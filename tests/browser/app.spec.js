import { test, expect } from '@playwright/test';

const fresh = () => ({ version: 1, profile: { name: 'Antigo' }, xp: 0, coins: 0, tasks: [], rewards: [], redemptions: [], seededMissionSets: [], createdAt: '2026-10-21T00:00:00.000Z' });
async function mockAccount(page, { user = { id: 1, login: 'alice', name: 'Alice' }, initial = null, delay = 0, conflict = false } = {}) {
  let data = initial, revision = initial ? 'r1' : null, writes = 0;
  await page.route('**/api/session', route => route.fulfill({ json: { user } }));
  await page.route('**/api/data', async route => {
    if (route.request().method() === 'GET') {
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      return route.fulfill({ json: { data, revision } });
    }
    writes++;
    if (conflict) return route.fulfill({ status: 409, json: { error: 'Conflito de versões.' } });
    const body = route.request().postDataJSON();
    expect(body.revision).toBe(revision);
    data = body.data; revision = `r${writes + 1}`;
    return route.fulfill({ json: { data, revision } });
  });
  return { get data() { return data; }, get writes() { return writes; } };
}

async function completeMission(page, accuracy = '75,5') {
  await page.locator('[data-toggle-task]').first().click();
  await expect(page.locator('#completionModal')).toBeVisible();
  await page.locator('#completionAccuracy').fill(accuracy);
  await page.locator('#confirmCompletionButton').click();
  await expect(page.locator('#completionModal')).toBeHidden();
}

test('frontend espera a leitura, mostra a conta GitHub e sincroniza uma missão', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const cloud = await mockAccount(page, { delay: 1600 });
  await page.goto('/');
  await expect(page.locator('#loginScreen')).toBeVisible();
  await page.waitForTimeout(1300);
  expect(cloud.writes).toBe(0);
  await expect(page.locator('#loginScreen')).toBeHidden();
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await expect(page.locator('.task-card').first()).toBeVisible();
  await completeMission(page);
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(cloud.data.tasks.some(task => task.cycle === 2 && task.accuracyByCycle['1'] === 75.5 && task.history.length === 2)).toBe(true);
  expect(cloud.data.coins).toBeGreaterThan(0);
  expect(cloud.data.xp).toBe(0);
  await expect(page.locator('#completedTotal')).toHaveText('1');
  expect(errors).toEqual([]);
  const cookies = await page.context().cookies();
  expect(cookies.some(cookie => cookie.name === 'gh_token')).toBe(false);
  expect(await page.evaluate(() => localStorage.getItem('gh_token'))).toBeNull();
});

test('erro de revisão preserva cache e oferece escolha de versão', async ({ page }) => {
  await mockAccount(page, { conflict: true });
  await page.goto('/');
  await expect(page.locator('#syncNotice')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('#useRemoteButton')).toBeVisible();
  await expect(page.locator('#useLocalButton')).toBeVisible();
  const cache = await page.evaluate(() => JSON.parse(localStorage.getItem('auraTracker.user.1.v1')));
  expect(cache.dirty).toBe(true);
  expect(cache.data.tasks.length).toBeGreaterThan(0);
});

test('logout limpa a tela e conta nova não recebe o cache de outra conta', async ({ page }) => {
  await mockAccount(page);
  await page.route('**/api/auth/logout', route => route.fulfill({ json: { ok: true } }));
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#logoutBtn').click();
  await expect(page.locator('#loginScreen')).toBeVisible();
  await expect(page.locator('.app-root')).toBeHidden();
  const next = fresh(); next.seededMissionSets = ['TCE_GO_Analise_FCC_Espacado_v1'];
  await mockAccount(page, { user: { id: 2, login: 'bob', name: 'Bob' }, initial: next });
  await page.reload();
  await expect(page.locator('#profileName')).toHaveText('Bob');
  await expect(page.locator('.task-card')).toHaveCount(0);
});

test('sem sessão a aplicação permanece bloqueada', async ({ page }) => {
  await page.route('**/api/session', route => route.fulfill({ status: 401, json: { error: 'Entre com GitHub.' } }));
  await page.goto('/');
  await expect(page.locator('#ghLoginBtn')).toBeVisible();
  await expect(page.locator('.app-root')).toBeHidden();
});

test('CSV preserva ciclo, prazo e conclusão sem alterar XP e moedas', async ({ page }) => {
  const data = fresh(); data.seededMissionSets = ['TCE_GO_Analise_FCC_Espacado_v1'];
  const cloud = await mockAccount(page, { initial: data });
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  const csv = 'Item do Edital;Link do Notebook;Disciplina;Importância / Relevância;Ciclo;Prazo;Concluída\n"Missão CSV";https://example.com;Teste;Alta;3º Ciclo;2026-12-20;Sim';
  await page.locator('#csvFileInput').setInputFiles({ name: 'backup.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(cloud.data.tasks[0]).toMatchObject({ title: 'Missão CSV', cycle: 3, deadline: '2026-12-20', done: true, importance: 'high' });
  expect(cloud.data.xp).toBe(0); expect(cloud.data.coins).toBe(0);
});

test('queda de rede preserva alterações no cache após recarregar', async ({ page }) => {
  const data = fresh(); data.seededMissionSets = ['TCE_GO_Analise_FCC_Espacado_v1'];
  data.tasks = [{ id: 'offline', title: 'Estudar offline', subject: 'Teste', link: '', deadline: '', cycle: 1, importance: 'low', done: false }];
  await mockAccount(page, { initial: data });
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await page.route('**/api/data', route => route.abort());
  await completeMission(page);
  await expect(page.locator('#syncNotice')).toBeVisible();
  await page.reload();
  await expect(page.locator('#profileName')).toHaveText('Alice');
  const cache = await page.evaluate(() => JSON.parse(localStorage.getItem('auraTracker.user.1.v1')));
  expect(cache.dirty).toBe(true); expect(cache.data.tasks[0].cycle).toBe(2);
  expect(cache.data.tasks[0].accuracyByCycle['1']).toBe(75.5);
  await expect(page.locator('#completedTotal')).toHaveText('1');
});

test('cadastro de concurso e vínculo de missão persistem após recarregar', async ({ page }) => {
  const data = fresh(); data.seededMissionSets = ['TCE_GO_Analise_FCC_Espacado_v1'];
  const cloud = await mockAccount(page, { initial: data });
  await page.goto('/');
  await page.locator('[data-view="exams"]').click();
  await page.locator('#newExamButton').click();
  await page.locator('#examName').fill('Concurso de teste');
  await page.locator('#examBoard').fill('FCC');
  await page.locator('#examRegistration').fill('2026-10-22');
  await page.locator('#examFee').fill('120,50');
  await page.locator('#examDate').fill('2027-02-10');
  await page.locator('#examRegistered').check();
  await page.locator('#saveExamButton').click();
  await expect(page.locator('#examModal')).toBeHidden();
  await expect(page.locator('#radarExams')).toContainText('Concurso de teste');
  await page.locator('[data-view="tasks"]').click();
  await page.locator('#dockAddButton').click();
  await page.locator('#taskTitle').fill('Estudar redes');
  await page.locator('#taskExam').selectOption({ label: 'Concurso de teste' });
  await page.locator('#taskDeadline').fill('2026-12-01');
  await page.locator('#saveTaskButton').click();
  await expect(page.locator('#taskModal')).toBeHidden();
  await expect(page.locator('#taskGrid')).toContainText('Concurso de teste');
  await completeMission(page, '82');
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(cloud.data.exams.find(exam => exam.name === 'Concurso de teste')).toMatchObject({ registered: true, fee: 120.5 });
  expect(cloud.data.tasks[0].examId).toBeTruthy();
  await page.reload();
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await page.locator('#currentCycleSelect').selectOption('2');
  await expect(page.locator('#taskGrid')).toContainText('Estudar redes');
  await expect(page.locator('#taskGrid')).toContainText('82%');
  await page.locator('[data-task-menu]').click();
  await page.locator('[data-action="history"]').click();
  await expect(page.locator('#historyModalBody')).toContainText('Transferência');
  await expect(page.locator('#historyModalBody')).toContainText('82%');
});

test('transferência em lote preserva acertos e moedas e o quarto ciclo não avança', async ({ page }) => {
  const data = fresh(); data.seededMissionSets = ['TCE_GO_Analise_FCC_Espacado_v1']; data.coins = 55; data.xp = 200;
  data.tasks = [{ id: 'move', title: 'Transferir missão', subject: 'TI', link: '', deadline: '2026-12-01', cycle: 2, importance: 'high', done: false, accuracyByCycle: { '1': 60 }, history: [] }];
  const cloud = await mockAccount(page, { initial: data });
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#settingsButton').click();
  await page.locator('#moveCycleFrom').selectOption('2');
  await page.locator('#moveCycleTo').selectOption('4');
  await page.locator('#moveCycleButton').click();
  await expect(page.locator('#cycleModal')).toBeHidden();
  await page.locator('#currentCycleSelect').selectOption('4');
  await expect(page.locator('#taskGrid')).toContainText('60%');
  await completeMission(page, '100');
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(cloud.data.tasks[0]).toMatchObject({ cycle: 4, deadline: '', done: true, accuracyByCycle: { '1': 60, '4': 100 } });
  expect(cloud.data.tasks[0].history[0]).toMatchObject({ type: 'cycle_transfer', from: 2, to: 4, previousDeadline: '2026-12-01' });
  expect(cloud.data.coins).toBe(70); expect(cloud.data.xp).toBe(200);
  await page.reload();
  await expect(page.locator('#currentCycleSelect')).toHaveValue('4');
  await expect(page.locator('#cycleProgressValue')).toHaveText('100%');
});

test('login continua disponível e concurso padrão excluído não reaparece', async ({ page }) => {
  await mockAccount(page);
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await page.locator('[data-view="exams"]').click();
  await expect(page.locator('#currentExam')).toContainText('TCE Goiás');
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#currentExam [data-exam-action="delete"]').click();
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  await page.reload();
  await page.locator('[data-view="exams"]').click();
  await expect(page.locator('#examCount')).toHaveText('0');
  await page.route('**/api/session', route => route.fulfill({ status: 401, json: { error: 'Entre com GitHub.' } }));
  await page.route('**/api/auth/login', route => route.fulfill({ contentType: 'text/plain', body: 'Iniciando OAuth' }));
  await page.reload();
  await page.locator('#ghLoginBtn').click();
  await expect(page).toHaveURL(/\/api\/auth\/login$/);
});
