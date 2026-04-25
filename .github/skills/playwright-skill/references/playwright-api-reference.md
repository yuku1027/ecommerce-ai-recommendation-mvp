# Playwright 技能 - 完整 API 參考

本文件提供 Playwright 常用 API 與進階模式。若只需要快速使用流程，先看 [SKILL.md](../SKILL.md)。

## 目錄

- [安裝與設定](#安裝與設定)
- [核心模式](#核心模式)
- [選擇器與定位器](#選擇器與定位器)
- [常見操作](#常見操作)
- [等待策略](#等待策略)
- [斷言](#斷言)
- [Page Object Model](#page-object-model)
- [網路與 API 測試](#網路與-api-測試)
- [視覺測試](#視覺測試)
- [行動裝置測試](#行動裝置測試)
- [除錯](#除錯)
- [平行執行](#平行執行)
- [資料驅動測試](#資料驅動測試)
- [無障礙測試](#無障礙測試)
- [CI/CD 整合](#cicd-整合)
- [常見模式與解法](#常見模式與解法)
- [疑難排解](#疑難排解)
- [全面覆蓋藍圖](#全面覆蓋藍圖)
- [測試報告輸出模板](#測試報告輸出模板)

## 安裝與設定

### 前置檢查

```bash
# 檢查是否安裝 Playwright
npm list playwright 2>/dev/null || echo "Playwright 尚未安裝"

# 需要時安裝
cd "$SKILL_DIR"
npm run setup
```

### 基本設定範例

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 核心模式

### 基本瀏覽器自動化

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  await page.goto('https://example.com', {
    waitUntil: 'networkidle'
  });

  // 在這裡加入你的自動化腳本

  await browser.close();
})();
```

### 測試結構

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    const button = page.locator('button[data-testid="submit"]');

    await button.click();

    await expect(page).toHaveURL('/success');
    await expect(page.locator('.message')).toHaveText('Success!');
  });
});
```

## 選擇器與定位器

### 選擇器優先順序

```javascript
// 最推薦：data 屬性（最穩定）
await page.locator('[data-testid="submit-button"]').click();
await page.locator('[data-cy="user-input"]').fill('text');

// 推薦：可存取性角色
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');

// 可用：唯一文字
await page.getByText('Sign in').click();
await page.getByText(/welcome back/i).click();

// 可用：語意化 HTML
await page.locator('button[type="submit"]').click();
await page.locator('input[name="email"]').fill('test@test.com');

// 盡量避免：class / id 容易變動
await page.locator('.btn-primary').click();
await page.locator('#submit').click();
```

### 進階定位模式

```javascript
const row = page.locator('tr').filter({ hasText: 'John Doe' });
await row.locator('button').click();

await page.locator('button').nth(2).click();

const cell = page.locator('td').filter({ hasText: 'Active' });
const parentRow = cell.locator('..');
await parentRow.locator('button.edit').click();
```

## 常見操作

### 表單互動

```javascript
await page.getByLabel('Email').fill('user@example.com');
await page.getByPlaceholder('Enter your name').fill('John Doe');

await page.locator('#username').clear();
await page.locator('#username').type('newuser', { delay: 100 });

await page.getByLabel('I agree').check();
await page.getByLabel('Subscribe').uncheck();

await page.selectOption('select#country', { label: 'United States' });

await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');
```

### 滑鼠與鍵盤

```javascript
await page.click('button');
await page.dblclick('button');
await page.hover('.menu-item');
await page.dragAndDrop('#source', '#target');

await page.keyboard.type('Hello World', { delay: 100 });
await page.keyboard.press('Control+A');
await page.keyboard.press('Enter');
```

## 等待策略

```javascript
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('.spinner').waitFor({ state: 'hidden' });

await page.waitForURL('**/success');
await page.waitForLoadState('networkidle');

const responsePromise = page.waitForResponse('**/api/users');
await page.click('button#load-users');
const response = await responsePromise;
```

## 斷言

```javascript
import { expect } from '@playwright/test';

await expect(page).toHaveTitle('My App');
await expect(page).toHaveURL(/.*dashboard/);

await expect(page.locator('.message')).toBeVisible();
await expect(page.locator('button')).toBeEnabled();

await expect(page.locator('h1')).toHaveText('Welcome');
await expect(page.locator('.message')).toContainText('success');

await expect(page.locator('input')).toHaveValue('test@example.com');
await expect(page.locator('.item')).toHaveCount(5);
```

## Page Object Model

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## 網路與 API 測試

### 攔截與改寫請求

```javascript
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'John' }])
  });
});

await page.route('**/api/**', route => {
  const headers = {
    ...route.request().headers(),
    'X-Custom-Header': 'value'
  };
  route.continue({ headers });
});
```

### 透過環境變數注入 Header

```bash
PW_HEADER_NAME=X-Automated-By PW_HEADER_VALUE=playwright-skill
PW_EXTRA_HEADERS='{"X-Automated-By":"playwright-skill","X-Request-ID":"123"}'
```

優先順序（由高到低）：
1. `options.extraHTTPHeaders`
2. 環境變數 headers
3. Playwright 預設

## 視覺測試

```javascript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await page.locator('.chart').screenshot({ path: 'chart.png' });
await expect(page).toHaveScreenshot('homepage.png');
```

## 行動裝置測試

```javascript
const { devices } = require('playwright');
const iPhone = devices['iPhone 12'];

const context = await browser.newContext({
  ...iPhone,
  locale: 'en-US'
});
```

## 除錯

```bash
npx playwright test --debug
npx playwright test --headed
npx playwright test --headed --slowmo=1000
```

```javascript
await page.pause();
page.on('console', msg => console.log(msg.text()));
page.on('pageerror', error => console.log(error));
```

## 平行執行

```javascript
test.describe.parallel('Parallel suite', () => {
  test('test 1', async ({ page }) => {});
  test('test 2', async ({ page }) => {});
});
```

## 資料驅動測試

```javascript
const testData = [
  { username: 'user1', password: 'pass1', expected: 'Welcome user1' },
  { username: 'user2', password: 'pass2', expected: 'Welcome user2' },
];

testData.forEach(({ username, password, expected }) => {
  test(`login with ${username}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.message')).toHaveText(expected);
  });
});
```

## 無障礙測試

```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('accessibility check', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## CI/CD 整合

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test
```

## 常見模式與解法

### Popup

```javascript
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('button.open-popup')
]);
await popup.waitForLoadState();
```

### 檔案下載

```javascript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('button.download')
]);
await download.saveAs(`./downloads/${download.suggestedFilename()}`);
```

### iFrame

```javascript
const frame = page.frameLocator('#my-iframe');
await frame.locator('button').click();
```

## 疑難排解

1. 找不到元素：檢查 iframe、可見性與 selector。
2. Timeout：改用正確等待條件，不要只加 sleep。
3. 測試不穩：隔離外部依賴並 mock。
4. 認證問題：確認 auth state 與 cookie。

## 全面覆蓋藍圖

當使用者要求「全面測試」時，至少覆蓋：

1. 導覽健康度：首頁與關鍵路由可進入。
2. Happy path：完整主流程至少一次。
3. 負向流程：錯誤輸入、空值、重複提交。
4. 表單驗證：必填、格式、邊界。
5. 資料一致性：UI 結果與 API/狀態一致。
6. 穩定性：使用顯式等待，避免固定 sleep。
7. 響應式：桌機與手機 viewport。
8. 可觀測性：失敗案例有截圖與可執行原因。

## 測試報告輸出模板

### API 模式建議

- `real`：驗證真實後端行為、延遲與錯誤碼。
- `mock`：快速、穩定地覆蓋前端流程。
- `hybrid`：多數流程用 mock，關鍵交易或關鍵查詢改走 real。

### Markdown 骨架

```markdown
# Playwright Test Report

- Run ID: <run-id>
- Timestamp: <iso-time>
- Target: <url> (<env>)
- Summary: total=<n>, passed=<n>, failed=<n>, blocked=<n>

## Coverage
- navigation: covered|partial|not-covered
- happyPath: covered|partial|not-covered
- negative: covered|partial|not-covered
- formValidation: covered|partial|not-covered
- dataConsistency: covered|partial|not-covered
- stability: covered|partial|not-covered
- responsive: covered|partial|not-covered
- observability: covered|partial|not-covered

## Test Cases
| Case ID | Title | Status | Reason | Evidence |
|---|---|---|---|---|

## Defects
| Bug ID | Severity | Title | Expected | Actual | Evidence |
|---|---|---|---|---|---|

## Risks And Limits
- ...
```

### JSON 寫檔範例

```javascript
const fs = require('fs');
const path = require('path');

const reportDir = path.resolve(process.cwd(), 'reports');
fs.mkdirSync(reportDir, { recursive: true });

const runId = `pw-${Date.now()}`;
const jsonPath = path.join(reportDir, `playwright-report-${runId}.json`);
const mdPath = path.join(reportDir, `playwright-report-${runId}.md`);

const report = {
  runId,
  timestamp: new Date().toISOString(),
  target: { baseUrl: 'https://example.com', env: 'staging' },
  summary: { total: 3, passed: 2, failed: 1, blocked: 0 },
  coverage: {
    navigation: 'covered',
    happyPath: 'covered',
    negative: 'partial',
    formValidation: 'covered',
    dataConsistency: 'partial',
    stability: 'covered',
    responsive: 'covered',
    observability: 'covered'
  },
  cases: [
    { id: 'TC-001', title: 'Login success', status: 'passed', reason: '', evidence: [] }
  ],
  defects: []
};

fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(mdPath, '# Playwright Test Report\n\n(Generate from report object)', 'utf8');
```

## 快速指令

```bash
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright codegen https://example.com
npx playwright show-report
```

## 其他資源

- [Playwright 文件](https://playwright.dev/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
