---
name: playwright-skill
description: General-purpose browser automation with Playwright. Detect local dev servers, generate scripts in /tmp, run with the included executor, capture screenshots, validate flows, and debug web UI behavior.
---

# Playwright Browser Automation Skill (Standalone)

This skill is a standalone Playwright automation workflow. It is not tied to a specific agent platform.

## Path Resolution (Required)

Do not assume a fixed installation path.
Always resolve `SKILL_DIR` as the directory containing this `SKILL.md` file, and run all skill commands from that directory.

Examples of valid locations:
- `<repo>/skills/playwright-skill`
- `~/.codex/skills/playwright-skill`
- `~/.claude/skills/playwright-skill`
- Any project-local copied skill directory

## Core Workflow (Follow In Order)

1. Detect local dev servers first for localhost tasks:

```bash
cd $SKILL_DIR && node -e "require('./lib/helpers').detectDevServers().then(s => console.log(JSON.stringify(s)))"
```

- If 1 server found: use it automatically and report it
- If multiple servers found: ask which URL/port to use
- If none found: ask for target URL or help start dev server

2. Write automation scripts to `/tmp` only:
- Use `/tmp/playwright-test-*.js`
- Do not write generated test scripts into `SKILL_DIR` or project source

3. Default to visible browser:
- Use `headless: false`
- Only use headless mode if explicitly requested

4. Parameterize target URL:
- Define `TARGET_URL` at top of script
- Do not hardcode URL in multiple places

## Execution Model

1. Gather target URL (auto-detected or user-provided)
2. Write custom script to `/tmp/playwright-test-*.js`
3. Execute with:

```bash
cd $SKILL_DIR && node run.js /tmp/playwright-test-*.js
```

4. Report console output and artifacts (screenshots/logs)

## First-Time Setup

```bash
cd $SKILL_DIR
npm run setup
```

This installs Playwright dependencies and Chromium.

## Script Template

```javascript
// /tmp/playwright-test-page.js
const { chromium } = require("playwright");

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3001";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(TARGET_URL);
  console.log("Page loaded:", await page.title());

  await page.screenshot({ path: "/tmp/screenshot.png", fullPage: true });
  console.log("Screenshot saved: /tmp/screenshot.png");

  await browser.close();
})();
```

## Common Tasks

### Responsive Check

```javascript
// /tmp/playwright-test-responsive.js
const { chromium } = require("playwright");

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3001";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  const viewports = [
    { name: "desktop", width: 1920, height: 1080 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(TARGET_URL);
    await page.screenshot({ path: `/tmp/${viewport.name}.png`, fullPage: true });
  }

  await browser.close();
})();
```

### Login Flow

```javascript
// /tmp/playwright-test-login.js
const { chromium } = require("playwright");

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3001";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(`${TARGET_URL}/login`);
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await page.waitForURL("**/dashboard");
  console.log("Login redirect verified");

  await browser.close();
})();
```

### Broken Links Check

```javascript
// /tmp/playwright-test-links.js
const { chromium } = require("playwright");

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3000";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(TARGET_URL);

  const links = await page.locator('a[href^="http"]').all();
  const broken = [];

  for (const link of links) {
    const href = await link.getAttribute("href");
    if (!href) continue;
    try {
      const response = await page.request.head(href);
      if (!response.ok()) broken.push({ href, status: response.status() });
    } catch (error) {
      broken.push({ href, error: error.message });
    }
  }

  console.log("Broken links:", broken);
  await browser.close();
})();
```

## Inline Execution (One-Off)

For quick checks, inline code is supported:

```bash
cd $SKILL_DIR && node run.js "
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto('http://localhost:3001');
await page.screenshot({ path: '/tmp/quick-screenshot.png', fullPage: true });
console.log('Saved /tmp/quick-screenshot.png');
await browser.close();
"
```

Use inline only for short one-off tasks. Use files for repeatable flows.

## Helpers

Utility functions live in `lib/helpers.js`, including:
- `detectDevServers()`
- `safeClick(page, selector, options)`
- `safeType(page, selector, text, options)`
- `takeScreenshot(page, name, options)`
- `handleCookieBanner(page)`
- `extractTableData(page, tableSelector)`

For complete API details, see `API_REFERENCE.md`.

## Custom HTTP Headers

Single header:

```bash
PW_HEADER_NAME=X-Automated-By PW_HEADER_VALUE=playwright-skill \
  cd $SKILL_DIR && node run.js /tmp/my-script.js
```

Multiple headers:

```bash
PW_EXTRA_HEADERS='{"X-Automated-By":"playwright-skill","X-Debug":"true"}' \
  cd $SKILL_DIR && node run.js /tmp/my-script.js
```

If using helpers:

```javascript
const helpers = require("./lib/helpers");
const context = await helpers.createContext(browser);
const page = await context.newPage();
```

If using raw Playwright context options inside `run.js` execution, use injected helper:

```javascript
const context = await browser.newContext(
  getContextOptionsWithHeaders({ viewport: { width: 1280, height: 720 } }),
);
```

## Troubleshooting

Playwright missing:

```bash
cd $SKILL_DIR && npm run setup
```

Module resolution issues:
- Execute scripts through `run.js` from `SKILL_DIR`

Browser not visible:
- Ensure `headless: false`
- Ensure a display environment is available

Element not found:
- Add explicit waits (`waitForSelector`, `waitForURL`, `waitForLoadState`)

## Best Practices

- Always detect local servers before localhost automation
- Keep generated scripts in `/tmp`
- Keep target URL configurable
- Prefer explicit waits over fixed timeouts
- Use try/catch for robust scripts
- Log important milestones to console

## Summary

This skill provides a repeatable, platform-agnostic Playwright workflow:
- detect target server
- generate script in `/tmp`
- run via `run.js`
- collect screenshots/logs
