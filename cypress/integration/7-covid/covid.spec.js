import { waitLinearProgressBar, selectCovidConfidence, navigateToTestSet } from "../../support/common/functions/index"
import { TOOL } from "../../support/common/constants/index"

const modality_name = 'CovED - COVID-19'
function getTool(toolName) {
    cy.get(`[data-tool="${toolName}"]`).should('exist').and('be.visible').click()
}
function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
context('Test Page - Covid-19', () => {
    describe('Expect to see Covid-19 modality functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains(modality_name).should('be.visible').click();
            navigateToTestSet(modality_name)
        })

        it('should be able to load all images', () => {
            checkLoadingIndicator()
            waitLinearProgressBar()
        })
        it('should be able to use series feature', () => {
            const toggleSeriesIcon = () => {
                cy.get('.series-icon').click()
            }
            toggleSeriesIcon()
            cy.get('.image-browser').should('exist').and('be.visible')
            toggleSeriesIcon()
        })
        it('should be able to use instruction', () => {
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
        it('should be able to use Slices feature', () => {
            waitLinearProgressBar()
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
            ).set
            const changeRangeInputValue = $range => value => {
                nativeInputValueSetter.call($range[0], value)
                $range[0].dispatchEvent(new Event('change', { value, bubbles: true }))
            }
            cy.wait(5000)
            const scrolling = () => {
                cy.getBySel('stack-scrollbar-range').then((stackScrollbar) => {
                    for (let i = 0; i < stackScrollbar.length; i++) {
                        let element = stackScrollbar[i];
                        let max = stackScrollbar[i].max
                        let min = stackScrollbar[i].min
                        for (let j = min; j <= max; j++) {
                            cy.wrap(element).then(input => changeRangeInputValue(input)(j))
                            cy.wait(200)
                        }
                    }
                    cy.wait(1000)
                    for (let i = 0; i < stackScrollbar.length; i++) {
                        let element = stackScrollbar[i];
                        let max = stackScrollbar[i].max
                        let min = stackScrollbar[i].min
                        for (let j = max; j >= min; j--) {
                            cy.wrap(element).then(input => changeRangeInputValue(input)(j))
                            cy.wait(200)
                        }
                    }
                })
            }
            scrolling()
        })
        it('should be able to use next, previous test case feature', () => {
            const testCaseValue = String(1)
            cy.get('select')
                .select(testCaseValue)
            waitLinearProgressBar()
            
            cy.get('select')
                .should('have.value', testCaseValue)
            
            selectCovidConfidence(3)

            cy.get('button')
                .contains('Next')
                .click()
            waitLinearProgressBar()

            cy.get('select')
                .should('have.value', Number(testCaseValue) + 1)

            cy.get('button')
                .contains('Previous')
                .click()
            waitLinearProgressBar()

            cy.get('select')
                .should('have.value', Number(testCaseValue))
        })
        it('should be able to use Pan tool', () => {
            waitLinearProgressBar()
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
            waitLinearProgressBar()
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
            waitLinearProgressBar()
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
        it('should be able to use Reset tool', () => {
            waitLinearProgressBar()
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
        it('should be able to use invert feature', () => {
            waitLinearProgressBar()
            const toggleInvertAction = () => {
                cy.getBySel('tool-invert').should('be.visible').first().click();
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                toggleInvertAction()
                toggleInvertAction()
            })
        })
    })
})