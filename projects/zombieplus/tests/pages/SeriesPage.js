import { expect } from '@playwright/test'

export class SeriesPage {
    constructor(page) {
        this.page = page
    }

    async goForm() {
        await this.page.locator('a[href$="admin/tvshows/register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(serie) {
        await this.goForm(serie)

        //await this.page.getByLabel('Titulo do filme').fill(serie.title)
        await this.page.getByRole('textbox', { name: 'Titulo da série' }).fill(serie.title)
        await this.page.getByLabel('Sinopse').fill(serie.overview)

        await this.page.locator('#select_company_id .react-select__indicator').click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: serie.company })
            .click()

        await this.page.locator('#select_year .react-select__indicator').click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: serie.release_year })
            .click()

        await this.page.getByRole('textbox', { name: 'Temporadas' }).fill(serie.seasons);

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + serie.cover)

        if (serie.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()
    }

    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(target)
        await this.page.locator('.actions button').click()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

    async tableHave(content) {
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }

    async removeSerie(title) {
        await this.page.getByRole('row', { name: title }).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }

}
