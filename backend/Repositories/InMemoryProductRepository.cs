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
        },

        // 耳機第 3 筆
        new()
        {
            Id = "p-013",
            Name = "SoundMax 入耳式有線耳機",
            Category = "耳機",
            Brand = "SoundMax",
            Price = 790m,
            ImageUrl = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
            Popularity = 78,
            Rating = 4.1m
        },

        // 手機第 3 筆
        new()
        {
            Id = "p-014",
            Name = "PixelMate Lite 輕薄智慧手機",
            Category = "手機",
            Brand = "PixelMate",
            Price = 7990m,
            ImageUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
            Popularity = 84,
            Rating = 4.3m
        },

        // 穿戴裝置第 3 筆
        new()
        {
            Id = "p-015",
            Name = "FitPlus 健康監測智慧戒指",
            Category = "穿戴裝置",
            Brand = "FitPlus",
            Price = 2990m,
            ImageUrl = "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
            Popularity = 81,
            Rating = 4.4m
        },

        // 家電第 3 筆
        new()
        {
            Id = "p-016",
            Name = "HomeChef 多功能電子鍋",
            Category = "家電",
            Brand = "HomeChef",
            Price = 2490m,
            ImageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
            Popularity = 87,
            Rating = 4.6m
        },

        // 筆電第 3 筆
        new()
        {
            Id = "p-017",
            Name = "WorkPro 13 吋商務超薄筆電",
            Category = "筆電",
            Brand = "WorkPro",
            Price = 22900m,
            ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89",
            Popularity = 83,
            Rating = 4.3m
        },

        // 手機配件第 3 筆
        new()
        {
            Id = "p-018",
            Name = "ChargeGo 15W 磁吸無線充電盤",
            Category = "手機配件",
            Brand = "ChargeGo",
            Price = 990m,
            ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90",
            Popularity = 82,
            Rating = 4.4m
        },

        // 個人護理（新分類）
        new()
        {
            Id = "p-019",
            Name = "OralCare 音波電動牙刷",
            Category = "個人護理",
            Brand = "OralCare",
            Price = 1990m,
            ImageUrl = "https://images.unsplash.com/photo-1559591937-95b0d9ec6e67",
            Popularity = 88,
            Rating = 4.6m
        },
        new()
        {
            Id = "p-020",
            Name = "SilkPro 負離子速乾吹風機",
            Category = "個人護理",
            Brand = "SilkPro",
            Price = 3290m,
            ImageUrl = "https://images.unsplash.com/photo-1522338242992-e1a54906a8da",
            Popularity = 85,
            Rating = 4.5m
        },
        new()
        {
            Id = "p-021",
            Name = "PureSkin 音波潔顏儀",
            Category = "個人護理",
            Brand = "PureSkin",
            Price = 2490m,
            ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03",
            Popularity = 79,
            Rating = 4.3m
        },

        // 居家香氛（新分類）
        new()
        {
            Id = "p-022",
            Name = "AromaLife 超音波水氧擴香機",
            Category = "居家香氛",
            Brand = "AromaLife",
            Price = 1490m,
            ImageUrl = "https://images.unsplash.com/photo-1527574327770-4b51fd3a7c3c",
            Popularity = 86,
            Rating = 4.5m
        },
        new()
        {
            Id = "p-023",
            Name = "CandleHouse 大豆精油香氛蠟燭",
            Category = "居家香氛",
            Brand = "CandleHouse",
            Price = 590m,
            ImageUrl = "https://images.unsplash.com/photo-1603006938481-680c64f85f8e",
            Popularity = 83,
            Rating = 4.4m
        },
        new()
        {
            Id = "p-024",
            Name = "AromaLife 天然竹炭擴香石組",
            Category = "居家香氛",
            Brand = "AromaLife",
            Price = 890m,
            ImageUrl = "https://images.unsplash.com/photo-1607006344380-b6775a0824a7",
            Popularity = 77,
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
