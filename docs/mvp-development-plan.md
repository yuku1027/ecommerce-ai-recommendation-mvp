# AI 推薦功能 MVP 開發流程與任務清單

本文依據 `AGENT.md`、`frontend/AGENT.md`、`backend/AGENT.md` 制定，作為本專案的 MVP 開發執行依據與面試說明素材。

---

## 1. MVP 開發原則

### 1.1 產品原則

- 先完成可展示的購物推薦體驗，再討論正式 AI / ML 架構。
- 本次 MVP 以「規則式推薦」模擬 AI 推薦，不宣稱已完成真實模型。
- 推薦結果必須能隨使用者行為改變。
- 每個推薦商品都必須顯示推薦理由，方便面試官理解邏輯。

### 1.2 技術原則

- 前端使用 Next.js + TypeScript。
- 後端使用 C# ASP.NET Core Web API。
- 後端採用 Controller / Service / Repository 分層。
- 推薦 scoring 邏輯放在後端 Service。
- 前端只負責畫面、互動、狀態整理與呼叫 API。
- MVP 階段使用 mock data / in-memory repository，不做真實資料庫。

### 1.3 範圍控制

本次不做：

- 真實奇摩購物資料串接。
- 會員登入與權限。
- 購物車結帳與付款。
- 正式 ML 模型訓練。
- 大規模資料管線。
- A/B test 平台。

---

## 2. MVP 目標畫面與流程

### 2.1 使用者流程

1. 使用者進入首頁。
2. 前端呼叫 `GET /api/products` 取得商品列表。
3. 頁面顯示商品列表與預設熱門推薦。
4. 使用者點擊商品、搜尋關鍵字或加入購物車。
5. 前端整理使用者行為，呼叫 `POST /api/recommendations`。
6. 後端依規則式 scoring 計算推薦結果。
7. 前端更新「AI 為你推薦」區塊。
8. 每個推薦商品顯示推薦理由。

### 2.2 最小可展示功能

- 商品列表。
- 商品卡片。
- 搜尋或分類互動。
- 點擊商品紀錄。
- 加入購物車按鈕。
- AI 推薦區塊。
- 推薦理由。
- 使用者行為狀態顯示。

---

## 3. 開發階段

### Phase 0：專案初始化

目標：建立前後端最小可執行骨架。

Tasks：

- [x] `INIT-001` 建立 `frontend/` Next.js + TypeScript 專案。
- [x] `INIT-002` 建立 `backend/` ASP.NET Core Web API 專案。
- [x] `INIT-003` 設定前端 API base URL，例如 `NEXT_PUBLIC_API_BASE_URL`。
- [x] `INIT-004` 設定後端 CORS，允許前端本機開發網址。
- [x] `INIT-005` 更新 README，記錄前後端啟動方式。

完成條件：

- 前端可啟動並看到首頁。
- 後端可啟動並看到 Swagger 或 health endpoint。
- 前後端資料夾都符合各自 `AGENT.md`。

執行紀錄：

- 已建立 `frontend/` Next.js App Router + TypeScript + ESLint 骨架。
- 已建立 `backend/` ASP.NET Core Web API + Controller 專案骨架。
- 已新增 `frontend/.env.example` 與 `frontend/.env.local`，預設 `NEXT_PUBLIC_API_BASE_URL=http://localhost:5163`。
- 已在後端設定 CORS，允許 `http://localhost:3000` 與 `http://localhost:3001`。
- 已新增 `GET /health` 作為後端健康檢查端點，並保留 OpenAPI document。
- 已更新 `README.md`，記錄前後端啟動與 Phase 0 驗證方式。
- 已移除 ASP.NET Core 範本預設 `WeatherForecast` 範例 endpoint，避免與本專案 API 邊界混淆。

驗證紀錄：

- `dotnet build`：通過，0 warnings / 0 errors。
- `npm install`：完成；出現 Node engine warning 與 npm audit 2 個 moderate vulnerabilities。
- `npm run lint`：通過。
- `npm run build`：通過。
- `dotnet run --launch-profile http`：後端成功啟動於 `http://localhost:5163`。
- `npm run dev`：前端成功啟動於 `http://localhost:3000`。
- `curl http://localhost:5163/health`：回傳 HTTP 200 與 `{"status":"Healthy","service":"Ecommerce AI Recommendation API"}`。
- `curl -I http://localhost:3000`：回傳 HTTP 200。
- `curl http://localhost:5163/openapi/v1.json`：回傳 HTTP 200；移除範例 endpoint 後，OpenAPI paths 僅保留目前骨架需要的 `/health`。

無法完成或待注意事項：

- 建立前端專案時，本機 Node 版本為 `v20.18.0`；Next.js 16 相關 ESLint 相依套件提示建議 Node `20.19+`、`22.13+` 或 `24+`。目前不阻擋初始化，但建議後續升級 Node 以避免 lint/build 工具鏈警告。
- `npm audit` 回報 2 個 moderate vulnerabilities；目前未執行 `npm audit fix --force`，避免自動套用可能破壞 Next.js 版本相容性的升級。後續可在升級 Node 後再評估相依套件更新。

---

### Phase 1：後端 Domain / DTO / Repository

目標：建立商品資料與使用者行為資料結構。

Tasks：

- [x] `BE-001` 建立 `Product` domain model。
- [x] `BE-002` 建立 `UserBehavior` domain model。
- [x] `BE-003` 建立 `RecommendationResult` domain model。
- [x] `BE-004` 建立 `ProductDto`。
- [x] `BE-005` 建立 `RecommendationRequestDto`。
- [x] `BE-006` 建立 `RecommendationResponseDto`。
- [x] `BE-007` 建立 `IProductRepository`。
- [x] `BE-008` 建立 `InMemoryProductRepository`，提供 mock 商品資料。

完成條件：

- 商品資料至少 12 筆。
- 商品需包含名稱、分類、品牌、價格、圖片 URL、熱度或評分。
- Repository 可由 Service 透過 interface 呼叫。

執行紀錄：

- 已建立 `backend/Models/Product.cs`，包含名稱、分類、品牌、價格、圖片 URL、熱度與評分。
- 已建立 `backend/Models/UserBehavior.cs`，可表達已瀏覽商品、購物車商品、搜尋關鍵字、偏好分類與偏好品牌。
- 已建立 `backend/Models/RecommendationResult.cs`，保留推薦商品、分數、推薦理由與命中規則，供 Phase 2 scoring 使用。
- 已建立 `ProductDto`、`RecommendationRequestDto`、`RecommendationResponseDto` 作為 API contract 基礎。
- 已建立 `IProductRepository`，提供 `GetAllAsync` 與 `GetByIdAsync`。
- 已建立 `InMemoryProductRepository`，提供 12 筆 mock 商品資料，涵蓋耳機、手機、穿戴裝置、家電、筆電與手機配件。
- 已在 `Program.cs` 註冊 `IProductRepository -> InMemoryProductRepository`，Phase 2 service 可透過 interface 注入。

驗證紀錄：

- `dotnet build`：通過，0 warnings / 0 errors。
- mock 商品資料數量：12 筆。

無法完成或待注意事項：

- Phase 1 只建立資料結構與 repository；尚未建立 Controller 或 Service，因此目前還沒有 `GET /api/products` 可供外部呼叫，會在 Phase 2 完成。

---

### Phase 2：後端 Service 與 RESTful API

目標：完成商品 API 與推薦 API。

Tasks：

- [x] `BE-009` 建立 `IProductService`。
- [x] `BE-010` 建立 `ProductService`。
- [x] `BE-011` 建立 `IRecommendationService`。
- [x] `BE-012` 建立 `RecommendationService`。
- [x] `BE-013` 實作規則式 scoring（同分類 +40、同品牌 +25、co-view +30、關鍵字 +20、價格相近 +15、熱門 +20）。
- [x] `BE-013a` 建立 `ICoViewRepository` 與 `InMemoryCoViewRepository`，提供靜態 mock co-view 對照表。
- [x] `BE-014` 實作推薦理由產生（每條命中規則對應一段中文說明）。
- [x] `BE-015` 建立 `ProductsController`。
- [x] `BE-016` 建立 `RecommendationsController`。
- [x] `BE-017` 在 `Program.cs` 註冊 DI。
- [x] `BE-018` 驗證 `GET /api/products`。
- [x] `BE-019` 驗證 `GET /api/products/{id}`。
- [x] `BE-020` 驗證 `POST /api/recommendations`。

完成條件：

- Controller 不直接存取 Repository。
- 推薦邏輯集中在 Service。
- `POST /api/recommendations` 可根據使用者行為回傳推薦商品。
- 每個推薦商品都有推薦理由。
- co-view 規則可命中並產生對應推薦理由「看過此商品的人也瀏覽了這些」。

執行紀錄：

- 已建立 `IProductService` 與 `ProductService`，Controller 透過 service 取得商品 DTO。
- 已建立 `IRecommendationService` 與 `RecommendationService`，推薦 scoring 集中於 service。
- 已建立 `ICoViewRepository` 與 `InMemoryCoViewRepository`，提供靜態 co-view 商品對照表。
- 已完成規則式 scoring：同分類 +40、同品牌 +25、co-view +30、關鍵字 +20、價格相近 +15、熱門 +20。
- 已完成推薦理由產生，包含 co-view 指定理由「看過此商品的人也瀏覽了這些」。
- 已建立 `ProductsController`，提供 `GET /api/products` 與 `GET /api/products/{id}`。
- 已建立 `RecommendationsController`，提供 `POST /api/recommendations`。
- 已於 `Program.cs` 註冊 `IProductRepository`、`ICoViewRepository`、`IProductService`、`IRecommendationService`。

驗證紀錄：

- `dotnet build`：通過，0 warnings / 0 errors。
- `GET /api/products`：HTTP 200，回傳 12 筆商品。
- `GET /api/products/p-001`：HTTP 200，回傳 `p-001` 商品。
- `POST /api/recommendations`：HTTP 200，使用 `viewedProductIds=["p-001"]` 與 `searchKeyword="耳機"` 時回傳 6 筆推薦。
- co-view 驗證：推薦結果包含 `matchedRules=["same_category","same_brand","co_view","keyword"]`，並包含理由「看過此商品的人也瀏覽了這些」。

無法完成或待注意事項：

- 本次驗證時預設 `http://localhost:5163` 已被其他程序占用，因此改以 `http://localhost:5164` 啟動後端測試 API。正式 README 預設啟動方式仍維持 `5163`。

---

### Phase 3：前端 UI 骨架

目標：完成購物推薦頁面基礎畫面。

Tasks：

- [ ] `FE-001` 建立首頁 `app/page.tsx`。
- [ ] `FE-002` 建立共用型別 `types/product.ts`。
- [ ] `FE-003` 建立共用型別 `types/recommendation.ts`。
- [ ] `FE-004` 建立 `ProductCard`。
- [ ] `FE-005` 建立 `ProductGrid`。
- [ ] `FE-006` 建立 `RecommendationSection`。
- [ ] `FE-007` 建立 `BehaviorPanel`，顯示：最近瀏覽商品（最多 3 筆名稱）、目前搜尋關鍵字、購物車商品數量。
- [ ] `FE-008` 建立基本 responsive layout。
- [ ] `FE-009` 建立 loading / empty / error 狀態。
- [ ] `FE-009a` 建立 `SearchBar` 元件，支援輸入關鍵字並觸發行為記錄。
- [ ] `FE-009b` 建立 `CategoryFilter` 元件，支援點擊分類標籤並觸發行為記錄。

完成條件：

- 第一畫面是可操作的購物推薦頁。
- 商品列表與推薦區塊可清楚掃讀。
- 手機與桌機基本可用。
- SearchBar 與 CategoryFilter 可操作，操作後推薦依據改變。
- BehaviorPanel 可清楚顯示目前行為狀態（讓面試官直接看到「行為 → 推薦」的對應關係）。

---

### Phase 4：前後端串接

目標：讓前端透過 API 取得商品與推薦結果。

Tasks：

- [ ] `FE-010` 建立 `lib/apiClient.ts`。
- [ ] `FE-011` 建立 `services/recommendationApi.ts`。
- [ ] `FE-012` 串接 `GET /api/products`。
- [ ] `FE-013` 建立使用者行為 state。
- [ ] `FE-014` 在商品點擊時記錄最近瀏覽商品。
- [ ] `FE-015` 在搜尋時記錄搜尋關鍵字。
- [ ] `FE-015a` 在選擇分類標籤時記錄 preferredCategory，並更新行為 state。
- [ ] `FE-016` 在加入購物車時記錄商品 ID。
- [ ] `FE-017` 呼叫 `POST /api/recommendations` 更新推薦（點擊商品、加入購物車、搜尋、切換分類時各觸發一次）。
- [ ] `FE-018` 顯示推薦理由。
- [ ] `FE-019` 顯示目前推薦依據。

完成條件：

- 初次進入顯示預設熱門推薦（空行為 → 後端回傳 popularity 前 6 名）。
- 點擊商品後推薦結果改變。
- 搜尋或加入購物車後推薦結果改變。
- 切換分類後推薦結果改變。
- 前端不直接寫 scoring 邏輯。

---

### Phase 5：驗證、文件與展示

目標：完成可提交、可錄影、可說明的 MVP。

Tasks：

- [ ] `QA-001` 執行後端 `dotnet build`。
- [ ] `QA-002` 執行前端 build / lint / type check。
- [ ] `QA-003` 手動驗證核心使用流程。
- [ ] `QA-004` 檢查 API contract 與前端型別是否一致。
- [ ] `DOC-001` 撰寫 README。
- [ ] `DOC-002` 撰寫 AI 協作開發說明。
- [ ] `DOC-003` 撰寫推薦邏輯說明。
- [ ] `DOC-004` 撰寫錄影展示腳本。
- [ ] `DOC-005` 補充未來導入第三方 AI / 自建模型的演進方案。

完成條件：

- 前後端皆可本機啟動。
- README 可讓面試官快速理解與執行。
- 錄影展示可在 3-6 分鐘內說清楚。

---

## 4. API Contract 初稿

### 4.1 `GET /api/products`

用途：取得商品列表。支援 query params 做前端篩選：

| 參數 | 型別 | 說明 |
|:--|:--|:--|
| `category` | string（可選）| 篩選指定分類，例如 `?category=耳機` |
| `search` | string（可選）| 關鍵字搜尋商品名稱，例如 `?search=AirPods` |

Response 範例：

```json
[
  {
    "id": "p-001",
    "name": "無線降噪耳機",
    "category": "耳機",
    "brand": "SoundMax",
    "price": 3490,
    "imageUrl": "https://example.com/products/p-001.jpg",
    "popularity": 92,
    "rating": 4.7
  }
]
```

---

### 4.2 `GET /api/products/{id}`

用途：取得單一商品。

Response 範例：

```json
{
  "id": "p-001",
  "name": "無線降噪耳機",
  "category": "耳機",
  "brand": "SoundMax",
  "price": 3490,
  "imageUrl": "https://example.com/products/p-001.jpg",
  "popularity": 92,
  "rating": 4.7
}
```

---

### 4.3 `POST /api/recommendations`

用途：依使用者行為取得推薦商品。

Request 範例：

```json
{
  "viewedProductIds": ["p-001"],
  "cartProductIds": ["p-004"],
  "searchKeyword": "耳機",
  "preferredCategories": ["耳機"],
  "preferredBrands": ["SoundMax"]
}
```

Response 範例：

```json
{
  "items": [
    {
      "product": {
        "id": "p-008",
        "name": "藍牙運動耳機",
        "category": "耳機",
        "brand": "SoundMax",
        "price": 2290,
        "imageUrl": "https://example.com/products/p-008.jpg",
        "popularity": 88,
        "rating": 4.5
      },
      "score": 75,
      "reasons": ["因為你瀏覽過相同分類", "同品牌熱門商品"]
    }
  ]
}
```

---

## 5. 推薦 Scoring 規則

| 條件                          | 建議分數   | 推薦理由                   |
| :---------------------------- | :--------- | :------------------------- |
| 與最近瀏覽商品同分類          | +40        | 因為你瀏覽過相同分類       |
| 與最近瀏覽商品同品牌          | +25        | 同品牌熱門商品             |
| 共現商品（co-view）           | +30        | 看過此商品的人也瀏覽了這些 |
| 使用者搜尋關鍵字命中          | +20        | 根據你的搜尋關鍵字推薦     |
| 價格區間相近                  | +15        | 與你剛剛查看的商品價格相近 |
| 商品熱度高（popularity ≥ 85） | +20        | 近期熱門商品               |
| 已瀏覽商品                    | 排除或降權 | 避免重複推薦你已看過的商品 |

### 5.1 預設推薦邏輯（無使用者行為時）

當 `POST /api/recommendations` 收到的 request body 中所有欄位皆為空（首次進入頁面），後端應：

1. 跳過所有行為相關 scoring 規則。
2. 對全部商品套用熱門規則（popularity ≥ 85 得 +20）。
3. 依 popularity 由高到低排序。
4. 回傳前 6 筆作為預設推薦。
5. 推薦理由統一顯示「近期熱門商品」。

### 5.2 Co-view 實作說明（MVP 版）

MVP 階段無真實多用戶行為資料，以靜態 mock co-view table 模擬：

```
// 後端 InMemoryCoViewRepository 範例
{
  "p-001": ["p-003", "p-007", "p-010"],
  "p-002": ["p-005", "p-008"],
  ...
}
```

- 命中邏輯：使用者瀏覽過的任一商品若在 co-view table 中有關聯，關聯商品得 +30。
- 面試說明：此為 collaborative filtering（協同過濾）概念的 MVP 模擬，真實版本應由 event log 累積後離線計算，定期更新 co-view table。

### 5.3 排序規則

1. 排除已瀏覽商品，或大幅降低分數（-50）。
2. 依 score 由高到低排序。
3. score 相同時，依 popularity 由高到低排序。
4. 只回傳前 4-6 筆推薦商品。

### 5.4 Score 多規則命中說明

各規則分數直接累加，無上限。同時命中全部規則最高可得 150 分（+40+25+30+20+15+20）。這是有意為之：分數本身不代表百分比或信賴度，只用於商品間相對排序，面試官詢問時需說明此點。未來正式 AI 化後可替換為歸一化分數（0–1）或模型輸出的機率值。

---

## 6. 驗收標準

### AC-001 預設推薦

Given 使用者第一次進入頁面  
When 尚未有任何互動  
Then 系統顯示預設熱門推薦商品

### AC-002 點擊商品後更新推薦

Given 使用者點擊某個商品  
When 行為被送到推薦 API  
Then 推薦區塊更新為同分類、同品牌或相近價格商品

### AC-003 推薦理由

Given 推薦商品被顯示  
When 使用者查看推薦區塊  
Then 每個商品都顯示至少一個推薦理由

### AC-004 後端分層

Given 開發者查看後端程式碼  
When 尋找推薦邏輯  
Then scoring 邏輯位於 `RecommendationService`，Controller 不直接存取 Repository

### AC-005 前端責任邊界

Given 開發者查看前端程式碼  
When 尋找推薦邏輯  
Then 前端只呼叫 API 並呈現結果，不直接計算推薦分數

### AC-006 面試說明

Given 面試官詢問是否為真實 AI 模型
When 說明專案架構
Then 文件與展示需清楚說明目前為規則式 MVP，後續可替換為第三方 AI 或自建模型

### AC-007 Co-view 命中

Given 使用者瀏覽過商品 A
When 商品 A 在 co-view table 中有關聯商品
Then 推薦結果包含關聯商品，且推薦理由顯示「看過此商品的人也瀏覽了這些」

### AC-008 BehaviorPanel 可視性

Given 使用者執行任何操作（點擊 / 搜尋 / 分類 / 加入購物車）
When BehaviorPanel 更新
Then 面板即時反映最近瀏覽、搜尋關鍵字與購物車狀態，讓面試官能直接對應「行為 → 推薦」的變化

---

## 7. 面試說明補充

### 7.1 為什麼先做規則式 MVP

團隊目前沒有推薦系統經驗，且前測時間有限。若一開始就自建 ML 模型，會卡在資料量、標註、訓練、評估與部署問題。先做規則式 MVP 可以快速驗證：

- 推薦區塊是否能融入購物流程。
- 使用者行為是否足以產生有感推薦。
- PO 是否接受推薦理由與展示方式。
- 架構是否能支援未來替換推薦引擎。

### 7.2 為什麼加入 Co-view 規則

Co-view（共現瀏覽）是 collaborative filtering（協同過濾）的核心概念之一：「行為相似的使用者，對商品的興趣也相似」。加入 co-view 規則有幾個好處：

- 比純分類 / 品牌規則更接近真實推薦系統的思維。
- 可在面試時說明：這是協同過濾的 MVP 模擬，真實版本應由 event log 離線計算 item-item co-occurrence matrix，定期更新。
- mock co-view table 成本低，但展示效果明顯（如：看過 iPhone → 推薦 AirPods）。

### 7.3 為什麼推薦邏輯放後端 Service

推薦 scoring 屬於商業邏輯，放在後端 Service 有幾個好處：

- 前端只負責體驗與呈現，避免商業邏輯外洩。
- 未來可直接替換成第三方推薦 API。
- 可集中測試推薦規則。
- Controller / Service / Repository 分層清楚，便於維護。

### 7.3 未來如何正式 AI 化

可分三階段演進：

1. 規則式 MVP：使用 mock data 與使用者行為 scoring。
2. 第三方服務：接入推薦 SaaS、向量搜尋或 LLM 商品理解。
3. 自建模型：累積行為資料後導入 collaborative filtering、content-based filtering 或 hybrid recommendation。

### 7.4 錄影展示順序

建議控制在 3-6 分鐘：

1. 說明題目與 MVP 策略。
2. 展示首頁商品列表與預設推薦。
3. 點擊商品，展示推薦結果更新。
4. 搜尋或加入購物車，展示推薦理由變化。
5. 簡述前後端架構。
6. 說明目前限制與未來 AI 化路線。
7. 補充 AI 工具如何協助需求拆解、程式生成與文件整理。

---

## 8. 建議開發順序

建議先後端、再前端、最後整合：

1. 建立後端 API skeleton。
2. 建立 in-memory 商品資料。
3. 完成推薦 service。
4. 用 Swagger 或 HTTP client 驗證 API。
5. 建立 Next.js 前端頁面。
6. 串接商品 API。
7. 串接推薦 API。
8. 補 UI 狀態與推薦理由。
9. 撰寫 README 與展示腳本。
10. 執行前後端 build 驗證。

理由：

- 推薦邏輯屬於後端 Service，先完成 API contract 可降低前端返工。
- 前端可依穩定 contract 建立型別與 API client。
- 最後整合時只需處理 CORS、URL 與 response mapping。
