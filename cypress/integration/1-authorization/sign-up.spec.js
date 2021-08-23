const apiHost = Cypress.env('apiUrl')
const apiSignup = {
    method: 'POST',
    url: `${apiHost}/users`
}
/// <reference types="cypress" />
describe('Sign-Up', () => {
    beforeEach(() => {
        cy.visit('/signup')
    })
    it('can displays placeholder to sign-up', () => {
        cy.get('#first_name')
            .type(Cypress.env('test_signup_first_name'))
            .should('have.value', Cypress.env('test_signup_first_name'))
        cy.get('#last_name')
            .type(Cypress.env('test_signup_last_name'))
            .should('have.value', Cypress.env('test_signup_last_name'))
        cy.get('#email')
            .type(Cypress.env('test_signup_email'))
            .should('have.value', Cypress.env('test_signup_email'))
        cy.get('#password')
            .type(Cypress.env('test_signup_password'))
            .should('have.value', Cypress.env('test_signup_password'))
        cy.get('#confirmPassword')
            .type(Cypress.env('test_signup_confirm_password'))
            .should('have.value', Cypress.env('test_signup_confirm_password'))
        cy.get('#country')
            .select(Cypress.env('test_signup_country'))
            .should('have.value', Cypress.env('test_signup_country'))
        cy.get('#state')
            .type(Cypress.env('test_signup_state'))
            .should('have.value', Cypress.env('test_signup_state'))
        cy.get('#postcode')
            .type(Cypress.env('test_signup_postcode'))
            .should('have.value', Cypress.env('test_signup_postcode'))
        cy.get('#position')
            .select(Cypress.env('test_signup_job_title'))
            .should('have.value', Cypress.env('test_signup_job_title_value'))
        cy.get('#employer')
            .type(Cypress.env('test_signup_insitution'))
            .should('have.value', Cypress.env('test_signup_insitution'))
        cy.contains('I allow DetectED-X to contact me further about its services')
            .parent()
            .find('input[type=checkbox]')
            .check()
        cy.contains('I have read and agree')
            .parent()
            .find('input[type=checkbox]')
            .check()
        cy.intercept({
            method: apiSignup.method,
            url: apiSignup.url,
          }).as("signUpData");
        cy.get('.mb-15 > .MuiButtonBase-root').click()
        cy.wait('@signUpData').its('response.statusCode').should('eq', 200)
    })
})