context('Score Page - Breast Mammo', () => {
    describe('Expect to see breast mammo score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').click();
            cy.get('button').contains('Scores')
                .first()
                .click({ force: true })
            cy.wait(2000)
        })
        afterEach(() => {
            cy.wait(3000)
        })
        
        it('should be able click action view', () => {
            cy.get('button').contains('View').should('exist').click()
            cy.wait(2000)
            cy.get('.rct-page').should('exist')
            cy.get('.score-circle-container').should('exist')
            cy.get('text').contains('Scores').should('exist')
        })
    })
})