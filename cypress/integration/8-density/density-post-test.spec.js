import { 
    alertAndPause,
    checkAnswer,
    checkLoadingIndicator,
    clickOnModalityTab,
    clickReattempt,
    clickReviewAnswers,
    clickStartPostTest,
    downloadCertificates,
    interceptAttemptRequest,
    interceptDicomImages,
    isCurrentAQuestionPage,
    navigateToSpecificTestPage,
    routeToScorePage,
    selectTestCaseAt,
    selectTheLast,
    selectDensity,
    waitLoadingToTestView,
    waitForUserInputQuestionnairePage,
    waitForUserInputEvaluationPage,
    waitUntilAllImagesLoaded,
    loginWithEmailPasswordWithCookiesPreserved,
    waitUntilQuestionnaireIsReady,
    waitUntilEvaluationFormIsReady,
 } from "../../support/common/functions/index"

 import { MODALITY_NAME } from "../../support/common/constants"
 
 const POST_TEST_CARD = 'Density 60 Cases (D1)'

function makeCorrectAnswer() {
    checkLoadingIndicator()
    waitUntilAllImagesLoaded()
    const correctAnswer = ['a', 'b', 'b', 'c', 'd', 'd', 'a', 'c']
    for (let index = 0; index < correctAnswer.length; index++) {
        const element = correctAnswer[index];
        selectTestCaseAt(index + 1)
        selectDensity(element)
    }
}
context(`Post Test - ${MODALITY_NAME.DensityED}`, () => {
    describe(`Expect to see ${MODALITY_NAME.DensityED} Post Test`, {
    }, () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(MODALITY_NAME.DensityED)
        })
        it('should be able to do post test', () => {
            interceptAttemptRequest()
            interceptDicomImages()
            navigateToSpecificTestPage(POST_TEST_CARD)
            cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage').then(({ selector }) => {
                if (selector.found) {
                    alertAndPause()
                    questionnaireFlow()
                } else {
                    waitLoadingToTestView()
                    submitTestFlow()
                }
            })
            const submitTestFlow = () => {
                waitUntilAllImagesLoaded()
                selectTheLast()
                selectDensity('a')
                waitUntilQuestionnaireIsReady()
                waitForUserInputQuestionnairePage()
                questionnaireFlow()
            }
            const questionnaireFlow = () => {
                startPostTestWithReattempt()
                startPostTestWithCorrectAnswer()
            }
            const startPostTestWithReattempt = () => {
                interceptAttemptRequest()
                waitForUserInputQuestionnairePage()
                clickStartPostTest()
                cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
                selectTheLast()
                selectDensity('a')
                clickReviewAnswers()
                clickReattempt()
            }
            const startPostTestWithCorrectAnswer = () => {
                makeCorrectAnswer()
                waitUntilEvaluationFormIsReady()
                waitForUserInputEvaluationPage()
                checkAnswer()
                routeToScorePage()
                downloadCertificates()
            }
        })
    })
})