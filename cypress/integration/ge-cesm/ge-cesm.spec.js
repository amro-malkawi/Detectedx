import {
    clickOnModalityTab,
    loginWithEmailPasswordWithCookiesPreserved,
    navigateToTestSet,
    waitLoadingResources,
} from "../../support/common/functions/index"
import { 
    validateSeriesFeature,
    validateInstructionFeature,
    validateNextPreviousFeature,
    validateInvertFeature,
    validateTool,
    validateHideInfoFeature,
    validateClearSymbols,
 } from "../../support/common/functions/validation"
import { validateHangingButtonFeature } from "../../support/ge-cesm/utils"
import { TOOL, MODALITY_NAME } from "../../support/common/constants/index"
const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.GE_CESM
}
context(`Test Page - ${CURRENT_TEST.MODALITY_NAME}`, () => {
    describe(`Expect to see ${CURRENT_TEST.MODALITY_NAME} modality functional`, () => {
        before(() => {
            loginWithEmailPasswordWithCookiesPreserved()
        })
        beforeEach(() => {
            cy.visit('/app/test/list')
            clickOnModalityTab(CURRENT_TEST.MODALITY_NAME)
            navigateToTestSet(CURRENT_TEST.MODALITY_NAME)
        })
        it('should be able to load all images', () => {
            waitLoadingResources()
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
        it('should be able to use Pan tool', () => {
            validateTool(TOOL.PAN)
        })
        it('should be able to use Zoom tool', () => {
            validateTool(TOOL.ZOOM)
        })
        it('should be able to use Magnify tool', () => {
            validateTool(TOOL.MAGNIFY)
        })
        it('should be able to use Window tool', () => {
            validateTool(TOOL.WINDOW)
        })
        it('should be able to use Mark tool', () => {
            validateTool(TOOL.MARKER)
        })
        it('should be able to use FreehandMarker tool', () => {
            validateTool(TOOL.MARKER_FREEHAND)
        })
        it('should be able to use Reset tool', () => {
            validateTool(TOOL.RESET)
        })
        it('should be able to use Hide info feature', () => {
            validateHideInfoFeature()
        })
        it('should be able to use Invert feature', () => {
            validateInvertFeature()
        })
        it('should be able to use Clear symbols feature', () => {
            validateClearSymbols()
        })
    })
})