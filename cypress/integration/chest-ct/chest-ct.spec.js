import {
    checkLoadingIndicator,
    clickOnModalityTab,
    getTool,
    navigateToTestSet,
    waitLinearProgressBar,
} from "../../support/common/functions/index"

import {
    panAction,
    zoomAction
} from "../../support/common/functions/tool_action"

import { TOOL, MODALITY_NAME } from "../../support/common/constants/index"
import { validateGridFeature } from "../../support/chest-ct/utils"
import { 
    validateInvertFeature, 
    validateNextPreviousFeature, 
    validateSeriesFeature, 
    validateSlicesFeature 
} from "../../support/common/functions/validation"

const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.ChestCT
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
        it('should be able to use Grid status', () => {
            validateGridFeature()
        })
        it('should be able to use Slices feature', () => {
            validateSlicesFeature()
        })
        it('should be able to use Next, Previous test case feature', () => {
            const options = {
                selectConfidence: true,
                modality_name: CURRENT_TEST.MODALITY_NAME,
                confidenceLevel: 3
            }
            validateNextPreviousFeature(options)
        })
        it('should be able to use Pan tool', () => {
            waitLinearProgressBar()
            getTool(TOOL.PAN)
            cy.get('.image-row').then((row) => {
                panAction(row)
            })
        })

        it('should be able to use Zoom tool', () => {
            waitLinearProgressBar()
            getTool(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
        })
        it('should be able to use Reset tool', () => {
            waitLinearProgressBar()
            getTool(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
            getTool(TOOL.RESET)
        })
        it('should be able to use Invert feature', () => {
            waitLinearProgressBar()
            validateInvertFeature()
        })
    })
})