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
    selectDensity,
    selectTheLast,
    waitForUserInputQuestionnairePage,
} from '../../support/common/functions/index'
const CURRENT_TEST = {
    VIEW_BUTTON_INDEX: 0,
}
const modality_name = 'DensityED'
context('DensityED - Score Page', () => {
    describe('Expect to see DensityED score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(modality_name)
        })

        it('should be able to submit test or make questionnaire on score page', () => {
            navigateToTestPage(modality_name)
            pauseIfVideoModalExist()
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage').then(({ selector }) => {
                if (selector.found) {
                    questionnaireFlow()
                } else {
                    submitTestFlow()
                }
            })

            const questionnaireFlow = () => {
                alertAndPause()
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
                selectDensity('a')
            }
        })
        it('should be able to click on view button and navigate to score page', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('.rct-page').should('be.visible')
            cy.get('.volpara-score-data').should('be.visible')
        })

        it('should be able to see score data on score page', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('.volpara-score-data').should('be.visible').should('exist').and('be.visible')
        })

        it('should be able to download the certificate of completion on score page', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
        })

        it('should be able to see the extra information on score page by clicking button', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            cy.get('button').contains('Start Video')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
                .should('exist')
            cy.get('video').should('exist').and('be.visible')
            cy.wait(5000)
            cy.get('.video-close-button > .zmdi').click()
        })
    })
})