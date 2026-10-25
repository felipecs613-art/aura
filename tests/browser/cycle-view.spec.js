import { test, expect } from '@playwright/test';
import { emptyState } from '../../shared/state.js';

test('alterna entre ciclo atual e próximo, ordena Z–A e respeita o último ciclo', async ({ page }) => {
  const task = (id, title, cycle, done = false) => ({ id, title, cycle, done, subject: 'TI', importance: 'medium', link: '', deadline: '', createdAt: '', updatedAt: '' });
  let data = { ...emptyState(), currentCycle: 2, tceGoSeeded: true, seededMissionSets: ['TCE_GO_Analise_FCC_Espacado_v1'], tasks: [task('current', 'Missão atual', 2), task('finished', 'Concluída atual', 2, true), task('a', 'Alfa', 3), task('z', 'Zebra', 3), task('m', 'Média', 3), task('four', 'Última', 4)] };
  let writes = 0;
  await page.route('**/api/session', route => route.fulfill({ json: { user: { id: 1, login: 'alice', name: 'Alice' } } }));
  await page.route('**/api/data', route => {
    if (route.request().method() === 'POST') { data = route.request().postDataJSON().data; writes++; }
    return route.fulfill({ json: { data, revision: `r${writes}` } });
  });
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await expect(page.locator('.task-title')).toHaveText(['Concluída atual', 'Missão atual']);
  await expect(page.locator('#cycleProgressFoot')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Pendentes', exact: true })).toHaveCount(0);
  await page.locator('#sortSelect').selectOption('oldest');
  await page.getByRole('button', { name: 'Próximo ciclo', exact: true }).click();
  await expect(page.locator('.task-title')).toHaveText(['Zebra', 'Média', 'Alfa']);
  await expect(page.locator('#sortSelect')).toHaveValue('title-desc');
  await expect(page.locator('#sortSelect')).toBeDisabled();
  await expect(page.locator('#currentCycleSelect')).toHaveValue('2');
  await expect(page.locator('#taskCycleHeading')).toHaveText('Missões do próximo ciclo');
  expect(writes).toBe(0);
  await page.locator('#searchInput').fill('Alfa');
  await expect(page.locator('.task-title')).toHaveText(['Alfa']);
  await page.locator('#searchInput').fill('');
  await page.locator('#dockAddButton').click();
  await expect(page.locator('#taskCycle')).toHaveValue('3');
  await page.locator('[data-close="taskModal"]').first().click();
  await page.getByRole('button', { name: 'Ciclo atual', exact: true }).click();
  await expect(page.locator('#sortSelect')).toHaveValue('oldest');
  await expect(page.locator('#sortSelect')).toBeEnabled();
  await expect(page.locator('.task-title')).toHaveCount(2);
  await page.locator('#currentCycleSelect').selectOption('4');
  await expect(page.getByRole('button', { name: 'Próximo ciclo', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Ciclo atual', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.task-title')).toHaveText(['Última']);
});
