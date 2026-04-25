using EcommerceAiRecommendation.Api.Models;

namespace EcommerceAiRecommendation.Api.Repositories.Interfaces;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
}
