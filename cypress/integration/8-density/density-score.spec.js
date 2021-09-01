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
    loginWithEmailPasswordWithCookiesPreserved,
    waitUntilQuestionnaireIsReady} from '../../support/common/functions/index'
import { validateScoreContainer } from '../../support/common/functions/validation'
const CURRENT_TEST = {
    VIEW_BUTTON_INDEX: 0,
}
const modality_name = 'DensityED'
context('DensityED - Score Page', () => {
    describe('Expect to see DensityED score page functional', () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
            cy.visit('/app/test/list')
            clickOnModalityTab(modality_name)
        })
        it('should be able to submit test or make questionnaire on score page', () => {
            navigateToTestPage(modality_name)
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
                selectDensity('a')
                waitUntilQuestionnaireIsReady()
            }
        })
        it('should be able to click on view button and navigate to score page', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
        })
        it('should be able to see score data on score page', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            validateScoreContainer()
        })
        it('should be able to download the certificate of completion on score page', () => {
            navigateToScorePage(modality_name)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            downloadCertificate()
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
            cy.wait(3000) // wait to let tester see video play
            cy.get('.video-close-button > .zmdi').click()
        })
    })
})