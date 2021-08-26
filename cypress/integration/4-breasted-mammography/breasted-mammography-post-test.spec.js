import { MODALITY_NAME, TOOL } from "../../support/common/constants/index"
import { 
    alertAndPause,
    clickOnModalityTab, 
    clickSubmit, 
    clickReviewAnswers, 
    clickReattempt, 
    clickSave,
    clickStartPostTest,
    clearSymbolsAt, 
    checkAnswer, 
    checkLoadingIndicator,
    checkRadioButton,
    selectTheLast, 
    downloadCertificates, 
    isCurrentAQuestionPage, 
    interceptAttemptRequest, 
    interceptDicomImages, 
    routeToScorePage, 
    selectTestCaseAt,
    getToolWithMoreIcon,
    navigateToSpecificTestPage,
    waitUntilAllImagesLoaded, 
    waitForUserInputEvaluationPage, 
    waitForUserInputQuestionnairePage, 
} from "../../support/common/functions/index"

const POST_TEST_CARD = 'Mammography 60 Cases (M1 2020) Earn 6 Credits'
const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.BreastED_Mammography,
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
let count = {
    markPosition: 0,
    checkMarkerPopup: 0,
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
function markDefaultPostion() {
    getToolWithMoreIcon(TOOL.MARKER)
    const index = 0
    cy.getReact("ImageOverlap").then((value) => {
        cy.wrap(value).its('length').should('be.gte', 1).then(() => {
            clearSymbolsAt(index)
            const image = value[index].node.previousSibling.parentElement
            cy.wrap(image).click().should('exist').and('not.be.visible')
            clickSave()
        })
    })
}
function checkMarkerPopup() {
    count.checkMarkerPopup += 1
    return cy.get('#mark-details')
}
function markCorrectPosition(correctPosition, index) {
    checkLoadingIndicator()
    waitUntilAllImagesLoaded()
    clearSymbolsAt(index)    
    const mark = $el =>  {
        count.markPosition += 1
        cy.wrap($el)
            .trigger('mousedown', correctPosition)
            .trigger('mouseup', { force: true })
    }
    const pipeMarking = (target) => {
        cy.get(target)
        .pipe(mark)
        .pipe(checkMarkerPopup)
        .should('exist')
        .then(() => {
            cy.log(`markPosition ${count.markPosition} time(s)`)
            cy.log(`checkMarkerPopup ${count.checkMarkerPopup} time(s)`)
        })
    }
    cy.get('.image-row').then((row) => {
        const target = row[0].childNodes[index].childNodes[0].childNodes[0]
        cy.wrap(target).invoke('width').then(parseFloat).should('be.gt', 0)
        cy.wrap(target).invoke('height').then(parseFloat).should('be.gt', 0)
        cy.wait(3000) // wait for image is ready to mark.
        pipeMarking(target)
        cy.wait(1000) // make sure the marker popup is visible before move on.
        checkRadioButton(CORRECT_ANSWER.IMAGE_2.LEVEL_OF_CONFIDENCE)
        selectLesionType(LESION_TYPE.OtherFindings)
        clickSave()
    })
}
context(`Post Test - ${CURRENT_TEST.MODALITY_NAME}`, () => {
    describe(`Expect to see ${CURRENT_TEST.MODALITY_NAME} Post Test`, {}, () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(CURRENT_TEST.MODALITY_NAME)
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
                    submitTestFlow()
                }
            })
            const submitTestFlow = () => {
                waitUntilAllImagesLoaded()
                selectTheLast()
                markDefaultPostion()
                clickSubmit()
                waitForUserInputQuestionnairePage()
                questionnaireFlow()
            }
            const questionnaireFlow = () => {
                startPostTestWithReattempt()
                startPostTestWithCorrectAnswer()
            }
            const markCorrectImage2 = () => {
                selectTestCaseAt(2)
                cy.wait(3500)
                getToolWithMoreIcon(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_2.POSITION.A, 0)
            }
            const markCorrectImage5 = () => {
                selectTestCaseAt(5)
                cy.wait(3500)
                getToolWithMoreIcon(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_5.POSITION.A, 1)
                markCorrectPosition(CORRECT_ANSWER.IMAGE_5.POSITION.B, 3)
            }
            const markCorrectImage6 = () => {
                selectTestCaseAt(6)
                cy.wait(3500)
                getToolWithMoreIcon(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_6.POSITION.A, 0)
                markCorrectPosition(CORRECT_ANSWER.IMAGE_6.POSITION.B, 2)
            }
            const markCorrectImage8 = () => {
                selectTestCaseAt(8)
                cy.wait(3500)
                getToolWithMoreIcon(TOOL.MARKER)
                cy.wait("@dicomImagesResponse");
                markCorrectPosition(CORRECT_ANSWER.IMAGE_8.POSITION.A, 1)
                markCorrectPosition(CORRECT_ANSWER.IMAGE_8.POSITION.B, 3)
            }

            const startPostTestWithReattempt = () => {
                interceptAttemptRequest()
                clickStartPostTest()
                cy.wait('@attemptResponse').its('response.statusCode').should('eq', 200)
                selectTheLast()
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
                downloadCertificates()
            }
        })
    })
})