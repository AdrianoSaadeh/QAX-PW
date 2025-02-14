// @ts-check
import { test, expect } from '@playwright/test'
const { LandingPage } = require('../pages/LandingPage')
const { Popup } = require('../pages/Components')
const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')

let popup
let landingPage

test.beforeAll(async () => {
  await executeSQL('DELETE FROM public.leads;')
})

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page)
  popup = new Popup(page)
})

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName() // Amber Keebler
  const LeadEmail = faker.internet.email() // Norma13@hotmail.com
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, LeadEmail)
  await popup.haveText('Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.')
})

test('Não deve cadastrar um lead quando o email já existe', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const LeadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: LeadEmail
    }
  })
  expect(newLead.ok()).toBeTruthy()

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, LeadEmail)
  await popup.haveText('Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.')
})

test('Não deve cadastrar um lead na fila de espera com e-mail incorreto', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('Adriano Legal', 'emailincorreto.com')
  await landingPage.alertHaveText('Email incorreto')
})

test('Não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('Adriano Legal', '')
  await landingPage.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('', 'adrianolegal@gmail.com')
  await landingPage.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando email e nome não sãp preenchidos', async ({ page }) => {
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm('', '')
  await landingPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})
