using EcommerceAiRecommendation.Api.DTOs;
using EcommerceAiRecommendation.Api.Models;
using EcommerceAiRecommendation.Api.Repositories.Interfaces;
using EcommerceAiRecommendation.Api.Services.Interfaces;

namespace EcommerceAiRecommendation.Api.Services;

public sealed class ProductService(IProductRepository productRepository) : IProductService
{
    public async Task<IReadOnlyList<ProductDto>> GetProductsAsync(
        CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);

        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto?> GetProductByIdAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);

        return product is null ? null : MapToDto(product);
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Brand = product.Brand,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Popularity = product.Popularity,
            Rating = product.Rating
        };
    }
}
