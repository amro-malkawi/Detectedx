import {
    clickOnModalityTab,
    loginWithEmailPasswordWithCookiesPreserved,
    navigateToTestSet,
    waitLoadingResources,
} from "../../support/common/functions/index"
import { TOOL, MODALITY_NAME } from "../../support/common/constants/index"
import { validateGridFeature } from "../../support/chest-ct/utils"
import { 
    validateInvertFeature, 
    validateNextPreviousFeature, 
    validateSeriesFeature, 
    validateSlicesFeature, 
    validateTool
} from "../../support/common/functions/validation"
const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.ChestCT
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
            }
            validateNextPreviousFeature(options)
        })
        it('should be able to use Pan tool', () => {
            validateTool(TOOL.PAN)
        })
        it('should be able to use Zoom tool', () => {
            validateTool(TOOL.ZOOM)
        })
        it('should be able to use Reset tool', () => {
            validateTool(TOOL.RESET)
        })
        it('should be able to use Invert feature', () => {
            validateInvertFeature()
        })
    })
})