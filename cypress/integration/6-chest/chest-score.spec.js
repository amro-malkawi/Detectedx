import { dropdown } from '../../support/breasted-mammography/breasted-mammography-dropdown-list'
import { selectChestConfidence, isCurrentAQuestionPage, pauseIfVideoModalExist } from '../../support/common/functions/index'
const apiHost = Cypress.env('apiUrl')
const apiSelectDrownDownList = {
    method: 'GET',
    url: `${apiHost}/scores/attempt_percentile**`
}
const CURRENT_TEST = {
    VIEW_BUTTON_INDEX: 0,
}
const modality_name = 'CHEST'
function waitForUserInputQuestionnairePage() {
    isCurrentAQuestionPage()
    cy.wait(1000)
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
function navigateToTestPage () {
    cy.getBySel(`"${modality_name}"`).then((modality_info) => {
        cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
            if (test_set.find("button:contains('Start')").length > 0) {
                cy.wrap(test_set).find('button').contains('Start').click({ force: true })
            } else {
                cy.wrap(test_set).find('button').contains('Continue').click({ force: true })
            }
        })
    })
}
function navigateToScorePage() {
    cy.getBySel(`"${modality_name}"`).then((modality_info) => {
        cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
            if(test_set.find("button:contains('Scores')").length > 0) {
                cy.wrap(test_set).find('button').contains('Scores').click({ force: true })
            }
        })
    })
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

context('Chest - Score Page', () => {
    describe('Expect to see Chest score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains(modality_name).should('be.visible').click();
        })

        it('should be able to submit test or make questionnaire on score page', () => {
            navigateToTestPage()
            pauseIfVideoModalExist()
            isCurrentAQuestionPage()
            cy.wait(1000)
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
                selectChestConfidence(3)
                clickSubmit()
                cy.wait(3000)
            }
        })

        it('should be able to re-select the drop down list on score page', () => {
            const navigateToScoreOrTestPage = () => {
                cy.getBySel(`"${modality_name}"`).then((modality_info) => {
                    cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
                        if(test_set.find("button:contains('Scores')").length > 0) {
                            cy.get('button').contains('Scores').click({ force: true })
                            checkScorePage()
                        } else if (test_set.find("button:contains('Start')").length > 0) {
                            cy.get('button').contains('Start').click({ force: true })
                            checkTestPage()
                        } else {
                            cy.get('button').contains('Continue').click({ force: true })
                            checkTestPage()
                        }
                    })
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
                cy.wait(1000)
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