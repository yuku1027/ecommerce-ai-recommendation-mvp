---
name: prototype-to-react-orchestrator
description: 將 HTML 雛形轉換為完整 React 元件的總指揮 Skill，依序協調 prototype-to-react → accessibility → react-testing 三個階段，最終產出元件程式碼與測試檔案。當使用者丟入 HTML 雛形並要求產生完整 React 功能（含無障礙與測試）時使用。
---

# Prototype to React Orchestrator

> **注意**：`prototype-to-react`、`accessibility`、`react-testing` 三個 Skill 皆可**單獨使用**。
> 本 Orchestrator 適合一次從雛形跑完整個流程的情境。若只需要強化無障礙或補測試，直接使用對應 Skill 即可。

## 目標
作為總指揮，依序執行以下三個 Skill，將 HTML 雛形轉換為生產就緒的 React 元件（含無障礙與測試）：

```
使用者丟入 prototype（HTML 雛形）
        ↓
[Phase 1] prototype-to-react   ← 讀取 agent 規範，產生 React JSX/TSX
        ↓（使用者確認 UI Schema 後）
[Phase 2] accessibility        ← 加入 ARIA、鍵盤導覽、語意化 HTML
        ↓
[Phase 3] react-testing        ← 產生 Jest + RTL + jest-axe 測試
        ↓
最終輸出：元件檔案 + 測試檔案
```

## 執行前置作業

讀取以下 Skill 規範（依序執行時作為每個 Phase 的行為準則）：
- `.github/skills/prototype-to-react/SKILL.md`
- `.github/skills/accessibility/SKILL.md`
- `.github/skills/react-testing/SKILL.md`

## 執行流程

### Phase 1：產生 React 程式碼

呼叫 `prototype-to-react` Skill：

1. 讀取 `.github/agents/Frontend/prototype-to-react-code.agent.md` 完整規範
2. 解析使用者提供的 HTML 雛形（`index.html`、`form.html`）
3. 萃取並輸出 **UI Schema**
4. ⏸️ **暫停，等待使用者確認 UI Schema**
5. 確認後產出完整 React 程式碼（API 層、頁面元件、共用元件）

**移交條件**：使用者確認程式碼無誤後，帶著以下資訊進入 Phase 2：
- 產出的元件檔案路徑清單
- 各元件的主要互動行為摘要（Modal、表單、列表操作等）

---

### Phase 2：無障礙強化

呼叫 `accessibility` Skill：

1. 讀取 Phase 1 產出的所有元件
2. 掃描並列出無障礙問題清單
3. 加入 ARIA 屬性、鍵盤導覽、焦點管理、語意化 HTML
4. 輸出修改摘要（修改前/後對比）

**移交條件**：帶著以下資訊進入 Phase 3：
- 已強化的元件路徑清單
- 各元件的 ARIA role/label 名稱（供測試查詢用）
- 需用 `jest-axe` 驗證的互動情境

---

### Phase 3：產生測試

呼叫 `react-testing` Skill：

1. 依 Phase 2 提供的元件與 ARIA 資訊，產生測試檔案
2. 涵蓋渲染、互動、API、無障礙（jest-axe）四大類測試
3. 輸出測試檔案清單與覆蓋摘要

---

## 各 Phase 溝通規則

- 每個 Phase 結束時必須明確說明：「**Phase X 完成，準備進入 Phase X+1**」
- Phase 1 → 2 移交時附上元件清單
- Phase 2 → 3 移交時附上 ARIA 資訊
- 任何 Phase 遇到不明確需求，**先提問等待確認，不得擅自假設後繼續**

## 最終輸出摘要

所有 Phase 完成後，輸出：

```
✅ Phase 1 - prototype-to-react
   產出檔案：[列出所有元件路徑]

✅ Phase 2 - accessibility
   強化元件：[列出修改元件]
   主要改動：[ARIA、鍵盤導覽、語意化 HTML 摘要]

✅ Phase 3 - react-testing
   測試檔案：[列出測試路徑]
   測試涵蓋：渲染 N 個 / 互動 N 個 / API N 個 / 無障礙 N 個

⚠️ 待處理事項：[需人工確認或設計師介入的項目]
```

## 全域規則

- 全程使用**繁體中文**溝通
- 三個 Phase 使用同一個功能命名（Feature / featureLower）保持一致
- 共用元件（`src/Shared/UI/`）只在 Phase 1 建立，Phase 2/3 沿用

---

## 執行問題處理

### 主動提問
遇到以下情況，**必須先提問，不得自行假設後繼續**：
- 輸入的 HTML 雛形或規格書缺漏、內容不完整
- 任一 Phase 遇到規格不明確或衝突
- 使用者要求跳過某個 Phase 但影響後續流程

### 問題回報
每個 Phase 結束時若有問題，**必須在該 Phase 的輸出結尾回報**，不得累積到最後才說。
全部 Phase 完成後，若跨 Phase 仍有待處理問題，**在最終摘要中統一條列**。

**問題數量少（1–3 個）**：直接條列。

```
⚠️ 執行問題
1. [Phase X] [問題描述] — [影響範圍 / 建議處理方式]
```

**問題數量多（4 個以上）**：產出問題報告。

```markdown
# 執行問題報告

> Skill：prototype-to-react-orchestrator
> 功能：{Feature}
> 時間：YYYY-MM-DD HH:mm

## 問題清單

| # | Phase | 類型 | 說明 | 影響範圍 | 建議處理 |
|---|-------|------|------|----------|----------|
| 1 | Phase 1 | 規格缺漏 | form.html 缺少停用按鈕邏輯 | 表單頁 | 詢問確認 |
| 2 | Phase 2 | ARIA 不明確 | Modal 觸發情境不確定 | 無障礙強化 | 詢問確認 |

## 需使用者決策的項目

- [ ] 問題 1：請確認 xxx
- [ ] 問題 2：請確認 xxx
```
