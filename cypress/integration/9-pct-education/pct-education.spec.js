import { 
    checkLoadingIndicator, 
    clearSymbols, 
    clickOnModalityTab, 
    getToolWithMoreIcon, 
    navigateToTestSet,
    waitLinearProgressBar,
    toggleMarkInfo,
 } from "../../support/common/functions/index"

import { 
    validateSeriesFeature,
    validateInstructionFeature,
    validateNextPreviousFeature,
    validateInvertFeature 
} from "../../support/common/functions/validation"

import { TOOL, MODALITY_NAME } from "../../support/common/constants/index"
import { validateGridFeature } from "../../support/pct-education/utils"
import { markWithSaveAction } from "../../support/common/functions/tool_action"

const CURRENT_TEST = {
    MODALITY_NAME: MODALITY_NAME.PCTEducation
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
            waitLinearProgressBar()
            validateNextPreviousFeature()
        })
        it('should be able to use Pan tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.PAN)
            const panAction = (row) => {
                const pageX = 600
                const move = (row, i) => {
                    cy.wrap(row[0].childNodes[0])
                        .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
                        .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
                }
                const smooth = 50;
                const pan = {
                    up: {
                        start: 75,
                        end: 250
                    },
                    down: {
                        start: 250,
                        end: 100
                    }
                }
                for (let i = pan.up.start; i < pan.up.end; i = i + smooth) {
                    move(row, i)
                }
                for (let i = pan.down.start; i > pan.down.end; i = i - smooth) {
                    move(row, i)
                }
            }
            cy.get('.image-row').then((row) => {
                panAction(row)
            })
        })

        it('should be able to use Zoom tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.ZOOM)
            const zoomAction = (row) => {
                const pageX = 450
                const move = (row, i) => {
                    cy.wrap(row[0].childNodes[0])
                        .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
                        .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
                }
                const smooth = 0.8;
                const zoom = {
                    in: {
                        start: 500,
                        end: 520
                    },
                    out: {
                        start: 520,
                        end: 512
                    }
                }
                for (let i = zoom.in.start; i < zoom.in.end; i = i + smooth) {
                    move(row, i)
                }
                for (let i = zoom.out.start; i >= zoom.out.end; i = i - smooth) {
                    move(row, i)
                }
            }
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
        })
        it('should be able to use Window tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.WINDOW)
            const windowAction = (row) => {
                const element = row[0].childNodes[0]
                const pageX = 0
                const pageY = 0
                const moveY = (element, i) => {
                    cy.wrap(element)
                        .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
                        .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
                    }
                    const moveX = (element, i) => {
                        cy.wrap(element)
                        .trigger('mousedown', { which: 1, pageX: i, pageY: pageY })
                        .trigger('mousemove', { which: 1, pageX: i, pageY: pageY })
                }
                const smooth = 10;
                const window = {
                    y: {
                        in: {
                            start: 1,
                            end: 80
                        },
                        out: {
                            start: 80,
                            end: 1
                        }
                    },
                    x: {
                        in: {
                            start: 1,
                            end: 80
                        },
                        out: {
                            start: 80,
                            end: 1
                        }
                    }
                }
                for (let i = window.y.in.start; i < window.y.in.end; i = i + smooth) {
                    moveY(element, i)
                }
                for (let i = window.y.out.start; i >= window.y.out.end; i = i - smooth) {
                    moveY(element, i)
                }
                
                cy.wrap(element).trigger('mouseup')

                for (let i = window.x.in.start; i < window.x.in.end; i = i + smooth) {
                    moveX(element, i)
                }
                for (let i = window.x.out.start; i >= window.x.out.end; i = i - smooth) {
                    moveX(element, i)
                }
            }
            cy.get('.image-row').then((row) => {
                windowAction(row)
            })
        })
        it('should be able to use Length tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.LENGTH)
            clearSymbols()
            const makeLength = (image) => {
                cy.wrap(image)
                    .trigger('mousedown', { which: 1, pageX: 543, pageY: 252 })
                    .trigger('mousemove', { which: 1, pageX: 615, pageY: 252 })
                    .trigger('mouseup', { which: 1, pageX: 615, pageY: 252 })
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                makeLength(image)
            })
            cy.wait(3000)
            clearSymbols()
        })
        it('should be able to use Mark tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.MARKER)
            clearSymbols()
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0])
                    .trigger('mousedown', { which: 1, pageX: 557, pageY: 212 })
                    .trigger('mouseup', { which: 1, pageX: 557, pageY: 212 })
            })
        })
        it('should be able to use FreehandMarker tool', () => {
            waitLinearProgressBar()
            const markerFreehandAction = (row) => {
                const draw = (row) => {
                    cy.wrap(row[0].childNodes[0])
                    .trigger('mousedown', { which: 1, pageX: 511, pageY: 239 })
                    .trigger('mousemove', { which: 1, pageX: 553, pageY: 168 })
                    .trigger('mousemove', { which: 1, pageX: 598, pageY: 234 })
                    .trigger('mousemove', { which: 1, pageX: 511, pageY: 240 })
                    .trigger('mouseup')
                }
                draw(row)
            }
            cy.get('.image-row').then((row) => {
                getToolWithMoreIcon(TOOL.MARKER_FREEHAND)
                markerFreehandAction(row)
            })
        })
        it('should be able to use Grid status', () => {
            waitLinearProgressBar()
            validateGridFeature()
        })
        it('should be able to use Reset tool', () => {
            waitLinearProgressBar()
            getToolWithMoreIcon(TOOL.ZOOM)
            const zoomAction = (row) => {
                const pageX = 450
                const move = (row, i) => {
                    cy.wrap(row[0].childNodes[0])
                        .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
                        .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
                }
                const smooth = 0.8;
                const zoom = {
                    in: {
                        start: 500,
                        end: 520
                    },
                    out: {
                        start: 520,
                        end: 512
                    }
                }
                for (let i = zoom.in.start; i < zoom.in.end; i = i + smooth) {
                    move(row, i)
                }
            }
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
                markWithSaveAction(image)
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
                markWithSaveAction(image)
                cy.wait(3000)
                clearSymbols()
            })
        })
    })
})