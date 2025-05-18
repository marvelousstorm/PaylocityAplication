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
            let testD = (env === 'stage') ? test_data.stage.CRUD : test_data.production.CRUD
            firstName = testD.employee.firstName
            lastName = testD.employee.lastName
            dependants = testD.employee.dependants
        })
    })
    beforeEach(() => {
        cy.login(URL, username, password)
    })

    it('Create employee', { cases: [2] }, () => {
        homePage.getAddEmployeeButton().should('be.visible').click()
        homePage.getAddEmployeeTitle().should('be.visible').invoke('text').then((addEmployeeTitle) => {
            expect(addEmployeeTitle.trim()).to.eq('Add Employee')
        })
        homePage.getAddFirstNameInput().type(firstName)
        homePage.getAddLastNameInput().type(lastName)
        homePage.getAddDependentsInput().type(dependants)
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
                let testD = (env === 'stage') ? data.stage.CRUD : data.production.CRUD
                testD.employeeId = uniqueEmployeeID
                cy.writeFile('cypress/fixtures/shared_data.json', data);
            });
        }))
    })
    it('Edit employee', { cases: [3] }, () => {
        cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
            let testD = (env === 'stage') ? data.stage.CRUD : data.production.CRUD
            cy.wrap(testD.employeeId).as('employeeId')
        });
        cy.get('@employeeId').then((createdEmployeeID) => {
            homePage.getEmployeeEditButton(createdEmployeeID).should('exist').click()
            //The next assertion will be commented until BUG-0006 is solved
            // homePage.getAddEmployeeTitle().should('be.visible').invoke('text').then((updateEmployeeTitle) => {
            //     expect(updateEmployeeTitle.trim()).to.eq('Update Employee')
            // })
            homePage.getUpdateFirstNameInput().clear().type(firstName + 'Edited')
            homePage.getUpdateLastNameInput().clear().type(lastName + 'Edited')
            homePage.getUpdateDependentsInput().clear().type(parseInt(dependants) + 1)
            cy.intercept('PUT', '/Prod/api/employees').as('updateEmployeeAPI')
            homePage.getUpdateButton().click()
            cy.wait('@updateEmployeeAPI').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                expect(interception.response.body.dependants).to.eq(parseInt(dependants)+1)
                expect(interception.response.body.firstName).to.eq(firstName + 'Edited');
                expect(interception.response.body.lastName).to.eq(lastName + 'Edited');
                expect(interception.response.body.id).to.eq(createdEmployeeID)
            })
            homePage.getEmployeeRow(createdEmployeeID).find('td:nth-child(2)').invoke('text').should('eq',firstName + 'Edited')
            homePage.getEmployeeRow(createdEmployeeID).find('td:nth-child(3)').invoke('text').should('eq',lastName + 'Edited')
            homePage.getEmployeeRow(createdEmployeeID).find('td:nth-child(4)').invoke('text').should('include',parseInt(dependants)+1)

        })
    })
    it('Delete employee', { cases: [4] }, () => {
        cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
            let testD = (env === 'stage') ? data.stage.CRUD : data.production.CRUD
            cy.wrap(testD.employeeId).as('employeeId')
        });
        cy.get('@employeeId').then((createdEmployeeID) => {
            homePage.getEmployeeDeleteButton(createdEmployeeID).should('exist').click()
            homePage.getDeleteEmployeeTitle().should('be.visible').invoke('text').then((updateEmployeeTitle) => {
                expect(updateEmployeeTitle.trim()).to.eq(`Delete Employee`)
            })
            homePage.getDeleteEmployeeMesage().should('be.visible').invoke('text').then((adivsoryMessage)=>{
                expect(homePage.normalizeWhitespace(adivsoryMessage)).to.eq(`Delete employee record for ${firstName}Edited ${lastName}Edited?`)
            })
            cy.intercept('DELETE',`Prod/api/employees/${createdEmployeeID}`).as('deleteAPI')
            homePage.getDeleteEmployeeButton().should('be.visible').click()
            cy.wait('@deleteAPI').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            })
            homePage.getEmployeeRow(createdEmployeeID).should('not.exist')

        })
    })
})