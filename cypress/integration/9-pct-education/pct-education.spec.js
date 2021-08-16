import { getTool, clickNextModalityTab, navigateToTestSet } from "../../support/common/functions/index"
import { TOOL } from "../../support/common/constants/index"

const modality_name = 'PCT Education'
function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
function clearSymbols () {
    cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
}
context(`Test Page - ${modality_name}`, () => {
    describe(`Expect to see ${modality_name} modality functional`, () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            clickNextModalityTab(2)
            cy.contains(modality_name).should('be.visible').click();
            navigateToTestSet(modality_name)
        })

        it('should be able to load all images', () => {
            checkLoadingIndicator()
        })
        it('should be able to use Series feature', () => {
            const toggleSeriesIcon = () => {
                cy.get('.series-icon').click()
            }
            cy.get('.image-browser').should('exist').and('be.visible')
            toggleSeriesIcon()
            cy.get('.image-browser').should('not.be.visible')
            toggleSeriesIcon()
            cy.get('.image-browser').should('exist').and('be.visible')
        })
        it('should be able to use Instruction', () => {
            cy.get('button')
                .contains('Instruction')
                .click()
                .should('exist')
            cy.get('.MuiDialogContent-root')
                .scrollTo('bottom', { duration: 3000 })
            cy.get('.MuiDialogContent-root')
                .scrollTo('top', { duration: 3000 })
            cy.get('button')
                .contains('Close')
                .click()
                .should('not.exist')
        })
        it('should be able to use Next, Previous test case feature', () => {
            const testCaseValue = String(1)
            cy.get('select')
                .select(testCaseValue)
            cy.get('select')
                .should('have.value', testCaseValue)
            
            cy.get('button')
                .contains('Next')
                .click()

            cy.get('select')
                .should('have.value', Number(testCaseValue) + 1)
            cy.get('button')
                .contains('Previous')
                .click()
            cy.get('select')
                .should('have.value', Number(testCaseValue))
        })
        it('should be able to use Pan tool', () => {
            getTool(TOOL.PAN)
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
            getTool(TOOL.ZOOM)
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
            getTool(TOOL.WINDOW)
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
            getTool(TOOL.LENGTH)
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
            getTool(TOOL.MARKER)
            clearSymbols()
            cy.getReact('Toolbar').then((value) => {
                expect(value[1].props.currentTool).to.equal('Marker')
            })
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0])
                    .trigger('mousedown', { which: 1, pageX: 557, pageY: 212 })
                    .trigger('mouseup', { which: 1, pageX: 557, pageY: 212 })
            })
        })
        it('should be able to use FreehandMarker tool', () => {
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
                getTool(TOOL.MARKER_FREEHAND)
                markerFreehandAction(row)
            })
        })
        it('should be able to use Grid status', () => {
            const selectGridTool = () => {
                cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-cy=grid-tool]')
                .click()
                .should('exist')
            }
            cy.get('.tool-container').click().should('exist')
            cy.wait(1000)

            selectGridTool()
            cy.get('tbody > :nth-child(2) > :nth-child(2)') // 4 grid
                .click()
                .should('exist')
            cy.get('.MuiDialog-container')
                .click()
                .should('not.exist')
            cy.get('.image-row').then((row) => {
                expect(row.length).to.eq(2)
                expect(row[0].childElementCount).to.eq(2)
                expect(row[1].childElementCount).to.eq(2)
            })
            cy.get('.tool-container').click().should('exist')
            cy.wait(1000)
            
            selectGridTool()
            cy.get('tbody > :nth-child(2) > :nth-child(4)') // 8 grid
                .click()
                .should('exist')
            cy.get('.MuiDialog-container')
                .click()
                .should('not.exist')
            cy.get('.image-row').then((row) => {
                expect(row.length).to.eq(2)
                expect(row[0].childElementCount).to.eq(4)
                expect(row[1].childElementCount).to.eq(4)
            })
        })
        it('should be able to use Reset tool', () => {
            getTool(TOOL.ZOOM)
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
            getTool(TOOL.RESET)
        })
        it('should be able to use Hide info feature', () => {
            getTool(TOOL.MARKER)
            const markAction = (image) => {
                const x = 250
                const y = 180
                cy.wrap(image).click(x,y)
                cy.get('.save > .MuiButton-label').should('be.visible').click()
            }
            const toggleMarkInfo = () => {
                cy.getBySel('tool-mark-info').should('be.visible').first().click()
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wait(1000)
                markAction(image)
                cy.wait(1000)
                toggleMarkInfo()
                cy.wait(3000)
                toggleMarkInfo()
            })
        })
        it('should be able to use Invert feature', () => {
            const toggleInvertAction = () => {
                cy.getBySel('tool-invert').should('be.visible').first().click();
            }
            toggleInvertAction()
            toggleInvertAction()
        })
        it('should be able to use Clear symbols feature', () => {
            getTool(TOOL.MARKER)
            const markAction = (image) => {
                const x = 600
                const y = 300
                cy.wrap(image).click(x,y)
                cy.wait(500)
                cy.get('.save > .MuiButton-label').should('be.visible').click()
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                markAction(image)
                cy.wait(3000)
                clearSymbols()
            })
        })
    })
})