// const apiHost = Cypress.env('apiUrl')
const apiHost = 'https://static.detectedx.com'
const apiImages = {
    method: 'GET',
    url: `${apiHost}/images/**`,
}

function interceptImages() {
    cy.intercept({
        method: apiImages.method,
        url: apiImages.url,
    }).as("loadImages");
}

function waitForTransition() {
    const time = 3000
    cy.wait(time)
}

function drawFreehand(element) {
    cy.get(element)
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: 946, clientY: 1228 })
        .trigger('mouseup', { force: true })
}
context('Test Page - Breast Mammo', () => {
    describe('Expect to see breast mammo modality functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').click();
            cy.getBySel('test-continue-attemp-progress-test-button')
                .first()
                .click({ force: true })
            cy.wait(2000)
        })
        afterEach(() => {
            waitForTransition()
        })

        it('should be able to load all images', () => {
            cy.wait(2000)
            interceptImages()
            cy.wait('@loadImages').its('response.statusCode').should('eq', 200)
            cy.getReact('TestView').nthNode(2).then((value) => {
                const { state } = value
                expect(state.isShowLoadingIndicator).to.be.false
            })
        })
        it('should be able to use grid status', () => {
            cy.get('.tool-container').click().should('exist')
            cy.wait(1000)
            cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > :nth-child(9)')
                .click()
                .should('exist')
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
            cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > :nth-child(9)')
                .click()
                .should('exist')

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
            }
            const expectIsShowImageBrowserToBe = (boolean) => {
                cy.getReact('ImageBrowser').nthNode(2).then((value) => {
                    const { props } = value
                    expect(props.isShowImageBrowser).to.be[boolean]
                    wait()
                })
            }
            wait()
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
        it('should be able to use Freehand tool', () => {
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).dblclick()
            })
            cy.wait(2000)
            cy.get('.more-icon').click()
            cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="MarkerFreehand"]')
                .click()
                .should('exist')
            cy.wait(2000)
            cy.get('.image-row').then((row) => {
                const element = row[0].childNodes[0]
                drawFreehand(element)
            }).should('exist')
            cy.getReact('Toolbar').then((value) => {
                expect(value[1].props.currentTool).to.equal('MarkerFreehand')
            })
        })
        it('should be able to use Mark tool', () => {
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).dblclick()
            })
            cy.wait(2000)
            cy.get('.more-icon').click()
            cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="Marker"]')
                .click()
                .should('exist')
            cy.wait(2000)
            cy.getReact('Toolbar').then((value) => {
                expect(value[1].props.currentTool).to.equal('Marker')
            })
            cy.get('.image-row').then((row) => {
                cy.wrap(row[0].childNodes[0]).click();
            })
        })
        it('should be able to use tool of toolbar', () => {
            const verifyTool = (toolName) => {
                cy.get('.more-icon').click()
                cy.get(`.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool=${toolName}]`)
                    .click()
                    .should('exist')
                cy.wait(2000)
                cy.getReact('Toolbar').then((value) => {
                    expect(value[1].props.currentTool).to.equal(`${toolName}`)
                })
            }
            const toolList = ['Pan', 'Zoom', 'Magnify', 'Wwwc', 'Marker', 'MarkerFreehand']
            toolList.forEach(name => {
                verifyTool(name)
            });
        })
    })
})