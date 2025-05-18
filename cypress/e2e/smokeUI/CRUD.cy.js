import HomePage from "../../support/Pages/homePage"

const homePage = new HomePage()
const URL = `${Cypress.env('baseURL')}Prod/Account/Login`
const username = Cypress.env('username')
const password = Cypress.env('password')
const env = Cypress.env('platform')
let firstName, lastName, dependants
describe('CRUD test', { tags: ['@smoke'], cases: [1] }, () => {
    before(() => {
        cy.fixture('test_data.json').then((test_data) => {
            let testD = (env === 'stage') ? test_data.stage : test_data.production.CRUD
            firstName = testD.employee.firstName
            lastName = testD.employee.lastName
            dependants = testD.employee.dependants
        })
    })
    beforeEach(() => {
        cy.login(URL, username, password)
    })

    it('Create employee', { cases: [1] }, () => {
        homePage.getAddEmployeeButton().should('be.visible').click()
        homePage.getAddEmployeeTitle().should('be.visible').invoke('text').then((addEmployeeTitle) => {
            expect(addEmployeeTitle.trim()).to.eq('Add Employee')
        })
        homePage.getFirstNameInput().type(firstName)
        homePage.getLastNameInput().type(lastName)
        homePage.getDependentsInput().type(dependants)
        cy.intercept('POST', '/Prod/api/employees').as('addEmployeeAPI')
        homePage.getAddButton().click()
        cy.wait('@addEmployeeAPI').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.dependants).to.eq(parseInt(dependants))
            expect(interception.response.body.firstName).to.eq(firstName);
            expect(interception.response.body.lastName).to.eq(lastName);
            cy.wrap(interception.response.body.id).as('uniqueEmployeeID')
        })
        cy.get('@uniqueEmployeeID').then((uniqueEmployeeID => {
            homePage.getEmployeeRow(uniqueEmployeeID).should('exist').and('be.visible')
            cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
                data.production.CRUD = {
                    employeeId: uniqueEmployeeID,
                };
                cy.writeFile('cypress/fixtures/sharedData.json', data);
            });
        }))
    })
    it('Edit employee', { cases: [1] }, () => {
        cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
            const id = data.production.CRUD.employeeId;
            cy.log(`ID: ${id}`);
        });
    })
})