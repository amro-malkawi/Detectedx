import {
    clearSymbols,
    clickOnModalityTab,
    getToolWithMoreIcon,
    loginWithEmailPasswordWithCookiesPreserved,
    navigateToTestSet,
    toggleMarkInfo,
    waitLinearProgressBar,
    waitLoadingResources,
} from "../../support/common/functions/index"

import {
    magnifyAction,
    markAction,
    markerFreehandAction,
    markWithSaveAction,
    panAction,
    windowAction,
    zoomAction
} from "../../support/common/functions/tool_action"

import { TOOL, MODALITY_NAME } from "../../support/common/constants/index"
import { 
    validateInstructionFeature, 
    validateInvertFeature, 
    validateNextPreviousFeature, 
    validateSeriesFeature 
} from "../../support/common/functions/validation"

context(`Test Page - ${MODALITY_NAME.DentalED}`, () => {
    describe(`Expect to see ${MODALITY_NAME.DentalED} modality functional`, () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
            cy.visit('/app/test/list')
            
            clickOnModalityTab(MODALITY_NAME.DentalED)
            navigateToTestSet(MODALITY_NAME.DentalED)
        })

        it('should be able to load all images', () => {
            waitLoadingResources()
        })
        it('should be able to use Series feature', () => {
            validateSeriesFeature()
        })
        it('should be able to use Instruction', () => {
            validateInstructionFeature()
        })
        it('should be able to use Next, Previous test case feature', () => {
            waitLinearProgressBar()
            validateNextPreviousFeature()
        })
        it('should be able to use Pan tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.PAN)
            cy.get('.image-row').then((row) => {
                panAction(row)
            })
        })

        it('should be able to use Zoom tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
        })
        it('should be able to use Magnify tool', () => {
            getToolWithMoreIcon(TOOL.MAGNIFY)
            cy.get('.image-row').then((row) => {
                magnifyAction(row, 610, 200)
            })
        })
        it('should be able to use Window tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.WINDOW)
            cy.get('.image-row').then((row) => {
                windowAction(row)
            })
        })
        it('should be able to use Mark tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.MARKER)
            clearSymbols()
            cy.get('.image-row').then((row) => {
                markAction(row, 557, 212)
            })
        })
        it('should be able to use FreehandMarker tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.MARKER_FREEHAND)
            cy.get('.image-row').then((row) => {
                markerFreehandAction(row)
            })
        })
        it('should be able to use Reset tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.ZOOM)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
            getToolWithMoreIcon(TOOL.RESET)
        })
        it('should be able to use Hide info feature', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.MARKER)
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wait(1000)
                clearSymbols()
                markWithSaveAction(image, 250, 180)
                cy.wait(1000)
                toggleMarkInfo()
                cy.wait(3000)
                toggleMarkInfo()
            })
        })
        it('should be able to use Invert feature', () => {
            waitLinearProgressBar()
            validateInvertFeature()
        })
        it('should be able to use Clear symbols feature', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.MARKER)
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                markWithSaveAction(image, 600, 300)
                cy.wait(3000)
                clearSymbols()
            })
        })
    })
})