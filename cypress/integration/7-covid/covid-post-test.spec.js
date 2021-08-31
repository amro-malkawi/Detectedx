import { MODALITY_NAME } from "../../support/common/constants/index"
import { 
    waitLinearProgressBar, 
    isCurrentAQuestionPage, 
    clickOnModalityTab, 
    navigateToSpecificTestPage, 
    loginWithEmailPasswordWithCookiesPreserved, 
    waitForUserInputEvaluationPage, 
    waitForUserInputQuestionnairePage, 
    clickStartPostTest, 
    clickSubmit, 
    clickReviewAnswers, 
    clickReattempt, 
    selectTheLast, 
    downloadCertificates, 
    alertAndPause, 
    checkAnswer, 
    routeToScorePage 
} from "../../support/common/functions/index"
import { makeCorrectAnswer, selectCovidConfidences } from "../../support/covid/utils"
const CARD = {
    COVID_POST_TEST: 'CovED I with Post Test'
}
const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.Covid,
    CARD: CARD.COVID_POST_TEST
}
context('Post Test - Covid-19', () => {
    describe('Expect to see Covid-19 Post Test', {
    }, () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(CURRENT_TEST.MODALITY_NAME)
        })

        it('should be able to do post test', () => {
            navigateToSpecificTestPage(CURRENT_TEST.CARD)
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage').then(({ selector }) => {
                if (selector.found) {
                    alertAndPause()
                    questionnaireFlow()
                } else {
                    submitTestFlow()
                }
            })
            const submitTestFlow = () => {
                selectTheLast()
                waitLinearProgressBar()
                selectCovidConfidences()
                clickSubmit()
                waitForUserInputQuestionnairePage()
                questionnaireFlow()
            }
            const questionnaireFlow = () => {
                startPostTestWithReattempt()
                startPostTestWithCorrectAnswer()
            }
            const startPostTestWithReattempt = () => {
                waitForUserInputQuestionnairePage()
                clickStartPostTest()
                selectTheLast()
                waitLinearProgressBar()
                selectCovidConfidences()
                clickSubmit()
                clickReviewAnswers()
                clickReattempt()
            }
            const startPostTestWithCorrectAnswer = () => {
                makeCorrectAnswer()
                waitForUserInputEvaluationPage()
                checkAnswer()
                routeToScorePage()
                downloadCertificates()
            }
        })
    })
})