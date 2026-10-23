import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, validateState } from '../shared/state.js';
import { exportMissionsCsv, exportExamsCsv, importAuraCsv, parseCsv } from '../shared/csv.js';

const exam = (id = 'exam') => ({ id, name: 'Concurso "TI"; Goiás', board: 'FCC', registrationStartDate: '2026-10-01', registrationEndDate: '2026-10-30', noticeUrl: 'https://example.com/edital.pdf', examDate: '2027-01-17', fee: 120.5, registered: false, createdAt: '2026-10-01T12:00:00Z' });
function fixture() {
  return validateState({ ...emptyState(), currentExamId: 'exam', exams: [exam(), exam('unlinked')], tasks: [{ id: 'mission', title: 'Redes; "TCP/IP"\nRevisão', link: 'https://example.com/notebook', subject: 'Redes', importance: 'high', cycle: 3, deadline: '2026-12-01', done: false, examId: 'exam', accuracyByCycle: { '1': 0, '2': 75.5, '4': 100 }, createdAt: '2026-10-01T12:00:00Z', updatedAt: '2026-10-23T12:00:00Z', history: [{ type: 'edit', at: '2026-10-23T12:00:00Z', changes: [{ field: 'title', before: 'Antes; "texto"', after: 'Depois\nNova linha' }] }] }] });
}

test('CSV de missões inclui todos os campos novos e conserva valores ao reimportar', () => {
  const data = fixture(), csv = exportMissionsCsv(data), rows = parseCsv(csv);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.equal(rows[0].length, rows[1].length);
  for (const label of ['Concurso', 'Banca', 'Início das inscrições', 'Último dia de inscrição', 'Link do edital', 'Acerto no 1º ciclo (%)', 'Acerto no 4º ciclo (%)', 'Histórico (JSON)', 'Criada em', 'Atualizada em']) assert.ok(rows[0].includes(label));
  const result = importAuraCsv(csv, emptyState());
  assert.deepEqual(result.state.tasks, data.tasks);
  assert.deepEqual(result.state.exams, [data.exams[0]]);
  assert.equal(result.state.currentExamId, 'exam');
  assert.equal(result.tasksAdded, 1); assert.equal(result.examsAdded, 1);
});

test('CSV de concursos inclui registros sem missão e todos os campos de inscrição', () => {
  const data = fixture();
  const result = importAuraCsv(exportExamsCsv(data), emptyState());
  assert.deepEqual(result.state.exams, data.exams);
  assert.equal(result.tasksAdded, 0); assert.equal(result.examsAdded, 2);
  assert.equal(result.state.currentExamId, data.currentExamId);
});

test('importa CSV antigo e CSV sem cabeçalho sem alterar saldos', () => {
  const original = { ...emptyState(), xp: 300, coins: 45 };
  const csv = 'Item do Edital;Link do Notebook;Disciplina;Importância / Relevância;Ciclo;Prazo;Concluída\nScrum;https://example.com/notebook;TI;Alta;3º Ciclo;2026-12-01;Sim';
  const result = importAuraCsv(csv, original);
  assert.equal(result.state.xp, 300); assert.equal(result.state.coins, 45);
  assert.equal(result.state.tasks[0].importance, 'high'); assert.equal(result.state.tasks[0].cycle, 3);
  assert.equal(result.state.tasks[0].done, true);
  const noHeader = importAuraCsv('Scrum,https://example.com/notebook,TI,h', original);
  assert.equal(noHeader.state.tasks[0].title, 'Scrum'); assert.equal(noHeader.state.tasks[0].importance, 'high');
});

test('colisões de ID não sobrescrevem concursos ou missões existentes', () => {
  const source = fixture();
  const existing = structuredClone(source); existing.exams[0].board = 'Outra banca';
  let counter = 0;
  const result = importAuraCsv(exportMissionsCsv(source), existing, { makeId: () => `new-${++counter}` });
  assert.equal(result.state.exams[0].board, 'Outra banca');
  assert.equal(result.state.tasks[0].id, 'mission');
  assert.notEqual(result.state.tasks[1].id, 'mission');
  assert.equal(result.state.tasks[1].examId, result.state.exams[2].id);
  assert.equal(result.state.exams[2].board, 'FCC');
  assert.equal(result.state.currentExamId, existing.currentExamId);
});

test('reutiliza concurso idêntico, preserva vínculo excluído e datas vazias', () => {
  const source = fixture(); source.tasks[0].createdAt = ''; source.tasks[0].updatedAt = '';
  const existing = { ...emptyState(), exams: [source.exams[0]] };
  const result = importAuraCsv(exportMissionsCsv(source), existing);
  assert.equal(result.examsAdded, 0); assert.equal(result.state.tasks[0].examId, 'exam');
  assert.equal(result.state.tasks[0].createdAt, '');
  source.tasks[0].examId = 'deleted';
  const deleted = importAuraCsv(exportMissionsCsv(source), emptyState());
  assert.equal(deleted.state.tasks[0].examId, 'deleted'); assert.equal(deleted.state.exams.length, 0);
});

test('rejeita acertos e histórico inválidos sem modificar o estado original', () => {
  const source = fixture(), before = structuredClone(source), rows = parseCsv(exportMissionsCsv(source));
  const serialize = rows => rows.map(row => row.map(v => `"${v.replace(/"/g, '""')}"`).join(';')).join('\n');
  rows[1][rows[0].indexOf('Acerto no 1º ciclo (%)')] = '101';
  assert.throws(() => importAuraCsv(serialize(rows), source));
  rows[1][rows[0].indexOf('Acerto no 1º ciclo (%)')] = '0';
  rows[1][rows[0].indexOf('Histórico (JSON)')] = 'invalid json';
  assert.throws(() => importAuraCsv(serialize(rows), source));
  assert.deepEqual(source, before);
  assert.throws(() => parseCsv('Title\n"unclosed'));
});
