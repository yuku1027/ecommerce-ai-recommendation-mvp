namespace EcommerceAiRecommendation.Api.Models;

public sealed class RecommendationResult
{
    public required Product Product { get; init; }

    public int Score { get; init; }

    public IReadOnlyList<string> Reasons { get; init; } = [];

    public IReadOnlyList<string> MatchedRules { get; init; } = [];
}
