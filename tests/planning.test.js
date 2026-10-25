import test from 'node:test';
import assert from 'node:assert/strict';
import { cycleCompletionEstimate } from '../shared/planning.js';

const tasks = count => Array.from({ length: count }, () => ({ cycle: 2, done: false }));
const day = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()];

test('12 pendentes levam quatro dias, incluindo hoje, sem contar outros ciclos ou concluídas', () => {
  const estimate = cycleCompletionEstimate([...tasks(12), { cycle: 2, done: true }, { cycle: 1, done: false }], 2, new Date(2026, 9, 25, 23, 59));
  assert.equal(estimate.pending, 12); assert.equal(estimate.days, 4);
  assert.deepEqual(day(estimate.date), [2026, 10, 28]);
});

test('arredonda dias para cima e trata viradas de mês e ano', () => {
  assert.deepEqual(day(cycleCompletionEstimate(tasks(3), 2, new Date(2026, 9, 31)).date), [2026, 10, 31]);
  assert.deepEqual(day(cycleCompletionEstimate(tasks(4), 2, new Date(2026, 9, 31)).date), [2026, 11, 1]);
  assert.deepEqual(day(cycleCompletionEstimate(tasks(7), 2, new Date(2026, 11, 31)).date), [2027, 1, 2]);
  assert.deepEqual(cycleCompletionEstimate([], 2), { pending: 0, days: 0, date: null });
});
