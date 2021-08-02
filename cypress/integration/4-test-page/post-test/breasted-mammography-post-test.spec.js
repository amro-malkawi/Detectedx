import { BUTTON, TOOL } from "../../../support/common/constants/index"
import { getTool, clickExistButtonInCard, isCurrentAQuestionPage, isCurrentAnEvaluationFormPage } from "../../../support/common/functions/index"
const CARD = {
    Mammography60CasesM12020: 'Mammography 60 Cases (M1 2020) Earn 6 Credits'
}
const CURRENT_TEST = {
    CARD: CARD.Mammography60CasesM12020
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
function addMarker() {
    cy.get('.image-row').then((row) => {
        const image = row[0].childNodes[0]
        cy.wait(1000)
        cy.get('.more-icon').click()
        cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="Marker"]').click()
        cy.wait(1000)
        cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
        cy.wait(2000)
        cy.wrap(image).click() // click to mark
        cy.get('.save').click() // save marker
    })
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

        it.only('should be able to do post test', () => {
            navigateToTestPage()
            cy.wait(1000)

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

                    cy.get('.css-16zdvyg-control').click() // click on dropdown lesion type
                    cy.get('#react-select-3-option-1').click()  // CORRECT_ANSWER.IMAGE_2.LESION_TYPE

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // click on dropdown lesion child
                    cy.get('#react-select-4-option-1').click() // CORRECT_ANSWER.IMAGE_2.CHILD_LESION

                    cy.get('.right > .MuiButtonBase-root').click() // save
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

                    cy.get('.css-16zdvyg-control').click() // click selector
                    cy.get('#react-select-6-option-3').click() // click select appearance

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // select dropdown lesion child
                    cy.get('#react-select-7-option-3').click()  // choose Calcification

                    cy.get(':nth-child(3) > .css-16zdvyg-control').click()
                    cy.get('#react-select-8-option-2').click()  // choose Calcification


                    cy.get('.right > .MuiButtonBase-root').click() // save

                    cy.wait(1500)

                    cy.wrap(row[0].childNodes[3])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_5.POSITION.B) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_5.LEVEL_OF_CONFIDENCE) // check radio element

                    cy.get('.css-16zdvyg-control').click() // click selector
                    cy.get('#react-select-10-option-3').click() // click select appearance

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // click dropdown lesion child
                    cy.get('#react-select-11-option-3').click()  // choose Calcification

                    cy.get(':nth-child(3) > .css-16zdvyg-control').click()
                    cy.get('#react-select-12-option-2').click()  // choose Calcification

                    cy.get('.right > .MuiButtonBase-root').click() // save
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

                    cy.get('.css-16zdvyg-control').click() // click dropdown lesion type
                    cy.get('#react-select-14-option-1').click()  // select lesion type

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // click dropdown lesion child
                    cy.get('#react-select-15-option-1').click() // select lesion child

                    cy.get('.right > .MuiButtonBase-root').click() // save

                    cy.wait(1500)
                    cy.wrap(row[0].childNodes[2])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_6.POSITION.B) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_6.LEVEL_OF_CONFIDENCE) // check radio element

                    cy.get('.css-16zdvyg-control').click() // select dropdown lesion type
                    cy.get('#react-select-17-option-1').click()  // select lesion type

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // select dropdown lesion child
                    cy.get('#react-select-18-option-1').click() // select lesion type

                    cy.get('.right > .MuiButtonBase-root').click() // save
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

                    cy.get('.css-16zdvyg-control').click() // click dropdown lesion type
                    cy.get('#react-select-20-option-1').click()  // select lesion type

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // click dropdown lesion child
                    cy.get('#react-select-21-option-1').click() // select lesion type

                    cy.get('.right > .MuiButtonBase-root').click() // save

                    cy.wrap(row[0].childNodes[3])
                        .trigger('mousedown', CORRECT_ANSWER.IMAGE_8.POSITION.B) // mark at correct position
                        .trigger('mouseup')
                    cy.get('[type="radio"]').check(CORRECT_ANSWER.IMAGE_8.LEVEL_OF_CONFIDENCE) // check radio element

                    cy.get('.css-16zdvyg-control').click() // click dropdown lesion type
                    cy.get('#react-select-23-option-1').click()  // select lesion type

                    cy.get(':nth-child(2) > .css-16zdvyg-control').click() // click dropdown lesion child
                    cy.get('#react-select-24-option-1').click() // select lesion type

                    cy.get('.right > .MuiButtonBase-root').click() // save
                })
            }

            const startPostTestWithReattempt = () => {
                cy.get('button').contains('Start').click() // AMA PRA Category 1 Credit(s)™ Start button
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