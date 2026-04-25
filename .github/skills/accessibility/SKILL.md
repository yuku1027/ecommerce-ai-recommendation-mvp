---
name: accessibility
argument-hint: "[path] [--profile wcag21|wcag22|wcag22-tw] [--criteria ids]"
description: 針對任意 React 元件或頁面執行無障礙審計與修復：ARIA、鍵盤導覽、語意化 HTML、焦點管理、對比度與再驗證。支援 WCAG 2.1/2.2 與台灣在地檢核模式。
hooks:
  PostToolUse:
    - matcher: "Edit"
      hooks:
        - type: prompt
          prompt: |
            An accessibility fix was applied. Review the edit in $ARGUMENTS.
            Flag (ok=false) if ANY of these are true:
            1. A design token/class variable was replaced by a hardcoded style value.
            2. Low-level DOM APIs were introduced where framework-native solutions should be used.
            3. HTML element type was changed and could alter semantics/default styles.
            4. New code reimplements an existing shared accessibility mechanism.
            Simple attribute additions (alt, aria-*, role, lang, scope, autocomplete, rel) are always ok=true.
            $ARGUMENTS
  Stop:
    - hooks:
        - type: agent
          prompt: |
            The accessibility skill is finishing. Verify completeness:
            1. Were any fixes applied?
            2. If fixes were applied, was re-verification executed AFTER fixes?
            3. If fixes applied but no re-verification, return ok=false with reason "Re-verification required after fixes."
            4. If report-only (no fixes), return ok=true.
            5. If fixes and re-verification both done, return ok=true.
            $ARGUMENTS
---

# Accessibility Audit + Enhancement

## 目標

對指定的 React 元件或功能頁執行完整無障礙流程：

1. 先審計（靜態 + 必要 runtime）
2. 產出結構化報告
3. 再分級修復
4. 修復後再驗證

確保互動元素可被鍵盤與螢幕閱讀器正確操作，並避免修復造成 UI 回歸或架構偏離。

**可單獨使用**：直接指定任意現有元件路徑即可，不需先執行 `prototype-to-react`。

## 適用標準

- `--profile wcag21`（預設）：WCAG 2.1 A/AA
- `--profile wcag22`：WCAG 2.2 A/AA（含 2.2 新增條款）
- `--profile wcag22-tw`：WCAG 2.2 A/AA + 台灣在地檢核重點（TW-01~TW-05）

> 若未指定 profile，預設 `wcag21`。若指定 `--criteria`，僅檢查該 criteria 並以 profile 為邊界。

## 輸入來源

接收使用者直接指定的元件路徑（或 `prototype-to-react` Skill 產出的元件）：

```
# 範例 1：直接指定單一元件
src/components/UserForm.tsx

# 範例 2：指定整個功能頁
src/Page/{Feature}Page/index.tsx
src/Page/{Feature}Page/Form/index.tsx

# 範例 3：共用元件
src/Shared/UI/*.tsx
```

> 使用方式：直接告知要強化哪些檔案，或貼上元件程式碼即可。

## 本 Skill 不適用於

- 螢幕閱讀器實際朗讀品質（需 NVDA/VoiceOver 手動驗證）
- 影片字幕與音訊描述品質（1.2.x）
- 跨頁一致性主觀判斷（3.2.3/3.2.4）
- 非 Web 技術（原生 App / 桌面應用）
- 純設計決策題（需設計師主導）

## 核心原則（新增）

### 1) 先報告，後修復

任何修復都必須先完成審計報告，不能邊掃描邊直接改碼。

### 2) 修復分級

- `🔧 可自動修復`：純語意/屬性調整，不改變可見像素
- `🎨 需確認`：可能影響視覺（顏色、間距、焦點樣式、尺寸、布局）
- `📝 需手動處理`：牽涉複雜流程、跨檔協調、產品決策

### 3) 框架與設計系統優先

- 優先沿用專案既有元件、token、樣式抽象層
- 優先框架原生解法，不引入不必要低階 DOM 操作

## 參考資源（新增，必須遵守）

- 每次審計必讀：`references/checklist.md`
- 涉及互動或需 runtime 驗證時必讀：`references/playwright.md`
- 涉及色彩對比時讀：`references/contrast.md`
- 遇到複雜互動元件（Modal/Tab/Accordion/Date Picker）時讀：`references/patterns.md`

執行優先順序：

1. 先以 `checklist.md` 逐條比對並產生初判
2. 再依 `playwright.md` 跑對應 runtime 驗證
3. 靜態與 runtime 結果合併為最終判定
4. 執行結果必須標註 profile（`wcag21` / `wcag22` / `wcag22-tw`）

## 執行流程（整合版）

### Step 1：確認範圍與準則

1. 解析使用者給的路徑（單檔、資料夾、glob）
2. 若描述模糊，先列出候選檔案讓使用者確認
3. 解析 profile（預設 `wcag21`）
4. 若有指定準則（例如 `--criteria 1.4.3,2.4.7`），只審計指定項目

### Step 2：載入參考資源（必做）

- 一律讀取 `references/checklist.md`（若有 `--criteria` 只讀該準則段落）
- 若本次含互動驗證或動態狀態檢查，預先讀取 `references/playwright.md`
- 若含 1.4.3 / 1.4.11，補讀 `references/contrast.md`
- 若有複雜互動元件，補讀 `references/patterns.md`
- 依 profile 過濾準則範圍：
  - `wcag21`：忽略 2.2 新增條款與 TW-xx
  - `wcag22`：包含 2.2 新增條款，忽略 TW-xx
  - `wcag22-tw`：全量（含 TW-xx）

### Step 3：靜態審計（必做）

逐一檢查每個元件，至少涵蓋：

- 互動元素可存取名稱：`aria-label` / `aria-labelledby` / `aria-describedby`
- 鍵盤可達性：Tab 可到達、Enter/Space 可觸發
- 語意化 HTML：避免以 `<div>` 模擬 button/nav/main/list
- 表單對應：`<label htmlFor>`、錯誤欄位 `aria-invalid`、錯誤訊息關聯
- Dialog/Popover：角色、標題關聯、Escape、焦點進出
- 動態狀態：`aria-live` / `aria-busy`
- 色彩對比：文字至少 4.5:1（大字 3:1）、非文字對比 3:1（若適用）

對每條準則輸出初判：`✅ 通過` / `🔴 失敗` / `🟡 警告` / `⚠️ 需 runtime 確認`

### Step 4：Runtime 驗證（有互動就必做）

若包含 Modal、Tab、Accordion、Dropdown、Form 驗證、焦點流程、動態狀態或對比不確定項，必須做 runtime 驗證：

- `axe-core` 掃描
- Tab 序列與焦點可見性檢查
- 互動流程（開啟/關閉、鍵盤操作、焦點回復）
- 對比度 runtime 補驗（靜態無法解析時）
- 依 `references/playwright.md` 的「準則對應表」對準則逐項執行

若開發伺服器不可用，需在報告明確標註「僅靜態分析，runtime 未驗證」。

#### Runtime 降級策略（新增）

1. 優先使用 Playwright MCP（`browser_*`）。
2. 若 MCP 工具不可用，改用專案可執行的 Playwright CLI 腳本（若存在）。
3. 若兩者皆不可用：保留靜態結果，將所有需 runtime 項目標記 `🟡 runtime-未驗證`，並提升風險等級。

### Step 5：先產出審計報告（修復前必要）

報告至少包含：

- 掃描範圍
- 合規 profile（`wcag21` / `wcag22` / `wcag22-tw`）
- 準則統計（通過/警告/失敗）
- 每項問題的檔案位置、影響、修復方向、驗證方式
- 修復類型（🔧 / 🎨 / 📝）與優先級（🔴 / 🟡 / 🟢）

#### 報告資料結構（新增，固定欄位）

每筆 issue 必須有：

- `issue_id`
- `criterion_id`
- `severity`（critical/high/medium/low）
- `file_path`
- `evidence`（code snippet / screenshot / runtime output）
- `fix_type`（🔧 / 🎨 / 📝）
- `verify_method`（static / runtime / static+runtime）
- `status_before`
- `status_after`（若尚未修復填 `not-fixed`）

#### 報告檔案輸出（必要）

- 報告不可只存在對話，必須寫入 `.md` 檔
- 輸出目錄：`doc/accessibility-reports/`（若不存在先建立）
- Step 5 報告檔名：`a11y-audit-{profile}-{target}-{YYYY-MM-DD}.md`
- 檔案開頭需包含：審計日期、掃描範圍、profile、執行模式（static/runtime/fallback）
- 在對話中回覆時，必須附上報告檔案相對路徑

#### 統計數據一致性檢核（必要）

報告中的「準則統計」表格必須通過以下自我驗證，不通過則**必須修正後才能寫入檔案**：

1. **issue 計數一致**：
   - `🔴 失敗` 數量 = 問題清單中 `status_before` 為 `🔴 失敗` 的 issue 總數
   - `🟡 警告` 數量 = 問題清單中 `status_before` 為 `🟡 警告` 的 issue 總數
   - 禁止將 🟡 警告項目計入 🔴 失敗，或反之

2. **總和守恆**：
   - `✅ 通過 + 🔴 失敗 + 🟡 警告 + ⚠️ 需 runtime 確認` = 固定總數（所有掃描準則數）
   - 此總數在同一份報告中前後必須一致

3. **修復前後守恆**（再驗證報告適用）：
   - 修復前各狀態總和 = 修復後各狀態總和（準則數不變）
   - 修復後 `✅ 通過` = 修復前 `✅ 通過` + 已修復的 `🔴` 數量 + 已修復的 `🟡` 數量

4. **逐項交叉比對**：
   - 報告寫入前，逐一遍歷問題清單，分別計算 🔴 和 🟡 的實際數量
   - 將計算結果填入統計表格，不可先寫數字再回頭對問題清單

### Step 6：修復前架構探索（新增）

先理解專案慣例，再動手修：

- 技術棧（React/Next/Vite、CSS 方案、UI Library）
- 設計 token 定義位置（CSS 變數 / tailwind config / theme）
- 類似問題在專案內的既有做法

### Step 7：分級修復執行

1. `🔧 可自動修復`：可直接批次修
2. `🎨 需確認`：先提出修復計畫與視覺影響，待使用者確認再改
3. `📝 需手動處理`：只提供指引與建議方案

### Step 8：修復後再驗證（必要）

修復完成後，必須重新驗證原本 `🔴/🟡` 項目：

- 重新做對應靜態檢查
- 重新跑必要 runtime 檢查
- 輸出「修復前 → 修復後」差異表

若發現回歸，立即回報並停止擴大修改。

#### 再驗證報告檔案輸出（必要）

- Step 8 必須另外寫入 `.md` 檔，不可覆蓋 Step 5 檔案
- 檔名：`a11y-reverify-{profile}-{target}-{YYYY-MM-DD}.md`
- 需包含：修復項目清單、差異表、回歸檢查結果、仍未通過項目
- 在對話中回覆時，必須附上再驗證報告檔案相對路徑
- **必須依照「統計數據一致性檢核」規則驗證修復前後數字**，不通過則修正後才能寫入

## 強化項目清單（可作為修復對照）

#### 語意化 HTML

- `<header>`、`<main>`、`<nav>`、`<section>`、`<footer>` 取代無意義 `<div>`
- 表格使用 `<caption>`、`<thead>`、`<th scope>`
- 清單使用 `<ul>` / `<ol>`，不用 `<div>` 模擬

#### ARIA 屬性

- 所有按鈕加 `aria-label`（icon only 按鈕必填）
- 表單欄位：`aria-required`、`aria-invalid`、`aria-describedby`（錯誤訊息）
- Loading 狀態：`aria-busy`、`aria-live="polite"`
- Modal：`role="dialog"`、`aria-modal="true"`、`aria-labelledby`
- 展開/收合：`aria-expanded`、`aria-controls`
- 分頁：`aria-label="分頁導覽"`、當前頁加 `aria-current="page"`
- Tab 面板：`role="tablist"`、`role="tab"`、`aria-selected`、`role="tabpanel"`

#### 鍵盤導覽

- Tab 順序與視覺閱讀順序一致
- 所有互動元素可用 Enter / Space 觸發
- Escape 關閉 Modal / Dropdown
- 方向鍵操作 Tab 面板、Radio Group、Select Dropdown
- 焦點視覺樣式清晰（不可使用 `outline: none` 而不補替代樣式）

#### 焦點管理

- Modal 開啟時焦點移入第一個可操作元素
- Modal 關閉後焦點回到觸發按鈕
- 路由切換後焦點移到頁面標題 `<h1>`
- 表單送出錯誤後焦點移到第一個錯誤欄位

#### 表單無障礙

- 每個 `<input>` 使用 `<label htmlFor>` 明確綁定
- 必填欄位加 `aria-required="true"`
- 錯誤訊息使用 `role="alert"` 或 `aria-live="assertive"`
- 群組欄位用 `<fieldset>` + `<legend>`

## 修復品質護欄（新增）

以下情況視為高風險，需先停下來確認：

- 用硬編碼值替換既有 design token / class 變數
- 為框架可處理的問題引入低階 DOM API（如 `MutationObserver`、手動全域事件監聽）
- 任意更換 HTML 元素型別導致預設樣式或語意改變（如 `<p>` 改 `<legend>`）
- 重新實作專案既有能力（例如已有 Dialog 元件卻另做 focus trap）

## 產出規則

- 以**增量 patch 方式**修改，不重寫整個元件
- 先給審計報告，再進入修復
- 每個修改列出：檔案路徑、修改位置、修改前/後對比、修復類型與風險
- 不得移除或破壞既有功能邏輯
- 全文使用**繁體中文**說明
- 報告輸出一律為 Markdown 檔（`.md`），不得僅以對話文字交付

## 輸出結尾

1. 審計報告摘要（含通過/警告/失敗統計）
2. 修改檔案清單與各檔案無障礙強化摘要（修改前/後對比）
3. 修復後再驗證結果（含差異表）
4. 仍需人工處理的項目（如對比設計決策、朗讀體驗）
5. （選用）若後續需要搭配 `react-testing` Skill，額外提供：
   - 需要用 `jest-axe` 測試的元件清單
   - 關鍵 ARIA role/label 名稱（供測試 query 用）

---

> 當遇到邊界情況或不確定的 ARIA 用法時，
> 請以 **ARIA Authoring Practices Guide** 的範例為準。

## 執行問題處理

### 主動提問

遇到以下情況，**必須先提問，不得自行假設後繼續**：

- 元件結構不明確，無法判斷正確的 ARIA role
- 互動行為不清楚（如 Modal 觸發條件、焦點預期位置）
- 修改可能影響既有功能邏輯或可見 UI

### 問題回報

執行過程中遇到問題，**必須在最後統一回報**，不得靜默跳過：

**問題數量少（1–3 個）**：直接在回覆結尾條列說明。

```
⚠️ 執行問題
1. [問題描述] — [影響範圍 / 建議處理方式]
```

**問題數量多（4 個以上）**：產出問題報告。

```markdown
# 執行問題報告

> Skill：accessibility
> 元件：{ComponentName}
> 時間：YYYY-MM-DD HH:mm

## 問題清單

| #   | 類型        | 說明                       | 影響範圍 | 建議處理       |
| --- | ----------- | -------------------------- | -------- | -------------- |
| 1   | ARIA 不明確 | xxx 元件缺少 role 定義     | Modal    | 詢問確認後補上 |
| 2   | 需人工處理  | 色彩對比不足，需設計師介入 | Badge    | 提交設計確認   |

## 需使用者決策的項目

- [ ] 問題 1：請確認 xxx
- [ ] 問題 2：請確認 xxx
```

---

## References

- 本 Skill 檢核清單：`references/checklist.md`
- WCAG 2.1 AA 完整規範：https://www.w3.org/TR/WCAG21/
- WCAG 2.2 完整規範：https://www.w3.org/TR/WCAG22/
- ARIA Authoring Practices Guide（互動元件範例）：https://www.w3.org/WAI/ARIA/apg/
- MDN ARIA 文件：https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA

## 單一來源規範（新增）

- 以 `.github/skills/accessibility/` 為唯一主版本（source of truth）
- `$CODEX_HOME/skills/accessibility/` 視為鏡像副本
- 每次更新後需同步鏡像，避免兩份規則漂移
