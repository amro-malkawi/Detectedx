const apiHost = Cypress.env('apiUrl')
const apiLogin = {
    method: 'POST',
    url: `${apiHost}/users/login`
}
/// <reference types="cypress" />
describe('Sign-In', () => {
    beforeEach(() => {
        cy.visit('/signin')
    })
    it('can displays placeholder for username and password, also allow user to sign-in', () => {
        cy.get('#user-mail')
            .type(Cypress.env('test_username'))
            .should('have.value', Cypress.env('test_username'))
        cy.get('#pwd')
            .type(Cypress.env('test_password'))
            .should('have.value', Cypress.env('test_password'))
        cy.intercept({
            method: apiLogin.method,
            url: apiLogin.url,
          }).as("loginData");
        cy.get('.mb-15 > .MuiButtonBase-root').click()
        cy.wait('@loginData').its('response.statusCode').should('eq', 200)
        cy.getCookie('access_token').should('exist')
    })
})