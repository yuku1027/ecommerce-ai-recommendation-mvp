---
name: commit-msg
description: 根據目前的 git 變更，生成符合 Conventional Commits 標準格式的 commit message。當使用者要求產生 commit message、整理變更說明、或進行 commit 時使用。
---

# Commit Message 生成（Conventional Commits）

## 目標
分析目前 git 變更，產出符合 Conventional Commits 規範、以繁體中文撰寫的 commit message。

## 步驟一：分析變更內容

執行以下指令取得變更資訊：
- `git diff --staged` — 已暫存的變更
- `git diff` — 未暫存的變更（如果 staged 為空）
- `git status` — 檔案狀態總覽

## 步驟二：判斷 commit 類型

根據變更內容選擇對應的類型：

| 類型       | 說明                                      |
| :--------- | :---------------------------------------- |
| `feat`     | 新增功能                                  |
| `fix`      | 修復 bug                                  |
| `docs`     | 文件變更（README、註解等）               |
| `style`    | 格式調整（不影響邏輯，如空白、縮排）     |
| `refactor` | 重構（非新功能也非修 bug）               |
| `test`     | 新增或修改測試                            |
| `chore`    | 建置工具、套件更新、設定變更             |
| `perf`     | 效能優化                                  |
| `ci`       | CI/CD 設定變更                            |
| `revert`   | 還原前一個 commit                         |
| `build`    | 影響建置系統或外部依賴的變更             |

## 步驟三：格式規則

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Header（必填）**
- `type`：從上表選擇
- `scope`：選填，變更影響的模組或範圍（如 `auth`、`api`、`ui`）
- `subject`：
  - 使用繁體中文撰寫
  - 使用祈使語氣（動詞開頭，如「新增」、「修復」、「更新」）
  - 結尾不加句號
  - 不超過 50 個字元

**Body（選填）**
- 說明「為什麼」做這個變更，而非「做了什麼」
- 與 header 空一行
- 每行不超過 72 個字元

**Footer（選填）**
- 重大變更：`BREAKING CHANGE: <說明>`
- 關聯 issue：`Closes #123` 或 `Refs #456`

## 步驟四：輸出

1. 用繁體中文簡短說明分析到的變更摘要
2. 輸出完整的 commit message（放在 code block 中）
3. 若有多個獨立的變更，建議拆分成多個 commit 並分別提供 message
4. 詢問使用者是否確認執行 commit，確認後使用 HEREDOC 方式執行：

```bash
git add <相關檔案>
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<body>

EOF
)"
```

## 範例

```
feat(auth): 新增 OAuth2 登入支援

實作 Google 與 GitHub OAuth2 登入，
讓使用者無需另外註冊帳號即可登入。

Closes #42
```

```
fix(api): 修復金流閘道回傳 null 導致的例外錯誤

金流閘道逾時時偶爾回傳 null，造成未處理的例外。
新增 null 檢查並加入重試邏輯。
```

```
chore: 更新相依套件至最新版本
```

---

## 執行問題處理

### 主動提問
遇到以下情況，**必須先提問，不得自行假設後繼續**：
- `git diff` 為空且 `git status` 無任何變更，無法判斷要 commit 什麼
- 同一批變更橫跨多個不相關功能，無法確定是否應拆分 commit

### 問題回報
執行過程中遇到問題，**必須在最後回報**，不得靜默跳過：

```
⚠️ 執行問題
1. [問題描述] — [建議處理方式]
```
