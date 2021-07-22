import { dropdownKey, dropdownValue } from '../../support/breasted-mammography/breasted-mammography-dropdown-list'
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

function clickViewButton() {
    cy.get('button').contains('View').should('exist').click()
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
        })
        afterEach(() => {
            cy.wait(1000)
        })

        it('should be able to click on view button and navigate to score page', () => {
            clickViewButton()
            cy.get('.rct-page').should('be.visible')
            cy.get('.score-circle-container').should('be.visible')
        })

        it.only('should be able to re-select the drop down list on score page', () => {
            clickViewButton()
            interceptDropdownRequest()
            const checkAllDropdownListAt = (number) => {
                const selector = `:nth-child(${number}) > .score-chart-title > .form-control`
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdownKey.BreastPhysician)
                    .invoke('val')
                    .should('deep.equal', dropdownValue.BreastPhysician)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdownKey.Radiologist)
                    .invoke('val')
                    .should('deep.equal', dropdownValue.Radiologist)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdownKey.Radiographer)
                    .invoke('val')
                    .should('deep.equal', dropdownValue.Radiographer)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdownKey.Trainee)
                    .invoke('val')
                    .should('deep.equal', dropdownValue.Trainee)
                cy.get(selector)
                    .should('exist')
                    .and('be.visible')
                    .select(dropdownKey.other)
                    .invoke('val')
                    .should('deep.equal', dropdownValue.other)

                cy.wait('@scoresAttemptPercentile').its('response.statusCode').should('eq', 200)
            }
            checkAllDropdownListAt(1)
            checkAllDropdownListAt(2)
            checkAllDropdownListAt(3)
        })
    })
})