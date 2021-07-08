context('Modality Description', () => {
    describe('Expect to see the modality description', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
        })
        it('should see the modality description', () => {
            cy.getReact('modality-desc-text').should('exist')
        })
    })
})