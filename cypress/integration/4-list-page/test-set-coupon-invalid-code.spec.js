/// <reference types="cypress" />

const apiHost = Cypress.env('apiUrl')
const apiCouponInfo = {
    method: 'GET',
    url: `${apiHost}/coupons/**`,
    statusCode: 200,
}

context('Test Set Coupon', () => {
    describe('Expect to get response of invalid code', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('can popup modal, and allow user to add test set coupon', () => {
            cy.get('.test-set-coupon > .MuiButtonBase-root > .MuiButton-label')
                .click()
            cy.get('#couponCode')
                .type(Cypress.env('test_set_coupon_invalid_code'))
                .should('have.value', Cypress.env('test_set_coupon_invalid_code'))
            cy.intercept({
                method: apiCouponInfo.method,
                url: apiCouponInfo.url,
            }).as("couponInfo");
            cy.get('.test-set-coupon-info > :nth-child(3) > .MuiButtonBase-root')
                .click()
            cy.wait('@couponInfo').then((interception) => {
                const { statusCode, body } = interception.response;
                expect(statusCode).to.equal(200)
                expect(body).to.deep.contains({ valid: false })
            })
        })
    })
    describe('Expect to get response of valid code', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('can popup modal, and allow user to add test set coupon', () => {
            cy.get('.test-set-coupon > .MuiButtonBase-root > .MuiButton-label')
                .click()
            cy.get('#couponCode')
                .type(Cypress.env('test_set_coupon_valid_code'))
                .should('have.value', Cypress.env('test_set_coupon_valid_code'))
            cy.intercept({
                method: apiCouponInfo.method,
                url: apiCouponInfo.url,
            }).as("couponInfo");
            cy.get('.test-set-coupon-info > :nth-child(3) > .MuiButtonBase-root')
                .click()
            cy.wait('@couponInfo').then((interception) => {
                const { statusCode, body } = interception.response;
                expect(statusCode).to.equal(200)
                expect(body).to.deep.contains({ valid: true })
            })
        })
    })
})