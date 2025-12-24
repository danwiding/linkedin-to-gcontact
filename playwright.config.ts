import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  timeout: 30000,
  retries: 0,
  use: {
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 0, // Delays each operation by X milliseconds (currently 0)
    },
  },
});

