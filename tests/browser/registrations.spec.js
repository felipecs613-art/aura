import { test, expect } from '@playwright/test';
import { emptyState, validateState } from '../../shared/state.js';

test.use({ timezoneId: 'America/Sao_Paulo' });
async function account(page, exams = []) {
  await page.clock.setFixedTime(new Date('2026-10-23T15:00:00Z'));
  let data = { ...emptyState(), exams, tceGoSeeded: true, seededMissionSets: ['TCE_GO_Analise_FCC_Espacado_v1'] }, revision = 'r1';
  await page.route('**/api/session', route => route.fulfill({ json: { user: { id: 1, login: 'alice', name: 'Alice' } } }));
  await page.route('**/api/data', route => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      expect(body.revision).toBe(revision);
      data = validateState(body.data); revision = `${revision}x`;
    }
    return route.fulfill({ json: { data, revision } });
  });
  await page.goto('/');
  await expect(page.locator('#profileName')).toHaveText('Alice');
  return { get data() { return data; } };
}

test('período e edital persistem; aviso leva ao concurso e some ao confirmar inscrição', async ({ page }) => {
  const cloud = await account(page);
  await expect(page.locator('#registrationAlerts')).toBeHidden();
  await page.locator('[data-view="exams"]').click();
  await page.locator('#newExamButton').click();
  await page.locator('#examName').fill('Concurso com prazo');
  await page.locator('#examRegistration').fill('2026-10-01');
  await page.locator('#examRegistrationEnd').fill('2026-10-30');
  await page.locator('#examNoticeUrl').fill('https://example.com/edital.pdf');
  await page.locator('#examDate').fill('2027-01-17');
  await page.locator('#saveExamButton').click();
  await expect(page.locator('#examModal')).toBeHidden();
  await expect(page.locator('#currentExam a')).toHaveAttribute('href', 'https://example.com/edital.pdf');
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  expect(cloud.data.exams[0]).toMatchObject({ registrationStartDate: '2026-10-01', registrationEndDate: '2026-10-30', noticeUrl: 'https://example.com/edital.pdf' });
  await page.reload();
  await expect(page.locator('#registrationAlerts')).toBeVisible();
  await expect(page.locator('#registrationAlerts')).toContainText('Faltam 7 dias');
  await page.locator('[data-registration-exam]').click();
  await expect(page.locator('#examsView')).toBeVisible();
  await page.locator('[data-exam-action="edit"]').click();
  await expect(page.locator('#examRegistrationEnd')).toHaveValue('2026-10-30');
  await expect(page.locator('#examNoticeUrl')).toHaveValue('https://example.com/edital.pdf');
  await page.locator('[data-close="examModal"]').first().click();
  await page.locator('[data-exam-action="toggle-registration"]').click();
  await page.locator('[data-view="tasks"]').click();
  await expect(page.locator('#registrationAlerts')).toBeHidden();
  await expect(page.locator('#syncIndicator')).toHaveText('Sincronizado');
  await page.reload();
  await expect(page.locator('#profileName')).toHaveText('Alice');
  await expect(page.locator('#registrationAlerts')).toBeHidden();
});

test('somente prazos elegíveis aparecem, inclusive concursos do radar e último dia', async ({ page }) => {
  const base = { board: '', registrationDate: '2026-10-01', registrationStartDate: '2026-10-01', fee: '', examDate: '2027-01-17', registered: false, createdAt: '' };
  await account(page, [
    { ...base, id: 'today', name: 'Último dia', registrationEndDate: '2026-10-23' },
    { ...base, id: 'seven', name: 'No radar', registrationEndDate: '2026-10-30' },
    { ...base, id: 'eight', name: 'Oito dias', registrationEndDate: '2026-10-31' },
    { ...base, id: 'registered', name: 'Já inscrito', registrationEndDate: '2026-10-24', registered: true },
    { ...base, id: 'expired', name: 'Encerrado', registrationEndDate: '2026-10-22' },
  ]);
  await expect(page.locator('.registration-alert-row')).toHaveCount(2);
  await expect(page.locator('#registrationAlerts')).toContainText('hoje!');
  await expect(page.locator('#registrationAlerts')).toContainText('No radar');
  await page.clock.setFixedTime(new Date('2026-10-31T15:00:00Z'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(page.locator('.registration-alert-row')).toHaveCount(1);
  await expect(page.locator('#registrationAlerts')).toContainText('Oito dias');
});

test('formulário rejeita período invertido e edital inválido', async ({ page }) => {
  await account(page);
  await page.locator('[data-view="exams"]').click();
  await page.locator('#newExamButton').click();
  await page.locator('#examName').fill('Concurso inválido');
  await page.locator('#examDate').fill('2027-01-17');
  await page.locator('#examRegistration').fill('2026-10-30');
  await page.locator('#examRegistrationEnd').fill('2026-10-20');
  await page.locator('#saveExamButton').click();
  await expect(page.locator('#examFormMessage')).toContainText('posterior ao início');
  await page.locator('#examRegistrationEnd').fill('2026-10-31');
  await page.locator('#examNoticeUrl').fill('javascript://example');
  await page.locator('#saveExamButton').click();
  await expect(page.locator('#examFormMessage')).toContainText('link válido');
  await expect(page.locator('#examModal')).toBeVisible();
});
