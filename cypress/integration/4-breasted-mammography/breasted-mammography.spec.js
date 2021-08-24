import {
    getToolWithMoreIcon,
    navigateToTestSet,
    clickOnModalityTab,
    checkLoadingIndicator,
    clearSymbols,
    toggleMarkInfo,
} from "../../support/common/functions/index"
import { MODALITY_NAME, TOOL } from "../../support/common/constants/index"

import {
    validateSeriesFeature,
    validateInstructionFeature,
    validateNextPreviousFeature,
    validateInvertFeature,
    validateGridFeature
} from "../../support/common/functions/validation"

import { validateHangingButtonFeature } from "../../support/breasted-mammography/utils"
import {
    lengthAction,
    magnifyAction,
    markAction,
    markerFreehandAction,
    markWithSaveAction,
    panAction,
    windowAction,
    zoomAction
} from "../../support/common/functions/tool_action"

const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.BreastED_Mammography
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
        })
        it('should be able to use Grid feature', () => {
            validateGridFeature({ selectMoreIcon: true })
        })
        it('should be able to use Series feature', () => {
            validateSeriesFeature()
        })
        it('should be able to use Hanging button', () => {
            validateHangingButtonFeature()
        })
        it('should be able to use Instruction', () => {
            validateInstructionFeature()
        })
        it('should be able to use Next, Previous test case feature', () => {
            validateNextPreviousFeature()
        })
        it('should be able to use Mark tool', () => {
            getToolWithMoreIcon(TOOL.MARKER)
            clearSymbols()
            cy.get('.image-row').then((row) => {
                markAction(row)
            })
        })
        it('should be able to use Pan tool', () => {
            getToolWithMoreIcon(TOOL.PAN)
            cy.get('.image-row').then((row) => {
                panAction(row)
            })
        })

        it('should be able to use Zoom tool', () => {
            getToolWithMoreIcon(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
        })
        it('should be able to use Magnify tool', () => {
            getToolWithMoreIcon(TOOL.MAGNIFY)
            cy.get('.image-row').then((row) => {
                magnifyAction(row)
            })
        })
        it('should be able to use Window tool', () => {
            getToolWithMoreIcon(TOOL.WINDOW)
            cy.get('.image-row').then((row) => {
                windowAction(row)
            })
        })
        it('should be able to use Reset tool', () => {
            getToolWithMoreIcon(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
            getToolWithMoreIcon(TOOL.RESET)
        })
        it('should be able to use FreehandMarker tool', () => {
            getToolWithMoreIcon(TOOL.MARKER_FREEHAND)
            cy.get('.image-row').then((row) => {
                markerFreehandAction(row)
            })
        })
        it('should be able to use Length tool', () => {
            getToolWithMoreIcon(TOOL.LENGTH)
            clearSymbols()
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                lengthAction(image)
            })
        })
        it('should be able to use Hide info feature', () => {
            getToolWithMoreIcon(TOOL.MARKER)
            cy.get('.image-row').then((row) => {
                clearSymbols()
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                markWithSaveAction(image, 700, 200)
                toggleMarkInfo()
                cy.wait(1000)
                toggleMarkInfo()
            })
        })
        it('should be able to use Invert feature', () => {
            validateInvertFeature()
        })
        it('should be able to use Clear symbols feature', () => {
            getToolWithMoreIcon(TOOL.MARKER)
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                markWithSaveAction(image, 200, 140)
                cy.wait(3000)
                clearSymbols()
            })
        })
    })
})