/// <reference types="cypress" />

context('Instruction Video', () => {
    describe('Expect to see the instruction video', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('should see the instruction video', () => {
            cy.getBySel('instruction-video').first().click().should('exist')
        })
    })
})