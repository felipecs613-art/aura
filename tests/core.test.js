import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { AuraStore, hash } from '../worker/index.js';
import { emptyState, validateState } from '../shared/state.js';
import { reconcile } from '../shared/sync.js';
import { SyncClient, ApiError } from '../shared/client.js';

class Memory {
  values = new Map();
  async get(key) { return structuredClone(this.values.get(key)); }
  async put(key, value) { this.values.set(key, structuredClone(value)); }
  async deleteAll() { this.values.clear(); }
  async setAlarm() {}
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
}
function environment() {
  const instances = new Map();
  return {
    GITHUB_CLIENT_ID: 'client', GITHUB_CLIENT_SECRET: 'secret',
    AURA: { idFromName: v => v, get(name) {
      if (!instances.has(name)) instances.set(name, new AuraStore({ storage: new Memory() }));
      return instances.get(name);
    } },
    ASSETS: { fetch: async () => new Response('app') },
  };
}
const call = (store, path, body) => store.fetch(new Request(`https://internal/${path}`, { method: 'POST', body: JSON.stringify(body) }));
const gist = (data, id = 'abc') => ({ id, public: false, owner: { id: 1 }, files: { 'aura-data.json': { content: JSON.stringify({ app: 'Aura Tracker', data }), size: 100, truncated: false } } });

test('schema rejeita versões futuras, números inválidos, URLs executáveis e IDs duplicados', () => {
  const data = emptyState();
  assert.deepEqual(validateState({ ...data, injected: 'ignored' }), data);
  assert.throws(() => validateState({ ...data, version: 4 }));
  assert.throws(() => validateState({ ...data, xp: -1 }));
  const task = { id: 'one', title: 'Teste', cycle: 1, importance: 'low', done: false, link: 'javascript:alert(1)' };
  assert.throws(() => validateState({ ...data, tasks: [task] }));
  task.link = '';
  assert.throws(() => validateState({ ...data, tasks: [task, task] }));
  assert.throws(() => validateState({ ...data, tasks: [{ ...task, deadline: '2026-02-30' }] }));
});

test('reconciliação preserva alterações pendentes e reconhece resposta perdida', () => {
  const local = { data: { xp: 10 }, revision: 'a', dirty: true };
  assert.equal(reconcile(local, { data: { xp: 20 }, revision: 'b' }).conflict, true);
  assert.equal(reconcile(local, { data: { xp: 0 }, revision: 'a' }).conflict, false);
  assert.equal(reconcile(local, { data: { xp: 10 }, revision: 'b' }).dirty, false);
});

test('OAuth associa state ao navegador, exige PKCE e consome o fluxo uma única vez', async t => {
  const env = environment();
  const start = await worker.fetch(new Request('https://aura.test/api/auth/login'), env);
  const target = new URL(start.headers.get('Location'));
  assert.equal(target.searchParams.get('scope'), 'gist');
  assert.equal(target.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(target.searchParams.get('redirect_uri'), 'https://aura.test/api/auth/callback');
  const browserCookie = start.headers.get('Set-Cookie').split(';')[0];
  const state = target.searchParams.get('state');
  const flow = env.AURA.get(`oauth:${await hash(state)}`);
  assert.equal((await call(flow, 'consume', { browser: 'wrong' })).status, 403);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url === 'https://github.com/login/oauth/access_token') {
      const sent = JSON.parse(options.body);
      assert.equal(await hash(sent.code_verifier), target.searchParams.get('code_challenge'));
      assert.equal(sent.client_secret, 'secret');
      return Response.json({ access_token: 'github-token-only-on-server', scope: 'gist' });
    }
    return Response.json({ id: 1, login: 'alice' });
  });
  const callback = new Request(`https://aura.test/api/auth/callback?code=code&state=${state}`, { headers: { Cookie: browserCookie, 'Sec-Fetch-Site': 'cross-site' } });
  const result = await worker.fetch(callback, env);
  assert.equal(result.headers.get('Location'), '/');
  assert.match(result.headers.get('Set-Cookie'), /HttpOnly/);
  assert.match(result.headers.get('Set-Cookie'), /Secure/);
  assert.doesNotMatch(result.headers.get('Set-Cookie'), /github-token/);
  const sessionCookie = result.headers.get('Set-Cookie').split(';')[0];
  const session = await worker.fetch(new Request('https://aura.test/api/session', { headers: { Cookie: sessionCookie } }), env);
  assert.deepEqual(await session.json(), { user: { id: 1, login: 'alice', name: 'alice' } });
  assert.match((await worker.fetch(callback, env)).headers.get('Location'), /auth_error/);
  assert.equal((await worker.fetch(new Request('https://aura.test/api/auth/logout', { method: 'POST', headers: { Origin: 'https://evil.test', Cookie: sessionCookie } }), env)).status, 403);
  assert.equal((await worker.fetch(new Request('https://aura.test/api/auth/logout', { method: 'POST', headers: { Origin: 'https://aura.test', Cookie: sessionCookie } }), env)).status, 200);
  assert.equal((await worker.fetch(new Request('https://aura.test/api/session', { headers: { Cookie: sessionCookie } }), env)).status, 401);
});

test('callback sem state não troca código por token e API não aceita credenciais antigas', async t => {
  const env = environment();
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Não deve chamar GitHub'); });
  const response = await worker.fetch(new Request('https://aura.test/api/auth/callback?code=abc'), env);
  assert.match(response.headers.get('Location'), /auth_error=state/);
  assert.equal((await worker.fetch(new Request('https://aura.test/api/data', { headers: { Authorization: 'Bearer old-token' } }), env)).status, 401);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('GitHub Pages usa PKCE, CORS restrito e sessão opaca sem expor token GitHub', async t => {
  const env = environment(); env.PAGES_URL = 'https://felipecs613-art.github.io/aura';
  const origin = 'https://felipecs613-art.github.io', endpoint = 'https://aura.test/api';
  const request = (path, body, sessionToken, site = origin) => new Request(`${endpoint}${path}`, {
    method: body === undefined ? 'GET' : 'POST', headers: { Origin: site, ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body),
  });
  const verifier = 'a'.repeat(43), challenge = await hash(verifier);
  const preflight = await worker.fetch(new Request(`${endpoint}/data`, { method: 'OPTIONS', headers: { Origin: origin } }), env);
  assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal((await worker.fetch(request('/auth/start', { code_challenge: challenge }, null, 'https://evil.test'), env)).status, 403);
  const start = await worker.fetch(request('/auth/start', { code_challenge: challenge }), env);
  const flow = await start.json();
  assert.equal(new URL(flow.authorize_url).searchParams.get('redirect_uri'), env.PAGES_URL);
  assert.equal(new URL(flow.authorize_url).searchParams.get('code_challenge'), challenge);
  assert.equal((await worker.fetch(request('/auth/exchange', { code: 'code', state: flow.state, code_verifier: 'b'.repeat(43) }), env)).status, 403);
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url === 'https://github.com/login/oauth/access_token') {
      const body = JSON.parse(options.body);
      assert.equal(body.code_verifier, verifier); assert.equal(body.redirect_uri, env.PAGES_URL);
      return Response.json({ access_token: 'private-github-token', scope: 'gist' });
    }
    return Response.json({ id: 1, login: 'alice' });
  });
  const callback = { code: 'code', state: flow.state, code_verifier: verifier };
  const exchanged = await worker.fetch(request('/auth/exchange', callback), env);
  const result = await exchanged.json();
  assert.equal(exchanged.status, 200); assert.match(result.session_token, /^[\w-]{43}$/);
  assert.equal(JSON.stringify(result).includes('private-github-token'), false);
  assert.equal((await worker.fetch(request('/session', undefined, result.session_token), env)).status, 200);
  assert.equal((await worker.fetch(new Request(`${endpoint}/session`, { headers: { Authorization: `Bearer ${result.session_token}` } }), env)).status, 403);
  assert.equal((await worker.fetch(request('/auth/exchange', callback), env)).status, 401);
  assert.equal((await worker.fetch(request('/auth/logout', {}, result.session_token), env)).status, 200);
  assert.equal((await worker.fetch(request('/session', undefined, result.session_token), env)).status, 401);
});

test('Gist é criado secreto; gravações concorrentes com revisão antiga não sobrescrevem', async t => {
  const store = new AuraStore({ storage: new Memory() });
  let current = null, creates = 0;
  t.mock.method(globalThis, 'fetch', async (url, options = {}) => {
    if (url.includes('/gists?')) return Response.json(current ? [current] : []);
    if (options.method === 'POST' || options.method === 'PATCH') {
      const payload = JSON.parse(options.body);
      if (options.method === 'POST') { assert.equal(payload.public, false); creates++; }
      current = gist(JSON.parse(payload.files['aura-data.json'].content).data);
    }
    return Response.json(current);
  });
  const data = emptyState();
  const first = await call(store, 'save', { token: 'token', userId: 1, revision: null, data });
  const saved = await first.json();
  assert.equal(first.status, 200);
  const [a, b] = await Promise.all([
    call(store, 'save', { token: 'token', userId: 1, revision: saved.revision, data: { ...data, xp: 10 } }),
    call(store, 'save', { token: 'token', userId: 1, revision: saved.revision, data: { ...data, xp: 20 } }),
  ]);
  assert.equal(a.status, 200); assert.equal(b.status, 409);
  assert.equal(creates, 1);
  assert.equal(JSON.parse(current.files['aura-data.json'].content).data.xp, 10);
});

test('descoberta pagina Gists e rejeita conteúdo público, de outro dono ou truncado', async t => {
  const store = new AuraStore({ storage: new Memory() });
  const valid = gist(emptyState());
  let pages = 0;
  t.mock.method(globalThis, 'fetch', async url => {
    if (new URL(url).searchParams.get('page') === '1') { pages++; return Response.json(Array.from({ length: 100 }, (_, i) => ({ id: String(i) }))); }
    if (new URL(url).searchParams.get('page') === '2') { pages++; return Response.json([valid]); }
    return Response.json(valid);
  });
  assert.equal((await call(store, 'load', { token: 't', userId: 1 })).status, 200);
  assert.equal(pages, 2);
  await assert.rejects(store.decode({ ...valid, public: true }, 1), /secreto/);
  await assert.rejects(store.decode(valid, 2), /pertencer/);
  valid.files['aura-data.json'].truncated = true;
  await assert.rejects(store.decode(valid, 1), /truncado/);
});

test('cache é isolado por conta, alterações offline sobrevivem e conflito bloqueia envio', async () => {
  const storage = new Memory(), data = emptyState(); let writes = 0;
  const remote = { data, revision: 'r1' };
  const client = new SyncClient(1, { storage, locks: null, request: async (path, body) => { if (body) writes++; return structuredClone(remote); } });
  await client.initialize();
  client.save({ ...data, xp: 10 });
  const other = new SyncClient(2, { storage, locks: null });
  assert.equal(other.read(), null);
  remote.revision = 'r2';
  const resumed = new SyncClient(1, { storage, locks: null, request: client.request });
  await resumed.initialize();
  assert.equal(resumed.cache.data.xp, 10); assert.equal(resumed.conflict, true);
  await resumed.flush(); assert.equal(writes, 0);
  await client.stop(); await resumed.stop();
});

test('edição durante gravação permanece pendente e a próxima usa a nova revisão', async () => {
  const storage = new Memory(), data = emptyState(); let release, writes = [];
  const client = new SyncClient(1, { storage, locks: null, request: async (path, body) => {
    if (!body) return { data, revision: 'r1' };
    writes.push(body);
    if (writes.length === 1) await new Promise(resolve => { release = resolve; });
    return { revision: `r${writes.length + 1}` };
  } });
  await client.initialize(); client.save({ ...data, xp: 10 });
  const pending = client.flush();
  while (!release) await new Promise(resolve => setImmediate(resolve));
  client.save({ ...data, xp: 20 }); release(); await pending;
  assert.equal(client.cache.dirty, true); assert.equal(client.cache.revision, 'r2');
  await client.flush();
  assert.equal(writes[1].revision, 'r2'); assert.equal(writes[1].data.xp, 20);
  assert.equal(client.cache.dirty, false); await client.stop();
});

test('erro 401 não descarta dados e não gera retentativas automáticas', async () => {
  const storage = new Memory(), data = emptyState(); const statuses = [];
  const client = new SyncClient(1, { storage, locks: null, notify: v => statuses.push(v), request: async (path, body) => {
    if (body) throw new ApiError(401, 'Expirou');
    return { data, revision: 'r1' };
  } });
  await client.initialize(); client.save({ ...data, xp: 10 });
  await assert.rejects(client.flush(), /Expirou/);
  assert.equal(client.read().dirty, true); assert.equal(statuses.at(-1), 'expired');
  await client.stop();
});
