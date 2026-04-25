namespace EcommerceAiRecommendation.Api.DTOs;

public sealed class RecommendationRequestDto
{
    public IReadOnlyList<string> ViewedProductIds { get; init; } = [];

    public IReadOnlyList<string> CartProductIds { get; init; } = [];

    public string? SearchKeyword { get; init; }

    public string? PreferredCategory { get; init; }

    public string? PreferredBrand { get; init; }
}
