const { test } = require('../support')
const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')
import { expect } from '@playwright/test'

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM public.movies;`)
})

test('Deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')

    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('Deve poder remover um filme', async ({ page, request }) => {
    const movie = data.to_remove
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')

    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')
})


test('Não deve cadastrar um filme duplicado', async ({ page, request }) => {
    const movie = data.duplicate
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')

    await page.movies.create(movie)
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('Não deve Cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')

    await page.movies.goForm()
    await page.movies.submit()
    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ])
})

test('Deve realizar a busca pelo termo zumbi', async ({ page, request }) => {
    const movies = data.search
    movies.data.forEach(async (movie) => {
        await request.api.postMovie(movie)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn('Admin')

    await page.movies.search(movies.input)
    const rows = page.getByRole('row')
    await expect(rows).toContainText(movies.outputs)
})