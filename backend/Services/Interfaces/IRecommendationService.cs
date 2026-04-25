using EcommerceAiRecommendation.Api.DTOs;

namespace EcommerceAiRecommendation.Api.Services.Interfaces;

public interface IRecommendationService
{
    Task<IReadOnlyList<RecommendationResponseDto>> GetRecommendationsAsync(
        RecommendationRequestDto request,
        CancellationToken cancellationToken = default);
}
