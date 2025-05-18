import LogInPage from "./Pages/loginPage";
import HomePage from "./Pages/homePage";

Cypress.Commands.add("login", function (url, username, password) {
    const loginPage = new LogInPage()
    const homePage = new HomePage()
    cy.visit(url)
    loginPage.getUsernameInput().should('be.visible').type(username,{log:false});
    loginPage.getPasswordInput().should('be.visible').type(password,{log:false});
    cy.intercept('GET', '/Prod/api/employees').as('getEmployeeAPI')
    loginPage.getLogInButton().should('be.visible').click();
    cy.wait('@getEmployeeAPI').its('response.statusCode').should('eq', 200)
    homePage.getHeader().should('be.visible').and('exist').invoke('text').then((titleText) => {
        expect(titleText.trim()).to.include('Paylocity Benefits Dashboard')
    })
})