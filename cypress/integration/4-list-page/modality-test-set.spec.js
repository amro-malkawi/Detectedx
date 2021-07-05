context('Modality Test Set', () => {
    describe('Expect to see the modality test set', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('should see the modality test set', () => {
            cy.getBySel('test-set').should('exist')
        })
    })
})