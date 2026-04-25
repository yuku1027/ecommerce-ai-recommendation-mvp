---
name: playwright-skill
description: 使用 Playwright 進行瀏覽器自動化與網頁 UI 驗證，涵蓋可重現的導覽、互動、資料擷取、截圖存證與流程除錯。當任務需要從終端執行真實瀏覽器腳本或測試、驗證前端行為、排查 selector 或等待條件、處理登入與 session、蒐集頁面或網路層證據時使用此技能。
---

# Playwright 技能

使用此技能在終端中執行 Playwright 自動化流程。

## 快速開始

1. 進入技能目錄。
2. 確認依賴或先完成安裝。
3. 用 `run.js` 執行腳本（檔案、inline、或 stdin）。

```bash
cd "$SKILL_DIR"
npm list playwright 2>/dev/null || npm run setup
node run.js "console.log('playwright-ready')"
```

若需求是「全面檢測 + 輸出報告」，優先使用內建腳本：

```bash
npm run test:comprehensive -- --url https://example.com --env staging
```

## 第一次使用

1. 先執行 `node run.js "..."`。
2. 若未安裝 `playwright`，`run.js` 會自動嘗試安裝 `npm install` 與 `npx playwright install chromium`。
3. 若自動安裝失敗（常見於網路或權限限制），手動執行：

```bash
cd "$SKILL_DIR"
npm run setup
```

4. 安裝完成後重新執行 `node run.js "..."`。

## 標準工作流程

1. 先定義可驗證的目標（要點擊什麼、要看到什麼、哪裡算成功）。
2. 使用可重現設定執行（`headless`、固定 viewport、明確 timeout）。
3. 依序優先使用穩定 selector：
`data-testid` -> `getByRole`/name -> label/text -> semantic attribute。
4. 避免硬塞 sleep，改為等待 URL、locator state、response 或 load state。
5. 失敗時保留證據（截圖、console、request/response、trace）。
6. 回報精簡結果：做了什麼、哪一步失敗、下一步修正建議。

## 全面檢測覆蓋矩陣

在使用者只給網址或需求較模糊時，至少覆蓋以下 8 個面向：

1. 導覽與可用性：首頁可載入、核心路由可進入、無致命錯誤頁。
2. 核心流程 Happy Path：以主要商業流程為主線完整走一次。
3. 關鍵負向場景：錯誤輸入、空值、權限不足、重複提交。
4. 表單與驗證：必填、格式、邊界值、錯誤訊息顯示。
5. 狀態與資料一致性：UI 顯示與 API response 一致。
6. 響應與等待穩定性：避免硬等待，對 URL/locator/response 做顯式等待。
7. 相容性最小覆蓋：桌機 viewport + 行動 viewport 各至少一次。
8. 可觀測性：失敗步驟至少含截圖與錯誤訊息，必要時加 network 線索。

若使用者提供明確流程，先完整覆蓋指定流程，再補齊上述缺漏面向。

## 輸入契約（讓檢測更完整）

要求使用者至少提供以下資訊；若缺漏，先做保守 smoke test 並在報告標記限制：

1. 目標網址（含環境別：dev/staging/prod）。
2. 需登入與否（測試帳密或測試 token）。
3. 核心流程步驟（至少 1 條主流程）。
4. 成功條件（URL、文字、狀態、資料變化）。
5. 不可操作範圍（避免誤觸真實交易或破壞性動作）。

若要啟用 API 驗證與 API 報告，另外提供：

1. `apiMode`：`real`、`mock`、`hybrid`。
2. `mockRoutes`（可選）：mock 規則（urlPattern、method、status、body）。
3. `contractChecks`（可選）：合約檢查（urlPattern、method、expectStatus、requiredFields）。
4. `expectedApiEndpoints`（可選）：預期應命中的 API pattern 清單，用於 coverage 報表。

## 測試報告輸出規範

每次執行都產出兩份報告：

1. Markdown：`reports/playwright-report-<timestamp>.md`
2. JSON：`reports/playwright-report-<timestamp>.json`

Markdown 最少包含以下段落：

1. 測試摘要（時間、環境、網址、總案例數、通過/失敗）。
2. 覆蓋面向（對照「全面檢測覆蓋矩陣」逐項標示 `covered`/`partial`/`not-covered`）。
3. 案例結果表（Case ID、目標、結果、失敗原因、證據路徑）。
4. 缺陷清單（Severity、重現步驟、預期/實際、建議修正）。
5. 風險與限制（未覆蓋區塊、測試資料限制、外部依賴不穩定）。
6. 附件清單（screenshot、trace、console、network）。

JSON 最少欄位：

```json
{
  "runId": "string",
  "timestamp": "ISO-8601",
  "target": { "baseUrl": "string", "env": "string" },
  "summary": { "total": 0, "passed": 0, "failed": 0, "blocked": 0 },
  "apiSummary": {
    "apiMode": "real|mock|hybrid",
    "totalResponses": 0,
    "totalFailures": 0,
    "status5xxCount": 0,
    "contractChecksTotal": 0,
    "contractChecksPassed": 0,
    "contractChecksFailed": 0,
    "latencyMs": { "p50": 0, "p95": 0, "max": 0 },
    "endpointCoverage": [{ "pattern": "**/api/**", "hits": 0, "status": "covered|not-covered" }]
  },
  "apiDetails": {
    "mockRulesApplied": [{ "urlPattern": "**/api/**", "method": "GET", "status": 200 }],
    "contractResults": [
      {
        "id": "contract-user",
        "url": "https://example.com/api/user",
        "method": "GET",
        "expectedStatus": 200,
        "actualStatus": 200,
        "statusPassed": true,
        "requiredFields": ["id", "email"],
        "requiredFieldsPassed": true,
        "missingFields": []
      }
    ]
  },
  "coverage": {
    "navigation": "covered|partial|not-covered",
    "happyPath": "covered|partial|not-covered",
    "negative": "covered|partial|not-covered",
    "formValidation": "covered|partial|not-covered",
    "dataConsistency": "covered|partial|not-covered",
    "stability": "covered|partial|not-covered",
    "responsive": "covered|partial|not-covered",
    "observability": "covered|partial|not-covered"
  },
  "cases": [
    {
      "id": "TC-001",
      "title": "string",
      "status": "passed|failed|blocked",
      "reason": "string",
      "evidence": ["path/to/file"]
    }
  ],
  "defects": [
    {
      "id": "BUG-001",
      "severity": "critical|high|medium|low",
      "title": "string",
      "steps": ["..."],
      "expected": "string",
      "actual": "string",
      "evidence": ["path/to/file"]
    }
  ]
}
```

若使用者明確要求「測試報告」，優先按此格式輸出，不要只給文字摘要。

## API 測試模式

使用內建腳本時可加 `--api-mode`：

```bash
# 真實 API
npm run test:comprehensive -- --url https://example.com --env staging --api-mode real --config ./test-plan.json

# 全 mock API
npm run test:comprehensive -- --url https://example.com --env staging --api-mode mock --config ./test-plan.json

# 混合模式（部分 mock + 部分 real）
npm run test:comprehensive -- --url https://example.com --env staging --api-mode hybrid --config ./test-plan.json
```

## 預設原則

- 除非明確需要，優先用 Chromium。
- 讓腳本可重跑且具冪等性。
- 將 base URL、認證設定集中管理，不要散落於每個測試。
- 針對不穩定外部 API，優先 mock，再考慮拉高 timeout。

## 請求標頭注入

當後端需要辨識自動化流量時，使用環境變數注入 header：

```bash
PW_HEADER_NAME=X-Automated-By PW_HEADER_VALUE=playwright-skill
PW_EXTRA_HEADERS='{"X-Automated-By":"playwright-skill","X-Request-ID":"123"}'
```

優先順序：
1. `options.extraHTTPHeaders`
2. 環境變數 headers
3. Playwright 預設值

## 疑難排解

1. 找不到元素：確認 role/name、可見性與 iframe。
2. Timeout：改等正確訊號（URL/response/locator），不要直接加 sleep。
3. 登入失敗：檢查 storage state、cookie、header。
4. 測試不穩定：隔離測資、mock 外部依賴、啟用 trace。

## 參考資料

- 完整 API 與進階範例：[references/playwright-api-reference.md](references/playwright-api-reference.md)
- 備份筆記：[SKILLBACKUP.md](SKILLBACKUP.md)
- 執行器與函式庫：`run.js`、`lib/`

只在需要時讀取對應 reference 區段，避免上下文膨脹。
