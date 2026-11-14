import { test, expect } from '@playwright/test';
import { emptyState } from '../../shared/state.js';

test('missões seguem o concurso atual nos dois ciclos e após recarregar', async ({ page }) => {
  const task = (id, examId, cycle) => ({ id, title: id, examId, cycle, done: false, subject: id, importance: 'medium', link: '', deadline: '', createdAt: '', updatedAt: '' });
  let data = { ...emptyState(), currentExamId: 'a', tceGoSeeded: true, seededMissionSets: ['TCE_GO_Analise_FCC_Espacado_v1'],
    exams: ['a', 'b', 'c'].map(id => ({ id, name: `Concurso ${id}`, board: '', fee: 0, registered: false, createdAt: '' })),
    tasks: [task('Alfa', 'a', 1), task('Beta', 'b', 1), task('Zebra', 'b', 2), task('Abelha', 'b', 2), task('Sem vínculo', '', 1)] };
  let writes = 0;
  await page.route('**/api/session', route => route.fulfill({ json: { user: { id: 1, login: 'alice' } } }));
  await page.route('**/api/data', route => {
    if (route.request().method() === 'POST') { data = route.request().postDataJSON().data; writes++; }
    return route.fulfill({ json: { data, revision: `r${writes}` } });
  });
  await page.goto('/');
  await expect(page.locator('.task-title')).toHaveText(['Alfa']);
  await page.locator('#searchInput').fill('Alfa');
  await page.locator('[data-view="exams"]').click();
  await page.locator('[data-exam-action="promote"][data-exam-id="b"]').click();
  await page.locator('[data-view="tasks"]').click();
  await expect(page.locator('.task-title')).toHaveText(['Beta']);
  await expect(page.locator('#completedFoot')).toHaveText('de 3 missões cadastradas');
  await expect(page.locator('#taskCycleDescription')).toContainText('Concurso b');
  await page.locator('#dockAddButton').click();
  await expect(page.locator('#taskExam')).toHaveValue('b');
  await page.locator('[data-close="taskModal"]').first().click();
  await page.getByRole('button', { name: 'Próximo ciclo', exact: true }).click();
  await expect(page.locator('.task-title')).toHaveText(['Zebra', 'Abelha']);
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(data.tasks).toHaveLength(5);
  await page.reload();
  await expect(page.locator('.task-title')).toHaveText(['Beta']);
  await page.locator('[data-view="exams"]').click();
  await page.locator('[data-exam-action="promote"][data-exam-id="c"]').click();
  await page.locator('[data-view="tasks"]').click();
  await expect(page.locator('.task-title')).toHaveCount(0);
  await expect(page.locator('#visibleTaskCount')).toHaveText('0');
  await page.locator('[data-view="exams"]').click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#currentExam [data-exam-action="delete"]').click();
  await page.locator('[data-view="tasks"]').click();
  await expect(page.locator('.task-title')).toHaveText(['Sem vínculo']);
});
