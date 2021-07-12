/// <reference types="cypress" />

let log = console.log
context('List Page', () => {
    describe('Expect to see the list page functional', () => {
        before(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact();
        })
        it('should be able to get current state', () => {
            cy.wait(500);
            cy.getReact('List', {options: {timeout: 5000}}).nthNode(2).getCurrentState()
        })
        it('should be able to click on modality tab, and see modality description', () => {
            cy.getBySel('modality-tab-item').each(($el, index, $list) => {
                cy.wrap($el).click().should('exist');
                cy.wait(500)
                cy.getBySel('modality-desc-text').should('exist')
            })
        })
        it('should be able to click the instruction button and see instruction text', () => {
            cy.getBySel('modality-tab-item').each(($el, index, $list) => {
                cy.wait(500)
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
                            cy.get('.MuiDialogContent-root').scrollTo('bottom', { duration: 1000 })
                            cy.wait(1000)
                            cy.get('.MuiDialogActions-root > div > .text-white')
                                .click()
                                .should('not.exist')
                        }
                    }
                })
            })
        })
        it('should see the instruction video and able to play', () => {
            cy.wait(1000)
            cy.getBySel('instruction-video').each((value) => {
                cy.wrap(value).click({force: true}).should('exist')
                cy.wait(4500)
                cy.get('.video-close-button > .zmdi').click().should('not.exist')
            })
        })
        it('should see the modality test set', () => {
            cy.getBySel('test-set').each((value) => {
                cy.wait(200)
                cy.get(value).scrollIntoView().should('exist')
            })
        })
    })
})