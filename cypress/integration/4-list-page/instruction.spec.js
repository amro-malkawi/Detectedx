/// <reference types="cypress" />

let log = console.log
context('Instruction', () => {
    describe('Expect to see the instruction detail', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.react('SwipeableViews')
        })

        it('should be able to click on modality tab', () => {

        })
        // it('should be able to click on modality tab', () => {
        //     cy.getBySel('modality-tab-item').each(($el, index, $list) => {
        //         cy.wrap($el).click().should('exist');
        //     })
        // })
        // it('can click instruction button see instruction text', () => {
        //     cy.getBySel('modality-tab-item').each(($el, index, $list) => {
        //         cy.wrap($el).children().contains('Instructions').click().should('exist')
        //         cy.get('.MuiDialogActions-root > div > .text-white').click().should('not.exist')
        //     })
        // })
    })
})