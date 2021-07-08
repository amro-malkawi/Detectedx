context('Modality Description', () => {
    describe('Expect to see the modality description', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('should see the modality description', () => {
            cy.getBySel('modality-desc-text').should('exist')
        })
    })
})