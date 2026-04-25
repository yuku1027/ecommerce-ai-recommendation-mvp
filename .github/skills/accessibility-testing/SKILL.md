---
name: accessibility-testing
description: 專門為 React 元件建立與執行無障礙測試（Jest + React Testing Library + jest-axe），涵蓋 WCAG 2.1 AA 自動化檢查、鍵盤互動、焦點管理與可辨識名稱驗證。當需求聚焦在「只做無障礙測試」、需要產出 a11y 測試報告、或要將功能測試與無障礙測試拆分維護時使用此 Skill。
---

# Accessibility Testing

## 目標
為指定 React 元件建立可維護的無障礙測試，並輸出機器可讀與人工可讀報告，讓團隊可在 CI 與 Code Review 快速掌握風險。

## 使用方法
在對話中指定元件與（可選）相依 API：

```text
@workspace /accessibility-testing 請為以下元件建立無障礙測試：
  #file:'src/Page/CustomerPage/index.tsx'
  #file:'src/Page/CustomerPage/Form/index.tsx'
```

若元件依賴 API 或共用 UI 元件，請一併提供路徑以提高 mock 與測試精度。

## 執行流程
1. 掃描元件可見結構與互動行為，列出 a11y 風險點。
2. 建立測試檔並依規範補齊 `jest-axe` 與鍵盤/焦點情境。
3. 執行測試並彙整結果為 JSON + Markdown 報告。
4. 若遇阻塞（API 結構不明、互動規格不明），先提問再繼續。

## 測試規範

### 技術棧
- `Jest`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`
- `jest-axe`

### 撰寫規範
- 優先使用 `getByRole`，其次 `getByLabelText`、`getByText`。
- 互動模擬一律使用 `userEvent`，避免 `fireEvent`。
- `describe` 與 `it` 使用繁體中文命名並明確敘述情境。
- 禁止直接操作 DOM 實作細節（如 `querySelector` 驗證業務邏輯）。
- 測試資料與 mock 回應需貼近實際資料結構。

### 最低涵蓋案例
- `jest-axe`：元件主畫面無 WCAG 違規。
- 可辨識名稱：互動元素（按鈕、輸入、連結）具備可讀名稱。
- 鍵盤可達性：可用 Tab/Shift+Tab 走訪主要互動元件。
- Dialog/Modal：開啟後焦點進入對話框、Escape 可關閉、關閉後焦點返回觸發點。
- 表單錯誤：錯誤訊息可被讀取（`role="alert"` 或 `aria-live`）。

## 輸出

### 測試檔案
```text
src/**/__tests__/
└── {ComponentOrPage}.a11y.test.tsx
```

### 報告檔案
```text
test-reports/
├── {FeatureOrComponent}-a11y-test-report.json
└── {FeatureOrComponent}-a11y-test-report.md
```

### JSON 報告欄位
- `summary`：`total/passed/failed/skipped/duration`
- `categories`：`axe`, `keyboard`, `focus`, `semantics`
- `failedCases`：失敗案例與錯誤摘要
- `violations`：`jest-axe` 規則違規清單
- `pendingItems`：需人工補強項目

### Markdown 報告內容
- 測試總覽表
- 分類統計表（axe / keyboard / focus / semantics）
- 通過與失敗案例明細
- 無障礙違規清單
- 待處理事項 checklist

## 失敗與例外處理
- 元件未具備必要 ARIA 基礎時，可先將對應案例標記 `skip`，並在報告明確列出原因與修補建議。
- 問題 1–3 項：在回覆末段條列 `⚠️ 執行問題`。
- 問題 >= 4 項：另外輸出 `執行問題報告` 區塊並同步寫入 Markdown 報告。

## 與其他 Skill 的搭配
- 先做元件補強：搭配 `accessibility`
- 再做完整功能測試：搭配 `react-testing`
