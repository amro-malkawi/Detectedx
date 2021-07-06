/// <reference types="cypress" />

describe('Test Set Coupon With Invalid Code', () => {
    beforeEach(() => {
        cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
        cy.visit('/app/test/list')
    })
    it('can popup modal, allow user to add test set coupon', () => {
        cy.get('.test-set-coupon > .MuiButtonBase-root > .MuiButton-label')
            .click()
        cy.get('#couponCode')
            .type(Cypress.env('test_set_coupon_invalid_code'))
            .should('have.value', Cypress.env('test_set_coupon_invalid_code'))
        cy.get('.test-set-coupon-info > :nth-child(3) > .MuiButtonBase-root')
            .click()
        cy.get('.test-set-coupon-error')
            .should('have.text', 'The coupon code you entered is invalid')
    })
})