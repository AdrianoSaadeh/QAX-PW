import { expect } from '@playwright/test'

export class MoviesPage {
    constructor(page) {
        this.page = page
    }

    async isLoggedIn(userName) {
        // const logoutLink = this.page.locator('a[href="/logout"]')
        // await expect(logoutLink).toBeVisible()

        // await this.page.waitForLoadState('networkidle')
        // await expect(this.page).toHaveURL(/.*admin/)

        const loggerUser = this.page.locator('.logged-user')
        await expect(loggerUser).toHaveText(`Olá, ${userName}`)
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(movie) {
        await this.goForm()

        // outras formas de usar localizador abaixo
        // await this.page.locator('input[name-title]').fill(title)
        // await this.page.locator('#title').fill(title)

        await this.page.getByLabel('Titulo do filme').fill(movie.title)
        await this.page.getByLabel('Sinopse').fill(movie.overview)

        await this.page.locator('#select_company_id .react-select__indicator').click()

        //estrategia para pegar o conteudo da lista flutuante que nao pode ser inspecionada
        const html = await this.page.content()
        console.log(html)

        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.company })
            .click()


        await this.page.locator('#select_year .react-select__indicator').click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.release_year })
            .click()

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + movie.cover)

        if (movie.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

}
