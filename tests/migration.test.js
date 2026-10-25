import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, validateState } from '../shared/state.js';
import { AuraStore } from '../worker/index.js';

const task = () => ({ id: 'task-1', title: 'Redes', subject: 'TI', link: 'https://example.com', deadline: '', cycle: 2, importance: 'high', done: false, createdAt: '2026-10-21T12:00:00Z', updatedAt: '2026-10-22T12:00:00Z' });
const state20 = () => ({
  ...emptyState(), xp: 450, coins: 120, currentCycle: 2, currentExamId: 'exam-1', tceGoSeeded: true,
  exams: [{ id: 'exam-1', name: 'Concurso de TI', board: 'FCC', registrationDate: '2026-10-05', registrationStartDate: '2026-10-05', registrationEndDate: '2026-11-05', noticeUrl: 'https://example.com/edital.pdf', fee: 120.5, examDate: '2027-01-17', registered: true, createdAt: '2026-10-21T12:00:00Z' }],
  tasks: [{ ...task(), examId: 'exam-1', accuracyByCycle: { '1': 75.5, '2': 0 }, history: [
    { type: 'status', at: '2026-10-21T12:00:00Z', done: true, accuracy: 75.5, cycle: 1 },
    { type: 'cycle_transfer', at: '2026-10-21T12:00:00Z', from: 1, to: 2, previousDone: true, previousDeadline: '2026-10-20', previousAccuracy: 75.5 },
    { type: 'edit', at: '2026-10-22T12:00:00Z', changes: [{ field: 'cycle', before: 1, after: 2 }, { field: 'Concurso', before: '', after: 'Concurso de TI' }] },
  ] }],
});

test('dados anteriores migram sem perder tarefas, saldos, recompensas e resgates', () => {
  const old = { version: 1, profile: { name: 'Felipe' }, xp: 300, coins: 45, tasks: [{ ...task(), done: true }], rewards: [{ id: 'reward', name: 'Café', cost: 10, description: '', icon: '☕', createdAt: '' }], redemptions: [{ id: 'redemption', rewardId: 'reward', name: 'Café', cost: 10, date: '2026-10-21T12:00:00Z' }], seededMissionSets: ['TCE_GO_Analise_FCC_Espacado_v1'] };
  const migrated = validateState(old);
  assert.equal(migrated.version, 3);
  for (const key of ['xp', 'coins', 'profile', 'rewards', 'redemptions', 'seededMissionSets']) assert.deepEqual(migrated[key], old[key]);
  for (const [key, value] of Object.entries(old.tasks[0])) assert.deepEqual(migrated.tasks[0][key], value);
  assert.deepEqual(migrated.tasks[0].history, []);
  assert.deepEqual(migrated.exams, []);
  assert.equal(migrated.currentCycle, 1);
});

test('campos 2.0 sobrevivem à validação, serialização e leitura pelo Worker', async () => {
  const data = state20();
  const first = validateState(data);
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(first))), first);
  const store = new AuraStore({ storage: {} });
  const result = await store.decode({ id: 'gist', owner: { id: 10 }, public: false, files: { 'aura-data.json': { content: JSON.stringify({ app: 'Aura Tracker', data }), truncated: false, size: 4000 } } }, 10);
  assert.deepEqual(result.data, first);
  assert.deepEqual(result.data.tasks[0].history, data.tasks[0].history);
  assert.deepEqual(result.data.exams, data.exams);
});

test('renomeação aceita Gists com o nome antigo e o novo sem perder dados', async () => {
  const data = state20();
  const store = new AuraStore({ storage: {} });
  for (const app of ['Aura Tracker', 'Aula Tracker']) {
    const result = await store.decode({ id: 'gist', owner: { id: 10 }, public: false, files: {
      'aura-data.json': { content: JSON.stringify({ app, data }), truncated: false, size: 4000 }
    } }, 10);
    assert.deepEqual(result.data, validateState(data));
  }
});

test('backup HTML 2.0 de versão 1 conserva concursos e histórico na migração', () => {
  const data = state20(); data.version = 1;
  const migrated = validateState(data);
  assert.deepEqual(migrated.tasks[0].accuracyByCycle, data.tasks[0].accuracyByCycle);
  assert.deepEqual(migrated.exams, data.exams);
  assert.equal(migrated.currentExamId, 'exam-1');
  // Um concurso removido pode continuar referenciado no histórico da missão.
  data.currentExamId = null; data.exams = [];
  assert.equal(validateState(data).tasks[0].examId, 'exam-1');
});

test('novos campos inválidos são recusados antes de salvar', () => {
  const invalid = mutate => { const data = state20(); mutate(data); assert.throws(() => validateState(data)); };
  invalid(data => data.tasks[0].accuracyByCycle['1'] = 101);
  invalid(data => data.tasks[0].accuracyByCycle['5'] = 50);
  invalid(data => data.tasks[0].history[0].accuracy = -1);
  invalid(data => data.tasks[0].history[1].to = 5);
  invalid(data => data.exams[0].examDate = '2026-02-30');
  invalid(data => data.exams[0].fee = -1);
  invalid(data => data.currentExamId = 'missing');
  invalid(data => data.currentCycle = 5);
  invalid(data => data.tceGoSeeded = 'true');
});
