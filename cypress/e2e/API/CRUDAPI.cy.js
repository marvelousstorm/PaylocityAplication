const URL = Cypress.env('baseURL')
const username = Cypress.env('username')
const password = Cypress.env('password')
const env = Cypress.env('platform')
let firstName, lastName, dependants
describe('CRUD API test', { tags: ['@smoke', '@API'] }, () => {
    before(() => {
        cy.fixture('test_data.json').then((test_data) => {
            let testD = (env === 'stage') ? test_data.stage.CRUD : test_data.production.CRUDAPI
            firstName = testD.employee.firstName
            lastName = testD.employee.lastName
            dependants = testD.employee.dependants
        })
    })

    it('Succesfull POST employee', { cases: [2] }, () => {
        cy.request({
            method: 'POST',
            url: `${URL}Prod/api/employees`,
            body: {
                firstName: firstName,
                lastName: lastName,
                dependants: dependants
            },
            headers: {
                'Content-type': 'application/json',
                'Authorization': Cypress.env('authorizationCode')
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.dependants).to.eq(parseInt(dependants))
            expect(response.body.firstName).to.eq(firstName);
            expect(response.body.lastName).to.eq(lastName);
            cy.wrap(response.body.id).as('uniqueEmployeeID')
        });
        cy.get('@uniqueEmployeeID').then((uniqueEmployeeID => {
            cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
                let testD = (env === 'stage') ? data.stage.CRUDAPI : data.production.CRUDAPI
                testD.employeeId = uniqueEmployeeID
                cy.writeFile('cypress/fixtures/shared_data.json', data);
            });
        }))
    })
    it('Succesfull GET employee', { cases: [2] }, () => {
        cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
            let testD = (env === 'stage') ? data.stage.CRUDAPI : data.production.CRUDAPI
            cy.wrap(testD.employeeId).as('employeeId')
        });
        cy.get('@employeeId').then((createdEmployeeID) => {
            cy.request({
                method: 'GET',
                url: `${URL}Prod/api/employees/${createdEmployeeID}`,
                headers: {
                    'Authorization': Cypress.env('authorizationCode')
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.dependants).to.eq(parseInt(dependants))
                expect(response.body.firstName).to.eq(firstName);
                expect(response.body.lastName).to.eq(lastName);
                expect(response.body.id).to.eq(createdEmployeeID)
            });
        })
    })
    it('Succesfull UPDATE employee', { cases: [2] }, () => {
        cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
            let testD = (env === 'stage') ? data.stage.CRUDAPI : data.production.CRUDAPI
            cy.wrap(testD.employeeId).as('employeeId')
        });
        cy.get('@employeeId').then((createdEmployeeID) => {
            cy.request({
                method: 'PUT',
                url: `${URL}Prod/api/employees`,
                body: {
                    id: createdEmployeeID,
                    firstName: `${firstName}Edited`,
                    lastName: `${lastName}Edited`,
                    dependants: parseInt(dependants)+1
                },
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': Cypress.env('authorizationCode')
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.dependants).to.eq(parseInt(dependants)+1)
                expect(response.body.firstName).to.eq( `${firstName}Edited`);
                expect(response.body.lastName).to.eq(`${lastName}Edited`);
                expect(response.body.id).to.eq(createdEmployeeID)
            });
        })
    })
    it('Succesfull DELETE employee', { cases: [2] }, () => {
        cy.readFile('cypress/fixtures/shared_data.json').then((data) => {
            let testD = (env === 'stage') ? data.stage.CRUDAPI : data.production.CRUDAPI
            cy.wrap(testD.employeeId).as('employeeId')
        });
        cy.get('@employeeId').then((createdEmployeeID) => {
            cy.request({
                method: 'DELETE',
                url: `${URL}Prod/api/employees/${createdEmployeeID}`,
                headers: {
                    'Authorization': Cypress.env('authorizationCode')
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
            cy.request({
                method: 'GET',
                url: `${URL}Prod/api/employees/${createdEmployeeID}`,
                headers: {
                    'Authorization': Cypress.env('authorizationCode')
                }
            }).then((response) => {
                // This assert will be commented until BUG-0007 is solved
                // expect(response.status).to.eq(404);
            });
        })
    })
})