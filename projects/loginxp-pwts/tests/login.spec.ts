import { test, expect } from '@playwright/test';

test('Deve logar com sucesso', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('admin@zombieplus.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('pwd123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('navigation')).toContainText('Olá, Admin');
});

test('credencias inválidas', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login');
  await page.getByRole('textbox', { name: 'E-mail' }).fill('adrianolegal@gmail.com');
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.locator('#swal2-html-container')).toContainText('Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.');
});

test('Não deve permitir quando as credenciasi n~]ao são informadas', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.locator('form')).toContainText('Campo obrigatório');
  await expect(page.locator('form')).toContainText('Campo obrigatório');
});
