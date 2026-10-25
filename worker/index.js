import { validateState, MAX_BYTES } from '../shared/state.js';
import { SaveQueue } from '../shared/sync.js';

const FILE = 'aura-data.json';
const APP = 'Aula Tracker';
const SESSION_SECONDS = 60 * 60 * 24 * 7;
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const fail = error => json({ error: error.status ? error.message : 'Não foi possível concluir a operação.' }, error.status || 500);
const random = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export async function hash(value) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function cookies(request) {
  return Object.fromEntries((request.headers.get('Cookie') || '').split(';').map(v => v.trim().split('=')));
}
function cookie(name, value, seconds, secure) {
  return `${name}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${seconds}${secure ? '; Secure' : ''}`;
}
function object(env, name) { return env.AURA.get(env.AURA.idFromName(name)); }
async function internal(env, name, path, body) {
  const response = await object(env, name).fetch(new Request(`https://internal${path}`, { method: 'POST', body: JSON.stringify(body) }));
  const result = await response.json();
  if (!response.ok) throw new HttpError(response.status, result.error);
  return result;
}
async function readJson(request, limit = MAX_BYTES + 10_000) {
  if (Number(request.headers.get('Content-Length')) > limit) throw new HttpError(413, 'Arquivo muito grande.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Corpo JSON obrigatório.');
  const chunks = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) { await reader.cancel(); throw new HttpError(413, 'Arquivo muito grande.'); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(buffer)); }
  catch { throw new HttpError(400, 'JSON inválido.'); }
}
async function github(token, path, options = {}) {
  let response;
  try {
    response = await fetch(`https://api.github.com${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'Aula-Tracker', 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
    });
  } catch { throw new HttpError(503, 'GitHub indisponível. Tente novamente.'); }
  if (!response.ok) {
    if (response.status === 401) throw new HttpError(401, 'Acesso ao GitHub expirado. Entre novamente.');
    if (response.status === 404) throw new HttpError(409, 'O Gist foi removido ou não está acessível. Seus dados locais foram preservados.');
    if (response.status === 403 || response.status === 429) throw new HttpError(429, 'GitHub limitou o acesso ou recusou a permissão. Aguarde e verifique a autorização do aplicativo.');
    throw new HttpError(502, 'GitHub recusou a operação. Tente novamente.');
  }
  return response.json();
}
async function session(request, env) {
  const bearer = request.headers.get('Authorization')?.match(/^Bearer ([\w-]{43})$/)?.[1];
  const sid = bearer || cookies(request).aura_session;
  if (!sid || !/^[\w-]{43}$/.test(sid)) throw new HttpError(401, 'Entre com GitHub.');
  const active = await internal(env, `session:${await hash(sid)}`, '/read', {});
  if (bearer && (!active.pagesOrigin || request.headers.get('Origin') !== active.pagesOrigin)) throw new HttpError(403, 'Sessão não autorizada nesta origem.');
  if (!bearer && active.pagesOrigin) throw new HttpError(401, 'Entre com GitHub.');
  allowUser(active.user, env);
  return active;
}
function allowUser(user, env) {
  if (env.ALLOWED_USER && user.login.toLowerCase() !== env.ALLOWED_USER.trim().toLowerCase()) throw new HttpError(403, 'Conta não autorizada neste aplicativo.');
}
function redirect(url, values = []) {
  const headers = new Headers({ Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  for (const value of values) headers.append('Set-Cookie', value);
  return new Response(null, { status: 302, headers });
}

export default {
  async fetch(request, env) {
    const response = await handle(request, env);
    const origin = request.headers.get('Origin');
    if (origin && env.PAGES_URL && origin === new URL(env.PAGES_URL).origin) {
      const cors = new Response(response.body, response);
      cors.headers.set('Access-Control-Allow-Origin', origin);
      cors.headers.set('Vary', 'Origin');
      return cors;
    }
    return response;
  },
};

async function handle(request, env) {
    const url = new URL(request.url);
    const secure = url.protocol === 'https:';
    try {
      if (!url.pathname.startsWith('/api/')) {
        const asset = await env.ASSETS.fetch(request);
        const response = new Response(asset.body, asset);
        response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'no-referrer');
        if (url.pathname === '/' || url.pathname.endsWith('.html')) response.headers.set('Cache-Control', 'no-cache');
        return response;
      }
      const origin = request.headers.get('Origin');
      const pagesOrigin = env.PAGES_URL ? new URL(env.PAGES_URL).origin : null;
      const fromPages = !!origin && origin === pagesOrigin;
      if (origin && origin !== url.origin && !fromPages) throw new HttpError(403, 'Origem não permitida.');
      if (request.headers.get('Sec-Fetch-Site') === 'cross-site' && !fromPages && url.pathname !== '/api/auth/callback') throw new HttpError(403, 'Origem não permitida.');
      if (request.method === 'OPTIONS') {
        if (!fromPages) throw new HttpError(403, 'Origem não permitida.');
        return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Max-Age': '600', 'Cache-Control': 'no-store' } });
      }
      if (request.method === 'POST' && origin !== url.origin && !fromPages) throw new HttpError(403, 'Origem obrigatória.');

      if (url.pathname === '/api/health' && request.method === 'GET') {
        return json({ ok: true, app: APP, schemaVersion: 3, oauthConfigured: !!env.GITHUB_CLIENT_ID && !!env.GITHUB_CLIENT_SECRET });
      }

      if (url.pathname === '/api/auth/start' && request.method === 'POST') {
        if (!fromPages) throw new HttpError(403, 'Origem não permitida.');
        if (!env.GITHUB_CLIENT_SECRET || !env.GITHUB_CLIENT_ID) throw new HttpError(503, 'OAuth ainda não configurado no servidor.');
        const body = await readJson(request, 2000);
        if (!/^[\w-]{43}$/.test(body.code_challenge)) throw new HttpError(400, 'PKCE obrigatório.');
        const state = random();
        await internal(env, `oauth:${await hash(state)}`, '/write', { browser: body.code_challenge, pages: true, redirectUri: env.PAGES_URL, expires: Date.now() + 600_000 });
        const target = new URL('https://github.com/login/oauth/authorize');
        target.search = new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, redirect_uri: env.PAGES_URL, scope: 'gist', state, code_challenge: body.code_challenge, code_challenge_method: 'S256' }).toString();
        return json({ authorize_url: target.href, state });
      }
      if (url.pathname === '/api/auth/exchange' && request.method === 'POST') {
        if (!fromPages) throw new HttpError(403, 'Origem não permitida.');
        const body = await readJson(request, 4000);
        if (!/^[\w-]{43}$/.test(body.state) || !/^[\w-]{43}$/.test(body.code_verifier) || typeof body.code !== 'string' || !body.code || body.code.length > 1000) throw new HttpError(400, 'Callback OAuth inválido.');
        const flow = await internal(env, `oauth:${await hash(body.state)}`, '/consume', { browser: await hash(body.code_verifier) });
        if (!flow.pages || flow.redirectUri !== env.PAGES_URL) throw new HttpError(403, 'State OAuth inválido.');
        const exchange = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code: body.code, redirect_uri: flow.redirectUri, code_verifier: body.code_verifier }),
          signal: AbortSignal.timeout(20_000),
        });
        const token = await exchange.json();
        if (!exchange.ok || !token.access_token || !String(token.scope || '').split(/[ ,]+/).includes('gist')) throw new HttpError(401, 'Autorização inválida ou sem permissão para Gists.');
        const account = await github(token.access_token, '/user');
        if (!Number.isSafeInteger(account.id) || !account.login) throw new HttpError(502, 'Conta inválida.');
        allowUser(account, env);
        const sid = random(), user = { id: account.id, login: account.login, name: account.name || account.login };
        const expires = Date.now() + Math.min(SESSION_SECONDS, Number(token.expires_in) || SESSION_SECONDS) * 1000;
        await internal(env, `session:${await hash(sid)}`, '/write', { token: token.access_token, user, expires, pagesOrigin });
        return json({ session_token: sid, user });
      }

      if (url.pathname === '/api/auth/login' && request.method === 'GET') {
        if (!env.GITHUB_CLIENT_SECRET || !env.GITHUB_CLIENT_ID) throw new HttpError(503, 'OAuth ainda não configurado no servidor.');
        const state = random(), verifier = random(), browser = random();
        await internal(env, `oauth:${await hash(state)}`, '/write', { verifier, browser: await hash(browser), expires: Date.now() + 600_000 });
        const target = new URL('https://github.com/login/oauth/authorize');
        target.search = new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, redirect_uri: `${url.origin}/api/auth/callback`, scope: 'gist', state, code_challenge: await hash(verifier), code_challenge_method: 'S256' }).toString();
        return redirect(target.href, [cookie('aura_oauth', browser, 600, secure)]);
      }
      if (url.pathname === '/api/auth/callback' && request.method === 'GET') {
        const state = url.searchParams.get('state'), browser = cookies(request).aura_oauth;
        if (!state || !/^[\w-]{43}$/.test(state) || !browser) return redirect('/?auth_error=state', [cookie('aura_oauth', '', 0, secure)]);
        try {
          const flow = await internal(env, `oauth:${await hash(state)}`, '/consume', { browser: await hash(browser) });
          if (url.searchParams.has('error') || !url.searchParams.get('code')) return redirect('/?auth_error=denied', [cookie('aura_oauth', '', 0, secure)]);
          const exchange = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code: url.searchParams.get('code'), redirect_uri: `${url.origin}/api/auth/callback`, code_verifier: flow.verifier }),
            signal: AbortSignal.timeout(20_000),
          });
          const token = await exchange.json();
          if (!exchange.ok || !token.access_token || !String(token.scope || '').split(/[ ,]+/).includes('gist')) throw new HttpError(401, 'Permissão gist obrigatória.');
          const account = await github(token.access_token, '/user');
          if (!Number.isSafeInteger(account.id) || !account.login) throw new HttpError(502, 'Conta inválida.');
          allowUser(account, env);
          const sid = random();
          const expires = Date.now() + Math.min(SESSION_SECONDS, Number(token.expires_in) || SESSION_SECONDS) * 1000;
          await internal(env, `session:${await hash(sid)}`, '/write', { token: token.access_token, user: { id: account.id, login: account.login, name: account.name || account.login }, expires });
          return redirect('/', [cookie('aura_session', sid, Math.floor((expires - Date.now()) / 1000), secure), cookie('aura_oauth', '', 0, secure)]);
        } catch { return redirect('/?auth_error=failed', [cookie('aura_oauth', '', 0, secure)]); }
      }
      if (url.pathname === '/api/session' && request.method === 'GET') {
        const active = await session(request, env);
        return json({ user: active.user });
      }
      if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
        await session(request, env);
        const sid = request.headers.get('Authorization')?.match(/^Bearer ([\w-]{43})$/)?.[1] || cookies(request).aura_session;
        if (sid && /^[\w-]{43}$/.test(sid)) await internal(env, `session:${await hash(sid)}`, '/delete', {});
        const response = json({ ok: true });
        response.headers.set('Set-Cookie', cookie('aura_session', '', 0, secure));
        return response;
      }
      if (url.pathname === '/api/data' && ['GET', 'POST'].includes(request.method)) {
        const active = await session(request, env);
        const payload = request.method === 'POST' ? await readJson(request) : {};
        return await object(env, `user:${active.user.id}`).fetch(new Request(`https://internal/${request.method === 'POST' ? 'save' : 'load'}`, { method: 'POST', body: JSON.stringify({ ...payload, token: active.token, userId: active.user.id }) }));
      }
      throw new HttpError(404, 'Rota não encontrada.');
    } catch (error) { return fail(error); }
}

export class AuraStore {
  constructor(ctx) { this.ctx = ctx; this.queue = new SaveQueue(); }
  async alarm() { await this.ctx.storage.deleteAll(); }
  fetch(request) { return this.queue.run(async () => {
    try {
      const path = new URL(request.url).pathname, body = await readJson(request);
      if (path === '/write') {
        await this.ctx.storage.put('record', body);
        await this.ctx.storage.setAlarm(body.expires);
        return json({ ok: true });
      }
      if (path === '/delete') { await this.ctx.storage.deleteAll(); return json({ ok: true }); }
      if (path === '/read' || path === '/consume') {
        const record = await this.ctx.storage.get('record');
        if (!record || record.expires <= Date.now()) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
        if (path === '/consume') {
          if (!body.browser || body.browser !== record.browser) throw new HttpError(403, 'State OAuth inválido.');
          await this.ctx.storage.deleteAll();
        }
        return json(record);
      }
      if (!['/load', '/save'].includes(path)) throw new HttpError(404, 'Rota inválida.');
      return json(await this.data(body, path === '/save'));
    } catch (error) { return fail(error); }
  }); }

  async findGist(token, userId) {
    const pinned = await this.ctx.storage.get('gistId');
    if (pinned) return github(token, `/gists/${pinned}`);
    const matches = [];
    for (let page = 1; ; page++) {
      const entries = await github(token, `/gists?per_page=100&page=${page}`);
      for (const entry of entries) {
        if (entry.files?.[FILE] && entry.owner?.id === userId) matches.push(entry);
      }
      if (entries.length < 100) break;
      if (page >= 100) throw new HttpError(409, 'Muitos Gists para localizar os dados com segurança.');
    }
    if (matches.length > 1) throw new HttpError(409, 'Mais de um Gist aura-data.json encontrado. Exporte backups e mantenha apenas o Gist correto com esse nome.');
    if (!matches.length) return null;
    const gist = await github(token, `/gists/${matches[0].id}`);
    // A validação ocorre antes de fixar o vínculo.
    await this.decode(gist, userId);
    await this.ctx.storage.put('gistId', gist.id);
    return gist;
  }

  async decode(gist, userId) {
    if (gist.owner?.id !== userId || gist.public !== false) throw new HttpError(409, 'O Gist deve ser secreto e pertencer à conta autenticada.');
    const file = gist.files?.[FILE];
    if (!file || file.truncated || file.size > MAX_BYTES + 1000 || typeof file.content !== 'string') throw new HttpError(422, 'Arquivo do Gist ausente, truncado ou muito grande.');
    try {
      const parsed = JSON.parse(file.content);
      if (parsed.app !== undefined && ![APP, 'Aura Tracker'].includes(parsed.app)) throw new Error('Aplicação incompatível.');
      const data = validateState(parsed.app !== undefined ? parsed.data : parsed);
      return { data, revision: await hash(file.content), gist_id: gist.id };
    } catch { throw new HttpError(422, 'Os dados do Gist são inválidos. Nenhuma alteração foi feita.'); }
  }

  async data(body, save) {
    const gist = await this.findGist(body.token, body.userId);
    const current = gist ? await this.decode(gist, body.userId) : { data: null, revision: null, gist_id: null };
    if (!save) return current;
    let data;
    try { data = validateState(body.data); } catch (error) { throw new HttpError(422, error.message); }
    if (body.revision !== current.revision) {
      // Retentativa de uma gravação cuja resposta se perdeu.
      if (JSON.stringify(data) === JSON.stringify(current.data)) return current;
      throw new HttpError(409, 'Há uma versão diferente na nuvem. Resolva o conflito antes de salvar.');
    }
    const content = JSON.stringify({ app: APP, data });
    const payload = { files: { [FILE]: { content } } };
    const result = gist
      ? await github(body.token, `/gists/${gist.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
      : await github(body.token, '/gists', { method: 'POST', body: JSON.stringify({ ...payload, description: 'Aula Tracker — progresso de estudos', public: false }) });
    await this.ctx.storage.put('gistId', result.id);
    return this.decode(result, body.userId);
  }
}
