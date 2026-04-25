namespace EcommerceAiRecommendation.Api.Repositories.Interfaces;

public interface ICoViewRepository
{
    Task<IReadOnlyList<string>> GetCoViewedProductIdsAsync(
        string productId,
        CancellationToken cancellationToken = default);
}
