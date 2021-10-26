import { loginWithEmailPasswordWithCookiesPreserved } from "../../support/common/functions"

const apiHost = Cypress.env('apiUrl')
const apiUpdateInfo = {
    method: 'POST',
    url: `${apiHost}/users/**`,
}
const apiChangePassword = {
    method: 'POST',
    url: `${apiHost}/users/change-password*`,
}

function waitBetweenTestSuite() {
    const millisec = 2000
    return cy.wait(millisec)
}

function onClickChangePassword() {
    cy.intercept({
        method: apiChangePassword.method,
        url: apiChangePassword.url,
    }).as("changePasswordResponse");
    cy.getBySel('confirm-change-password-button').click()
    cy.wait('@changePasswordResponse').its('response.statusCode').should('eq', 204)
}

function onClickUpdateProfile() {
    cy.intercept({
        method: apiUpdateInfo.method,
        url: apiUpdateInfo.url,
    }).as("updateInfo");
    cy.getBySel('update-profile').click()
    cy.wait('@updateInfo').its('response.statusCode').should('eq', 200)
}

context('User Page', () => {
    describe('Expect to see personal information', () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
            cy.visit('/app/test/profile')
            cy.waitForReact()
        })
        afterEach(() => {
            waitBetweenTestSuite();
        })
        it('should be able to change password', () => {
            cy.getBySel('change-password-button').click().should('exist')
            const input = {
                current_password: Cypress.env('test_user_page_current_password'),
                new_password: Cypress.env('test_user_page_new_password'),
                confirm_new_password: Cypress.env('test_user_page_confirm_new_password')
            }
            cy.getBySel('current-password').clear().type(input.current_password)
            cy.getBySel('new-password').clear().type(input.new_password)
            cy.getBySel('confirm-password').clear().type(input.confirm_new_password)
            onClickChangePassword()
        })
        it('should be able to read and update personal information', () => {
            cy.get('#first-name')
                .clear()
                .type(Cypress.env('test_user_page_first_name'))
                .should('have.value', Cypress.env('test_user_page_first_name'))
            cy.get('#last-name')
                .clear()
                .type(Cypress.env('test_user_page_last_name'))
                .should('have.value', Cypress.env('test_user_page_last_name'))
            onClickUpdateProfile()
        })
        it('should be able to read and update address information', () => {
            const input = {
                country: Cypress.env('test_user_page_address_country'),
                address1: Cypress.env('test_user_page_address_line_1'),
                address2: Cypress.env('test_user_page_address_line_2'),
                suburb: Cypress.env('test_user_page_address_suburb'),
                state: Cypress.env('test_user_page_address_state'),
                postcode: Cypress.env('test_user_page_address_postcode'),
            }
            cy.getBySel('expand-address-info', { timeout: 5000 }).click().should('exist')
            cy.getBySel('form-address-info-country').type(`{backspace}${input.country}{enter}`)
            cy.getBySel('form-address-info-address-line1').clear().type(input.address1)
            cy.getBySel('form-address-info-address-line2').clear().type(input.address2)
            cy.getBySel('form-address-info-address-suburb').clear().type(input.suburb)
            cy.getBySel('form-address-info-address-state').clear().type(input.state)
            cy.getBySel('form-address-info-address-postcode').clear().type(input.postcode)
            cy.getReact('Profile').getCurrentState().then((state) => {
                const { userInfo } = state
                expect(userInfo.country).to.equal(input.country)
                expect(userInfo.address1).to.equal(input.address1)
                expect(userInfo.address2).to.equal(input.address2)
                expect(userInfo.suburb).to.equal(input.suburb)
                expect(userInfo.state).to.equal(input.state)
                expect(userInfo.postcode).to.equal(input.postcode)
                onClickUpdateProfile()
            })
        })
        it('should be able to read and update additional information', () => {
            cy.getBySel('expand-additional-info', { timeout: 5000 }).click().should('exist')
            const input = {
                places_of_work: Cypress.env('test_user_page_additional_places_of_work'),
                position: Cypress.env('test_user_page_additional_position'),
                interests: Cypress.env('test_user_page_additional_interests'),
                referred_by: Cypress.env('test_user_page_additional_referred_by'),
                extra_info: Cypress.env('test_user_page_additional_extra_info')
            }
            cy.getBySel('form-additional-info-places-of-work').type(`{backspace}${input.places_of_work}{enter}`)
            cy.getBySel('form-additional-info-position').type(`{backspace}${input.position}{enter}`)
            cy.getBySel('form-additional-info-interests').type(`{backspace}${input.interests}{enter}`)
            cy.getBySel('form-additional-info-referred_by').clear().type(`${input.referred_by}`)
            cy.getBySel('form-additional-info-extra-info').clear().type(`${input.extra_info}`)
            onClickUpdateProfile()
        })
    })
})