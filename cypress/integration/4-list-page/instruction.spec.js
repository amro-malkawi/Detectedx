/// <reference types="cypress" />

context('Instruction', () => {
    describe('Expect to see the instruction detail', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('should see the instruction', () => {
            cy.getBySel('instruction-button').first().click().should('exist')
        })
    })
})