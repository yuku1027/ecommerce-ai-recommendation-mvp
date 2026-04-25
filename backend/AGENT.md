# backend/AGENT.md

本檔案是後端子專案專用規範。所有 `backend/` 內的開發都必須同時遵守根目錄 `AGENT.md` 與本檔案。

---

## 1. 技術棧

- 使用 C# ASP.NET Core Web API。
- API 採用 RESTful 設計。
- 後端必須採用 Controller / Service / Repository 分層。
- MVP 階段可使用 in-memory repository，不強制接資料庫。
- 所有 Service 與 Repository 需透過 dependency injection 註冊。

---

## 2. 分層責任

### Controller

- 只負責 HTTP request / response。
- 負責接收參數、基本 model validation、呼叫 Service。
- 不可直接存取 Repository。
- 不可包含推薦 scoring 商業邏輯。
- 新增或修改 Controller 時，需補上 API 相對說明，包含 controller/action 的 XML summary、必要 remarks、參數說明與主要 `ProducesResponseType`。
- API 說明需能被 Swagger / OpenAPI 讀取，讓 `/swagger` 可清楚呈現 API list、用途、參數與回應狀態。

### Service

- 負責商業邏輯、推薦 scoring、推薦理由產生與流程協調。
- 推薦邏輯需集中在 `RecommendationService` 或對應 domain service。
- Service 依賴 Repository interface，不直接依賴具體實作。

### Repository

- 負責資料存取。
- MVP 可使用 `InMemoryProductRepository`。
- 不可包含 HTTP、Controller 或 UI 邏輯。
- 未來可替換為 DB repository，而不影響 Controller 與 Service contract。

---

## 3. DTO 與 Model 規則

- DTO / ViewModel 需與 domain model 分離。
- API request 使用 `*RequestDto`。
- API response 使用 `*ResponseDto`。
- 不要直接把資料儲存 model 當作 API contract 暴露。
- 推薦回應需包含推薦商品與推薦理由。

---

## 4. 建議檔案結構

```text
backend/
├── AGENT.md
├── Controllers/
│   ├── ProductsController.cs
│   └── RecommendationsController.cs
├── Services/
│   ├── Interfaces/
│   │   ├── IProductService.cs
│   │   └── IRecommendationService.cs
│   ├── ProductService.cs
│   └── RecommendationService.cs
├── Repositories/
│   ├── Interfaces/
│   │   └── IProductRepository.cs
│   └── InMemoryProductRepository.cs
├── Models/
│   ├── Product.cs
│   ├── UserBehavior.cs
│   └── RecommendationResult.cs
├── DTOs/
│   ├── ProductDto.cs
│   ├── RecommendationRequestDto.cs
│   └── RecommendationResponseDto.cs
└── Program.cs
```

---

## 5. RESTful API 規則

建議 API：

| Method | Endpoint | 用途 |
|:--|:--|:--|
| `GET` | `/api/products` | 取得商品列表 |
| `GET` | `/api/products/{id}` | 取得單一商品 |
| `POST` | `/api/recommendations` | 依使用者行為取得推薦商品 |

### `POST /api/recommendations`

Request 需能表達使用者行為，例如：

- 最近瀏覽商品 ID。
- 搜尋關鍵字。
- 加入購物車商品 ID。
- 偏好的分類或品牌。

Response 需回傳：

- 推薦商品清單。
- 每個推薦商品的推薦理由。
- 可選：推薦分數或觸發規則，方便展示與除錯。

---

## 6. 推薦邏輯規則

本次推薦演算法使用規則式 scoring。每個候選商品可依下列條件計分：

| 條件 | 建議分數 |
|:--|:--|
| 與最近瀏覽商品同分類 | +40 |
| 與最近瀏覽商品同品牌 | +25 |
| 價格區間相近 | +15 |
| 商品熱度高 | +10 |
| 使用者搜尋關鍵字命中 | +20 |
| 已瀏覽商品 | 排除或大幅降權 |

推薦理由必須能對應到 scoring 條件。

---

## 7. 驗證規則

- 完成後端修改後，至少執行 `dotnet build` 或可用測試指令。
- 推薦 service 應盡量設計成可單元測試。
- 若 build 或測試無法執行，需在回覆中說明原因。
