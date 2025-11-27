## Copilot Instructions for linkedin-to-gcontact

These rules help AI coding agents work productively in this Chrome Extension project.

### Big Picture
- **Purpose:** A Manifest v3 Chrome extension that opens a side panel to link LinkedIn contacts with Google Contacts.
- **Core pieces:**
  - `manifest.json`: MV3 manifest, declares `background.service_worker` and `sidePanel` permission.
  - `background.js`: Service worker enabling the side panel on all tabs and on new tabs; opens panel on toolbar click.
  - `sidepanel.html`: Minimal UI loaded in the side panel.
  - Playwright tests under `tests/` with config `playwright.config.ts` and test fixtures in `tests/fixtures.ts` that load the extension.
- **Data flow:** Toolbar click → background service worker → `chrome.sidePanel.open({ tabId })` → loads `sidepanel.html`. There is no content script or storage yet.

### Development Workflow
- **Install deps:** Uses Node and Playwright only.
  - `npm install`
- **Run tests:** Playwright validates extension boot and side panel.
  - `npm test`
  - `npm run test:headed` to watch Chrome UI; `npm run test:debug` for inspector.
- **Debug extension:**
  - Load the folder in Chrome via `chrome://extensions` → Enable developer mode → Load unpacked → select repo root.
  - Open service worker logs in the extension's “Service Worker” console. The side panel opens via toolbar click; or see auto-enable behavior for tabs.

### Project Conventions
- **TypeScript for tests:** Runtime is ESM (`"type": "module"` in `package.json`). Tests import via ESM and use `@playwright/test`.
- **MV3 APIs only:** All extension code must be MV3-compliant (service worker, no persistent background pages).
- **Side Panel entry:** Always reference the panel path as `sidepanel.html` and manage per-tab with `chrome.sidePanel.setOptions({ tabId, path, enabled })`.
- **No bundler:** There is currently no build step for extension code. Add plain JS/HTML/CSS files unless introducing a build, and update tests accordingly.
- **File placement:** Keep extension runtime files at repo root (current structure). If adding more views (e.g., options, content scripts), reference them in `manifest.json` explicitly.

### Patterns and Examples
- **Enable side panel for all tabs (existing/new):** See `background.js`:
  - On load: query tabs → `chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html', enabled: true })`.
  - On new tab: `chrome.tabs.onCreated.addListener(...)` doing the same.
  - Toolbar click: `chrome.action.onClicked.addListener(tab => chrome.sidePanel.open({ tabId: tab.id }))`.
- **Testing MV3 extension:** See `tests/fixtures.ts`:
  - Launch Chromium with `--disable-extensions-except` and `--load-extension` pointing to repo root.
  - Derive `extensionId` from the service worker URL via `context.serviceWorkers()`.
  - Use `chrome-extension://<id>/sidepanel.html` to test UI directly.
- **Playwright config:** `playwright.config.ts` sets `testDir: './tests'`, `timeout: 30000`, and enables trace on first retry.

### When Adding Features
- **UI logic:** If expanding `sidepanel.html` to fetch LinkedIn page data, prefer adding a content script and messaging via `chrome.runtime.sendMessage`/`onMessage`. Update `manifest.json` with `content_scripts` and host permissions as needed.
- **Google Contacts integration:** Use the People API via OAuth; MV3 requires `chrome.identity` and appropriate `oauth2` manifest fields. Store tokens in `chrome.storage`.
- **Testing additions:**
  - For content scripts, navigate to a `linkedin.com` page in tests and assert message flow.
  - Mock network calls with Playwright `route` when hitting Google APIs.
  - Keep tests deterministic; avoid real external calls.

### Key Files
- `manifest.json`: Extension capabilities and entry points.
- `background.js`: Service worker and side panel lifecycle.
- `sidepanel.html`: Current UI surface for the extension.
- `tests/fixtures.ts`: Extension bootstrap for tests; derives `extensionId`.
- `tests/extension.spec.ts`: Validates service worker load and side panel content/styles.
- `playwright.config.ts`: Global test configuration.

### Add/Update Guidance for Agents
- Preserve MV3 constraints; do not add deprecated APIs.
- If introducing a build step (TypeScript or bundling), document commands in `package.json` and update tests to load built artifacts.
- Keep new Chrome API usage behind clear functions for testability.
- Update `README.md` with minimal usage notes when adding user-facing features.

### Quick Commands
- Install: `npm install`
- Tests: `npm test`
- Headed tests: `npm run test:headed`
- Debug tests: `npm run test:debug`
