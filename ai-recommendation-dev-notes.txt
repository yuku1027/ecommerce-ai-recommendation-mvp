# AI 推薦功能 MVP 開發說明

## 1. 專案定位

這次題目是針對「購物網站導入 AI 推薦功能」做技術拓荒。我將這個專案定位為 **PoC + MVP**，目標不是直接完成正式可上線的推薦模型，而是在有限時間內做出一個可展示、可解釋、可擴充的推薦功能雛形。

本次 MVP 的核心目標是：

- 使用者可以瀏覽商品、搜尋、切換分類、加入購物車。
- 系統會依照使用者行為更新推薦結果。
- 每個推薦商品都會顯示推薦理由。
- 前端不直接實作推薦 scoring，推薦邏輯集中在後端 Service。
- 架構保留未來替換成第三方推薦服務或自建 AI 模型的空間。

## 2. AI 工具協作方式

這次開發主要採用 **Codex + Claude Code** 協作。

### 為什麼以 Codex 為主開發？

我主要使用 Codex 作為開發主力，原因是這次任務需要從 0 到 1 建立前後端專案、規劃架構、實作 API、串接前端與自動驗證。Codex 在程式碼生成、專案內檔案操作、測試執行與多步驟開發流程上比較適合擔任主開發角色。

同時，Codex 的使用額度與可持續開發時間也比較適合這類 take-home 專案，可以支援較長時間的迭代與驗證。

### Claude Code 的角色

Claude Code 則比較適合放在輔助角色，特別是文件整理、說明文字調整、需求描述與規格語句優化。它在閱讀與整理文件脈絡時速度快，也適合協助產生面試說明素材。

因此這次分工是：

- Codex：主開發、架構實作、前後端串接、測試驗證。
- Claude Code：文件潤飾、說明整理、需求與規格補強。

這樣的分工可以讓不同 AI 工具各自負責比較擅長的部分，也降低單一工具輸出品質不穩定時的風險。

## 3. 開發前的準備

在正式開發前，我會先花比較多時間建立 AI 的專案上下文。這部分大約會佔整體時間的 50% 左右，因為前期規範越清楚，後續產生的程式碼品質越穩定。

我這次先建立了：

- 專案目標與 MVP 範圍。
- 前後端技術規範。
- `AGENT.md`、`frontend/AGENT.md`、`backend/AGENT.md`。
- 分階段開發計畫 `docs/mvp-development-plan.md`。
- API contract 初稿。
- 推薦規則與驗收標準。

另外也導入自己平常使用的 agent skill，例如：

- `commit-msg`：產生 Conventional Commits。
- `playwright`：進行瀏覽器流程驗證與 RWD 截圖。
- `spec-writing`：協助整理規格文件。

## 4. 面對知識盲區的處理方式

一開始看到 AI 推薦功能時，我其實並不熟悉正式推薦系統的完整實作，只知道它通常會根據搜尋、瀏覽、購物車、購買紀錄等行為推薦商品。

所以我先透過 ChatGPT 補齊基本知識，例如：

- rule-based recommendation
- content-based filtering
- collaborative filtering
- co-view / co-occurrence
- weighted scoring
- 推薦理由如何產生

理解基本概念後，我也會去實際操作一些電商網站的推薦區塊，觀察它們如何呈現商品、推薦理由、行為回饋與畫面位置。這對我理解產品體驗很有幫助。

## 5. 開發流程控管

這次開發採用分階段方式進行，而不是一次讓 AI 產生大量程式碼。

目前已完成：

- Phase 0：前後端專案初始化。
- Phase 1：後端 Domain / DTO / Repository。
- Phase 2：後端 Service 與 RESTful API。
- Phase 3：前端 UI 骨架與 RWD。
- Phase 4：前後端 API 串接。

每完成一個階段，我會要求 AI：

- 更新 `docs/mvp-development-plan.md` 的任務勾選。
- 記錄完成事項。
- 記錄無法完成或待注意事項。
- 自動執行前後端驗證。
- 產生清楚的 commit message。

這樣做的好處是：

- 每次變更範圍小，容易 review。
- 如果發生問題，回溯成本低。
- commit history 比較清楚。
- AI 不會一次產生過多不可控程式碼。

## 6. 技術架構

本次技術選型：

- 前端：Next.js + TypeScript + Material UI。
- 後端：ASP.NET Core Web API。
- API 文件：Swagger / OpenAPI。
- 前端驗證：lint、build、Playwright。
- 後端驗證：`dotnet build`、API curl 驗證。

架構分工：

- Controller：只處理 HTTP request / response。
- Service：集中商業邏輯與推薦 scoring。
- Repository：提供 mock data 與 in-memory data source。
- Frontend：只負責 UI、互動狀態與 API 呼叫，不實作推薦 scoring。

## 7. 推薦邏輯設計

本次採用 **加權評分機制（Weighted Scoring Model）**。

每個候選商品會依據多個條件計分，最後依總分排序。

| 條件                | 權重 | 說明               |
| :------------------ | :--- | :----------------- |
| 同分類              | +40  | 反映使用者近期興趣 |
| 同品牌              | +25  | 反映品牌偏好       |
| 共現商品（co-view） | +30  | 模擬協同過濾概念   |
| 關鍵字命中          | +20  | 對應搜尋意圖       |
| 價格相近            | +15  | 降低轉換阻力       |
| 商品熱度高          | +20  | 熱門商品加權       |
| 已瀏覽商品          | 排除 | 避免重複曝光       |

推薦結果也會回傳推薦理由，例如：

- 因為你瀏覽或偏好相同分類的商品。
- 同品牌商品符合你最近的瀏覽傾向。
- 看過此商品的人也瀏覽了這些。
- 商品名稱、分類或品牌符合你的搜尋關鍵字。
- 與你剛剛查看的商品價格相近。
- 目前尚無瀏覽行為，先推薦熱門商品。

## 8. 推薦流程（Recommendation Pipeline）

推薦流程如下：

1. 使用者產生行為（瀏覽 / 搜尋 / 加入購物車）
2. 前端呼叫 `/api/recommendations`
3. 後端收集使用者上下文（user events）
4. 建立候選商品集合（candidate set）
5. 套用 scoring rules 計算分數
6. 排序並取 Top N
7. 回傳推薦結果與推薦理由
8. 前端顯示推薦商品

## 9. 為什麼不直接使用 AI 模型？

這次沒有直接導入正式 AI / ML 模型，主要原因是：

- 沒有真實使用者行為資料。
- take-home 時間有限。
- 模型訓練、調校與評估成本高。
- 第三方推薦服務會增加成本與外部依賴。
- 本次重點是展示需求拆解、架構設計與可運作 MVP。

因此我選擇先實作 **rule-based recommendation**。

這個做法比較務實：在缺乏資料與經驗的情況下，先用規則式推薦建立可展示版本，同時把推薦邏輯集中在後端 Service，未來可以用相同 API contract 替換成：

- 第三方推薦 API。
- 向量資料庫 + 商品 embedding。
- collaborative filtering。
- content-based filtering。
- hybrid recommendation model。

## 10. 前端體驗與 RWD

前端目前使用 Material UI 實作購物商城型介面，包含：

- Header。
- Footer。
- Light / dark theme 切換。
- 商品搜尋列。
- 分類篩選。
- 商品卡片。
- AI 推薦區塊。
- 使用者行為面板。

RWD 設計上：

- 桌機版採主內容 + 右側行為面板。
- 手機版改為單欄排列。
- 分類標籤可橫向捲動。
- 商品卡片在不同寬度下自動調整欄數。

## 11. 驗證方式

每個階段完成後，我都有要求 AI 自動執行驗證。

目前已驗證：

- `dotnet build`
- `npm run lint`
- `npm run build`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/recommendations`
- Swagger API list
- Playwright 桌機 / 手機 RWD 截圖
- Playwright 前端互動流程

Phase 4 驗證的重點是：

- 初次進入頁面會顯示後端預設熱門推薦。
- 點擊商品後，推薦結果會改變。
- 搜尋關鍵字後，推薦依據會更新。
- 切換分類後，推薦依據會更新。
- 加入購物車後，行為面板會更新。
- 前端不直接計算推薦分數。

## 12. 這次 AI 協作的心得

這次最大的心得是：AI 工具很適合協助 0 到 1 建立 MVP，但前提是人要先把規格、邊界與驗收標準定清楚。

我不會一次要求 AI 完成整個系統，而是拆成小階段：

1. 初始化專案。
2. 建立後端資料結構。
3. 建立推薦 API。
4. 建立前端 UI。
5. 串接 API。
6. 驗證與文件整理。

每個階段都要求 AI 同步測試與更新文件，讓我可以專注在 reviewer 的角色，檢查：

- 架構是否合理。
- 是否符合原本規則。
- 前後端 contract 是否一致。
- 推薦邏輯是否可解釋。
- 是否有過度實作或偏離 MVP。

這次實作還有很多可以進步的地方:

1.當初在制定前後端規則時 沒有制定清楚 導致gen code後不是我要的 導致我需要再和AI溝通去修改 除了費時還需要耗費token
例:(前端rules忘記設定 UI要使用MUI套件 Call API要使用useQuery useMutation等) 2.由於對AI推薦這部分比較陌生 在制定開發規則.開發任務時 沒有辦法很精準的制定 中間也花了很多時間調整各個md檔

## 13. 後續演進方向

如果這個 MVP 要繼續往正式推薦系統演進，我會分幾個階段：

1. 收集真實 event log，例如瀏覽、點擊、加入購物車、購買。
2. 建立資料表與事件資料管線。
3. 離線計算 co-view / co-purchase matrix。
4. 導入商品 embedding 與向量搜尋。
5. 加入使用者分群與個人化特徵。
6. 建立 A/B test 觀察推薦區塊是否提升點擊率或轉換率。
7. 視資料量與效果，再評估自建模型或第三方推薦服務。

這樣可以從低成本 MVP 平滑演進到真正的 AI 推薦系統，而不是一開始就投入高成本模型開發。

## 14. 評估方式（Evaluation Metrics）

本次 MVP 主要以功能驗證為主，未導入正式線上指標。但在實務上，推薦系統通常會透過以下指標評估效果：

- CTR（Click Through Rate）：推薦商品點擊率
- Conversion Rate：推薦商品轉換率
- Add-to-Cart Rate：加入購物車比例
- Engagement Time：使用者停留時間

由於目前使用 mock data，本次僅驗證：

- 推薦結果是否會隨使用者行為變化
- 推薦理由是否合理且可解釋
- 推薦結果是否具備多樣性（非單一商品重複）

未來若導入真實資料，會透過 A/B Testing 評估推薦策略效果。

## 15. 系統邊界與限制

本次 MVP 不包含：

- 即時推薦（real-time streaming）
- 使用者長期偏好建模（user profiling）
- 多模型融合（hybrid recommendation）
- 廣告排序與商業邏輯混排
- 分散式資料處理（如 Kafka / Spark）

目前系統僅支援：

- 基於近期行為的簡單推薦
- 單一 scoring model
- in-memory mock data

此設計是刻意簡化，以便聚焦於推薦流程與架構驗證。
