import { navigateToTestSet, waitLoadingResources, loginWithEmailPasswordWithCookiesPreserved, clickOnModalityTab } from "../../support/common/functions/index"
import { MODALITY_NAME, TOOL } from "../../support/common/constants/index"
import { validateInstructionFeature, validateInvertFeature, validateNextPreviousFeature, validateSeriesFeature, validateSlicesFeature, validateTool } from '../../support/common/functions/validation'
const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.Covid
}
context('Test Page - Covid-19', () => {
    describe('Expect to see Covid-19 modality functional', () => {
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
        it('should be able to use Instruction', () => {
            validateInstructionFeature()
        })
        it('should be able to use Slices feature', () => {
            validateSlicesFeature()
        })
        it('should be able to use Next, Previous test case feature', () => {
            const options = {
                selectConfidence: true,
                modalityName: CURRENT_TEST.MODALITY_NAME,
            }
            validateNextPreviousFeature(options)
        })
        it('should be able to use Pan tool', () => {
            validateTool(TOOL.PAN)
        })
        it('should be able to use Zoom tool', () => {
            validateTool(TOOL.ZOOM)
        })
        it('should be able to use Window tool', () => {
            validateTool(TOOL.WINDOW)
        })
        it('should be able to use Reset tool', () => {
            validateTool(TOOL.RESET)
        })
        it('should be able to use Invert feature', () => {
            validateInvertFeature()
        })
    })
})