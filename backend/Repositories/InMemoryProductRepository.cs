using EcommerceAiRecommendation.Api.Models;
using EcommerceAiRecommendation.Api.Repositories.Interfaces;

namespace EcommerceAiRecommendation.Api.Repositories;

public sealed class InMemoryProductRepository : IProductRepository
{
    private static readonly IReadOnlyList<Product> Products =
    [
        new()
        {
            Id = "p-001",
            Name = "SoundMax 無線降噪耳機",
            Category = "耳機",
            Brand = "SoundMax",
            Price = 3490m,
            ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            Popularity = 94,
            Rating = 4.7m
        },
        new()
        {
            Id = "p-002",
            Name = "SoundMax 輕量藍牙耳機",
            Category = "耳機",
            Brand = "SoundMax",
            Price = 1890m,
            ImageUrl = "https://images.unsplash.com/photo-1484704849700-f032a568e944",
            Popularity = 86,
            Rating = 4.5m
        },
        new()
        {
            Id = "p-003",
            Name = "PixelMate 6.5 吋智慧手機",
            Category = "手機",
            Brand = "PixelMate",
            Price = 12990m,
            ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            Popularity = 91,
            Rating = 4.6m
        },
        new()
        {
            Id = "p-004",
            Name = "NovaTech Pro 智慧手機",
            Category = "手機",
            Brand = "NovaTech",
            Price = 18900m,
            ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
            Popularity = 88,
            Rating = 4.4m
        },
        new()
        {
            Id = "p-005",
            Name = "FitPlus 心率智慧手錶",
            Category = "穿戴裝置",
            Brand = "FitPlus",
            Price = 4290m,
            ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            Popularity = 89,
            Rating = 4.5m
        },
        new()
        {
            Id = "p-006",
            Name = "FitPlus 運動智慧手環",
            Category = "穿戴裝置",
            Brand = "FitPlus",
            Price = 1690m,
            ImageUrl = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
            Popularity = 82,
            Rating = 4.3m
        },
        new()
        {
            Id = "p-007",
            Name = "HomeChef 智能氣炸鍋",
            Category = "家電",
            Brand = "HomeChef",
            Price = 3290m,
            ImageUrl = "https://images.unsplash.com/photo-1585515320310-259814833e62",
            Popularity = 93,
            Rating = 4.8m
        },
        new()
        {
            Id = "p-008",
            Name = "CleanBot 掃拖機器人",
            Category = "家電",
            Brand = "CleanBot",
            Price = 9990m,
            ImageUrl = "https://images.unsplash.com/photo-1603618090561-412154b4bd1b",
            Popularity = 90,
            Rating = 4.6m
        },
        new()
        {
            Id = "p-009",
            Name = "WorkPro 14 吋輕薄筆電",
            Category = "筆電",
            Brand = "WorkPro",
            Price = 28900m,
            ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
            Popularity = 87,
            Rating = 4.4m
        },
        new()
        {
            Id = "p-010",
            Name = "GameBox RTX 電競筆電",
            Category = "筆電",
            Brand = "GameBox",
            Price = 45900m,
            ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
            Popularity = 92,
            Rating = 4.7m
        },
        new()
        {
            Id = "p-011",
            Name = "ChargeGo 65W 快充行動電源",
            Category = "手機配件",
            Brand = "ChargeGo",
            Price = 1490m,
            ImageUrl = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
            Popularity = 85,
            Rating = 4.5m
        },
        new()
        {
            Id = "p-012",
            Name = "SnapCase MagSafe 防摔手機殼",
            Category = "手機配件",
            Brand = "SnapCase",
            Price = 890m,
            ImageUrl = "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
            Popularity = 80,
            Rating = 4.2m
        }
    ];

    public Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Products);
    }

    public Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var product = Products.FirstOrDefault(product =>
            string.Equals(product.Id, id, StringComparison.OrdinalIgnoreCase));

        return Task.FromResult(product);
    }
}
