import { validateState } from './state.js';
import { reconcile, SaveQueue } from './sync.js';
import { apiUrl, isPages, sessionHeaders } from './auth.js';

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export async function api(path, body) {
  let response;
  try {
    response = await fetch(apiUrl(path), {
      method: body === undefined ? 'GET' : 'POST', credentials: isPages() ? 'omit' : 'same-origin',
      headers: { ...sessionHeaders(), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(30_000),
    });
  } catch { throw new ApiError(0, 'Sem conexão com o servidor. As alterações locais foram preservadas.'); }
  let result;
  try { result = await response.json(); } catch { throw new ApiError(502, 'Resposta inválida do servidor. Verifique a configuração do Worker.'); }
  if (!response.ok) throw new ApiError(response.status, result.error || 'Falha na comunicação.');
  return result;
}

export class SyncClient {
  constructor(userId, { storage = localStorage, request = api, notify = () => {}, locks = globalThis.navigator?.locks } = {}) {
    this.key = `auraTracker.user.${userId}.v1`;
    this.storage = storage; this.request = request; this.notify = notify; this.locks = locks;
    this.queue = new SaveQueue(); this.cache = null; this.ready = false; this.stopped = false;
    this.timer = null; this.retries = 0; this.conflict = false; this.saving = false;
  }
  read() {
    const raw = this.storage.getItem(this.key);
    if (!raw) return null;
    let value;
    try {
      value = JSON.parse(raw);
      if (value.revision !== null && typeof value.revision !== 'string') throw new Error();
      if (typeof value.dirty !== 'boolean' || typeof value.editId !== 'string') throw new Error();
      return { ...value, data: validateState(value.data) };
    } catch { throw new Error('O cache desta conta está inválido. Exporte uma cópia antes de removê-lo.'); }
  }
  write(value) {
    const next = { ...value, editId: crypto.randomUUID() };
    this.storage.setItem(this.key, JSON.stringify(next));
    this.cache = next;
    return next;
  }
  async initialize() {
    this.cache = this.read();
    await this.refresh();
    return this.cache?.data || null;
  }
  async refresh() {
    const remote = await this.request('/data');
    if (remote.data !== null) remote.data = validateState(remote.data);
    if (remote.revision !== null && typeof remote.revision !== 'string') throw new Error('Revisão remota inválida.');
    // O usuário pode editar enquanto uma leitura de recuperação está em andamento.
    const next = reconcile(this.cache, remote);
    this.conflict = next.conflict;
    if (next.data) this.write(next);
    this.ready = true;
    this.notify(this.conflict ? 'conflict' : this.cache?.dirty ? 'pending' : 'saved');
    return remote;
  }
  save(data) {
    if (this.stopped) throw new Error('A sessão foi encerrada.');
    const disk = this.read();
    if (disk?.editId !== this.cache?.editId) {
      this.conflict = true; this.notify('conflict');
      throw new Error('Outra aba alterou os dados. Exporte a cópia aberta e recarregue antes de continuar.');
    }
    this.write({ data: validateState(data), revision: this.cache?.revision ?? null, dirty: true, conflict: this.conflict });
    this.notify(this.conflict ? 'conflict' : 'pending');
    this.schedule();
  }
  schedule(delay = 1200) {
    clearTimeout(this.timer);
    if (!this.stopped && !this.conflict && this.cache?.dirty) this.timer = setTimeout(() => { this.flush().catch(() => {}); }, delay);
  }
  async flush() {
    clearTimeout(this.timer);
    return this.queue.run(async () => {
      const action = async () => {
        if (this.stopped || this.conflict || !this.cache?.dirty) return;
        try {
          if (!this.ready) await this.refresh();
          if (this.conflict || !this.cache?.dirty) return;
          const disk = this.read();
          if (disk?.editId !== this.cache.editId) { this.conflict = true; this.notify('conflict'); return; }
          const snapshot = structuredClone(this.cache);
          this.saving = true; this.notify('saving');
          const remote = await this.request('/data', { data: snapshot.data, revision: snapshot.revision });
          if (typeof remote.revision !== 'string') throw new Error('Revisão de gravação inválida.');
          const latest = this.read();
          // Outra aba pode ter editado enquanto a requisição estava em trânsito.
          if (latest?.editId !== this.cache.editId) {
            this.ready = false; this.conflict = true; this.notify('conflict'); return;
          }
          this.write({ ...this.cache, revision: remote.revision, dirty: this.cache.editId !== snapshot.editId, conflict: false });
          this.retries = 0;
          this.notify(this.cache.dirty ? 'pending' : 'saved');
          if (this.cache.dirty) this.schedule();
        } catch (error) {
          if (error.status === 409) { this.conflict = true; this.ready = false; this.notify('conflict', error); }
          else if (error.status === 401) { this.ready = false; this.notify('expired', error); }
          else {
            this.ready = false; this.notify('error', error);
            // Apenas erros transitórios recebem retentativas automáticas limitadas.
            if ([0,429,502,503,504].includes(error.status) && this.retries < 5) this.schedule(Math.min(60_000, 2000 * 2 ** this.retries++));
          }
          throw error;
        } finally { this.saving = false; }
      };
      return this.locks ? this.locks.request(this.key, action) : action();
    });
  }
  async resolve(useLocal) {
    clearTimeout(this.timer);
    await this.queue.run(async () => {});
    const remote = await this.request('/data');
    if (remote.data !== null) remote.data = validateState(remote.data);
    if (remote.revision !== null && typeof remote.revision !== 'string') throw new Error('Revisão remota inválida.');
    if (useLocal) this.write({ data: validateState(this.cache.data), revision: remote.revision, dirty: true, conflict: false });
    else if (remote.data) this.write({ data: remote.data, revision: remote.revision, dirty: false, conflict: false });
    else throw new Error('Não há dados na nuvem. Use a cópia local para criar o Gist.');
    this.conflict = false; this.ready = true; this.notify(useLocal ? 'pending' : 'saved');
    if (useLocal) await this.flush();
    return this.cache.data;
  }
  stop() { this.stopped = true; clearTimeout(this.timer); return this.queue.tail; }
}
