# prototype-to-react

將靜態 HTML 雛形頁面轉換為 **React 18 + TypeScript + React-Bootstrap** 的完整元件程式碼，包含 API 層、頁面元件、interface 定義與 mock data。

---

## 何時使用

- 設計師或 PM 交付了 HTML 雛形，需要轉成 React 元件
- 有後端程式規格書，需要對接 API 並建立 interface
- 初次建立某個功能頁（列表頁 + 表單頁）

> 若只需要補無障礙設計，請改用 [`accessibility`](../accessibility/README.md)。
> 若要一鍵跑完整個流程（含測試），請改用 [`prototype-to-react-orchestrator`](../prototype-to-react-orchestrator/README.md)。

---

## 前置準備

使用前請確認以下檔案已存在：

```
.github/prototypes/{Feature}/
├── index.html        ← 列表頁雛形（必須）
└── form.html         ← 表單頁雛形（必須）

.github/agents/features/{Functional}/
└── {Feature}-code-spec.md   ← 程式規格書（必須）
```

`mock-data.js` 不存在時 Skill 會自動建立。

---

## 使用方式

在 Copilot Chat 輸入：

```
@workspace /prototype-to-react 請讀取
  #file:'.github/prototypes/Customer/index.html'
  #file:'.github/prototypes/Customer/form.html'
  #file:'.github/agents/features/CustomerManagement/Customer-code-spec.md'
產生 React 程式碼
```

---

## 執行流程

```
Step 1  讀取 HTML 雛形 + 程式規格書
   ↓
Step 2  萃取 UI Schema（JSON）→ 輸出給你確認
   ↓  ← 等你確認後才繼續
Step 3  建立 mock data
   ↓
Step 4  產生程式碼（API 層 + 頁面元件）
   ↓
Step 5  輸出 Router 變更提示
   ↓
Step 6  輸出完成摘要與確認清單
```

> **Step 2 一定會暫停等你確認 UI Schema**，確認後才產出程式碼。

---

## 產出檔案

| 檔案 | 說明 |
|------|------|
| `src/api/{featureLower}Api/interface.ts` | API Request / Response interface |
| `src/api/{featureLower}Api/index.ts` | axios 呼叫函式 |
| `src/Page/{Feature}Page/interface.ts` | 頁面層 interface |
| `src/Page/{Feature}Page/index.tsx` | 列表頁元件 |
| `src/Page/{Feature}Page/Form/index.tsx` | 表單頁元件 |
| `src/Shared/UI/*`（視需求） | 共用 UI 元件 |
| `.github/prototypes/{Feature}/mock-data.js` | Mock 資料 |

---

## Mock Data 切換

| 方式 | 說明 |
|------|------|
| `VITE_USE_MOCK=true` | 使用 mock data（預設） |
| `VITE_USE_MOCK=false` | 使用真實 API |
| URL 參數 `?mock=1` | 覆蓋環境變數，優先序最高 |

---

## 無障礙地基（自動套用）

每次產出的程式碼都會內建以下基本 HTML 習慣：

- 語意化標籤（`<button>`、`<nav>`、`<table>`，不用 `<div>` 模擬）
- 圖片加 `alt`
- 表單欄位綁定 `<label htmlFor>`
- 正確標題層級（`<h1>` 只有一個）

進階 ARIA 與鍵盤導覽請另外執行 [`accessibility`](../accessibility/README.md) Skill。

---

## 支援增量更新

若功能頁已存在，再次執行時會：

1. 自動讀取既有程式碼
2. 只修改受影響的檔案與區塊
3. 輸出「變更清單 + 保持不變清單」

不會重生全部檔案。

---

## 注意事項

- 需求不明確時 Skill 會先列「待確認問題清單」，等你回覆後才繼續
- 不會直接修改 `src/Router/index.tsx`，只會提示應新增的 Route 片段
- 禁止使用 `any`、`export default`、`window.alert`
