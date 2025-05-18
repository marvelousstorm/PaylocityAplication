class HomePage {
    getHeader() {
        return cy.get('header a', { timeout: 15000 })
    }
    getAddEmployeeButton() {
        return cy.get('button[id="add"]', { timeout: 15000 })
    }
    getEmployeeRow(employeeID) {
        return cy.get(`#employeesTable tbody tr:contains("${employeeID}")`)
    }
    //Add Employee selectors
    getAddEmployeeTitle() {
        return cy.get('.modal-content h5:visible', { timeout: 15000 })
    } 
    getFirstNameInput() {
        return cy.get('input#firstName', { timeout: 15000 })
    }
    getLastNameInput() {
        return cy.get('input#lastName', { timeout: 15000 })
    }
    getDependentsInput() {
        return cy.get('input#dependants', { timeout: 15000 })
    }
    getAddButton() {
        return cy.get('button#addEmployee', { timeout: 15000 })
    }
}
export default HomePage