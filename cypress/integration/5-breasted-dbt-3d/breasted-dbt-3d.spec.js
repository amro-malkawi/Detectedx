import { getTool, interceptDicomImages } from "../../support/common/functions/index"
import { TOOL } from "../../support/common/constants/index"

function navigateToTestSet() {
    cy.get("body").then($body => {
        if( $body.find("[data-cy=test-start-button]:contains('Start')").length > 0) {
            cy.get('button').contains('Start').click({ force: true })
        } else {
            if($body.find("[data-cy=test-continue-button]:contains('Continue')").length > 0) {
                cy.get('button').contains('Continue').click({ force: true })
            }
        }
    });
}
function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
function waitLoading() {
    cy.location('pathname').should('include', '/test-view');
}
context('Test Page - Breasted DBT 3D', () => {
    describe('Expect to see Breasted DBT 3D modality functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - DBT 3D').should('be.visible').click();
            interceptDicomImages()
            navigateToTestSet()
            waitLoading()
            checkLoadingIndicator()
        })

        it('should be able to load all images', () => {
            interceptDicomImages()
            checkLoadingIndicator()
            cy.wait('@dicomImagesResponse')
        })
        it('should be able to use grid status', () => {
            const selectGridTool = () => {
                cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-cy=grid-tool]')
                .click()
                .should('exist')
            }
            cy.get('.tool-container').click().should('exist')
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
            cy.wait(1000)
            toggleSeriesIcon()
            scrolling()
        })
        it('should be able to use hanging button', () => {
            const selectFirst = () => {
                cy.get('.hanging-type-container').click().should('exist')
                cy.get('.MuiList-root > :nth-child(1)').click()
                cy.get('.image-row').then((row) => {
                    expect(row.length).to.eq(1)
                    expect(row[0].childElementCount).to.eq(4)
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
        it('should be able to use next, previous test case feature', () => {
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
        it('should be able to use Mark tool', () => {
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).dblclick()
            })
            getTool(TOOL.MARKER)
            cy.getReact('Toolbar').then((value) => {
                expect(value[1].props.currentTool).to.equal('Marker')
            })
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).click();
            })
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
        it('should be able to scroll', () => {
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
                            cy.wait(1)
                        }
                    }
                    cy.wait(1000)
                    for (let i = 0; i < stackScrollbar.length; i++) {
                        let element = stackScrollbar[i];
                        let max = stackScrollbar[i].max
                        let min = stackScrollbar[i].min
                        for (let j = max; j >= min; j--) {
                            cy.wrap(element).then(input => changeRangeInputValue(input)(j))
                            cy.wait(1)
                        }
                    }
                })
            }
            scrolling()
        })
        it('should be able to use Magnify tool', () => {
            getTool(TOOL.MAGNIFY)
            const pageX = 482
            const pageY = 296
            const movemouse = (row, i) => {
                cy.wrap(row[0].childNodes[0])
                    .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
            }
            const magnifyAction = (row) => {
                const smooth = 1;
                const magnify = {
                    start: 420,
                    end: 440
                }
                const move = () => {
                    cy.wrap(row[0].childNodes[0]).trigger('mousedown', { which: 1, pageX: pageX, pageY: pageY })
                    for (let i = magnify.start; i < magnify.end; i = i + smooth) {
                        movemouse(row, i)
                    }
                    cy.wrap(row[0].childNodes[0]).trigger('mouseup')
                }
                move();
            }
            cy.get('.image-row').then((row) => {
                magnifyAction(row)
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
        it('should be able to use FreehandMarker tool', () => {
            const markerFreehandAction = (row) => {
                const draw = (row) => {
                    cy.wrap(row[0].childNodes[0])
                    .trigger('mousedown', { which: 1, pageX: 910, pageY: 459 })
                    .trigger('mousemove', { which: 1, pageX: 950, pageY: 367 })
                    .trigger('mousemove', { which: 1, pageX: 996, pageY: 452 })
                    .trigger('mousemove', { which: 1, pageX: 913, pageY: 460 })
                    .trigger('mouseup')
                }
                draw(row)
            }
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).dblclick()
                getTool(TOOL.MARKER_FREEHAND)
                markerFreehandAction(row)
            })
        })
        it('should be able to use hide info feature', () => {
            getTool(TOOL.MARKER)
            const markAction = (image) => {
                const x = 700
                const y = 200
                cy.wrap(image).click(x,y)
                cy.get('.save > .MuiButton-label').should('be.visible').click()
            }
            const toggleMarkInfo = () => {
                cy.getBySel('tool-mark-info').should('be.visible').first().click()
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                markAction(image)
                toggleMarkInfo()
                toggleMarkInfo()
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
        it('should be able to use clear symbols feature', () => {
            getTool(TOOL.MARKER)
            const markAction = (image) => {
                const x = 600
                const y = 300
                cy.wrap(image).click(x,y)
                cy.get('.save > .MuiButton-label').should('be.visible').click()
            }
            const clearSymbols = () => {
                cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                markAction(image)
                clearSymbols()
            })
        })
    })
})