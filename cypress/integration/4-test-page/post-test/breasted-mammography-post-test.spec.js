import { BUTTON, TOOL } from "../../../support/common/constants/index"
import { getTool, clickExistButtonInCard, isCurrentAQuestionPage, isCurrentAnEvaluationFormPage } from "../../../support/common/functions/index"
const CARD = {
    Mammography60CasesM12020: 'Mammography 60 Cases (M1 2020) Earn 6 Credits'
}
const CURRENT_TEST = {
    CARD: CARD.Mammography60CasesM12020
}
const LESION_TYPE = {
    Asymmetry: "Asymmetry",
    Calcification: "Calcification",
    OtherFindings: "Other findings"
}
const CORRECT_ANSWER = {
    IMAGE_2: {
        POSITION: { A: { which: 1, pageX: 503, pageY: 396 } },
        LEVEL_OF_CONFIDENCE: "5",
        LESION_TYPE: "Asymmetry", // Select lesion type
        CHILD_LESION: "Focal", // Select lesion
    },
    IMAGE_5: {
        POSITION: {
            A: { which: 1, pageX: 673, pageY: 545 },
            B: { which: 1, pageX: 1183, pageY: 553 },
        },
        LEVEL_OF_CONFIDENCE: "5",
        LESION_TYPE: "Calcification", // Select lesion type
        CHILD_LESION: "Fine Linear", // Select lesion
    },
    IMAGE_6: {
        POSITION: {
            A: { which: 1, pageX: 419, pageY: 438 },
            B: { which: 1, pageX: 937, pageY: 532 },
        },
        LEVEL_OF_CONFIDENCE: "5",
        LESION_TYPE: "Asymmetry", // Select lesion type
        CHILD_LESION: "Focal", // Select lesion
    },
    IMAGE_8: {
        POSITION: {
            A: { which: 1, pageX: 618, pageY: 419 },
            B: { which: 1, pageX: 1044, pageY: 297 },
        },
        LEVEL_OF_CONFIDENCE: "5",
        LESION_TYPE: "Asymmetry", // Select lesion type
        CHILD_LESION: "Focal", // Select lesion
    },
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
    isCurrentAQuestionPage()
    cy.get('@foundQuestionnairePage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
function waitForUserInputEvaluationPage() {
    isCurrentAnEvaluationFormPage()
    cy.get('@foundEvaluationFormPage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
function selectLesionType(LesionType) {
    switch (LesionType) {
        case LESION_TYPE.OtherFindings:
            cy.get('div').contains('Select lesion type').click().type('{uparrow}{enter}');
            cy.get('div').contains('Select lesion').click().type('{uparrow}{enter}');
            break;
        case LESION_TYPE.Asymmetry:
            cy.get('div').contains('Select lesion type').click().type('{downarrow}{downarrow}{enter}');
            cy.get('div').contains('Select Lesion').click().type('{downarrow}{downarrow}{enter}');
            break;
        case LESION_TYPE.Calcification:
            cy.get('div').contains('Select lesion type').click().type('{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
            cy.get('div').contains('Select Appearance').click().type('{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
            cy.get('div').contains('Select Distribution').click().type('{downarrow}{downarrow}{downarrow}{enter}');
            break;
        default:
            break;
    }
}
function alertAndPause() {
    const message = 'After input all questionnaire, please click "Next" button below the questionnaire page. After that to continue the test please click "Resume" button.'
    cy.log(message)
    alert(message)
    cy.pause()
}
function checkAnswer() {
    return cy.get('button').contains('Answers').click()
}
function routeToScorePage() {
    return cy.get('button').contains('Scores').click({ force: true })
}
function downloadCertificate() {
    cy.get('button').contains('Certificate of Completion').click()
    cy.get('button').contains('Physicians').click()
    cy.get('button').contains('Non Physicians').click()
}
function navigateToTestPage() {
    const possibleButton = [BUTTON.Continue, BUTTON.Restart]
    clickExistButtonInCard(CURRENT_TEST.CARD, possibleButton)
}
function selectDropDownAt(order) {
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
    cy.getBySel('review-answers-button').should('exist').and('be.visible').click()
}
function clickSave() {
    cy.get('.save').click()
}
function waitUntilAllImagesLoaded() {
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
function markDefaultPostion() {
    cy.getReact("ImageOverlap").then((value) => {
        cy.wrap(value).its('length').should('be.gte', 1).then(() => {
            clickOnClearSymbol()
            const image = value[0].node.previousSibling.parentElement
            cy.wrap(image).click().should('exist').and('not.be.visible')
            cy.get('#mark-details').should('exist').and('be.visible')
            clickSave()
        })
    })
}
function clickOnClearSymbol() {
    cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
}

function addMarker() {
    getTool(TOOL.MARKER)
    markDefaultPostion()
}
function waitLoading() {
    cy.location('pathname', {timeout: 10000}).should('include', '/test-view');
}
context('Post Test - Breasted Mammography', () => {
    describe('Expect to see Breasted Mammography Post Test', () => {
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
                addMarker()
                cy.wait(500)
                clickSubmit() // after click Submit will route to Questionnaire Page
                cy.wait(2000)
                waitForUserInputQuestionnairePage()
                questionnaireFlow()
            }
            const questionnaireFlow = () => {
                startPostTestWithReattempt()
                startPostTestWithCorrectAnswer()
            }
            const markCorrectImage2 = () => {
                selectDropDownAt(2)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.get('.image-row').then((row) => {
                    cy.wrap(row[0].childNodes[0])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_2.POSITION.A) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_2.LEVEL_OF_CONFIDENCE) // check radio element

                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                })
            }
            const markCorrectImage5 = () => {
                selectDropDownAt(5)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.get('.image-row').then((row) => {
                    cy.wrap(row[0].childNodes[1])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_5.POSITION.A) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_5.LEVEL_OF_CONFIDENCE) // check radio element
                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                    cy.wait(1500)
                    cy.wrap(row[0].childNodes[3])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_5.POSITION.B) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_5.LEVEL_OF_CONFIDENCE) // check radio element
                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                })
            }
            const markCorrectImage6 = () => {
                selectDropDownAt(6)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.get('.image-row').then((row) => {
                    cy.wrap(row[0].childNodes[0])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_6.POSITION.A) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_6.LEVEL_OF_CONFIDENCE) // check radio element
                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                    cy.wait(1500)
                    cy.wrap(row[0].childNodes[2])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_6.POSITION.B) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_6.LEVEL_OF_CONFIDENCE) // check radio element
                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                })
            }
            const markCorrectImage8 = () => {
                selectDropDownAt(8)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.get('.image-row').then((row) => {
                    cy.wrap(row[0].childNodes[1])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_8.POSITION.A) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_8.LEVEL_OF_CONFIDENCE) // check radio element

                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                    cy.wrap(row[0].childNodes[3])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_8.POSITION.B) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_8.LEVEL_OF_CONFIDENCE) // check radio element

                    selectLesionType(LESION_TYPE.OtherFindings)
                    clickSave()
                })
            }

            const startPostTestWithReattempt = () => {
                interceptAttemptRequest()
                cy.get('button').contains('Start').click() // AMA PRA Category 1 Credit(s)™ Start button
                cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
                selectLastTest()
                clickSubmit()
                cy.wait(2000)
                clickReviewAnswers()
                cy.wait(2000)
                clickReattempt()
            }
            const startPostTestWithCorrectAnswer = () => {
                markCorrectImage2()
                markCorrectImage5()
                markCorrectImage6()
                markCorrectImage8()
                clickSubmit()
                cy.wait(2000)
                waitForUserInputEvaluationPage()
                checkAnswer()
                routeToScorePage()
                downloadCertificate()
            }
        })
    })
})