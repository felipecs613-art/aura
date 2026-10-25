import { test, expect } from '@playwright/test';
import { emptyState } from '../../shared/state.js';

test.use({ timezoneId: 'America/Sao_Paulo' });
test('previsão usa pendentes reais, não muda com busca e atualiza após conclusão', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-25T15:00:00Z'));
  let data = { ...emptyState(), currentCycle: 1, tceGoSeeded: true, seededMissionSets: ['TCE_GO_Analise_FCC_Espacado_v1'], tasks: Array.from({ length: 4 }, (_, i) => ({ id: `task-${i}`, title: `Missão ${i}`, cycle: 1, done: false, importance: 'medium', subject: 'TI', link: '', deadline: '', createdAt: '', updatedAt: '' })) };
  let writes = 0;
  await page.route('**/api/session', route => route.fulfill({ json: { user: { id: 1, login: 'alice' } } }));
  await page.route('**/api/data', route => {
    if (route.request().method() === 'POST') { data = route.request().postDataJSON().data; writes++; }
    return route.fulfill({ json: { data, revision: `r${writes}` } });
  });
  await page.goto('/');
  const badge = page.locator('#cycleCompletionEstimate');
  await expect(badge).toHaveText('Previsão: 26/10/2026');
  await page.locator('#searchInput').fill('Missão 0');
  await expect(page.locator('#visibleTaskCount')).toHaveText('1');
  await expect(badge).toHaveText('Previsão: 26/10/2026');
  await page.locator('[data-toggle-task]').click();
  await page.locator('#completionAccuracy').fill('80');
  await page.locator('#confirmCompletionButton').click();
  await expect(badge).toHaveText('Previsão: 25/10/2026');
  await page.locator('#searchInput').fill('');
  await page.getByRole('button', { name: 'Próximo ciclo', exact: true }).click();
  await expect(badge).toBeHidden();
  await page.getByRole('button', { name: 'Ciclo atual', exact: true }).click();
  await expect(badge).toBeVisible();
  await page.clock.setFixedTime(new Date('2026-10-26T15:00:00Z'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(badge).toHaveText('Previsão: 26/10/2026');
});
