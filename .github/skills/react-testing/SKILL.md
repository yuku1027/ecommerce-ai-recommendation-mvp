---
name: react-testing
description: 為任意 React 元件產生 Jest + React Testing Library + jest-axe 測試檔案，涵蓋渲染、互動、API 呼叫與無障礙驗證。可單獨使用，也可作為 prototype-to-react-orchestrator 流程的一環。
---

# React Testing

## 目標
為指定的 React 元件撰寫完整的測試套件，涵蓋功能、互動、無障礙三個面向。

**可單獨使用**：直接提供元件路徑或程式碼即可，不需先執行 `prototype-to-react` 或 `accessibility`。

## 測試技術棧

| 工具 | 用途 |
|------|------|
| `Jest` | 測試執行環境 |
| `@testing-library/react` | 元件渲染與互動 |
| `@testing-library/user-event` | 模擬真實使用者操作 |
| `@testing-library/jest-dom` | 自訂 DOM matcher |
| `jest-axe` | 自動化無障礙規則驗證（WCAG） |
| `msw`（可選） | API mock server |

## 輸入來源

使用者直接指定要測試的元件路徑或貼上程式碼即可：

```
# 範例 1：單一元件
src/components/UserCard.tsx

# 範例 2：整個功能頁（含列表與表單）
src/Page/{Feature}Page/index.tsx
src/Page/{Feature}Page/Form/index.tsx

# 範例 3：共用元件
src/Shared/UI/BaseModal.tsx
```

若元件有依賴的 API 函式（如 `src/api/{featureLower}Api/index.ts`），一併提供可產出更精確的 mock 與測試。

## 輸出結構

```
src/
└── Page/{Feature}Page/
    ├── __tests__/
    │   ├── {Feature}Page.test.tsx      ← 列表頁測試
    │   └── {Feature}FormPage.test.tsx  ← 表單頁測試
└── Shared/UI/
    └── __tests__/
        ├── BaseModal.test.tsx
        ├── AppButton.test.tsx
        └── ErrorMessage.test.tsx
```

## 測試類別與涵蓋範圍

### 1. 渲染測試（Render）
- 元件在預設 props 下正常 render，不拋出錯誤
- 頁面標題、主要區塊、關鍵文字正確顯示
- Loading 狀態下顯示 spinner / skeleton
- 空資料狀態顯示正確的空白提示

### 2. 互動測試（Interaction）
- 查詢表單輸入、送出、重設
- 新增/編輯 Modal 開啟與關閉
- 表單欄位驗證：必填未填、格式錯誤顯示正確錯誤訊息
- 表單成功送出後關閉 Modal 並重新整理列表
- 停用/刪除操作觸發確認 Dialog，確認後執行 API
- 分頁切換

### 3. API 整合測試（API）
- mock API 成功回應 → 元件正確更新
- mock API 失敗回應 → 顯示錯誤訊息
- 送出表單時傳遞正確的 request payload
- API 呼叫期間顯示 loading 狀態

### 4. 無障礙測試（Accessibility）
使用 `jest-axe` 對每個元件執行自動化 WCAG 掃描：

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<ComponentUnderTest />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

額外驗證：
- Modal 開啟後焦點進入 `role="dialog"`
- 所有 `<button>` 有可辨識的 accessible name
- 表單錯誤訊息可被螢幕閱讀器讀取（`role="alert"` 或 `aria-live`）
- Escape 鍵可關閉 Modal

## 程式碼範例模板

### 列表頁測試骨架

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { {Feature}Page } from '../index';

expect.extend(toHaveNoViolations);

// mock API
jest.mock('src/api/{featureLower}Api', () => ({
  get{Feature}List: jest.fn().mockResolvedValue([/* mock data */]),
}));

describe('{Feature}Page', () => {
  describe('渲染', () => {
    it('應正確渲染列表頁標題與查詢區塊', () => { /* ... */ });
    it('API 載入中應顯示 loading 狀態', () => { /* ... */ });
    it('無資料時應顯示空白提示訊息', () => { /* ... */ });
  });

  describe('查詢互動', () => {
    it('輸入關鍵字後點擊查詢，應觸發 API 並更新列表', async () => { /* ... */ });
    it('點擊重設，應清空查詢條件', async () => { /* ... */ });
  });

  describe('無障礙', () => {
    it('不應有 WCAG 違規', async () => {
      const { container } = render(<{Feature}Page />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
```

### 表單頁測試骨架

```typescript
describe('{Feature}FormPage', () => {
  describe('新增模式', () => {
    it('必填欄位未填寫時，送出應顯示錯誤訊息', async () => { /* ... */ });
    it('填寫完整後送出，應呼叫 add{Feature} API', async () => { /* ... */ });
    it('API 成功後應關閉表單並顯示成功提示', async () => { /* ... */ });
  });

  describe('編輯模式', () => {
    it('進入編輯模式應預填現有資料', async () => { /* ... */ });
    it('修改欄位後送出，應呼叫 update{Feature} API', async () => { /* ... */ });
  });

  describe('鍵盤操作', () => {
    it('Escape 鍵應關閉表單 Modal', async () => { /* ... */ });
    it('Tab 鍵應可依序到達所有表單欄位', async () => { /* ... */ });
  });

  describe('無障礙', () => {
    it('不應有 WCAG 違規', async () => { /* ... */ });
  });
});
```

## 產出規則

- 每個 `describe` 使用繁體中文命名，清楚說明測試情境
- mock 資料要貼近真實 API 回應結構（參考 UI Schema 的 interface）
- 使用 `userEvent` 而非 `fireEvent` 模擬使用者操作
- 禁止直接操作 DOM，全部透過 RTL query（`getByRole`、`getByLabelText` 優先）
- 全文使用**繁體中文**說明

---

## 測試報告產出

每次執行完測試後，**必須同時產出 JSON 與 Markdown 兩份報告**，存放於：

```
test-reports/
├── {Feature}-test-report.json   ← 機器可讀，供 CI 解析
└── {Feature}-test-report.md     ← 人工閱讀，供 review 與存檔
```

### JSON 報告格式

```json
{
  "feature": "{Feature}",
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "summary": {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "skipped": 0,
    "duration": "0.00s"
  },
  "categories": {
    "render": { "total": 0, "passed": 0, "failed": 0 },
    "interaction": { "total": 0, "passed": 0, "failed": 0 },
    "api": { "total": 0, "passed": 0, "failed": 0 },
    "accessibility": { "total": 0, "passed": 0, "failed": 0 }
  },
  "suites": [
    {
      "name": "describe 名稱",
      "file": "src/Page/{Feature}Page/__tests__/{Feature}Page.test.tsx",
      "cases": [
        {
          "name": "it 描述文字",
          "category": "render | interaction | api | accessibility",
          "status": "passed | failed | skipped",
          "duration": "0.00s",
          "error": null
        }
      ]
    }
  ],
  "failedCases": [],
  "accessibilityViolations": [],
  "pendingItems": []
}
```

### Markdown 報告格式

```markdown
# 測試報告：{Feature}

> 產出時間：YYYY-MM-DD HH:mm
> 執行檔案：src/Page/{Feature}Page/__tests__/

---

## 總覽

| 項目 | 數量 |
|------|------|
| 總計 | N |
| ✅ 通過 | N |
| ❌ 失敗 | N |
| ⏭️ 略過 | N |
| 執行時間 | 0.00s |

---

## 分類統計

| 類別 | 總計 | 通過 | 失敗 |
|------|------|------|------|
| 渲染（Render） | N | N | N |
| 互動（Interaction） | N | N | N |
| API 整合 | N | N | N |
| 無障礙（Accessibility） | N | N | N |

---

## 測試明細

### ✅ {describe 名稱}

| 測試案例 | 類別 | 結果 | 耗時 |
|----------|------|------|------|
| 元件應正常渲染 | 渲染 | ✅ 通過 | 0.00s |
| 點擊查詢應呼叫 API | 互動 | ✅ 通過 | 0.00s |

### ❌ {describe 名稱}（有失敗項目）

| 測試案例 | 類別 | 結果 | 耗時 |
|----------|------|------|------|
| 表單送出應顯示成功訊息 | 互動 | ❌ 失敗 | 0.00s |

**失敗原因：**
```
錯誤訊息或 stack trace 摘要
```

---

## 無障礙違規（jest-axe）

> 若無違規顯示「✅ 無 WCAG 違規」

| 元件 | 規則 | 嚴重度 | 說明 |
|------|------|--------|------|
| {Feature}Page | color-contrast | serious | 文字對比度不足 |

---

## 待處理事項

- [ ] 待補充的 mock 項目
- [ ] 需確認的測試情境

---

*由 react-testing Skill 自動產出*
```

---

## 輸出結尾

1. 產出測試檔案清單與路徑
2. 產出測試報告（JSON + Markdown），存放於 `test-reports/`
3. 需要額外補充 mock 或設定的項目清單

---

## 執行問題處理

### 主動提問
遇到以下情況，**必須先提問，不得自行假設後繼續**：
- 元件依賴的 API 結構不明確，無法建立正確 mock
- 測試情境不確定（如：哪些互動是核心流程、哪些可略過）
- 元件尚未加入無障礙屬性，jest-axe 必然失敗時

### 問題回報
執行過程中遇到問題，**必須在最後統一回報**，不得靜默跳過：

**問題數量少（1–3 個）**：直接在回覆結尾條列說明。

```
⚠️ 執行問題
1. [問題描述] — [影響範圍 / 建議處理方式]
```

**問題數量多（4 個以上）**：產出問題報告，一併附在測試報告內（Markdown 的「待處理事項」區塊），並單獨條列提示使用者。

```markdown
# 執行問題報告

> Skill：react-testing
> 功能：{Feature}
> 時間：YYYY-MM-DD HH:mm

## 問題清單

| # | 類型 | 說明 | 影響範圍 | 建議處理 |
|---|------|------|----------|----------|
| 1 | Mock 缺漏 | get{Feature}List 無法建立正確 mock | 列表頁渲染測試 | 提供 API interface 後補齊 |
| 2 | 無障礙缺失 | 元件尚無 ARIA，jest-axe 測試已標記 skip | 無障礙測試 | 先執行 accessibility Skill |

## 需使用者決策的項目

- [ ] 問題 1：請提供 xxx
- [ ] 問題 2：請確認 xxx
```
