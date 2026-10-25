import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:8793', headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  webServer: { command: 'npx wrangler dev --ip 127.0.0.1 --port 8793', url: 'http://127.0.0.1:8793', reuseExistingServer: false, timeout: 60_000 },
});
