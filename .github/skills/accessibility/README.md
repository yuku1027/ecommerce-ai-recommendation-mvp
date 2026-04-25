# accessibility

針對任意 React 元件或頁面執行無障礙審計與修復，包含 ARIA 屬性、鍵盤導覽、語意化 HTML、焦點管理、對比度與再驗證。

---

## 何時使用

- 現有元件需要補上無障礙設計
- 需要通過 WCAG 2.1 / WCAG 2.2 合規審查
- 執行 `prototype-to-react` 之後，想進一步強化無障礙品質

> 可**單獨使用**，不需要先執行其他 Skill。

---

## 使用方式

在 Copilot Chat 直接指定要強化的元件：

```
@workspace /accessibility 請強化
  #file:'src/Page/CustomerPage/index.tsx'
  #file:'src/Page/CustomerPage/Form/index.tsx'
```

或貼上元件程式碼直接詢問：

```
@workspace /accessibility 請幫這個元件加上無障礙設計：
[貼上程式碼]
```

---

## 執行流程（摘要）

```
Step 1  先審計（靜態 + 必要 runtime）
   ↓
Step 2  先產出審計報告（含修復分級）
   ↓
Step 3  分級修復（🔧/🎨/📝）
   ↓
Step 4  修復後再驗證 + 差異表
```

完整規則請以 `SKILL.md` 為準。

---

## 強化項目

### 語意化 HTML
- `<header>`、`<main>`、`<nav>`、`<section>` 取代無意義 `<div>`
- 表格加 `<caption>`、`<th scope>`
- 清單用 `<ul>` / `<ol>`

### ARIA 屬性
- 按鈕加 `aria-label`（icon only 按鈕必填）
- 表單欄位加 `aria-required`、`aria-invalid`、`aria-describedby`
- Loading 狀態加 `aria-busy`、`aria-live="polite"`
- Modal 加 `role="dialog"`、`aria-modal`、`aria-labelledby`

### 鍵盤導覽
- Tab 順序符合視覺閱讀順序
- Escape 關閉 Modal / Dropdown
- 所有互動元素可用 Enter / Space 觸發

### 焦點管理
- Modal 開啟時焦點移入第一個可操作元素
- Modal 關閉後焦點回到觸發按鈕
- 表單錯誤後焦點移到第一個錯誤欄位

---

## 輸出格式

每個修改都會附上對比，且會輸出報告 Markdown 檔（非只在對話）：

- `doc/accessibility-reports/a11y-audit-{profile}-{target}-{YYYY-MM-DD}.md`
- `doc/accessibility-reports/a11y-reverify-{profile}-{target}-{YYYY-MM-DD}.md`（有修復時）

修改對比範例：

```md
檔案：src/Page/CustomerPage/index.tsx
位置：第 42 行，查詢按鈕

修改前：
  <div onClick={handleSearch}>查詢</div>

修改後：
  <button type="button" onClick={handleSearch} aria-label="查詢">
    查詢
  </button>
```

---

## 合規模式

- `wcag21`（預設）
- `wcag22`
- `wcag22-tw`（含台灣在地檢核）

可用參數：`--profile wcag21|wcag22|wcag22-tw`

---

## 注意事項

- 以**增量 patch 方式**修改，不重寫整個元件
- 任何修復前必須先有審計報告
- 遇到 ARIA 用法不確定時，以 [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) 範例為準
- 修改不會破壞既有功能邏輯

---

## 參考資源

- [WCAG 2.1 AA 完整規範](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN ARIA 文件](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
