import {
    alertAndPause,
    checkAnswer,
    clickViewButton,
    clickOnModalityTab,
    downloadCertificate,
    isCurrentAQuestionPage,
    navigateToTestPage,
    navigateToScorePage,
    pauseIfVideoModalExist,
    routeToScorePage,
    selectTheLast,
    waitForUserInputQuestionnairePage,
    clickSubmit,
    checkAllDropdownListAt,
    markOnFilm,
    saveMarkPoint,
    backToHome,
    clickDefinitionButton,
} from '../../support/common/functions/index'

import { MODALITY_NAME } from '../../support/common/constants'

const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.DentalED,
    VIEW_BUTTON_INDEX: 0,
}
context(`${CURRENT_TEST.MODALITY_NAME} - Score Page`, () => {
    describe(`Expect to see ${CURRENT_TEST.MODALITY_NAME} score page functional`, () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(CURRENT_TEST.MODALITY_NAME)
        })

        it('should be able to submit test or make questionnaire on score page', () => {
            navigateToTestPage(CURRENT_TEST.MODALITY_NAME)
            pauseIfVideoModalExist()
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
                clickSubmit()
            }
        })
        it('should be able to re-select the drop down list on score page', () => {
            const navigateToScoreOrTestPage = () => {
                cy.getBySel(`"${CURRENT_TEST.MODALITY_NAME}"`).then((modality_info) => {
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
                checkAllDropdownListAt(1)
                checkAllDropdownListAt(2)
                checkAllDropdownListAt(3)
            }
            const checkTestPage = () => {
                cy.wait(2000)
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
                    clickSubmit()
                    backToHome()
                }
            }
            navigateToScoreOrTestPage()
        })
        it('should be able to click on view button and navigate to score page', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('.rct-page').should('be.visible')
            cy.get('.score-circle-container').should('be.visible')
        })

        it('should be able to see score data on score page', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('.normal-score-data').should('be.visible')
        })

        it('should be able to download the certificate of completion on score page', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
        })

        it('should be able to see the definition on score page by clicking button', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            clickDefinitionButton()
            cy.wait(3000)
            cy.get('#alert-dialog-title > .MuiButtonBase-root').click()
        })
    })
})