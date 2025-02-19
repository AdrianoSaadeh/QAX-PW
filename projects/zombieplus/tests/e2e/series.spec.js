import { expect } from '@playwright/test'
const { test } = require('../support')
const data = require('../support/fixtures/series.json')
const { executeSQL } = require('../support/database')
const { SeriesPage } = require('../pages/SeriesPage')

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM public.tvshows;`)
})

test('Deve poder cadastrar uma nova série gerado com codegen', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('textbox', { name: 'E-mail' }).fill('admin@zombieplus.com');
    await page.getByRole('textbox', { name: 'Senha' }).fill('pwd123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.getByRole('link', { name: 'Séries de TV' }).click();
    await page.getByRole('link').filter({ hasText: /^$/ }).click();

    await page.getByRole('textbox', { name: 'Titulo da série' }).fill('Teste');
    await page.getByRole('textbox', { name: 'Sinopse' }).fill('teste Sinopse');

    await page.locator('#select_company_id svg').click();
    await page.getByText('Amazon Studios', { exact: true }).click();

    await page.locator('#select_year').click();
    await page.getByText('1980', { exact: true }).click();

    await page.getByRole('textbox', { name: 'Temporadas' }).fill('5');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.locator('#swal2-html-container')).toContainText('A série \'Teste\' foi adicionada ao catálogo.');
    await expect(page.getByText('A série \'Teste\' foi')).toBeVisible();
})

test('Deve poder cadastrar uma nova série', async ({ page }) => {
    const series = new SeriesPage(page)
    const serie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')
    await page.movies.goSeriesPage()

    await series.create(serie)
    await page.popup.haveText(`A série '${serie.title}' foi adicionada ao catálogo.`)
})

test('Deve poder remover uma série', async ({ page, request }) => {

})


test('Não deve cadastrar uma série duplicada', async ({ page, request }) => {
    const series = new SeriesPage(page)
    const serie = data.duplicate
    await request.api.postSerie(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')
    await page.movies.goSeriesPage()

    await series.create(serie)
    await page.popup.haveText(`O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('Não deve cadastrar uma série quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    const series = new SeriesPage(page)

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')
    await page.movies.goSeriesPage()

    await series.goForm()
    await series.submit()
    await series.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])

})

test('Deve realizar a busca da série pelo termo zumbi', async ({ page, request }) => {


})