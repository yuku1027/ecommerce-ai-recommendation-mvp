using EcommerceAiRecommendation.Api.DTOs;
using EcommerceAiRecommendation.Api.Models;
using EcommerceAiRecommendation.Api.Repositories.Interfaces;
using EcommerceAiRecommendation.Api.Services.Interfaces;

namespace EcommerceAiRecommendation.Api.Services;

public sealed class RecommendationService(
    IProductRepository productRepository,
    ICoViewRepository coViewRepository) : IRecommendationService
{
    private const int SameCategoryScore = 40;
    private const int SameBrandScore = 25;
    private const int CoViewScore = 30;
    private const int KeywordScore = 20;
    private const int SimilarPriceScore = 15;
    private const int PopularScore = 20;
    private const decimal SimilarPriceRange = 0.2m;
    private const int PopularityThreshold = 88;
    private const int RecommendationLimit = 6;

    public async Task<IReadOnlyList<RecommendationResponseDto>> GetRecommendationsAsync(
        RecommendationRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);
        var productLookup = products.ToDictionary(product => product.Id, StringComparer.OrdinalIgnoreCase);
        var viewedProductIds = request.ViewedProductIds.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var cartProductIds = request.CartProductIds.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var interactedProductIds = request.ViewedProductIds
            .Concat(request.CartProductIds)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        var referenceProducts = interactedProductIds
            .Where(productLookup.ContainsKey)
            .Select(productId => productLookup[productId])
            .ToList();
        var coViewedProductIds = await GetCoViewedProductIdsAsync(interactedProductIds, cancellationToken);
        var hasBehavior = referenceProducts.Count > 0
            || !string.IsNullOrWhiteSpace(request.SearchKeyword)
            || !string.IsNullOrWhiteSpace(request.PreferredCategory)
            || !string.IsNullOrWhiteSpace(request.PreferredBrand);

        var recommendations = products
            .Where(product => !viewedProductIds.Contains(product.Id) && !cartProductIds.Contains(product.Id))
            .Select(product => ScoreProduct(product, request, referenceProducts, coViewedProductIds, hasBehavior))
            .Where(result => result.Score > 0)
            .OrderByDescending(result => result.Score)
            .ThenByDescending(result => result.Product.Popularity)
            .ThenByDescending(result => result.Product.Rating)
            .Take(RecommendationLimit)
            .Select(MapToResponseDto)
            .ToList();

        return recommendations;
    }

    private async Task<HashSet<string>> GetCoViewedProductIdsAsync(
        IReadOnlyList<string> productIds,
        CancellationToken cancellationToken)
    {
        var coViewedProductIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var productId in productIds)
        {
            var relatedProductIds = await coViewRepository.GetCoViewedProductIdsAsync(
                productId,
                cancellationToken);

            coViewedProductIds.UnionWith(relatedProductIds);
        }

        return coViewedProductIds;
    }

    private static RecommendationResult ScoreProduct(
        Product candidate,
        RecommendationRequestDto request,
        IReadOnlyList<Product> referenceProducts,
        IReadOnlySet<string> coViewedProductIds,
        bool hasBehavior)
    {
        var score = 0;
        var reasons = new List<string>();
        var matchedRules = new List<string>();

        if (MatchesCategory(candidate, request, referenceProducts))
        {
            score += SameCategoryScore;
            reasons.Add("因為你瀏覽或偏好相同分類的商品");
            matchedRules.Add("same_category");
        }

        if (MatchesBrand(candidate, request, referenceProducts))
        {
            score += SameBrandScore;
            reasons.Add("同品牌商品符合你最近的瀏覽傾向");
            matchedRules.Add("same_brand");
        }

        if (coViewedProductIds.Contains(candidate.Id))
        {
            score += CoViewScore;
            reasons.Add("看過此商品的人也瀏覽了這些");
            matchedRules.Add("co_view");
        }

        if (MatchesKeyword(candidate, request.SearchKeyword))
        {
            score += KeywordScore;
            reasons.Add("商品名稱、分類或品牌符合你的搜尋關鍵字");
            matchedRules.Add("keyword");
        }

        if (HasSimilarPrice(candidate, referenceProducts))
        {
            score += SimilarPriceScore;
            reasons.Add("與你剛剛查看的商品價格相近");
            matchedRules.Add("similar_price");
        }

        if (candidate.Popularity >= PopularityThreshold)
        {
            score += PopularScore;
            reasons.Add(hasBehavior ? "這也是近期熱門商品" : "目前尚無瀏覽行為，先推薦熱門商品");
            matchedRules.Add("popular");
        }

        return new RecommendationResult
        {
            Product = candidate,
            Score = score,
            Reasons = reasons,
            MatchedRules = matchedRules
        };
    }

    private static bool MatchesCategory(
        Product candidate,
        RecommendationRequestDto request,
        IReadOnlyList<Product> referenceProducts)
    {
        return string.Equals(candidate.Category, request.PreferredCategory, StringComparison.OrdinalIgnoreCase)
            || referenceProducts.Any(product =>
                string.Equals(product.Category, candidate.Category, StringComparison.OrdinalIgnoreCase));
    }

    private static bool MatchesBrand(
        Product candidate,
        RecommendationRequestDto request,
        IReadOnlyList<Product> referenceProducts)
    {
        return string.Equals(candidate.Brand, request.PreferredBrand, StringComparison.OrdinalIgnoreCase)
            || referenceProducts.Any(product =>
                string.Equals(product.Brand, candidate.Brand, StringComparison.OrdinalIgnoreCase));
    }

    private static bool MatchesKeyword(Product candidate, string? keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return false;
        }

        return candidate.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)
            || candidate.Category.Contains(keyword, StringComparison.OrdinalIgnoreCase)
            || candidate.Brand.Contains(keyword, StringComparison.OrdinalIgnoreCase);
    }

    private static bool HasSimilarPrice(Product candidate, IReadOnlyList<Product> referenceProducts)
    {
        return referenceProducts.Any(product =>
        {
            var lowerBound = product.Price * (1 - SimilarPriceRange);
            var upperBound = product.Price * (1 + SimilarPriceRange);

            return candidate.Price >= lowerBound && candidate.Price <= upperBound;
        });
    }

    private static RecommendationResponseDto MapToResponseDto(RecommendationResult result)
    {
        return new RecommendationResponseDto
        {
            Product = new ProductDto
            {
                Id = result.Product.Id,
                Name = result.Product.Name,
                Category = result.Product.Category,
                Brand = result.Product.Brand,
                Price = result.Product.Price,
                ImageUrl = result.Product.ImageUrl,
                Popularity = result.Product.Popularity,
                Rating = result.Product.Rating
            },
            Score = result.Score,
            Reasons = result.Reasons,
            MatchedRules = result.MatchedRules
        };
    }
}
