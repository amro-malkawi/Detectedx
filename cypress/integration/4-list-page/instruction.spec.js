/// <reference types="cypress" />

let log = console.log
context('Instruction', () => {
    describe('Expect to see the instruction detail', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact();
        })

        it('should be able to current state', () => {
            cy.wait(500);
            cy.getReact('List', {options: {timeout: 5000}}).nthNode(2).getCurrentState()
        })
        it('should be able to click on modality tab', () => {
            cy.getBySel('modality-tab-item').each(($el, index, $list) => {
                cy.wrap($el).click().should('exist');
            })
        })

        it('can click instruction button see instruction text', () => {
            cy.getBySel('modality-tab-item').each(($el, index, $list) => {
                cy.get($el).children().each((value) => {
                    if (value[0]) {
                        const result = value[0].attributes['data-cy']
                        if (result) {
                            cy.wrap($el)
                                .children()
                                .contains('Instructions')
                                .should('have.length.at.least', 1)
                                .click()
                                .should('exist');
                            cy.wait(1000)
                            cy.get('.MuiDialogContent-root').scrollTo('bottom')
                            cy.wait(1000)
                            cy.get('.MuiDialogActions-root > div > .text-white')
                                .click()
                                .should('not.exist')
                        }
                    }
                })
            })
        })
    })
})