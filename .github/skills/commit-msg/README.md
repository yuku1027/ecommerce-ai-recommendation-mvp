# commit-msg

根據目前的 git 變更，自動分析並產生符合 **Conventional Commits** 標準的 commit message。

---

## 何時使用

- 不知道怎麼寫 commit message
- 想確保格式符合團隊規範
- 有多個不相關的變更，需要判斷是否拆分 commit

---

## 使用方式

在 Copilot Chat 輸入：

```
@workspace /commit-msg
```

或附上補充說明：

```
@workspace /commit-msg 這次主要是修 auth 模組的 bug
```

---

## 執行流程

1. 自動執行 `git diff --staged` / `git diff` / `git status` 分析變更
2. 判斷 commit 類型（feat / fix / docs / chore…）
3. 產出完整 commit message（含 scope、subject、body、footer）
4. **詢問你是否確認**，確認後才執行 commit

> 不會直接 commit，一定會先讓你確認。

---

## 輸出格式

```
<type>(<scope>): <subject>

<body（選填）>

Co-Authored-By: ...
```

### 類型對照表

| 類型 | 說明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修復 bug |
| `docs` | 文件變更 |
| `style` | 格式調整（不影響邏輯） |
| `refactor` | 重構 |
| `test` | 新增或修改測試 |
| `chore` | 建置工具、套件、設定 |
| `perf` | 效能優化 |
| `ci` | CI/CD 設定 |
| `revert` | 還原 commit |
| `build` | 影響建置系統或外部依賴 |

---

## 範例

**輸入**：修改了 API 錯誤處理邏輯

**產出**：

```
fix(api): 修復金流閘道回傳 null 導致的例外錯誤

金流閘道逾時時偶爾回傳 null，造成未處理的例外。
新增 null 檢查並加入重試邏輯。
```

---

## 注意事項

- 若 `git diff` 為空，Skill 會主動詢問你要 commit 什麼
- 若同一批變更橫跨多個不相關功能，Skill 會建議拆分並分別產出 message
- Subject 使用**繁體中文**、動詞開頭、不超過 50 字元
