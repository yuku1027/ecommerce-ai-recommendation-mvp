# Playwright Skill 使用說明

這個資料夾提供可重用的 Playwright 測試技能，包含：

- `run.js`：通用 Playwright 執行器
- `scripts/run-comprehensive-test.js`：全面檢測與報告輸出腳本

## 前置需求

```bash
cd .github/skills/playwright-skill
npm run setup
```

## 快速冒煙測試

```bash
node run.js "console.log('playwright-ready')"
```

## 執行全面檢測（不帶設定檔）

```bash
npm run test:comprehensive -- --url https://example.com --env staging
```

輸出檔案：

- `reports/playwright-report-<runId>.md`
- `reports/playwright-report-<runId>.json`
- `artifacts/<runId>/...`（截圖與執行訊號）

## 執行全面檢測（帶設定檔）

1. 複製範本：

```bash
cp scripts/test-plan.example.json ./test-plan.json
```

2. 編輯 `test-plan.json`，填入你的 selector 與預期結果。

3. 執行：

```bash
npm run test:comprehensive -- --url https://your-site.com --env staging --config ./test-plan.json

# 指定 API 模式
npm run test:comprehensive -- --url https://your-site.com --env staging --api-mode hybrid --config ./test-plan.json
```

## CLI 參數

- `--url`（必填）：目標網址
- `--env`（選填）：環境標籤（`dev`、`staging`、`prod`...）
- `--api-mode`（選填）：`real`、`mock`、`hybrid`（預設 `real`）
- `--config`（選填）：JSON 測試計畫檔路徑
- `--help`：顯示使用方式

## 測試計畫 JSON 結構（摘要）

- `keyRoutes`：可選，導覽路由檢查清單
- `happyPath`：可選，核心流程步驟
- `negativePath`：可選，負向流程步驟
- `dataChecks`：可選，UI/API 資料一致性檢查
- `mockRoutes`：可選，API mock 規則
- `contractChecks`：可選，API contract 規則
- `expectedApiEndpoints`：可選，預期命中的 API pattern（做 coverage 用）

支援的步驟動作：

- `goto`
- `click`
- `fill`
- `type`
- `press`
- `waitForURL`
- `waitForSelector`
- `expectText`
- `expectVisible`
- `expectURL`
- `select`
- `check`
- `uncheck`
- `screenshot`

## 安全建議

- 優先在 staging 環境執行。
- 在 happy/negative flow 中避免破壞性操作。
- 若未提供設定檔，商業流程相關覆蓋率會出現 `blocked` 或 `not-covered`。
- 若使用 `mock` 或 `hybrid`，請在報告中一併檢查 `apiSummary` 與 `apiDetails.contractResults`。
