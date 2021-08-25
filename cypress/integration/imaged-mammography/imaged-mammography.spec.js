import {
    checkLoadingIndicator,
    clickOnModalityTab,
    selectTool,
    navigateToTestSet,
    waitLinearProgressBar,
} from "../../support/common/functions/index"

import { 
    validateSeriesFeature,
    validateInstructionFeature,
    validateNextPreviousFeature,
    validateInvertFeature,
 } from "../../support/common/functions/validation"

import {
    panAction,
    windowAction,
    zoomAction
} from "../../support/common/functions/tool_action"

import { TOOL, MODALITY_NAME } from "../../support/common/constants/index"

const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.ImagED_Mammography
}

context(`Test Page - ${CURRENT_TEST.MODALITY_NAME}`, () => {
    describe(`Expect to see ${CURRENT_TEST.MODALITY_NAME} modality functional`, () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickOnModalityTab(CURRENT_TEST.MODALITY_NAME)
            navigateToTestSet(CURRENT_TEST.MODALITY_NAME)
        })

        it('should be able to load all images', () => {
            checkLoadingIndicator()
            waitLinearProgressBar()
        })
        it('should be able to use Series feature', () => {
            validateSeriesFeature()
        })
        it('should be able to use Instruction', () => {
            validateInstructionFeature()
        })
        it('should be able to use Next, Previous test case feature', () => {
            const options = {
                answerQuestion: true,
                modality_name: CURRENT_TEST.MODALITY_NAME,
            }
            validateNextPreviousFeature(options)
        })
        it('should be able to use Pan tool', () => {
            waitLinearProgressBar()
            selectTool(TOOL.PAN)
            cy.get('.image-row').then((row) => {
                panAction(row)
            })
        })

        it('should be able to use Zoom tool', () => {
            waitLinearProgressBar()
            selectTool(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
        })
        it('should be able to use Window tool', () => {
            waitLinearProgressBar()
            selectTool(TOOL.WINDOW)
            cy.get('.image-row').then((row) => {
                windowAction(row)
            })
        })
        it('should be able to use Reset tool', () => {
            waitLinearProgressBar()
            selectTool(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
            selectTool(TOOL.RESET)
        })
        it('should be able to use Invert feature', () => {
            waitLinearProgressBar()
            validateInvertFeature()
        })
    })
})