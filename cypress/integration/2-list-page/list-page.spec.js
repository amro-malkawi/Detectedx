const apiHost = Cypress.env('apiUrl')
const apiCouponInfo = {
    method: 'GET',
    url: `${apiHost}/coupons/**`,
}
import { loginWithEmailPasswordWithCookiesPreserved } from '../../support/common/functions/index'
context('List Page', () => {
    describe('Expect to see the list page functional', () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
            cy.visit('/app/test/list')
            cy.waitForReact();
        })
        it('should be able to get current state', () => {
            cy.wait(500);
            cy.getReact('List', { options: { timeout: 5000 } }).nthNode(2).getCurrentState()
        })
        it('should be able to click on modality tab, and see modality description', () => {
            cy.getBySel('modality-tab-item').each(($el, index, $list) => {
                cy.wrap($el).click().should('exist');
                cy.wait(500)
                cy.getBySel('modality-desc-text').should('exist')
                cy.getBySel('test-set').each((value) => {
                    // cy.wait(1)
                    cy.get(value).scrollIntoView().should('exist')
                })
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
                cy.wrap(value).click({ force: true }).should('exist')
                cy.wait(4500)
                cy.get('.video-close-button > .zmdi').click().should('not.exist')
            })
        })
    })
})

context('Test Set Coupon', () => {
    describe('Expect to get response of invalid code', () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
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
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
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