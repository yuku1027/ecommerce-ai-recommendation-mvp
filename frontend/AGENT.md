# frontend/AGENT.md

本檔案是前端子專案專用規範。所有 `frontend/` 內的開發都必須同時遵守根目錄 `AGENT.md` 與本檔案。

---

## 1. 技術棧

- 使用 Next.js + TypeScript。
- 使用 Next.js App Router。
- React component 使用 `.tsx`。
- 共用型別放在 `types/`，避免重複宣告。
- API 呼叫封裝在 `lib/` 或 `services/`，不要直接散落在 component 中。

---

## 2. 前端責任邊界

- 前端負責 UI 呈現、使用者互動、狀態整理與呼叫後端 API。
- 前端不得直接實作推薦 scoring 商業邏輯。
- 前端可暫時使用 mock API adapter，但必須保留切換到後端 API 的介面。
- 推薦理由由後端回傳，前端只負責呈現。
- 商品資料來源優先透過 API client 取得，不直接寫死在 UI component 中。

---

## 3. 建議檔案結構

```text
frontend/
├── AGENT.md
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── RecommendationSection.tsx
│   └── BehaviorPanel.tsx
├── lib/
│   └── apiClient.ts
├── services/
│   └── recommendationApi.ts
└── types/
    ├── product.ts
    └── recommendation.ts
```

---

## 4. UI/UX 規則

- 第一畫面必須直接是可操作的購物推薦體驗，不做行銷 landing page。
- 商品卡片需包含商品名稱、分類、品牌、價格與可互動按鈕。
- 推薦區塊需明確標示「AI 為你推薦」或類似文案。
- 推薦理由要短、清楚、可掃讀。
- 使用者操作後需有明確狀態變化，例如最近瀏覽、已加入購物車、推薦結果重排。
- 介面需支援桌機與手機基本響應式。
- 不要使用過度裝飾的頁面；以購物網站、商品瀏覽、推薦展示為主。

---

## 5. API 整合規則

- 前端 API base URL 應集中設定，不要散落在多個 component。
- 建議使用環境變數管理後端 API URL，例如 `NEXT_PUBLIC_API_BASE_URL`。
- API response 型別需明確定義在 `types/`。
- 呼叫推薦 API 時，需傳入使用者行為資料，例如最近瀏覽商品、搜尋關鍵字、加入購物車商品。

建議 API：

| Method | Endpoint | 用途 |
|:--|:--|:--|
| `GET` | `/api/products` | 取得商品列表 |
| `GET` | `/api/products/{id}` | 取得單一商品 |
| `POST` | `/api/recommendations` | 依使用者行為取得推薦商品 |

---

## 6. 驗證規則

- 完成前端修改後，至少執行可用的 lint、type check 或 build。
- 若 build 失敗，需修正到可展示狀態；若受環境限制無法執行，需在回覆中說明。
- 不要只完成靜態畫面，推薦區塊需能隨互動更新。
