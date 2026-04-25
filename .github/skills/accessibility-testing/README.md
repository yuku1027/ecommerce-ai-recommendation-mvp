# accessibility-testing

將「無障礙測試」獨立成 Skill，專注產生 **Jest + React Testing Library + jest-axe** 測試與報告。

---

## 何時使用

- 只想針對 React 元件做無障礙測試
- 想把一般功能測試與 a11y 測試分開維護
- 需要可追蹤的 a11y 測試報告（CI + 人工 review）

---

## 使用方法

```text
@workspace /accessibility-testing 請為以下元件建立無障礙測試：
  #file:'src/Page/CustomerPage/index.tsx'
  #file:'src/Page/CustomerPage/Form/index.tsx'
```

可加上 API 檔案以取得更準確 mock：

```text
@workspace /accessibility-testing 請建立測試：
  #file:'src/Page/CustomerPage/index.tsx'
  #file:'src/api/customerApi/index.ts'
```

---

## 測試規範

- 使用 `userEvent`，避免 `fireEvent`
- Query 優先順序：`getByRole` > `getByLabelText` > `getByText`
- `describe` / `it` 以繁體中文命名
- 不直接測內部實作細節（避免 `querySelector` 驗證邏輯）
- Mock 結構需貼近真實 API

### 最低必測

1. `jest-axe` 無障礙掃描
2. 互動元素具備可辨識名稱
3. 鍵盤 Tab 導覽可達
4. Modal/Dialog 焦點與 Escape 關閉
5. 表單錯誤可被螢幕閱讀器讀取

---

## Output

```text
src/**/__tests__/
└── {ComponentOrPage}.a11y.test.tsx

test-reports/
├── {FeatureOrComponent}-a11y-test-report.json
└── {FeatureOrComponent}-a11y-test-report.md
```

### JSON 包含

- summary（total/passed/failed/skipped/duration）
- categories（axe/keyboard/focus/semantics）
- failedCases
- violations
- pendingItems

### Markdown 包含

- 總覽表
- 分類統計
- 測試明細（通過/失敗）
- 無障礙違規表
- 待處理 checklist

---

## 注意事項

- 若元件尚未補齊 ARIA，部分案例可先 `skip`，並在報告註記原因
- 建議先跑 [`accessibility`](../accessibility/README.md) 補強，再跑本 Skill
- 需要完整功能測試時，搭配 [`react-testing`](../react-testing/README.md)
