using EcommerceAiRecommendation.Api.DTOs;
using EcommerceAiRecommendation.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAiRecommendation.Api.Controllers;

/// <summary>
/// 推薦 API，依使用者行為回傳規則式推薦結果。
/// </summary>
[ApiController]
[Route("api/[controller]")]
public sealed class RecommendationsController(IRecommendationService recommendationService) : ControllerBase
{
    /// <summary>
    /// 根據使用者行為取得推薦商品。
    /// </summary>
    /// <remarks>
    /// 目前是 MVP 規則式推薦，會依瀏覽商品、加入購物車商品、搜尋關鍵字、
    /// 偏好分類與偏好品牌計算推薦分數，並回傳推薦理由。
    /// </remarks>
    /// <param name="request">使用者行為與偏好資料。</param>
    /// <param name="cancellationToken">取消請求的 token。</param>
    /// <returns>排序後的推薦商品、分數、命中規則與推薦理由。</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpPost]
    public async Task<IActionResult> GetRecommendations(
        RecommendationRequestDto request,
        CancellationToken cancellationToken)
    {
        var recommendations = await recommendationService.GetRecommendationsAsync(
            request,
            cancellationToken);

        return Ok(recommendations);
    }
}
