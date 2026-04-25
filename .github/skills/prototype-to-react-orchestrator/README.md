# prototype-to-react-orchestrator

從 HTML 雛形一鍵跑完整個前端開發流程的總指揮 Skill，依序協調三個子 Skill，最終產出可上線的 React 元件（含無障礙與測試）。

---

## 流程全覽

```
你丟入 HTML 雛形 + 程式規格書
        ↓
[Phase 1] prototype-to-react
  → 萃取 UI Schema → 你確認 → 產生 React TSX + API 層
        ↓
[Phase 2] accessibility
  → 加入 ARIA、鍵盤導覽、語意化 HTML、焦點管理
        ↓
[Phase 3] react-testing
  → 產生 Jest + RTL + jest-axe 測試 + JSON/MD 報告
        ↓
最終產出：元件程式碼 + 測試檔案 + 測試報告
```

---

## 各 Skill 也可單獨使用

> 不一定要跑完整個流程。

| 需求 | 使用的 Skill |
|------|-------------|
| 從雛形產出 React 元件 | [`prototype-to-react`](../prototype-to-react/README.md) |
| 幫現有元件補無障礙 | [`accessibility`](../accessibility/README.md) |
| 幫現有元件補測試 | [`react-testing`](../react-testing/README.md) |
| 全流程（從雛形到測試） | **本 Skill（orchestrator）** |

---

## 前置準備

```
.github/prototypes/{Feature}/
├── index.html        ← 列表頁雛形（必須）
└── form.html         ← 表單頁雛形（必須）

.github/agents/features/{Functional}/
└── {Feature}-code-spec.md   ← 程式規格書（必須）
```

---

## 使用方式

在 Copilot Chat 輸入：

```
@workspace /prototype-to-react-orchestrator 請讀取
  #file:'.github/prototypes/Customer/index.html'
  #file:'.github/prototypes/Customer/form.html'
  #file:'.github/agents/features/CustomerManagement/Customer-code-spec.md'
開始完整流程
```

---

## 各 Phase 說明

### Phase 1 — prototype-to-react

1. 解析 HTML 雛形，萃取 UI Schema（JSON）
2. **⏸️ 暫停，等你確認 UI Schema**
3. 產生 React 程式碼（API 層 + 列表頁 + 表單頁 + 共用元件）

**移交 Phase 2 前提供**：元件路徑清單、各元件主要互動行為摘要

### Phase 2 — accessibility

1. 讀取 Phase 1 產出的元件
2. 掃描並列出無障礙問題
3. 加入 ARIA、鍵盤導覽、焦點管理
4. 輸出修改前/後對比

**移交 Phase 3 前提供**：強化後的元件路徑、關鍵 ARIA role/label（供測試 query）

### Phase 3 — react-testing

1. 依 Phase 2 資訊產生測試檔案
2. 涵蓋渲染、互動、API、無障礙（jest-axe）
3. 產出 JSON + Markdown 測試報告

---

## 最終產出

```
src/
├── Shared/UI/                          ← 共用元件
├── Page/{Feature}Page/
│   ├── index.tsx                       ← 列表頁（含無障礙）
│   ├── interface.ts
│   ├── Form/index.tsx                  ← 表單頁（含無障礙）
│   └── __tests__/
│       ├── {Feature}Page.test.tsx
│       └── {Feature}FormPage.test.tsx
└── api/{featureLower}Api/
    ├── index.ts
    └── interface.ts

test-reports/
├── {Feature}-test-report.json
└── {Feature}-test-report.md
```

---

## 完成摘要格式

```
✅ Phase 1 - prototype-to-react
   產出檔案：[列出路徑]

✅ Phase 2 - accessibility
   強化元件：[列出元件]

✅ Phase 3 - react-testing
   測試檔案：[列出路徑]
   測試涵蓋：渲染 N / 互動 N / API N / 無障礙 N

⚠️ 待處理事項：[需人工確認的項目]
```

---

## 注意事項

- Phase 1 的 UI Schema 確認**不可跳過**（確保後續兩個 Phase 的命名與結構一致）
- 每個 Phase 結束若有問題，**即時回報**，不累積到最後
- 問題超過 4 個時，自動產出問題報告
- 全程使用**繁體中文**溝通
