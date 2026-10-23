// GitHub Pages mantém o frontend; credenciais GitHub continuam somente no Worker.
export const PAGES_ORIGIN = 'https://felipecs613-art.github.io';
export const WORKER_ORIGIN = 'https://aura-auth.felipecs613.workers.dev';
export const isPages = () => globalThis.location?.origin === PAGES_ORIGIN;
const SESSION_KEY = 'aura.session.v2';
const FLOW_KEY = 'aura.oauth.v2';
export function apiUrl(path) { return `${isPages() ? WORKER_ORIGIN : ''}/api${path}`; }
export function sessionHeaders() {
  const token = isPages() ? sessionStorage.getItem(SESSION_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
export function clearSession() { sessionStorage.removeItem(SESSION_KEY); }
function random() {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function challenge(value) {
  return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function startLogin(request) {
  if (!isPages()) { location.assign('/api/auth/login'); return; }
  const verifier = random();
  const flow = await request('/auth/start', { code_challenge: await challenge(verifier) });
  const target = new URL(flow.authorize_url);
  if (target.origin !== 'https://github.com' || target.pathname !== '/login/oauth/authorize' || !/^[\w-]{43}$/.test(flow.state)) throw new Error('Resposta OAuth inválida.');
  sessionStorage.setItem(FLOW_KEY, JSON.stringify({ state: flow.state, verifier, expires: Date.now() + 600_000 }));
  location.assign(target.href);
}
export async function finishLogin(request) {
  if (!isPages()) return;
  const params = new URLSearchParams(location.search);
  if (!params.has('code') && !params.has('error')) return;
  history.replaceState({}, '', location.pathname);
  const saved = sessionStorage.getItem(FLOW_KEY);
  sessionStorage.removeItem(FLOW_KEY);
  if (params.has('error')) throw new Error('Autorização cancelada. Entre novamente.');
  let flow;
  try { flow = JSON.parse(saved); } catch { /* rejeita fluxo inválido abaixo */ }
  if (!flow || flow.expires <= Date.now() || !params.get('state') || params.get('state') !== flow.state || !flow.verifier) throw new Error('State OAuth inválido ou expirado. Inicie o login novamente.');
  const result = await request('/auth/exchange', { code: params.get('code'), state: flow.state, code_verifier: flow.verifier });
  if (!/^[\w-]{43}$/.test(result.session_token)) throw new Error('Sessão inválida.');
  // Sessão opaca do Aura, nunca o token GitHub; encerrada ao fechar esta aba.
  sessionStorage.setItem(SESSION_KEY, result.session_token);
}
