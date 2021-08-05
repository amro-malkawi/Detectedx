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
const second = 180
const duration = second * 1000
const customTimeout = { timeout: duration }
let count = {
    markPosition: 0,
    checkMarkerPopup: 0,
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
    cy.get('@foundEvaluationFormPage', customTimeout).then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
function checkRadioButton(value) {
    cy.get('[type="radio"]', customTimeout).check(value)
}
function selectLesionType(LesionType) {
    switch (LesionType) {
        case LESION_TYPE.OtherFindings:
            cy.get('div').contains('Select lesion type').click().type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
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
    cy.get('button', customTimeout).contains('Answers').click()
}
function routeToScorePage() {
    cy.get('button', customTimeout).contains('Scores').click({ force: true })
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
    cy.get('.form-control', customTimeout).then((value) => {
        cy.wrap(value, customTimeout).select((order - 1).toString(), { force: true })
    })
}
function selectLastTest() {
    cy.get('.form-control', customTimeout).then((value) => {
        const position = (value[0].length - 1).toString()
        cy.wrap(value, customTimeout).select(position, { force: true })
    })
}
function clickSubmit() {
    cy.get('button').contains('Submit', customTimeout).should('exist').and('be.visible').click()
}
function clickReattempt() {
    cy.get('button').contains('Reattempt', customTimeout).should('exist').and('be.visible').click()
}
function clickReviewAnswers() {
    const selector = 'review-answers-button'
    cy.get(`[data-cy=${selector}]`, customTimeout).should('exist').and('be.visible').click()
}
function clickSave() {
    cy.get('.save', customTimeout).click()
}
function waitUntilAllImagesLoaded() {
    checkLoadingIndicator()
    cy.wait('@dicomImagesResponse').its('response.statusCode').should('eq', 200)
    cy.wait('@dicomImagesResponse').its('response.body').should('be.exist')
    cy.wait('@dicomImagesResponse').then(({ response }) => {
        if (response.body) {
            cy.window().its('store').invoke('getState').then(({ testView }) => {
                const { showImageList } = testView
                cy.wrap(showImageList, customTimeout).its('length').should('be.gte', 1)
            })
        }
    })
}
function markDefaultPostion() {
    const index = 0
    const options = { options: customTimeout }
    cy.getReact("ImageOverlap", options).then((value) => {
        cy.wrap(value).its('length').should('be.gte', 1).then(() => {
            clickOnClearSymbol(index)
            const image = value[index].node.previousSibling.parentElement
            cy.wrap(image, customTimeout).click().should('exist').and('not.be.visible')
            clickSave()
        })
    })
}
function clickOnClearSymbol(index) {
    const selector = 'tool-clear-symbols'
    cy.get(`[data-cy=${selector}]`, customTimeout).eq(index).should('be.visible').click();
}

function checkLoadingIndicator() {
    cy.get('.loading-indicator', customTimeout).should('not.exist')
}

function checkMarkerPopup() {
    count.checkMarkerPopup += 1
    return cy.get('#mark-details')
}
function markCorrectPosition(correctPosition, index) {
    checkLoadingIndicator()
    waitUntilAllImagesLoaded()
    clickOnClearSymbol(index)    
    const mark = $el =>  {
        count.markPosition += 1
        cy.wrap($el, customTimeout)
            .trigger('mousedown', correctPosition)
            .trigger('mouseup', { force: true })
    }
    const promisePipeMarking = (target) => {
        cy.get(target, customTimeout)
            .then((value) => {
                return new Cypress.Promise((resolve, reject) => {
                    cy.wrap(value)
                        .pipe(mark)
                        .pipe(checkMarkerPopup)
                        .should('exist')
                        .then(() => {
                            cy.log(`markPosition ${count.markPosition} time(s)`)
                            cy.log(`checkMarkerPopup ${count.checkMarkerPopup} time(s)`)
                        })
                    resolve(true)
                })
        })
    }
    const pipeMarking = (target) => {
        cy.get(target, customTimeout)
        .pipe(mark)
        .pipe(checkMarkerPopup)
        .should('exist')
        .then(() => {
            cy.log(`markPosition ${count.markPosition} time(s)`)
            cy.log(`checkMarkerPopup ${count.checkMarkerPopup} time(s)`)
        })
    }


    cy.get('.image-row', customTimeout).then((row) => {
        // const targetTemp = row[0].childNodes[index].childNodes[0]
        const target = row[0].childNodes[index].childNodes[0].childNodes[0]
        cy.wrap(target, customTimeout).invoke('width').then(parseFloat).should('be.gt', 0)
        cy.wrap(target, customTimeout).invoke('height').then(parseFloat).should('be.gt', 0)
        
        cy.wait(5000) // or should wait until the dicom images from application is ready to mark.
        
        pipeMarking(target)
        // promisePipeMarking(target)
        
        cy.wait(1000) // make sure the marker popup is visible
        
        checkRadioButton(CORRECT_ANSWER.IMAGE_2.LEVEL_OF_CONFIDENCE)
        selectLesionType(LESION_TYPE.OtherFindings)
        clickSave()
    })
}

function addMarker() {
    getTool(TOOL.MARKER)
    markDefaultPostion()
}
function waitLoading() {
    cy.location('pathname', customTimeout).should('include', '/test-view');
}
context('Post Test - Breasted Mammography', () => {
    describe('Expect to see Breasted Mammography Post Test', {
        // retries: {
        //     runMode: 3,
        //     openMode: 3,
        // },
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
            cy.wait('@attemptResponse', customTimeout).its('response.statusCode').should('eq', 200)
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage', customTimeout).then(({ selector }) => {
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
                clickSubmit()
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
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_2.POSITION.A, 0)
            }
            const markCorrectImage5 = () => {
                selectDropDownAt(5)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_5.POSITION.A, 1)
                markCorrectPosition(CORRECT_ANSWER.IMAGE_5.POSITION.B, 3)
            }
            const markCorrectImage6 = () => {
                selectDropDownAt(6)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_6.POSITION.A, 0)
                markCorrectPosition(CORRECT_ANSWER.IMAGE_6.POSITION.B, 2)
            }
            const markCorrectImage8 = () => {
                selectDropDownAt(8)
                cy.wait(3500)
                getTool(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_8.POSITION.A, 1)
                markCorrectPosition(CORRECT_ANSWER.IMAGE_8.POSITION.B, 3)
            }

            const startPostTestWithReattempt = () => {
                interceptAttemptRequest()
                cy.get('button').contains('Start', customTimeout).click() // AMA PRA Category 1 Credit(s)™ Start button
                cy.wait('@attemptResponse', customTimeout).its('response.statusCode').should('eq', 200)
                selectLastTest()
                clickSubmit()
                clickReviewAnswers()
                clickReattempt()
            }
            const startPostTestWithCorrectAnswer = () => {
                markCorrectImage2()
                markCorrectImage5()
                markCorrectImage6()
                markCorrectImage8()
                clickSubmit()
                waitForUserInputEvaluationPage()
                checkAnswer()
                routeToScorePage()
                downloadCertificate()
            }
        })
    })
})