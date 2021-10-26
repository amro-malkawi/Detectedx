const apiHost = Cypress.env('apiUrl')
const apiLogin = {
    method: 'POST',
    url: `${apiHost}/users/login`
}
Cypress.Commands.add('loginWithEmailPassword', (email, password) => {
    const log = Cypress.log({
        displayName: "EMAIL PASSWORD LOGIN",
        message: [`🔐 Authenticating | ${email}`],
        autoEnd: false,
    });
    log.snapshot("before");
    cy.request({
        method: apiLogin.method,
        url: apiLogin.url,
        body: {
            email,
            password,
        },
    });
    log.snapshot("after");
    log.end();
})