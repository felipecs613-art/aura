import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { emptyState, validateState } from '../../shared/state.js';
import { parseCsv } from '../../shared/csv.js';

test('downloads CSV completos e reimporta campos novos sem perder vínculos', async ({ page }) => {
  const exam = { id: 'exam', name: 'Concurso TI', board: 'FCC', registrationStartDate: '2026-10-01', registrationEndDate: '2026-10-30', noticeUrl: 'https://example.com/edital.pdf', examDate: '2027-01-17', fee: 120.5, registered: true, createdAt: '2026-10-01T12:00:00Z' };
  let data = validateState({ ...emptyState(), tceGoSeeded: true, seededMissionSets: ['TCE_GO_Analise_FCC_Espacado_v1'], currentExamId: 'exam', exams: [exam, { ...exam, id: 'radar', name: 'Sem missão' }], tasks: [{ id: 'mission', title: 'Redes; "Revisão"', subject: 'TI', link: '', cycle: 2, deadline: '', done: false, importance: 'high', examId: 'exam', accuracyByCycle: { '1': 0, '2': 82.5 }, history: [{ type: 'status', at: '2026-10-20T12:00:00Z', cycle: 1, done: true, accuracy: 0 }], createdAt: '2026-10-01T12:00:00Z', updatedAt: '2026-10-20T12:00:00Z' }] });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.route('**/api/session', route => route.fulfill({ json: { user: { id: 1, login: 'alice', name: 'Alice' } } }));
  let revision = 'r1';
  await page.route('**/api/data', route => {
    if (route.request().method() === 'POST') { const body = route.request().postDataJSON(); expect(body.revision).toBe(revision); data = validateState(body.data); revision += 'x'; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await page.locator('#settingsButton').click();
  const missionDownloadPromise = page.waitForEvent('download');
  await page.locator('#exportCsvButton').click();
  const missionDownload = await missionDownloadPromise;
  const content = await readFile(await missionDownload.path(), 'utf8');
  const rows = parseCsv(content), values = Object.fromEntries(rows[0].map((header, index) => [header, rows[1][index]]));
  expect(values).toMatchObject({ 'ID do concurso': 'exam', 'Acerto no 1º ciclo (%)': '0', 'Acerto no 2º ciclo (%)': '82,5' });
  expect(rows[0]).toHaveLength(16);
  for (const removed of ['Concurso', 'Banca', 'Início das inscrições', 'Último dia de inscrição', 'Link do edital', 'Data da prova', 'Taxa de inscrição', 'Inscrição realizada', 'Concurso atual', 'Concurso criado em']) expect(rows[0]).not.toContain(removed);
  expect(JSON.parse(values['Histórico (JSON)'])[0].accuracy).toBe(0);
  const examDownloadPromise = page.waitForEvent('download');
  await page.locator('#exportExamsCsvButton').click();
  const examDownload = await examDownloadPromise;
  expect(examDownload.suggestedFilename()).toContain('concursos');
  const examRows = parseCsv(await readFile(await examDownload.path(), 'utf8'));
  expect(examRows).toHaveLength(3);
  expect(examRows[2][0]).toBe('Sem missão');
  expect(examRows[0]).toContain('Banca');
  expect(examRows[0]).toContain('Link do edital');
  await page.locator('#csvFileInput').setInputFiles({ name: 'missoes.csv', mimeType: 'text/csv', buffer: Buffer.from(content) });
  await expect(page.locator('#toastStack')).toContainText('CSV importado');
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(data.tasks).toHaveLength(2);
  expect(data.exams).toHaveLength(2);
  expect(data.tasks[1]).toMatchObject({ examId: 'exam', accuracyByCycle: { '1': 0, '2': 82.5 }, history: data.tasks[0].history, createdAt: data.tasks[0].createdAt });
  expect(errors).toEqual([]);
});
