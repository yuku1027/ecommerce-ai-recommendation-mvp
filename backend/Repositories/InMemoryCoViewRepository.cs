using EcommerceAiRecommendation.Api.Repositories.Interfaces;

namespace EcommerceAiRecommendation.Api.Repositories;

public sealed class InMemoryCoViewRepository : ICoViewRepository
{
    private static readonly IReadOnlyDictionary<string, IReadOnlyList<string>> CoViewedProducts =
        new Dictionary<string, IReadOnlyList<string>>(StringComparer.OrdinalIgnoreCase)
        {
            // 耳機
            ["p-001"] = ["p-002", "p-013", "p-011"],
            ["p-002"] = ["p-001", "p-013", "p-005"],
            ["p-013"] = ["p-001", "p-002", "p-018"],

            // 手機
            ["p-003"] = ["p-004", "p-014", "p-011"],
            ["p-004"] = ["p-003", "p-014", "p-009"],
            ["p-014"] = ["p-003", "p-004", "p-012"],

            // 穿戴裝置
            ["p-005"] = ["p-006", "p-015", "p-001"],
            ["p-006"] = ["p-005", "p-015", "p-019"],
            ["p-015"] = ["p-005", "p-006", "p-019"],

            // 家電
            ["p-007"] = ["p-008", "p-016", "p-022"],
            ["p-008"] = ["p-007", "p-016", "p-009"],
            ["p-016"] = ["p-007", "p-008", "p-022"],

            // 筆電
            ["p-009"] = ["p-010", "p-017", "p-004"],
            ["p-010"] = ["p-009", "p-017", "p-004"],
            ["p-017"] = ["p-009", "p-010", "p-018"],

            // 手機配件
            ["p-011"] = ["p-012", "p-018", "p-003"],
            ["p-012"] = ["p-011", "p-018", "p-003"],
            ["p-018"] = ["p-011", "p-012", "p-013"],

            // 個人護理
            ["p-019"] = ["p-020", "p-021", "p-022"],
            ["p-020"] = ["p-019", "p-021", "p-006"],
            ["p-021"] = ["p-019", "p-020", "p-022"],

            // 居家香氛
            ["p-022"] = ["p-023", "p-024", "p-016"],
            ["p-023"] = ["p-022", "p-024", "p-019"],
            ["p-024"] = ["p-022", "p-023", "p-021"]
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
