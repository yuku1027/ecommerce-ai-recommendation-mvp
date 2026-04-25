# AI 推薦功能 MVP

電商 AI 商品推薦系統的規則式 MVP 展示專案。以 Next.js + C# ASP.NET Core 實作，模擬真實推薦系統的互動體驗與後端分層架構。

> 本 MVP 使用**規則式 scoring** 模擬 AI 推薦，不代表已完成正式 ML 模型，文件中有說明後續 AI 化演進路線。

---

## 目前完成狀態

**Phase 0–4 全部完成，核心 MVP 可完整展示。**

| Phase | 內容 | 狀態 |
|:--|:--|:--|
| Phase 0 | 前後端專案初始化、CORS、環境變數 | ✅ 完成 |
| Phase 1 | 後端 Domain Model / DTO / Repository | ✅ 完成 |
| Phase 2 | 後端 Service / RESTful API / Co-view | ✅ 完成 |
| Phase 3 | 前端 UI 骨架（MUI、RWD、Dark Mode） | ✅ 完成 |
| Phase 4 | 前後端串接（TanStack Query） | ✅ 完成 |
| Phase 5 | 驗證、文件與展示 | 🔄 進行中 |

---

## 功能總覽

### AI 推薦引擎（後端）

規則式 scoring，每次操作觸發重新計算：

| 規則 | 分數 | 對應 AI 概念 |
|:--|:--|:--|
| 與瀏覽商品同分類 | +40 | Content-based filtering |
| 與瀏覽商品同品牌 | +25 | Content-based filtering |
| Co-view 共現商品 | +30 | Collaborative filtering（mock） |
| 搜尋關鍵字命中 | +20 | Intent-based recommendation |
| 價格區間相近 | +15 | Content-based filtering |
| 熱門商品（popularity ≥ 85） | +20 | Popularity-based baseline |
| 已瀏覽商品 | -50 | 去重降權 |

初次進入頁面（無行為）→ 回傳 popularity 前 6 名作為預設推薦。

### 前端互動

- **商品列表**：24 筆 mock 商品，涵蓋 8 種分類
- **模糊搜尋**：支援商品名稱、分類、品牌及同義詞標籤（如搜尋「廚房」可找到氣炸鍋、電子鍋）
- **分類篩選**：點擊分類標籤篩選列表並觸發推薦更新
- **AI 推薦區塊**：橫式卡片捲動列，顯示推薦商品、價格、推薦理由
- **行為面板**：即時顯示最近瀏覽、搜尋關鍵字、購物車狀態
- **購物車**：加入購物車觸發推薦更新
- **Dark Mode**：深色/淺色主題切換，偏好存入 localStorage

### 商品分類（8 類 × 3 筆以上）

| 分類 | 商品數 |
|:--|:--|
| 耳機 | 3 |
| 手機 | 3 |
| 穿戴裝置 | 3 |
| 家電 | 3 |
| 筆電 | 3 |
| 手機配件 | 3 |
| 個人護理 | 3 |
| 居家香氛 | 3 |

---

## 技術棧

| 層 | 技術 |
|:--|:--|
| 前端 | Next.js 16 · TypeScript · Material UI · TanStack Query |
| 後端 | C# ASP.NET Core Web API · .NET 10 |
| 架構 | Controller / Service / Repository 三層 |
| 資料 | In-memory mock data（無需資料庫） |
| API 文件 | OpenAPI（Swagger） |

---

## 快速啟動

### 前置需求

- Node.js 20.19+ 或 22 LTS
- .NET 10 SDK

### 後端

```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

| 端點 | 說明 |
|:--|:--|
| http://localhost:5163/health | 健康檢查 |
| http://localhost:5163/openapi/v1.json | OpenAPI 文件 |
| http://localhost:5163/api/products | 商品列表 |
| http://localhost:5163/api/recommendations | 推薦 API |

### 前端

```bash
cd frontend
cp .env.example .env.local   # 首次執行需建立環境設定
npm install
npm run dev
```

前端預設開啟於 http://localhost:3000，API base URL 預設指向 `http://localhost:5163`。

如需修改後端位址，編輯 `frontend/.env.local`：

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5163
```

---

## 專案結構

```text
.
├── backend/
│   ├── Controllers/          # ProductsController, RecommendationsController
│   ├── Models/               # Product, UserBehavior, RecommendationResult
│   ├── Dtos/                 # ProductDto, RecommendationRequestDto, ResponseDto
│   ├── Repositories/         # InMemoryProductRepository, InMemoryCoViewRepository
│   └── Services/             # ProductService, RecommendationService（scoring 在此）
├── frontend/
│   ├── app/                  # Next.js App Router（page.tsx, layout.tsx, providers.tsx）
│   ├── components/           # ProductCard, ProductGrid, RecommendationSection, BehaviorPanel...
│   ├── lib/                  # apiClient.ts, productSearchTags.ts
│   ├── services/             # recommendationApi.ts（useQuery / useMutation hooks）
│   └── types/                # product.ts, recommendation.ts
└── docs/
    └── mvp-development-plan.md   # 開發計畫與執行紀錄
```

---

## 建置驗證

```bash
# 後端
cd backend && dotnet build

# 前端
cd frontend && npm run lint && npm run build
```

---

## 推薦系統架構說明（面試補充）

### 為什麼先做規則式 MVP

MVP 階段沒有足夠的使用者行為資料，且開發時間有限。規則式 scoring 可以在不需要訓練資料的情況下，快速驗證推薦區塊的 UX 流程與後端分層架構是否可行。

### Co-view 規則的技術意義

Co-view（共現瀏覽）是 Item-Item Collaborative Filtering 的核心概念。MVP 使用靜態 mock table 模擬，真實版本應由 event log 離線計算 item-item co-occurrence matrix，定期更新。

### 後續 AI 化演進路線

1. **規則式 MVP**（目前）：mock data + scoring rules
2. **第三方服務**：接入 Recommendation SaaS、向量搜尋（如 Pinecone）或 LLM 商品理解
3. **自建模型**：累積行為資料後導入 collaborative filtering、content-based filtering 或 hybrid recommendation
