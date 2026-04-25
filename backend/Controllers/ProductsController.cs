using EcommerceAiRecommendation.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAiRecommendation.Api.Controllers;

/// <summary>
/// 商品 API，提供 MVP 商品列表與單一商品查詢。
/// </summary>
[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController(IProductService productService) : ControllerBase
{
    /// <summary>
    /// 取得所有 mock 商品資料。
    /// </summary>
    /// <remarks>
    /// 前端商品列表會使用此 API 取得商品卡片資料。
    /// </remarks>
    /// <param name="cancellationToken">取消請求的 token。</param>
    /// <returns>商品 DTO 清單。</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public async Task<IActionResult> GetProducts(CancellationToken cancellationToken)
    {
        var products = await productService.GetProductsAsync(cancellationToken);

        return Ok(products);
    }

    /// <summary>
    /// 依商品 ID 取得單一商品。
    /// </summary>
    /// <remarks>
    /// 商品不存在時回傳 404，供前端商品詳情或推薦依據查詢使用。
    /// </remarks>
    /// <param name="id">商品 ID，例如 <c>p-001</c>。</param>
    /// <param name="cancellationToken">取消請求的 token。</param>
    /// <returns>符合 ID 的商品 DTO。</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id, CancellationToken cancellationToken)
    {
        var product = await productService.GetProductByIdAsync(id, cancellationToken);

        return product is null ? NotFound() : Ok(product);
    }
}
