import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Tracks all console and page errors that occur on a page.
 * Returns a function to assert no errors were captured.
 */
export function trackPageErrors(page: Page) {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[console] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`[pageerror] ${err.message}`);
  });
  
  page.on('unhandledrejection', err => {
    const message = err instanceof Error ? err.message : String(err);
    errors.push(`[unhandledrejection] ${message}`);
  });
  
  return {
    getErrors: () => errors,
    expectNoErrors: () => {
      if (errors.length > 0) {
        throw new Error(`Expected no page errors but got:\n${errors.join('\n')}`);
      }
    }
  };
}

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '..');
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // For manifest v3: get the service worker
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }
    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;


