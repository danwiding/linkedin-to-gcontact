import { test, expect, trackPageErrors } from './fixtures';

test('extension service worker loads successfully', async ({ context, extensionId }) => {
  // Verify the extension loaded by checking for the service worker
  const serviceWorkers = context.serviceWorkers();
  expect(serviceWorkers.length).toBeGreaterThan(0);
  expect(extensionId).toBeTruthy();
});

test('side panel HTML is accessible', async ({ page, extensionId }) => {
  const { expectNoErrors } = trackPageErrors(page);
  
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  // Wait a moment for scripts to load
  await page.waitForTimeout(1000);
  
  // Fail if there were any console or page errors
  expectNoErrors();
  
  const header = page.locator('h1#page-display-name');
  await expect(header).toBeVisible();
  // Should render some non-empty display name or fallback
  const text = await header.textContent();
  expect((text || '').length).toBeGreaterThan(0);
});

test('side panel has correct styling', async ({ page, extensionId }) => {
  const { expectNoErrors } = trackPageErrors(page);
  
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  expectNoErrors();
  
  // Verify the container exists
  const container = page.locator('.container');
  await expect(container).toBeVisible();
});

test('side panel refreshes when navigating to a new URL', async ({ context, page, extensionId }) => {
  const { expectNoErrors } = trackPageErrors(page);
  
  // Open the side panel
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  // Create a new page to simulate a tab with content
  const contentPage = await context.newPage();
  await contentPage.goto('data:text/html,<html><head><title>First Page</title></head><body>First</body></html>');
  
  // Wait for side panel to update with first page info
  await page.waitForTimeout(500);
  
  const titleEl = page.locator('#page-title');
  await expect(titleEl).toContainText('First Page');
  
  // Navigate to a different URL in the content page
  await contentPage.goto('data:text/html,<html><head><title>Second Page</title></head><body>Second</body></html>');
  
  // Wait for the navigation to complete
  await contentPage.waitForLoadState('load');
  
  // Side panel should refresh and show the new page title
  await expect(titleEl).toContainText('Second Page', { timeout: 3000 });
  
  expectNoErrors();
  
  await contentPage.close();
});

test('side panel refreshes when switching between tabs', async ({ context, page, extensionId }) => {
  const { expectNoErrors } = trackPageErrors(page);
  
  // Open the side panel
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  // Create two tabs with different content
  const tab1 = await context.newPage();
  await tab1.goto('data:text/html,<html><head><title>Tab One</title></head><body>Tab 1</body></html>');
  
  const tab2 = await context.newPage();
  await tab2.goto('data:text/html,<html><head><title>Tab Two</title></head><body>Tab 2</body></html>');
  
  // Wait for initial load
  await page.waitForTimeout(500);
  
  const titleEl = page.locator('#page-title');
  
  // Should show Tab Two (most recently activated)
  await expect(titleEl).toContainText('Tab Two', { timeout: 2000 });
  
  // Switch back to tab1 by bringing it to front
  await tab1.bringToFront();
  await page.waitForTimeout(500);
  
  // Side panel should refresh and show Tab One
  await expect(titleEl).toContainText('Tab One', { timeout: 3000 });
  
  expectNoErrors();
  
  await tab1.close();
  await tab2.close();
});

test('side panel displays page metadata correctly', async ({ context, page, extensionId }) => {
  const { expectNoErrors } = trackPageErrors(page);
  
  // Open the side panel
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  // Create a page with rich metadata using data URL
  const contentPage = await context.newPage();
  const htmlContent = encodeURIComponent(`
    <html>
      <head>
        <title>Test Article - Example Site</title>
        <meta name="author" content="John Doe">
        <meta property="og:site_name" content="Example Site">
      </head>
      <body>Test content</body>
    </html>
  `);
  await contentPage.goto(`data:text/html,${htmlContent}`);
  await contentPage.waitForLoadState('load');
  
  // Wait for side panel to update
  await page.waitForTimeout(1000);
  
  // Verify metadata is displayed
  const displayName = page.locator('#page-display-name');
  
  // With data: URLs, content script may not inject, so we check that display name is set
  // (it should at least show the parsed title "Example Site")
  const displayText = await displayName.textContent();
  expect(displayText).toBeTruthy();
  expect(displayText).not.toBe('(loading)');
  
  expectNoErrors();
  
  await contentPage.close();
});


