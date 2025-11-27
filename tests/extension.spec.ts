import { test, expect } from './fixtures';

test('extension service worker loads successfully', async ({ context, extensionId }) => {
  // Verify the extension loaded by checking for the service worker
  const serviceWorkers = context.serviceWorkers();
  expect(serviceWorkers.length).toBeGreaterThan(0);
  expect(extensionId).toBeTruthy();
});

test('side panel HTML is accessible', async ({ page, extensionId }) => {
  // Navigate to the side panel HTML directly
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  // Verify the page loads and contains expected content
  await expect(page.locator('h1')).toHaveText('Hello World');
});

test('side panel has correct styling', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
  
  // Verify the container exists
  const container = page.locator('.container');
  await expect(container).toBeVisible();
});


