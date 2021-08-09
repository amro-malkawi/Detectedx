import { BUTTON } from '../../support/common/constants/index'
import { dropdown } from '../../support/breasted-mammography/breasted-mammography-dropdown-list'
import { clickExistButtonInCard, getButtonByNameOfCard, getClickableButtonInCard, isCurrentAQuestionPage } from '../../support/common/functions/index'
const apiHost = Cypress.env('apiUrl')
const apiSelectDrownDownList = {
    method: 'GET',
    url: `${apiHost}/scores/attempt_percentile**`
}
const CARD = {
    DBT30Cases: 'DBT 30 Cases (DBT1)'
}

const CURRENT_TEST = {
    CARD: CARD.DBT30Cases,
    VIEW_BUTTON_INDEX: 0,
}

function waitForUserInputQuestionnairePage() {
    isCurrentAQuestionPage()
    cy.get('@foundQuestionnairePage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}

function alertAndPause() {
    const message = 'After input all questionnaire, please click "Next" button below the questionnaire page. After that to continue the test please click "Resume" button.'
    cy.log(message)
    alert(message)
    return cy.pause()
}

function selectTheLast() {
    cy.get('.form-control').then((value) => {
        const position = (value[0].length - 1).toString()
        cy.wrap(value).select(position)
    })
}

function backToHome() {
    cy.get('.navbar-right > :nth-child(1) > .MuiButtonBase-root').click()
}

function markOnFilm() {
    cy.wait(3000)
    cy.get('.image-row').then((row) => {
        const image = row[0].childNodes[0]
        cy.get('.more-icon').click()
        cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="Marker"]').click()
        cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
        cy.wrap(image).click()
    })
}

const saveMarkPoint = () => {
    cy.get('.right > .MuiButtonBase-root').click()
}

function clickSubmit() {
    cy.get('button').contains('Submit').should('exist').and('be.visible').click()
}

function checkAnswer() {
    return cy.get('button').contains('Answers').click()
}

function routeToScorePage() {
    return cy.get('button').contains('Scores').click({ force: true })
}

function downloadCertificate() {
    return cy.get('button').contains('Certificate of Completion').click()
}
function navigateToScorePage() {
    cy.get("body").then($body => {
        if($body.find("button:contains('Scores')").length > 0) {
            cy.get('button').contains('Scores').click({ force: true })
        }
    });
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
    describe('Expect to see Breasted DBT 3D score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - DBT 3D').should('be.visible').click();
        })

        it('should be able to submit test or make questionnaire on score page', () => {
            clickExistButtonInCard(CURRENT_TEST.CARD, [BUTTON.Continue, BUTTON.Restart])
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage').then(({ selector }) => {
                if (selector.found) {
                    alertAndPause()
                    questionnaireFlow()
                } else {
                    submitTestFlow()
                }
            })

            const questionnaireFlow = () => {
                checkAnswer()
                routeToScorePage()
                downloadCertificate()
            }

            const submitTestFlow = () => {
                submitTest()
                waitForUserInputQuestionnairePage()
                questionnaireFlow()
            }

            const submitTest = () => {
                selectTheLast()
                markOnFilm()
                saveMarkPoint()
                clickSubmit()
            }
        })

        it('should be able to re-select the drop down list on score page', () => {
            const navigateToScoreOrTestPage = () => {
                getClickableButtonInCard(CURRENT_TEST.CARD)
                cy.get('@clickableButtons').then(({ selector }) => {
                    const buttons = selector
                    if (buttons.includes(BUTTON.Scores)) {
                        clickExistButtonInCard(CURRENT_TEST.CARD, BUTTON.Scores)
                        checkScorePage()
                    } else {
                        clickExistButtonInCard(CURRENT_TEST.CARD, buttons)
                        checkTestPage()
                    }
                })
            }
            const checkScorePage = () => {
                clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
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
            }
            const checkTestPage = () => {
                isCurrentAQuestionPage()
                cy.get('@foundQuestionnairePage').then(({ selector }) => {
                    if (selector.found) {
                        alertAndPause()
                        questionnaireFlow()
                    } else {
                        submitTestFlow()
                    }
                })
                const questionnaireFlow = () => {
                    checkAnswer()
                    routeToScorePage()
                    downloadCertificate()
                }
                const submitTestFlow = () => {
                    submitTest()
                    questionnaireFlow()
                }
                const submitTest = () => {
                    clickSubmit()
                    selectTheLast()
                    markOnFilm()
                    saveMarkPoint()
                    submitResult()
                    backToHome()
                }
            }
            navigateToScoreOrTestPage()
        })

        it('should be able to click on view button and navigate to score page', () => {
            navigateToScorePage()
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('.rct-page').should('be.visible')
            cy.get('.score-circle-container').should('be.visible')
        })

        it('should be able to see score data on score page', () => {
            navigateToScorePage()
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('.normal-score-data')
                .should('exist')
                .and('be.visible')
        })

        it('should be able to download the certificate of completion on score page', () => {
            navigateToScorePage()
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
        })

        it('should be able to see the definition on score page by clicking button', () => {
            navigateToScorePage()
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.getBySel('test-attempt-definition-button')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
                .should('exist')
            cy.get('#alert-dialog-title > .MuiButtonBase-root').click()
        })
    })
})