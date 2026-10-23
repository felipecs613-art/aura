export const MAX_BYTES = 750_000;
export const emptyState = () => ({ version: 3, profile: { name: 'Estudante' }, xp: 0, coins: 0, tasks: [], rewards: [], redemptions: [], exams: [], currentExamId: null, currentCycle: 1, tceGoSeeded: false, seededMissionSets: [], createdAt: new Date().toISOString() });

function text(value, max, fallback = '') {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string' || value.length > max) throw new Error('Texto inválido ou muito longo.');
  return value;
}
function number(value, max = 1_000_000_000) {
  if (!Number.isSafeInteger(value) || value < 0 || value > max) throw new Error('Número inválido.');
  return value;
}
function list(value, max) {
  if (!Array.isArray(value) || value.length > max) throw new Error('Lista inválida ou muito grande.');
  return value;
}
function record(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Registro inválido.');
  return value;
}
function date(value) {
  const result = text(value, 40);
  if (result && !Number.isFinite(Date.parse(result))) throw new Error('Data inválida.');
  return result;
}
function identity(value, ids) {
  const id = text(value, 100);
  if (!id || ids.has(id)) throw new Error('Identificador ausente ou duplicado.');
  ids.add(id);
  return id;
}

function cycle(value) {
  if (![1, 2, 3, 4].includes(value)) throw new Error('Ciclo inválido.');
  return value;
}
function percentage(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) throw new Error('Percentual inválido.');
  return value;
}
function day(value) {
  const result = text(value, 10);
  if (result && (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result)) throw new Error('Data inválida.');
  return result;
}
function boolean(value) {
  if (typeof value !== 'boolean') throw new Error('Valor booleano inválido.');
  return value;
}
function historyEntry(value) {
  const entry = record(value), base = { type: text(entry.type, 30), at: date(entry.at) };
  if (entry.type === 'status') {
    return { ...base, done: boolean(entry.done), ...(entry.cycle === undefined ? {} : { cycle: cycle(entry.cycle) }), ...(entry.accuracy === undefined ? {} : { accuracy: percentage(entry.accuracy) }), ...(entry.undo === undefined ? {} : { undo: boolean(entry.undo) }) };
  }
  if (entry.type === 'cycle_transfer') {
    return { ...base, from: cycle(entry.from), to: cycle(entry.to), ...(entry.previousDone === undefined ? {} : { previousDone: boolean(entry.previousDone) }), ...(entry.previousDeadline === undefined ? {} : { previousDeadline: day(entry.previousDeadline) }), ...(entry.previousAccuracy === undefined ? {} : { previousAccuracy: percentage(entry.previousAccuracy) }) };
  }
  if (entry.type === 'edit') {
    return { ...base, changes: list(entry.changes, 20).map(value => {
      const change = record(value);
      const scalar = value => {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'boolean') return value;
        return text(value, 2000);
      };
      return { field: text(change.field, 100), before: scalar(change.before), after: scalar(change.after) };
    }) };
  }
  throw new Error('Tipo de histórico não suportado.');
}

// Uma única fronteira de validação para cache, backup e API. Nunca copia campos desconhecidos.
export function validateState(input) {
  const source = record(input);
  if (source.version !== undefined && ![1, 2, 3].includes(source.version)) throw new Error('Versão de dados não suportada.');
  const result = emptyState();
  result.profile = { name: text(record(source.profile || {}).name, 100, 'Estudante') };
  result.xp = number(source.xp);
  result.coins = number(source.coins);
  result.createdAt = date(source.createdAt) || result.createdAt;
  const taskIds = new Set(), rewardIds = new Set(), redemptionIds = new Set();
  result.tasks = list(source.tasks, 5000).map(value => {
    const t = record(value);
    const title = text(t.title, 2000).trim();
    if (!title || ![1,2,3,4].includes(t.cycle) || !['low','medium','high'].includes(t.importance) || typeof t.done !== 'boolean') throw new Error('Missão inválida.');
    const link = text(t.link, 2000);
    if (link && !['https:', 'http:'].includes(new URL(link).protocol)) throw new Error('Link inválido.');
    const deadline = text(t.deadline, 10);
    if (deadline && (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || !Number.isFinite(Date.parse(deadline)) || new Date(deadline).toISOString().slice(0,10) !== deadline)) throw new Error('Prazo inválido.');
    const accuracyByCycle = {};
    for (const [key, value] of Object.entries(record(t.accuracyByCycle || {}))) {
      if (!['1', '2', '3', '4'].includes(key)) throw new Error('Ciclo de percentual inválido.');
      const accuracy = percentage(value);
      if (accuracy !== null) accuracyByCycle[key] = accuracy;
    }
    return { id: identity(t.id, taskIds), title, subject: text(t.subject, 200), link, deadline, cycle: t.cycle, importance: t.importance, done: t.done, createdAt: date(t.createdAt), updatedAt: date(t.updatedAt), examId: text(t.examId, 100), accuracyByCycle, history: list(t.history || [], 2000).map(historyEntry) };
  });
  result.rewards = list(source.rewards, 1000).map(value => {
    const r = record(value);
    const name = text(r.name, 80).trim(), cost = number(r.cost, 1_000_000);
    if (!name || cost < 1) throw new Error('Recompensa inválida.');
    return { id: identity(r.id, rewardIds), name, description: text(r.description, 200), cost, icon: text(r.icon, 32), createdAt: date(r.createdAt) };
  });
  result.redemptions = list(source.redemptions || [], 5000).map(value => {
    const r = record(value);
    return { id: identity(r.id, redemptionIds), rewardId: text(r.rewardId, 100), name: text(r.name, 80), cost: number(r.cost, 1_000_000), date: date(r.date) };
  });
  result.seededMissionSets = list(source.seededMissionSets || [], 100).map(v => text(v, 100));
  const examIds = new Set();
  result.exams = list(source.exams || [], 200).map(value => {
    const exam = record(value), name = text(exam.name, 150).trim();
    if (!name) throw new Error('Nome do concurso obrigatório.');
    const fee = exam.fee ?? '';
    if (fee !== '' && (typeof fee !== 'number' || !Number.isFinite(fee) || fee < 0 || fee > 1_000_000)) throw new Error('Taxa de inscrição inválida.');
    const registrationStartDate = day(exam.registrationStartDate ?? exam.registrationDate);
    const registrationEndDate = day(exam.registrationEndDate);
    if (registrationStartDate && registrationEndDate && registrationEndDate < registrationStartDate) throw new Error('O último dia de inscrição deve ser igual ou posterior ao início.');
    const noticeUrl = text(exam.noticeUrl, 2000).trim();
    if (noticeUrl && !['http:', 'https:'].includes(new URL(noticeUrl).protocol)) throw new Error('Link do edital inválido.');
    // A data antiga é preservada como início; não inventa um prazo final para inscrições existentes.
    return { id: identity(exam.id, examIds), name, board: text(exam.board, 100), registrationDate: registrationStartDate, registrationStartDate, registrationEndDate, noticeUrl, fee, examDate: day(exam.examDate), registered: boolean(exam.registered ?? false), createdAt: date(exam.createdAt) };
  });
  result.currentExamId = source.currentExamId == null || source.currentExamId === '' ? null : text(source.currentExamId, 100);
  if (result.currentExamId && !examIds.has(result.currentExamId)) throw new Error('Concurso atual não encontrado.');
  result.currentCycle = cycle(source.currentCycle ?? 1);
  result.tceGoSeeded = boolean(source.tceGoSeeded ?? false);
  if (new TextEncoder().encode(JSON.stringify(result)).length > MAX_BYTES) throw new Error('Dados excedem o limite de 750 KB.');
  return result;
}
