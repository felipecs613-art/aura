// Estado de sincronização puro, compartilhado com testes.
export function reconcile(cache, remote) {
  if (!cache?.dirty) return { data: remote.data, revision: remote.revision, dirty: false, conflict: false };
  // Uma resposta pode ter se perdido depois de uma gravação bem-sucedida.
  if (JSON.stringify(cache.data) === JSON.stringify(remote.data)) return { ...cache, revision: remote.revision, dirty: false, conflict: false };
  return { ...cache, conflict: cache.revision !== remote.revision };
}

export class SaveQueue {
  constructor() { this.tail = Promise.resolve(); }
  run(action) {
    const pending = this.tail.then(action);
    this.tail = pending.catch(() => {});
    return pending;
  }
}
