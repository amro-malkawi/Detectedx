import {
    alertAndPause,
    checkAnswer,
    clickViewButton,
    clickOnModalityTab,
    clickSubmit,
    clickDefinitionButton,
    downloadCertificate,
    isCurrentAQuestionPage,
    navigateToTestPage,
    navigateToScorePage,
    pauseIfVideoModalExist,
    routeToScorePage,
    selectTheLast,
    waitForUserInputQuestionnairePage,
    closeDefinition,
} from '../../support/common/functions/index'

import { MODALITY_NAME } from '../../support/common/constants'
import { validateReSelectDropdownList, validateScoreContainer } from '../../support/common/functions/validation'

const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.GE_3D,
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
        it('should be able to click on view button and navigate to score page', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
        })
        it('should be able to re-select the drop down list on score page', () => {
            validateReSelectDropdownList(CURRENT_TEST.MODALITY_NAME)
        })
        it('should be able to see score data on score page', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            validateScoreContainer()
        })
        it('should be able to download the certificate of completion on score page', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            downloadCertificate()
        })
        it('should be able to see the definition on score page by clicking button', () => {
            navigateToScorePage(CURRENT_TEST.MODALITY_NAME)
            clickViewButton(CURRENT_TEST.VIEW_BUTTON_INDEX)
            clickDefinitionButton()
            closeDefinition()
        })
    })
})