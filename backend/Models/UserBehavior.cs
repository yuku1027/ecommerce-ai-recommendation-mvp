namespace EcommerceAiRecommendation.Api.Models;

public sealed class UserBehavior
{
    public IReadOnlyList<string> ViewedProductIds { get; init; } = [];

    public IReadOnlyList<string> CartProductIds { get; init; } = [];

    public string? SearchKeyword { get; init; }

    public string? PreferredCategory { get; init; }

    public string? PreferredBrand { get; init; }
}
