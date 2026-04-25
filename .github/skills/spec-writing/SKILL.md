---
name: spec-writing
description: 撰寫繁體中文、可實作的軟體規格文件（Markdown）。當使用者要求寫規格、功能說明、API 規格、需求文件、技術設計書，或要把零散需求整理成可開發文件時使用。
---

# Spec Writing（繁體中文）

## 目標
輸出工程可直接實作的規格文件，內容完整、可驗收、可追蹤。

## 檔案輸出規則（必須）
- 預設產出 `Markdown` 檔，且存放在「當前工作目錄」。
- 若使用者未指定檔名，使用 `spec-<feature-slug>.md`。
- 若檔名衝突，改用 `spec-<feature-slug>-v2.md`、`-v3.md` 遞增。
- 回覆中必須明確告知產出檔案路徑。

## 標準章節

# 功能名稱（Feature Name）

## 1. 背景與目的
- 說明此功能要解決的問題與商業/系統目標。

## 2. 範圍（In Scope / Out of Scope）
- In Scope：
  - 本次會實作與交付的內容。
- Out of Scope：
  - 本次不處理但與此功能相關的內容。

## 3. 需求說明

### 3.1 使用者角色與情境
- 列出會使用到此功能的角色（例：一般用戶、管理者、批次排程等）。
- 簡要描述典型使用情境（User Story）。

### 3.2 功能需求（Functional Requirements）
- 以條列方式撰寫，可編號為 FR-001、FR-002...
- 每一條需清楚說明「觸發條件、行為、預期結果」。

### 3.3 非功能需求（Non-Functional Requirements）
- 性能、容量、可用性、安全性、稽核與紀錄等。

## 4. 介面與互動設計

### 4.1 前端 UI/UX（如適用）
- 以條列方式描述每個畫面/元件的行為與狀態。
- 可附上簡易 wireframe 或文字說明。

### 4.2 API 介面規格（如適用）
- Endpoint：`[HTTP Method] /path`
- 說明：
- Request：
  - Header：
  - Query Parameters：
  - Body 結構（JSON 範例 + 欄位說明）。
- Response：
  - 成功回應格式與範例。
  - 失敗/錯誤碼與訊息格式。

## 5. 資料模型與商業規則

### 5.1 資料結構
- 說明會新增或調整的資料表/欄位/索引，或 Domain Model。

### 5.2 商業規則（Business Rules）
- 以 BR-001、BR-002... 編號。
- 清楚定義計算邏輯、條件判斷、狀態轉換規則等。

## 6. 例外與錯誤處理
- 說明常見例外情境（例如：查無資料、權限不足、外部服務失敗）。
- 規範系統行為與錯誤訊息呈現方式。

## 7. 驗收標準與測試重點
- 明列可驗證的條件（Acceptance Criteria），以 AC-001、AC-002... 編號。
- 每一條應可被實際測試（可寫成 Given/When/Then 形式）。

## 8. 其他備註
- 任何與實作或後續維護相關的重要補充說明。

## 工作流程
1. 萃取需求：功能、角色、場景、介面、資料、外部系統。
2. 補齊缺口：資訊不足時提出保守假設，標註「（假設）」或「（待確認）」。
3. 產出規格：嚴格依標準章節撰寫。
4. 檢查可實作性：FR、BR、AC 必須可對應程式邏輯與測試案例。
5. 落檔到當前目錄：建立 `.md` 檔並回報路徑。

## 撰寫規則
- 全文使用繁體中文。
- 以條列與短段落為主，避免空泛敘述。
- 功能需求使用 `FR-001...`；商業規則使用 `BR-001...`；驗收標準使用 `AC-001...`。
- 對不確定資訊不省略，明確標註並提出暫定方案。
- 若使用者提供公司模板，優先遵循模板。

## 與 doc Skill 串接（md -> docx）
產出規格後，使用下列流程轉成 Word：

```bash
# 1) 先產生 spec markdown（本 skill）
# 例如：./spec-user-query-api.md

# 2) 轉為 docx（專案腳本）
scripts/md_to_docx.sh ./spec-user-query-api.md

# 3) 若要套公司樣板
scripts/md_to_docx.sh ./spec-user-query-api.md output/doc/spec-user-query-api.docx ./docs/templates/reference.docx
```

若專案沒有 `scripts/md_to_docx.sh`，改用：

```bash
pandoc ./spec-user-query-api.md -o ./spec-user-query-api.docx
```
