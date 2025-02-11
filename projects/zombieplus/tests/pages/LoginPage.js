import { expect } from '@playwright/test'

export class LoginPage {
    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000/admin/login')
        const loginForm = this.page.locator('.login-form')
        await expect(loginForm).toBeVisible()
    }

    async do(email, password) {
        await this.visit()
        await this.submit(email, password)
    }

    async submit(email, password) {
        await this.page.getByPlaceholder('E-mail').fill(email)
        await this.page.getByPlaceholder('Senha').fill(password)
        //await this.page.getByText('Entrar').click()

        //usando XPath como exemplo
        await this.page.locator('//button[text()="Entrar"]').click()
    }

    async toastHaveText(message) {
        const toast = this.page.locator('.toast')
        await expect(toast).toHaveText(message)
        await expect(toast).not.toBeVisible({ timeout: 5000 })
    }

    async alertHaveText(message) {
        const alert = this.page.locator('span[class$=alert]')
        await expect(alert).toHaveText(message)
    }
}