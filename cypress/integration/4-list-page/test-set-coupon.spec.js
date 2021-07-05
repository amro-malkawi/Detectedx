/// <reference types="cypress" />

const apiHost = Cypress.env('apiUrl')
const apiCouponInfo = {
    method: 'GET',
    url: `${apiHost}/coupons/**`,
}

context('Test Set Coupon', () => {
    describe('Expect to get response of invalid code', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
        })
        it('can popup modal, and allow user to add test set coupon', () => {
            cy.getBySel('test-set-coupon-button').click()
            cy.getBySel('coupon-code-input').click()
                .type(Cypress.env('test_set_coupon_invalid_code'))
                .should('have.value', Cypress.env('test_set_coupon_invalid_code'))
            cy.intercept({
                method: apiCouponInfo.method,
                url: apiCouponInfo.url,
            }).as("couponInfo");
            cy.getBySel('test-set-verify-button').click()
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
            cy.getBySel('test-set-coupon-button').click()
            cy.getBySel('coupon-code-input').click()
                .type(Cypress.env('test_set_coupon_valid_code'))
                .should('have.value', Cypress.env('test_set_coupon_valid_code'))
            cy.intercept({
                method: apiCouponInfo.method,
                url: apiCouponInfo.url,
            }).as("couponInfo");
            cy.getBySel('test-set-verify-button').click()
            cy.wait('@couponInfo').then((interception) => {
                const { statusCode, body } = interception.response;
                expect(statusCode).to.equal(200)
                expect(body).to.deep.contains({ valid: true })
            })
        })
    })
})