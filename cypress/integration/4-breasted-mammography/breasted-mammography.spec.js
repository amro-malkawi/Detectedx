import { getTool, clickExistButtonInCard, interceptDicomImages } from "../../support/common/functions/index"
import { BUTTON, TOOL } from "../../support/common/constants/index"

const CURRENT_CARD = {
    MammographyDemo: 'Mammography Demo'    
}

function waitForTransition() {
    const time = 2000
    cy.wait(time)
}

function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}

function navigateToTestSet() {
    const cardName = CURRENT_CARD.MammographyDemo
    const buttonName = [BUTTON.Start, BUTTON.Restart ,BUTTON.Continue]
    clickExistButtonInCard(cardName, buttonName)
}
context('Test Page - Breast Mammo Continue Case', () => {
    describe('Expect to see breast mammo modality functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').should('be.visible').click();
            navigateToTestSet()
            cy.wait(2000)
        })
        afterEach(() => {
            waitForTransition()
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
        it('should be able to use series feature', () => {
            const defaultTime = 2000
            const wait = (milisec) => {
                const time = milisec ? milisec : defaultTime
                cy.wait(time)
            }
            const scrolling = () => {
                cy.get('.image-browser')
                    .scrollTo('bottom', { duration: defaultTime })
                cy.get('.image-browser')
                    .scrollTo('top', { duration: defaultTime })
            }
            const toggleSeriesIcon = () => {
                cy.get('.series-icon').click()
                wait()
            }
            const expectIsShowImageBrowserToBe = (boolean) => {
                cy.getReact('ImageBrowser').nthNode(2).then((value) => {
                    const { props } = value
                    expect(props.isShowImageBrowser).to.be[boolean]
                    wait()
                })
            }
            toggleSeriesIcon()
            expectIsShowImageBrowserToBe(false)
            
            toggleSeriesIcon()
            expectIsShowImageBrowserToBe(true)

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
            cy.wait(5000)
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
            cy.wait(1000)
            cy.get('button')
                .contains('Close')
                .click()
                .should('not.exist')
        })
        it('should be able to use next, previous test case feature', () => {
            cy.wait(5000)
            const testCaseValue = String(1)
            cy.get('select')
                .select(testCaseValue)
            cy.wait(1000)
            cy.get('select')
                .should('have.value', testCaseValue)
            cy.wait(5000)
            cy.get('button')
                .contains('Next')
                .click()
            cy.get('select')
                .should('have.value', Number(testCaseValue) + 1)
            cy.wait(5000)
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
        it('should be able to use Magnify tool', () => {
            getTool(TOOL.MAGNIFY)
            const pageX = 1
            const pageY = 1
            const movemouse = (row, i) => {
                cy.wrap(row[0].childNodes[0])
                    .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
            }
            const magnifyAction = (row) => {
                const smooth = 0.5;
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
                const pageX = 450
                const pageY = 10
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
                const smooth = 0.8;
                const window = {
                    y: {
                        in: {
                            start: 500,
                            end: 520
                        },
                        out: {
                            start: 520,
                            end: 512
                        }
                    },
                    x: {
                        in: {
                            start: 800,
                            end: 820
                        },
                        out: {
                            start: 820,
                            end: 812
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
            getTool(TOOL.MARKER_FREEHAND)
            const markerFreehandAction = (row) => {
                const draw = (row) => {
                    cy.wrap(row[0].childNodes[0])
                        .trigger('mousedown', { which: 1, pageX: 900, pageY: 500 })
                        .trigger('mousemove', { which: 1, pageX: 910, pageY: 510 })
                        .trigger('mousemove', { which: 1, pageX: 920, pageY: 520 })
                        .trigger('mousemove', { which: 1, pageX: 930, pageY: 510 })
                        .trigger('mousemove', { which: 1, pageX: 940, pageY: 500 })
                        .trigger('mousemove', { which: 1, pageX: 910, pageY: 440 })
                        .trigger('mouseup')
                }
                draw(row)
            }
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).dblclick()
                markerFreehandAction(row)
            })
        })
        it('should be able to use Length tool', () => {
            getTool(TOOL.LENGTH)
            const makeLength = (image) => {
                cy.wrap(image)
                    .trigger('mousedown', { which: 1, pageX: 900, pageY: 500 })
                    .trigger('mousemove', { which: 1, pageX: 910, pageY: 510 })
                    .trigger('mouseup')
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                makeLength(image)
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
                cy.wait(1000)
                cy.wrap(image).dblclick()
                markAction(image)
                cy.wait(1000)
                toggleMarkInfo()
                cy.wait(3000)
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
                cy.wait(3000)
                toggleInvertAction()
            })
        })
        it('should be able to use clear symbols feature', () => {
            getTool(TOOL.MARKER)
            const markAction = (image) => {
                const x = 600
                const y = 300
                cy.wrap(image).click(x,y)
                cy.wait(500)
                cy.get('.save > .MuiButton-label').should('be.visible').click()
            }
            const clearSymbols = () => {
                cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
            }
            cy.get('.image-row').then((row) => {
                const image = row[0].childNodes[0]
                cy.wrap(image).dblclick()
                markAction(image)
                cy.wait(3000)
                clearSymbols()
            })
        })
    })
})