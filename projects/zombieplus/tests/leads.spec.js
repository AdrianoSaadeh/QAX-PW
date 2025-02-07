// @ts-check
import { test, expect } from '@playwright/test';

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // usando XPath
  //await page.click('//button[text()= "Aperte o play... se tiver coragem"]');

  //await page.getByRole('button', { name: 'Aperte o play... se tiver coragem' });

  //estretegia com localizador do elemento com substring
  await page.getByRole('button', { name: /Aperte o play/ }).click();
  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  await page.locator('#name').fill('Adriano Legal');
  await page.locator('input[name=name]').fill('Forte');
  await page.locator('input[placeholder="Seu nome completo"]').fill('Masculo');

  await page.getByPlaceholder('Seu nome completo').fill('Booo');

  await page.locator('#email').fill('adrianolegal@gmail.com');
  await page.getByPlaceholder('Seu email principal').fill('qq@yahho.com');

  //await page.getByRole('button', { name: 'Quero entrar na fila!'}).click();
  //await page.getByText('Quero entrar na fila!').click()
  // ou mais seguro
  await page.getByTestId('modal')
    .getByText('Quero entrar na fila!').click();

  await page.waitForTimeout(5000);
})
