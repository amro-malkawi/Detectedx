import { BUTTON } from "../../support/common/constants/index"
import { 
    alertAndPause,
    checkAnswer,
    checkLoadingIndicator,
    clickExistButtonInCard,
    clickReattempt,
    clickReviewAnswers,
    downloadCertificates,
    interceptAttemptRequest,
    interceptDicomImages,
    isCurrentAQuestionPage,
    routeToScorePage,
    selectDropDownAt,
    selectTheLast,
    selectDensity,
    waitForUserInputQuestionnairePage,
    waitForUserInputEvaluationPage,
    waitUntilAllImagesLoaded,
 } from "../../support/common/functions/index"

const CARD = {
    POST_TEST: 'Density 60 Cases (D1)'
}
const modality_name = 'DensityED'
const CURRENT_TEST = {
    CARD: CARD.POST_TEST
}
function navigateToTestPage() {
    const possibleButton = [BUTTON.Continue, BUTTON.Restart]
    clickExistButtonInCard(CURRENT_TEST.CARD, possibleButton)
}
function makeCorrectAnswer() {
    checkLoadingIndicator()
    waitUntilAllImagesLoaded()
    const correctAnswer = ['a', 'b', 'b', 'c', 'd', 'd', 'a', 'c']
    for (let index = 0; index < correctAnswer.length; index++) {
        const element = correctAnswer[index];
        selectDropDownAt(index + 1)
        selectDensity(element)
        cy.wait(3000)
    }
}
context(`Post Test - ${modality_name}`, () => {
    describe(`Expect to see ${modality_name} Post Test`, {
    }, () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').should('be.visible').click();
        })
        afterEach(() => {
            cy.wait(1000)
        })

        it('should be able to do post test', () => {
            interceptAttemptRequest()
            interceptDicomImages()
            navigateToTestPage()
            cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
            cy.wait(1500)
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
                cy.wait(1000)
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
                cy.get('button').contains('Start').click() // AMA PRA Category 1 Credit(s)™ Start button
                cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
                selectTheLast()
                selectDensity('a')
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