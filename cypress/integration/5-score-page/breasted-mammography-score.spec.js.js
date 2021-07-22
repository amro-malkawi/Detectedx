import { dropdown } from '../../support/breasted-mammography/breasted-mammography-dropdown-list'
const apiHost = Cypress.env('apiUrl')
const apiSelectDrownDownList = {
    method: 'GET',
    url: `${apiHost}/scores/attempt_percentile**`
}

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

function clickViewButton(index) {
    cy.get('button').then((buttons) => {
        cy.wrap(buttons[index])
            .contains('View')
            .should('exist')
            .and('be.visible')
            .click()

    })
}

function interceptDropdownRequest() {
    cy.intercept({
        method: apiSelectDrownDownList.method,
        url: apiSelectDrownDownList.url,
    }).as("scoresAttemptPercentile");
}

context('Breasted Mammography - Score Page', () => {
    describe('Expect to see breasted mammography score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').click();
            navigateToScorePage()
            cy.wait(1000)
            const index = 2
            clickViewButton(index)
        })
        afterEach(() => {
            cy.wait(1000)
        })

        it('should be able to click on view button and navigate to score page', () => {
            cy.get('.rct-page').should('be.visible')
            cy.get('.score-circle-container').should('be.visible')
        })

        it('should be able to see score data on score page', () => {
            cy.get('.normal-score-data')
                .should('exist')
                .and('be.visible')
        })

        it('should be able to download the certificate of completion on score page', () => {
            cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
        })

        it('should be able to see the definition on score page by clicking button', () => {
            cy.getBySel('test-attempt-definition-button')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
                .should('exist')
            cy.wait(3000)
            cy.get('#alert-dialog-title > .MuiButtonBase-root').click()
        })

        it('should be able to re-select the drop down list on score page', () => {
            interceptDropdownRequest()
            const checkAllDropdownListAt = (number) => {
                const selector = `:nth-child(${number}) > .score-chart-title > .form-control`
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdown.key.BreastPhysician)
                    .invoke('val')
                    .should('deep.equal', dropdown.value.BreastPhysician)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdown.key.Radiologist)
                    .invoke('val')
                    .should('deep.equal', dropdown.value.Radiologist)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdown.key.Radiographer)
                    .invoke('val')
                    .should('deep.equal', dropdown.value.Radiographer)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdown.key.Trainee)
                    .invoke('val')
                    .should('deep.equal', dropdown.value.Trainee)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdown.key.other)
                    .invoke('val')
                    .should('deep.equal', dropdown.value.other)

                cy.wait('@scoresAttemptPercentile').its('response.statusCode').should('eq', 200)
            }
            checkAllDropdownListAt(1)
            checkAllDropdownListAt(2)
            checkAllDropdownListAt(3)
        })
    })
})