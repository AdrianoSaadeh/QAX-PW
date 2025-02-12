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
