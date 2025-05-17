class LogInPage{
    getUsernameInput() {
        return cy.get('#Username',{timeout:15000})
    }
    getPasswordInput() {
        return cy.get('#Password',{timeout:15000})
    }
    getLogInButton() {
        return cy.get('button[type="submit"]',{timeout:15000})
    }
    getLoginErrorMessage() {
        return cy.get('h3[data-test="error"]',{timeout:15000})
    }
}
export default LogInPage