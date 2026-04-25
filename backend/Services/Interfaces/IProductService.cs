using EcommerceAiRecommendation.Api.DTOs;

namespace EcommerceAiRecommendation.Api.Services.Interfaces;

public interface IProductService
{
    Task<IReadOnlyList<ProductDto>> GetProductsAsync(CancellationToken cancellationToken = default);

    Task<ProductDto?> GetProductByIdAsync(string id, CancellationToken cancellationToken = default);
}
