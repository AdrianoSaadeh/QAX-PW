const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../pages/LoginPage')

let loginPage

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
})

test('Deve logar como admin', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await loginPage.isLoggedIn()
})