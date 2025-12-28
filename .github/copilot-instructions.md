## Copilot Instructions for linkedin-to-gcontact

These rules help AI coding agents work productively in this Chrome Extension project.

### Repository & Project Links
- **Repository:** https://github.com/danwiding/linkedin-to-gcontact
- **Default Branch:** `main`
- **Active GitHub Project:** [Project Board](https://github.com/danwiding/linkedin-to-gcontact/projects) — use the repo Projects view. If a user-scoped project is used, link it explicitly here.
- **Quick CLI:**
  - View repo: `gh repo view danwiding/linkedin-to-gcontact --web`
  - List projects: `gh project list --owner danwiding`
  - Open project: `gh project view 2 --owner danwiding --web`

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

### Extension Version Management & Release Workflow

**Feature Branch Workflow:**
1. **Create feature branch:** Start each issue on a dedicated feature branch:
   ```
   git checkout -b feature/issue-<number>-short-description
   ```
   Example: `feature/issue-1-refresh-sidebar-navigation`

2. **Develop and test locally:**
   - Make code changes for the issue
   - Run `npm test` frequently to ensure tests pass
   - Make commits using the Conventional Commits format (see Git Commit Conventions below)

3. **Push and open PR:**
   - Push branch: `git push origin feature/issue-<number>-short-description`
   - Open a pull request on GitHub linking to the issue
   - GitHub Actions will automatically run `npm test` on the PR

4. **Version bump (if needed):**
   - Before merging, ask user: "Would you like to update the Chrome Extension version number?"
   - If yes, ask: "Is this a **major**, **minor**, or **patch** version change?"
   - Update `manifest.json` following Semantic Versioning:
     - **Major** (X.0.0): Breaking changes or significant new functionality
     - **Minor** (x.Y.0): New features that are backward-compatible
     - **Patch** (x.y.Z): Bug fixes and minor improvements
   - Commit version bump with message: `chore: bump version to X.Y.Z`

5. **Verify CI and merge:**
   - Wait for GitHub Actions to complete on the PR
   - Ensure all checks pass before merging
   - If CI fails, fix issues in the feature branch and push again
   - Merge to `main` when all checks pass

### Test-Driven Development (TDD) Workflow

**CRITICAL: Always write tests BEFORE implementing features or fixes.**

**For all issues (features and bugs):**
1. **Red - Write failing test first (with stubs):**
   - Before writing full implementation code, create a test that defines the expected behavior
   - For new features: Write tests that specify how the feature should work
   - For bugs: Write tests that reproduce the error
   - Create minimal function stubs and exported symbols referenced by the tests so imports resolve (e.g., functions that throw, return placeholders like `false`/`null`, or `NotImplementedError`-style stubs)
   - Run the test to verify it fails on assertions (not import/compile errors)
   - **Commit the failing test and stubs together as the first commit:**
     ```
     test: add tests for <feature/fix description>
     
     What:
     - Added test case for <expected behavior>
     - Added minimal function stubs so tests compile and import
     - Tests currently fail on assertions as feature/fix not implemented
     
     Where:
     - <test file name>
     - <stub file name>
     
     Why:
     - Defines acceptance criteria for <feature/fix>
     - Keeps TDD loop clean by avoiding import/compile failures
     - Will verify implementation and prevent regression
     
     How:
     - <describe test approach and what it validates>
     - <describe stub approach (e.g., returns false, throws)>
     
     Refs #<issue-number>
     ```

2. **Green - Make the test pass:**
   - Implement the minimal code needed to make the test pass
   - Run `npm test` frequently to check progress
   - Keep iterating until all tests pass
   - **Commit the implementation:**
     ```
     feat|fix: <description>
     
     What:
     - <changes made>
     
     Where:
     - <user-facing impact>
     
     Why:
     - <reason for implementation/fix>
     
     How:
     - <implementation approach>
     
     Refs #<issue-number>
     ```

3. **Refactor - Improve code quality:**
   - If needed, refactor the implementation while keeping tests green
   - Improve structure, readability, or performance
   - Run `npm test` after each refactoring to ensure tests still pass
   - **Commit refactoring separately:**
     ```
     refactor: <description>
     
     What:
     - <refactoring changes>
     
     Why:
     - <improvements made>
     
     How:
     - <refactoring approach>
     
     Refs #<issue-number>
     ```

**Benefits:**
- Clear commit history: failing test → passing implementation → refactored code
- Tests serve as executable documentation of requirements
- Prevents over-engineering (only write code needed to pass tests)
- Ensures all code is tested (100% coverage of new features)
- Catches regressions immediately
- Forces clear thinking about requirements before coding

**Examples:**

*New feature (Issue #2: Detect LinkedIn profiles):*
1. First commit: `test: add tests for LinkedIn profile detection` - tests that check URL patterns and DOM markers (FAILS) + add `linkedinDetection.js` with `isLinkedInProfile()` stub returning a placeholder (e.g., `false`)
2. Second commit: `feat(content): implement LinkedIn profile detection` - add detection logic (PASSES)
3. Third commit (optional): `refactor: extract URL pattern matching to helper function` - cleanup (PASSES)

*Bug fix (module import error):*
1. First commit: `test: reproduce module import error in side panel` - add console error checking to Playwright test (FAILS)
2. Second commit: `fix: add type module declarations for ES6 imports` - add type="module" to manifest and HTML (PASSES)
3. Third commit (optional): `refactor: improve error logging in tests` - cleanup (PASSES)

### Quick Commands
- Install: `npm install`
- Tests: `npm test` (runs both Jest and Playwright)
- Jest only: `npm run test:jest`
- Playwright only: `npm run test:playwright`
- Headed Playwright: `npm run test:playwright:headed`
- Debug Playwright: `npm run test:playwright:debug`
- Create feature branch: `git checkout -b feature/issue-<number>-description`

### Git Commit Conventions
Before committing:
1. **Version bump:** Ask user if version should update (major/minor/patch in `manifest.json`).
2. **Commit message format:** Use Conventional Commits with detailed body:
   - Subject: `<type>(<scope>): <brief description>`
   - Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`
   - Example subject: `feat(sidebar): add LinkedIn profile detection`
   - **Important:** Avoid double quotes in commit messages; use single quotes or backticks instead
3. **Commit body structure:**
   ```
   What:
   - List of changes made
   
   Where:
   - Where users see the impact (e.g., Login form in side panel)
   
   Why:
   - Rationale for the changes
   
   How:
   - Implementation details or approach
   
   Refs #123 (link to related issue)
   ```

Example commit:
```
feat(sidebar): add LinkedIn profile detection

What:
- Added isLinkedInProfile() function to content.js
- Listen for chrome.tabs.onUpdated to refresh sidebar on navigation
- Extract first/last name from LinkedIn profile DOM

Where:
- Side panel updates automatically when user navigates to/from LinkedIn profiles

Why:
- Required for detecting LinkedIn profiles before matching Google Contacts

How:
- URL heuristic: *://*.linkedin.com/in/*
- DOM marker: profile header container presence
- Message flow: content.js → sidepanel.js via chrome.runtime.sendMessage

Refs #2, #3
```
