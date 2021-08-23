import { selectChestConfidence, navigateToTestSet } from "../../support/common/functions/index"
import { TOOL } from "../../support/common/constants/index"

const modality_name = 'CHEST'
function getTool(toolName) {
    cy.get(`[data-tool="${toolName}"]`).should('exist').and('be.visible').click()
}
function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
context('Test Page - Chest', () => {
    describe('Expect to see Chest modality functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains(modality_name).should('be.visible').click();
            navigateToTestSet(modality_name)
        })

        it('should be able to load all images', () => {
            checkLoadingIndicator()
        })
        it('should be able to use series feature', () => {
            const defaultTime = 2000
            const scrolling = () => {
                cy.get('.image-browser')
                    .scrollTo('bottom', { duration: defaultTime })
                cy.get('.image-browser')
                    .scrollTo('top', { duration: defaultTime })
            }
            const toggleSeriesIcon = () => {
                cy.get('.series-icon').click()
            }
            toggleSeriesIcon()
            scrolling()
            cy.wait(1000)
            toggleSeriesIcon()
        })
        it('should be able to use hanging button', () => {
            const selectFirst = () => {
                cy.get('.hanging-type-container').click().should('exist')
                cy.get('.MuiList-root > :nth-child(1)').click()
                cy.get('.image-row').then((row) => {
                    expect(row.length).to.eq(1)
                    expect(row[0].childElementCount).to.eq(1)
                })
            }
            const selectSecond = () => {
                cy.get('.hanging-type-container').click().should('exist')
                cy.get('.MuiList-root > :nth-child(2)').click().should('exist')
                cy.get('.image-row').then((row) => {
                    expect(row.length).to.eq(1)
                    expect(row[0].childElementCount).to.eq(2)
                })
            }
            selectSecond()
            cy.wait(2000)
            selectFirst()
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
        it('should be able to use Sync function', () => {
            const toggleSyncSwitch = () => {
                cy.getBySel('synchronizer-switch').click()
            }
            const selectSecondCase = () => {
                cy.get('.hanging-type-container').click().should('exist')
                cy.get('.MuiList-root > :nth-child(2)').click().should('exist')
                cy.get('.image-row').then((row) => {
                    expect(row.length).to.eq(1)
                    expect(row[0].childElementCount).to.eq(2)
                })
            }
            toggleSyncSwitch()
            selectSecondCase()
            getTool(TOOL.ZOOM)
            const zoomAction = (row) => {
                const pageX = 178
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
            cy.wait(3000)
            cy.get('.image-row').then((row) => {
                zoomAction(row)
            })
        })

        it('should be able to use next, previous test case feature', () => {
            const testCaseValue = String(1)
            cy.get('select')
                .select(testCaseValue)
            cy.get('select')
                .should('have.value', testCaseValue).and('exist').and('be.visible')
            
            selectChestConfidence(3)

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
        it('should be able to use Length tool', () => {
            getTool(TOOL.LENGTH)
            const makeLength = (image) => {
                cy.wrap(image)
                    .trigger('mousedown', { which: 1, pageX: 366, pageY: 272 })
                    .trigger('mousemove', { which: 1, pageX: 228, pageY: 326 })
                    .trigger('mouseup', { which: 1, pageX: 228, pageY: 326 })
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                makeLength(image)
            })
        })
        it('should be able to use invert feature', () => {
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