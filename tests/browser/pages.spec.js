import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

test('Pages completa OAuth com PKCE e usa sessão Aura nas leituras e gravações', async ({ page }) => {
  const origin = 'https://felipecs613-art.github.io', base = `${origin}/aura/`;
  const token = 't'.repeat(43), state = 's'.repeat(43);
  let challenge, saved = null, revision = null, reads = 0, writes = 0, exchanged = false;
  await page.route(`${base}**`, async route => {
    const url = new URL(route.request().url());
    const response = await page.request.get(`http://127.0.0.1:8793/${url.pathname.slice('/aura/'.length)}${url.search}`);
    // GitHub Pages não aplica o CSP de mesma origem do servidor Worker local.
    const headers = { ...response.headers() };
    delete headers['content-security-policy'];
    await route.fulfill({ response, headers });
  });
  await page.route('https://github.com/login/oauth/authorize?**', route => route.fulfill({ contentType: 'text/html', body: '<p>Autorização GitHub simulada</p>' }));
  await page.route('https://aura-auth.felipecs613.workers.dev/api/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    const headers = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Authorization, Content-Type' };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    if (path.endsWith('/auth/start')) {
      challenge = request.postDataJSON().code_challenge;
      return route.fulfill({ headers, json: { state, authorize_url: `https://github.com/login/oauth/authorize?state=${state}` } });
    }
    if (path.endsWith('/auth/exchange')) {
      const body = request.postDataJSON();
      expect(body.state).toBe(state); expect(body.code).toBe('code');
      expect(createHash('sha256').update(body.code_verifier).digest('base64url')).toBe(challenge);
      exchanged = true;
      return route.fulfill({ headers, json: { session_token: token, user: { id: 1, login: 'alice' } } });
    }
    if (!exchanged) return route.fulfill({ status: 401, headers, json: { error: 'Entre com GitHub.' } });
    expect(request.headers().authorization).toBe(`Bearer ${token}`);
    if (path.endsWith('/session')) return route.fulfill({ headers, json: { user: { id: 1, login: 'alice', name: 'Alice' } } });
    if (path.endsWith('/auth/logout')) return route.fulfill({ headers, json: { ok: true } });
    if (request.method() === 'POST') { const body = request.postDataJSON(); saved = body.data; revision = 'r1'; writes++; }
    else reads++;
    return route.fulfill({ headers, json: { data: saved, revision } });
  });
  await page.goto(base);
  await expect(page.locator('#ghLoginBtn')).toBeVisible();
  await page.locator('#ghLoginBtn').click();
  await expect(page).toHaveURL(/github.com\/login\/oauth\/authorize/);
  await page.goto(`${base}?code=code&state=${state}`);
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(reads).toBeGreaterThan(0); expect(writes).toBeGreaterThan(0);
  expect(saved.version).toBe(3); expect(saved.tasks.length).toBeGreaterThan(0);
  expect(await page.evaluate(() => localStorage.getItem('gh_token'))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem('aura.session.v2'))).toBe(token);
  await expect(page).not.toHaveURL(/code=/);
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#logoutBtn').click();
  await expect(page.locator('#loginScreen')).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('aura.session.v2'))).toBeNull();
});
