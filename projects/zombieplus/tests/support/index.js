const { test: base } = require('@playwright/test')

const { LandingPage } = require('../pages/LandingPage')
const { LoginPage } = require('../pages/LoginPage')
const { Popup } = require('../pages/Components')
const { MoviesPage } = require('../pages/MoviesPage')

const { Api } = require('../support/fixtures/api')

const test = base.extend({
    page: async ({ page }, use) => {
        const context = page
        context['landing'] = new LandingPage(page),
            context['login'] = new LoginPage(page),
            context['movies'] = new MoviesPage(page),
            context['popup'] = new Popup(page)

        await use(context)
    },
    request: async ({ request }, use) => {
        const context = request
        context['api'] = new Api(request)

        await context['api'].setToken()

        await use(context)
    }
})

export { test }