# react-testing

為任意 React 元件產生 **Jest + React Testing Library + jest-axe** 測試套件，並自動產出 JSON 與 Markdown 格式的測試報告。

---

## 何時使用

- 需要為現有元件補上測試
- 想驗證元件的渲染、互動、API 呼叫是否正確
- 需要自動化無障礙驗證（WCAG）

> 可**單獨使用**，不需要先執行其他 Skill。

---

## 使用方式

在 Copilot Chat 指定要測試的元件：

```
@workspace /react-testing 請為以下元件產生測試：
  #file:'src/Page/CustomerPage/index.tsx'
  #file:'src/api/customerApi/index.ts'
```

若同時提供 API 函式檔，可產出更精確的 mock 與測試內容。

---

## 測試技術棧

| 工具                          | 用途                   |
| ----------------------------- | ---------------------- |
| `Jest`                        | 測試執行環境           |
| `@testing-library/react`      | 元件渲染與互動         |
| `@testing-library/user-event` | 模擬真實使用者操作     |
| `@testing-library/jest-dom`   | 自訂 DOM matcher       |
| `jest-axe`                    | 自動化 WCAG 無障礙驗證 |
| `msw`（可選）                 | API mock server        |

---

## 測試涵蓋範圍

### 1. 渲染測試

- 元件正常 render，不拋出錯誤
- 關鍵文字、標題、區塊正確顯示
- Loading 狀態顯示 spinner
- 空資料顯示空白提示

### 2. 互動測試

- 表單輸入、送出、重設
- Modal 開啟與關閉
- 必填驗證、格式錯誤訊息
- 分頁切換

### 3. API 整合測試

- 成功回應 → 元件正確更新
- 失敗回應 → 顯示錯誤訊息
- 傳遞正確的 request payload
- Loading 狀態期間的 UI 表現

### 4. 無障礙測試（jest-axe）

- 自動掃描 WCAG 違規
- 驗證 Modal 焦點行為
- 確認所有按鈕有可辨識的名稱

---

## 產出檔案

```
src/Page/{Feature}Page/
└── __tests__/
    ├── {Feature}Page.test.tsx       ← 列表頁測試
    └── {Feature}FormPage.test.tsx   ← 表單頁測試

test-reports/
├── {Feature}-test-report.json       ← 機器可讀報告（供 CI 解析）
└── {Feature}-test-report.md         ← 人工閱讀報告（供 review）
```

---

## 測試報告

### JSON 報告包含

- 總覽（total / passed / failed / skipped / 執行時間）
- 四大類別統計（渲染 / 互動 / API / 無障礙）
- 每個測試案例的狀態與耗時
- 失敗案例的錯誤訊息
- jest-axe 違規清單

### Markdown 報告包含

- 總覽表格
- 分類統計表格
- 測試明細（通過/失敗分群，附修改前後對比）
- 無障礙違規表格
- 待處理事項 checklist

---

## 撰寫規範

- 使用 `userEvent` 模擬使用者操作（不用 `fireEvent`）
- Query 優先順序：`getByRole` > `getByLabelText` > `getByText`（禁止直接操作 DOM）
- `describe` 使用繁體中文命名
- Mock 資料貼近真實 API 回應結構

---

## 注意事項

- 若元件尚無無障礙屬性，jest-axe 測試會先標記 `skip` 並提示先執行 [`accessibility`](../accessibility/README.md) Skill
- 若 API 結構不明確，Skill 會主動詢問後再建立 mock
- 問題超過 4 個時，自動產出問題報告附在 Markdown 報告內
