const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../pages/LoginPage')
const { Popup } = require('../pages/Components')
const { MoviesPage } = require('../pages/MoviesPage')

let loginPage
let popup
let moviesPage

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    popup = new Popup(page)
    moviesPage = new MoviesPage(page)
})

test('Deve logar como admin', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn('Admin')
})

test('Não deve logar com senha incorreta', async ({ page }) => {
    const message = 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'abc123')
    await popup.haveText(message)
})

test('Não deve logar quando email não informado', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('', 'abc123')
    await loginPage.alertHaveText('Campo obrigatório')
})

test('Não deve logar quando email é inválido', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('www.invalido.com', 'abc123')
    await loginPage.alertHaveText('Email incorreto')
})

test('Não deve logar quando a senha não é informada', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('adrianoadmin@gmail.com', '')
    await loginPage.alertHaveText('Campo obrigatório')
})

test('Não deve logar quando nenhum campo é informado', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('', '')
    await loginPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})