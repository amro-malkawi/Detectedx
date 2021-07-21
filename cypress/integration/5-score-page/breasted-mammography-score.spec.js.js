
function getButtonByNameOfCard(card_name, button_name) {
    cy.getReact('CardBody').then((cards) => {
        let target = null;
        cards.some(element => {
            if (element.node.innerText.includes(card_name)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                array.forEach(button => {
                    if (button.innerText.includes(button_name)) {
                        target = button
                        return true;
                    }
                });
            }
        });
        cy.get(target).click();
    });
}
function navigateToScorePage() {
    const selector = {
        card: '2019 Prior Cases Cancers',
        button: 'Scores'
    }
    getButtonByNameOfCard(selector.card, selector.button)
}

context('Breasted Mammography - Score Page', () => {
    describe('Expect to see breasted mammography score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').click();
            navigateToScorePage()
            cy.wait(2000)
        })
        afterEach(() => {
            cy.wait(3000)
        })

        it('should be able to click on view button and navigate to score page', () => {
            cy.get('button').contains('View').should('exist').click()
            cy.get('.rct-page').should('be.visible')
            cy.get('.score-circle-container').should('be.visible')
        })
    })
})