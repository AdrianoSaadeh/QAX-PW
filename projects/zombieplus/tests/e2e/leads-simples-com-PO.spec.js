// @ts-check
import { test, expect } from '@playwright/test'
const { LandingPage } = require('../pages/LandingPage')
const { Toast } = require('../pages/Components')
const { faker } = require('@faker-js/faker')

let toast
let landingPage

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page)
  toast = new Toast(page)
})

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName() // Amber Keebler
  const LeadEmail = faker.internet.email() // Norma13@hotmail.com
  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.submitLeadForm(leadName, LeadEmail)
  await toast.haveText('Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!')
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
