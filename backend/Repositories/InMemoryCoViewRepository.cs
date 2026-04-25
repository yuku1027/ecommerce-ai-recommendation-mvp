using EcommerceAiRecommendation.Api.Repositories.Interfaces;

namespace EcommerceAiRecommendation.Api.Repositories;

public sealed class InMemoryCoViewRepository : ICoViewRepository
{
    private static readonly IReadOnlyDictionary<string, IReadOnlyList<string>> CoViewedProducts =
        new Dictionary<string, IReadOnlyList<string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["p-001"] = ["p-002", "p-011", "p-012"],
            ["p-002"] = ["p-001", "p-005", "p-011"],
            ["p-003"] = ["p-004", "p-011", "p-012"],
            ["p-004"] = ["p-003", "p-009", "p-010"],
            ["p-005"] = ["p-006", "p-001", "p-007"],
            ["p-006"] = ["p-005", "p-002", "p-011"],
            ["p-007"] = ["p-008", "p-005", "p-011"],
            ["p-008"] = ["p-007", "p-009", "p-010"],
            ["p-009"] = ["p-010", "p-004", "p-008"],
            ["p-010"] = ["p-009", "p-004", "p-008"],
            ["p-011"] = ["p-012", "p-003", "p-001"],
            ["p-012"] = ["p-011", "p-003", "p-001"]
        };

    public Task<IReadOnlyList<string>> GetCoViewedProductIdsAsync(
        string productId,
        CancellationToken cancellationToken = default)
    {
        var productIds = CoViewedProducts.TryGetValue(productId, out var coViewedProductIds)
            ? coViewedProductIds
            : [];

        return Task.FromResult(productIds);
    }
}
