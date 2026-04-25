namespace EcommerceAiRecommendation.Api.DTOs;

public sealed class RecommendationResponseDto
{
    public required ProductDto Product { get; init; }

    public int Score { get; init; }

    public IReadOnlyList<string> Reasons { get; init; } = [];

    public IReadOnlyList<string> MatchedRules { get; init; } = [];
}
