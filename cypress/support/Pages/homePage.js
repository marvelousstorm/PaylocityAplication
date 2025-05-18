class HomePage {
    getHeader() {
        return cy.get('header a', { timeout: 15000 })
    }
    getAddEmployeeButton() {
        return cy.get('button[id="add"]', { timeout: 15000 })
    }
    getEmployeeRow(employeeID) {
        return cy.get(`#employeesTable tbody tr:contains("${employeeID}")`, { timeout: 15000 })
    }
    getEmployeeEditButton(employeeID) {
        return cy.get(`#employeesTable tbody tr:contains("${employeeID}") i.fas.fa-edit`, { timeout: 15000 })
    }
    getEmployeeDeleteButton(employeeID) {
        return cy.get(`#employeesTable tbody tr:contains("${employeeID}") i.fas.fa-times`, { timeout: 15000 })
    }
    //Add Employee selectors
    getAddEmployeeTitle() {
        return cy.get('.modal-content h5:visible', { timeout: 15000 })
    } 
    getAddFirstNameInput() {
        return cy.get('input#firstName', { timeout: 15000 })
    }
    getAddLastNameInput() {
        return cy.get('input#lastName', { timeout: 15000 })
    }
    getAddDependentsInput() {
        return cy.get('input#dependants', { timeout: 15000 })
    }
    getAddButton() {
        return cy.get('button#addEmployee', { timeout: 15000 })
    }
    //Update employee selectors
    getUpdateEmployeeTitle() {
        return cy.get('.modal-content h5:visible', { timeout: 15000 })
    } 
    getUpdateFirstNameInput() {
        return cy.get('input#firstName', { timeout: 15000 })
    }
    getUpdateLastNameInput() {
        return cy.get('input#lastName', { timeout: 15000 })
    }
    getUpdateDependentsInput() {
        return cy.get('input#dependants', { timeout: 15000 })
    }
    getUpdateButton() {
        return cy.get('button#updateEmployee', { timeout: 15000 })
    }
    //Delete employee selectors
    getDeleteEmployeeTitle() {
        return cy.get('.modal-content h5:visible', { timeout: 15000 })
    } 
    getDeleteEmployeeMesage() {
        return cy.get('.modal-content div[class^="col-sm"]:visible', { timeout: 15000 })
    }
    getDeleteEmployeeButton() {
        return cy.get('button#deleteEmployee', { timeout: 15000 })
    }
    //Functions
    normalizeWhitespace(str) {
        return str.replace(/\s+/g, ' ').trim();
    }
}
export default HomePage