import LogInPage from "../../support/Pages/loginPage"
import HomePage from "../../support/Pages/homePage"

const loginPage = new LogInPage()
const homePage = new HomePage()
describe('Login tests', { tags: ['@smoke'], cases: [1] }, () => {
    beforeEach(() => {
        cy.visit(`${Cypress.env('baseURL')}Prod/Account/Login`)
    })

    it('Valid login', {cases: [1] }, () => {
        loginPage.getUsernameInput().should('be.visible').type(Cypress.env('username'));
        loginPage.getPasswordInput().should('be.visible').type(Cypress.env('password'));
        cy.intercept('GET','/Prod/api/employees').as('getEmployeeAPI')
        loginPage.getLogInButton().should('be.visible').click();
        cy.wait('@getEmployeeAPI').its('response.statusCode').should('eq',200)
        homePage.getHeader().should('be.visible').and('exist').invoke('text').then((titleText) => {
            expect(titleText.trim()).to.include('Paylocity Benefits Dashboard')
        })
    })
    //This test will be skipped until BUG-0001 is solved
    it.skip('Invalid login', {cases: [2] }, () => {
        loginPage.getUsernameInput().should('be.visible').type('wrongUsername');
        loginPage.getPasswordInput().should('be.visible').type('wrongPassword');
        loginPage.getLogInButton().should('be.visible').click();
        loginPage.getLoginErrorMessage().should('be.visible').and('exist').invoke('text').then((failedLoginText) => {
            expect(failedLoginText.trim()).to.contain('Username and password do not match any user in this service')
        })
    })
})