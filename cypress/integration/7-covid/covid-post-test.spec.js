import { MODALITY_NAME } from "../../support/common/constants/index"
import { waitLinearProgressBar, isCurrentAQuestionPage, isCurrentAnEvaluationFormPage, selectCovidConfidence, clickOnModalityTab, navigateToSpecificTestPage } from "../../support/common/functions/index"
const CARD = {
    COVID_POST_TEST: 'CovED I with Post Test'
}
const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.Covid,
    CARD: CARD.COVID_POST_TEST
}
const apiHost = Cypress.env('apiUrl')
const apiHostImages = 'https://static.detectedx.com'
const apiAttempt = {
    method: 'GET',
    url: `${apiHost}/attempts/**`
}
const apiImages = {
    method: 'GET',
    url: `${apiHostImages}/images/**`
}
function interceptDicomImages() {
    cy.intercept({
        method: apiImages.method,
        url: apiImages.url,
    }).as("dicomImagesResponse");
}
function interceptAttemptRequest() {
    cy.intercept({
        method: apiAttempt.method,
        url: apiAttempt.url,
    }).as("attemptResponse");
}
function waitForUserInputQuestionnairePage() {
    cy.wait(1500)
    isCurrentAQuestionPage()
    cy.get('@foundQuestionnairePage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
function waitForUserInputEvaluationPage() {
    cy.wait(1500)
    isCurrentAnEvaluationFormPage()
    cy.get('@foundEvaluationFormPage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
function alertAndPause() {
    const message = 'After input all questionnaire, please click "Next" button below the questionnaire page. After that to continue the test please click "Resume" button.'
    cy.log(message)
    alert(message)
    cy.pause()
}
function checkAnswer() {
    cy.get('button').contains('Answers').click()
}
function routeToScorePage() {
    cy.get('button').contains('Scores').click({ force: true })
}
function downloadCertificate() {
    cy.get('button').contains('Certificate of Completion').click()
    cy.get('button').contains('Physicians').click()
    cy.get('button').contains('Non Physicians').click()
}
function selectTestCaseAt(order) {
    cy.get('.form-control').then((value) => {
        cy.wrap(value).select((order - 1).toString(), { force: true })
    })
}
function selectLastTest() {
    cy.get('.form-control').then((value) => {
        const position = (value[0].length - 1).toString()
        cy.wrap(value).select(position, { force: true })
    })
}
function clickSubmit() {
    cy.get('button').contains('Submit').should('exist').and('be.visible').click()
}
function clickReattempt() {
    cy.get('button').contains('Reattempt').should('exist').and('be.visible').click()
}
function clickReviewAnswers() {
    const selector = 'review-answers-button'
    cy.get(`[data-cy=${selector}]`).should('exist').and('be.visible').click()
}
function waitUntilAllImagesLoaded() {
    checkLoadingIndicator()
    cy.wait('@dicomImagesResponse').its('response.statusCode').should('eq', 200)
    cy.wait('@dicomImagesResponse').its('response.body').should('be.exist')
    cy.wait('@dicomImagesResponse').then(({ response }) => {
        if (response.body) {
            cy.window().its('store').invoke('getState').then(({ testView }) => {
                const { showImageList } = testView
                cy.wrap(showImageList).its('length').should('be.gte', 1)
            })
        }
    })
}
function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
function makeCorrectAnswer() {
    checkLoadingIndicator()
    waitUntilAllImagesLoaded()
    const positiveCovid19Cases = [2,4,5,8]
    for (let index = 0; index < positiveCovid19Cases.length; index++) {
        const element = positiveCovid19Cases[index];
        selectTestCaseAt(element)
        waitLinearProgressBar()
        selectCovidConfidence(5)
        cy.wait(3000)
        if (index === positiveCovid19Cases.length - 1) {
            clickSubmit()
        }
    }
}
function waitLoading() {
    cy.location('pathname').should('include', '/test-view');
}
context('Post Test - Covid-19', () => {
    describe('Expect to see Covid-19 Post Test', {
    }, () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(CURRENT_TEST.MODALITY_NAME)
        })

        it('should be able to do post test', () => {
            interceptAttemptRequest()
            interceptDicomImages()
            navigateToSpecificTestPage(CURRENT_TEST.CARD)
            cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
            cy.wait(1500)
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage').then(({ selector }) => {
                if (selector.found) {
                    alertAndPause()
                    questionnaireFlow()
                } else {
                    waitLoading()
                    submitTestFlow()
                }
            })
            const submitTestFlow = () => {
                waitUntilAllImagesLoaded()
                selectLastTest()
                selectCovidConfidence(3)
                clickSubmit()
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
                selectLastTest()
                selectCovidConfidence(3)
                clickSubmit()
                clickReviewAnswers()
                clickReattempt()
            }
            const startPostTestWithCorrectAnswer = () => {
                makeCorrectAnswer()
                waitForUserInputEvaluationPage()
                checkAnswer()
                routeToScorePage()
                downloadCertificate()
            }
        })
    })
})