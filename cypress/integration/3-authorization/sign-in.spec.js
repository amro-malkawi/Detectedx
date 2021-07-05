const frontendSignInUrl = 'http://localhost:3002/signin'
const apiLogin = {
    method: 'POST',
    url: 'http://localhost:3000/api/users/login'
}
const testCredential = {
    username: 'admin@test.com',
    password: 'test'
}

/// <reference types="cypress" />
describe('Sign-In', () => {
    beforeEach(() => {
        cy.visit(frontendSignInUrl)
    })
    it('can displays placeholder for username and password, also allow user to sign-in', () => {
        cy.get('#user-mail').type(testCredential.username).should('have.value', testCredential.username)
        cy.get('#pwd').type(testCredential.password).should('have.value', testCredential.password)
        cy.intercept({
            method: apiLogin.method,
            url: apiLogin.url,
          }).as("loginData");
        cy.get('.mb-15 > .MuiButtonBase-root').click()
        cy.wait('@loginData').its('response.statusCode').should('eq', 200)
        cy.getCookie('access_token').should('exist')
    })
})