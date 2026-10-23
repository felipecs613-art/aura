import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, validateState } from '../shared/state.js';
import { registrationAlerts } from '../shared/registration.js';
import { AuraStore } from '../worker/index.js';

const exam = (values = {}) => ({ id: 'exam', name: 'Concurso TI', board: 'FCC', registrationDate: '2026-10-01', registrationStartDate: '2026-10-01', registrationEndDate: '2026-10-30', noticeUrl: 'https://example.com/edital.pdf', registered: false, fee: 100, examDate: '2027-01-17', createdAt: '', ...values });
const now = new Date(2026, 9, 23, 23, 59, 59);

test('aviso cobre 7 dias, amanhã e hoje, ordenando pelo prazo', () => {
  const exams = [exam({ id: 'seven' }), exam({ id: 'today', registrationEndDate: '2026-10-23' }), exam({ id: 'tomorrow', registrationEndDate: '2026-10-24' })];
  assert.deepEqual(registrationAlerts(exams, now).map(({ exam, days }) => [exam.id, days]), [['today', 0], ['tomorrow', 1], ['seven', 7]]);
  assert.equal(registrationAlerts(exams, new Date(2026, 9, 23, 0, 0, 1)).length, 3);
});

test('não avisa fora do prazo, antes da abertura, sem data final ou para inscritos', () => {
  const exams = [exam({ registrationEndDate: '2026-10-31' }), exam({ registrationEndDate: '2026-10-22' }), exam({ registrationEndDate: '' }), exam({ registrationEndDate: '2026-02-30' }), exam({ registered: true }), exam({ registrationStartDate: '2026-10-24' })];
  assert.deepEqual(registrationAlerts(exams, now), []);
});

test('migração preserva a antiga data como início sem inventar fim ou edital', () => {
  const oldExam = { id: 'old', name: 'Concurso antigo', registrationDate: '2026-10-05', registered: true };
  const state = validateState({ ...emptyState(), version: 2, exams: [oldExam] });
  assert.equal(state.version, 3);
  assert.equal(state.exams[0].registrationStartDate, oldExam.registrationDate);
  assert.equal(state.exams[0].registrationDate, oldExam.registrationDate);
  assert.equal(state.exams[0].registrationEndDate, '');
  assert.equal(state.exams[0].noticeUrl, '');
  assert.equal(state.exams[0].registered, true);
});

test('datas e link sobrevivem ao backup JSON e à leitura pelo Worker', async () => {
  const data = validateState({ ...emptyState(), exams: [exam()] });
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(data))), data);
  const store = new AuraStore({ storage: {} });
  const decoded = await store.decode({ id: 'gist', owner: { id: 1 }, public: false, files: { 'aura-data.json': { content: JSON.stringify({ app: 'Aura Tracker', data }), size: 2000, truncated: false } } }, 1);
  assert.deepEqual(decoded.data.exams, data.exams);
});

test('rejeita período invertido, datas inexistentes e protocolos inseguros no edital', () => {
  for (const values of [{ registrationEndDate: '2026-09-30' }, { registrationStartDate: '2026-02-30' }, { registrationEndDate: '2026-11-31' }, { noticeUrl: 'javascript:alert(1)' }, { noticeUrl: 'data:text/html,test' }]) {
    assert.throws(() => validateState({ ...emptyState(), exams: [exam(values)] }));
  }
  assert.doesNotThrow(() => validateState({ ...emptyState(), exams: [exam({ registrationStartDate: '2026-10-30' })] }));
});
