namespace EcommerceAiRecommendation.Api.Models;

public sealed class Product
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required string Category { get; init; }

    public required string Brand { get; init; }

    public decimal Price { get; init; }

    public required string ImageUrl { get; init; }

    public int Popularity { get; init; }

    public decimal Rating { get; init; }
}
