import { 
    alertAndPause, 
    answerQuestionImagEDChest, 
    answerQuestionImagEDMammography, 
    backToHome, 
    clearSymbols, 
    clickSubmit, 
    clickViewButton, 
    interceptDropdownRequest, 
    isButtonExist, 
    isCurrentAQuestionPage, 
    markOnFilm, 
    saveMarkPoint, 
    selectChestConfidence, 
    selectChestCTConfidence, 
    selectCovidConfidence, 
    selectTheLast, 
    selectTool, 
    toggleInvertAction, 
    toggleMarkInfo, 
    toggleSeriesIcon, 
    waitLinearProgressBar, 
    waitLoadingResources, 
    waitUntilCanvasIsReady
} from "."

import { dropdown } from "../../breasted-mammography/breasted-mammography-dropdown-list"

import { MODALITY_NAME, TOOL } from "../constants"
import { lengthAction, magnifyAction, markAction, markerFreehandAction, markWithSaveAction, panAction, resetAction, windowAction, zoomAction } from "./tool_action"

// ---------------- test spec ----------------------
export function validateNextButton(testCaseValue) {
    const name = 'Next'
    isButtonExist(name)
    cy.get(`@found${name}Button`).then(({ selector }) => {
        if (selector.found) {
            cy.get('button').contains(name).click()
            cy.get('select').should('have.value', Number(testCaseValue) + 1)
        }
    })
}

export function validatePreviousButton(testCaseValue) {
    const name = 'Previous'
    isButtonExist(name)
    cy.get(`@found${name}Button`).then(({ selector }) => {
        if (selector.found) {
            cy.get('button').contains(name).click()
            cy.get('select').should('have.value', Number(testCaseValue))
        }
    })
}
export function validateSeriesFeature() {
    waitLoadingResources()
    cy.window().its('store').invoke('getState').then((state) => {
        expect(state).to.exist
        cy.get('.series-icon').then((seriesIcon) => {
            expect(seriesIcon).to.exist
            if (seriesIcon[0].outerHTML.includes('active')) {
                cy.get('.image-browser').should('be.visible')
                toggleSeriesIcon()
                cy.get('.image-browser').should('not.be.visible')
            } else {
                cy.get('.image-browser').should('not.be.visible')
                toggleSeriesIcon()
                cy.get('.image-browser').should('be.visible')
            }
        })
    })
}
export function validateInstructionFeature() {
    cy.get('button').contains('Instruction').should('exist').click()
    cy.get('.MuiDialogContent-root').scrollTo('bottom', { duration: 3000 })
    cy.get('.MuiDialogContent-root').scrollTo('top', { duration: 3000 })
    cy.get('button').contains('Close').click().should('not.exist')
}
export function validateNextPreviousFeature(opts) {
    waitLoadingResources()
    const testCaseSelector = 'Test Case Selector'
    const testCaseValue = String(0)
    const button = {
        next: 'Next',
        previous: 'Previous'
    }
    cy.get("body").then($body => {
        const isNextButtonExist = $body.find(`button:contains(${button.next})`).length > 0
        if (isNextButtonExist) {
            cy.wrap($body).find('button').contains(`${button.next}`).then(() => {
                assert.isOk(`${button.next} found `);
            })
        } else {
            assert.isOk(`${button.next} not found `);
        }
        const isPreviousButtonExist = $body.find(`button:contains(${button.previous})`).length > 0
        if (isPreviousButtonExist) {
            cy.wrap($body).find('button').contains(`${button.previous}`).then(() => {
                assert.isOk(`${button.previous} found `);
            })
        } else {
            assert.isOk(`${button.previous} not found `);
        }

        if ($body.find(`[data-cy=test-case-selector]`).length > 0) {
            //exist
            cy.getBySel('test-case-selector').then($elment => {
                if ($elment.is(':visible')) {
                    // exist and visible
                    cy.wrap($elment).should('exist').and('be.visible')
                    if ($elment && $elment[0].length > 1) {
                        assert.isOk(`${testCaseSelector} have length greather than 1`);
                        cy.getBySel('test-case-selector').select(testCaseValue)
                        cy.getBySel('test-case-selector').should('have.value', testCaseValue).and('exist').and('be.visible')
                        if (opts) {
                            if (opts.selectConfidence) {
                                switch (opts.modality_name) {
                                    case MODALITY_NAME.Chest:
                                        selectChestConfidence(opts.confidenceLevel)
                                        break;
                                    case MODALITY_NAME.ChestCT:
                                        selectChestCTConfidence(opts.confidenceLevel)
                                        break;
                                    case MODALITY_NAME.Covid:
                                        selectCovidConfidence(opts.confidenceLevel)
                                        break;
                                    default:
                                        break;
                                }
                            } else if (opts.answerQuestion) {
                                switch (opts.modality_name) {
                                    case MODALITY_NAME.ImagED_Chest:
                                        answerQuestionImagEDChest()
                                        break;
                                    case MODALITY_NAME.ImagED_Mammography:
                                        answerQuestionImagEDMammography()
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        validateNextButton(testCaseValue)
                        validatePreviousButton(testCaseValue)
                    } else {
                        assert.isOk(`${testCaseSelector} have length less than 1`);
                    }
                } else {
                    // exist but not visible
                    assert.isOk(`${testCaseSelector} is not visible`);
                }
            });
        } else {
            // not exist
            assert.isOk(`${testCaseSelector} not exist ','everything is OK`);
        }
    });
}
export function validateInvertFeature() {
    waitLoadingResources()
    waitUntilCanvasIsReady()
    toggleInvertAction()
    toggleInvertAction()
}
export function validateHideInfoFeature() {
    waitLoadingResources()
    waitUntilCanvasIsReady()
    selectTool(TOOL.MARKER)
    cy.get('.image-row').then((row) => {
        const image = row[0].childNodes[0]
        markWithSaveAction(image)
    })
    toggleMarkInfo()
    cy.wait(1000)
    toggleMarkInfo()

}
export function validateClearSymbols() {
    waitLoadingResources()
    waitUntilCanvasIsReady()
    selectTool(TOOL.MARKER)
    cy.get('.image-row').then((row) => {
        const image = row[0].childNodes[0]
        markWithSaveAction(image)
    })
    cy.wait(1000)
    clearSymbols()
}
export function validateSlicesFeature() {
    waitLoadingResources()
    waitUntilCanvasIsReady()
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
    ).set
    const changeRangeInputValue = $range => value => {
        nativeInputValueSetter.call($range[0], value)
        $range[0].dispatchEvent(new Event('change', { value, bubbles: true }))
    }
    cy.wait(3000)
    const slice = () => {
        cy.getBySel('stack-scrollbar-range').then((stackScrollbar) => {
            for (let i = 0; i < stackScrollbar.length; i++) {
                let element = stackScrollbar[i];
                let max = stackScrollbar[i].max/2
                let min = stackScrollbar[i].min
                for (let j = min; j <= max; j++) {
                    cy.wrap(element).then(input => changeRangeInputValue(input)(j))
                    cy.wait(350)
                }
            }
            cy.wait(1000)
            for (let i = 0; i < stackScrollbar.length; i++) {
                let element = stackScrollbar[i];
                let max = stackScrollbar[i].max/2
                let min = stackScrollbar[i].min
                for (let j = max; j >= min; j--) {
                    cy.wrap(element).then(input => changeRangeInputValue(input)(j))
                    cy.wait(350)
                }
            }
        })
    }
    slice()
}

export function validateGridFeature() {
    waitLoadingResources()
    let selectGridTool = null
    let dismissSelection = null
    cy.get('.test-view-toolbar').should('exist').and('be.visible')
    cy.get('body').then($body => {
        if ($body.find('.more-icon').length > 0) {
            if ($body.find('.more-icon').is(':visible')) {
                selectGridTool = () => {
                    cy.get('.more-icon').should('exist').and('be.visible').click()
                    cy.getBySel('grid-tool').should('exist').and('be.visible').last().click()
                }
                dismissSelection = () => {
                    cy.get('.MuiDialog-container').click().should('not.exist')
                }
            } else {
                selectGridTool = () => {
                    cy.getBySel('grid-tool').should('exist').and('be.visible').click()
                }
                dismissSelection = () => { }
            }
        } else {
            selectGridTool = () => {
                cy.getBySel('grid-tool').should('exist').and('be.visible').click()
            }
            dismissSelection = () => { }
        }
        selectGridTool()
        cy.get('tbody > :nth-child(2) > :nth-child(4)') // 8 grid
            .should('exist').and('be.visible').click()

        dismissSelection()

        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(2)
            expect(row[0].childElementCount).to.eq(4)
            expect(row[1].childElementCount).to.eq(4)
        })

        cy.wait(2000)

        selectGridTool()
        cy.get('tbody > :nth-child(2) > :nth-child(2)') // 4 grid
            .should('exist').and('be.visible').click()

        dismissSelection()

        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(2)
            expect(row[0].childElementCount).to.eq(2)
            expect(row[1].childElementCount).to.eq(2)
        })

        cy.wait(2000)

        selectGridTool()
        cy.get('tbody > :nth-child(1) > :nth-child(1)') // 1 grid
            .should('exist').and('be.visible').click()

        dismissSelection()

        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(1)
            expect(row[0].childElementCount).to.eq(1)
        })
    });
}

// ----------------- tool validation -------------------------
export function validateTool(name) {
    waitLoadingResources()
    waitUntilCanvasIsReady()
    selectTool(name)
    clearSymbols()
    actionTool(name)
}

export function actionTool(tool_name) {
    cy.get('.image-row').then((row) => {
        switch (tool_name) {
            case TOOL.PAN:
                panAction(row);
                break;
            case TOOL.ZOOM:
                zoomAction(row);
                break;
            case TOOL.MAGNIFY:
                magnifyAction(row);
                break;
            case TOOL.WINDOW:
                windowAction(row);
                break;
            case TOOL.LENGTH:
                lengthAction(row);
                break;
            case TOOL.MARKER:
                markAction(row);
                break;
            case TOOL.MARKER_FREEHAND:
                markerFreehandAction(row);
                break;
            case TOOL.RESET:
                resetAction()
                break;
            default:
                break;
        }
    })
}

// ----------------- score-spec ------------------------------
export function validateScoreContainer() {
    waitLoadingResources()
    cy.get('.score-container').should('exist').and('be.visible')
}
export function validateReSelectDropdownList(modality_name, view_button_index) {
    waitLoadingResources()
    const navigateToScoreOrTestPage = () => {
        cy.getBySel(`"${modality_name}"`).then((modality_info) => {
            cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
                if(test_set.find("button:contains('Scores')").length > 0) {
                    cy.wrap(test_set).find('button').contains('Scores').click({ force: true })
                    checkScorePage()
                } else if (test_set.find("button:contains('Start')").length > 0) {
                    cy.wrap(test_set).find('button').contains('Start').click({ force: true })
                    checkTestPage()
                } else {
                    cy.wrap(test_set).find('button').contains('Continue').click({ force: true })
                    checkTestPage()
                }
            })
        })
    }
    const checkScorePage = () => {
        clickViewButton(view_button_index ? view_button_index : 0)
        interceptDropdownRequest()
        const checkAllDropdownListAt = (number) => {
            const selector = `:nth-child(${number}) > .score-chart-title > .form-control`
            cy.get(selector)
                .should('exist')
                .and('be.visible')
                .select(dropdown.key.BreastPhysician)
                .invoke('val')
                .should('deep.equal', dropdown.value.BreastPhysician)
            cy.get(selector)
                .should('exist')
                .and('be.visible')
                .select(dropdown.key.Radiologist)
                .invoke('val')
                .should('deep.equal', dropdown.value.Radiologist)
            cy.get(selector)
                .should('exist')
                .and('be.visible')
                .select(dropdown.key.Radiographer)
                .invoke('val')
                .should('deep.equal', dropdown.value.Radiographer)
            cy.get(selector)
                .should('exist')
                .and('be.visible')
                .select(dropdown.key.Trainee)
                .invoke('val')
                .should('deep.equal', dropdown.value.Trainee)
            cy.get(selector)
                .should('exist')
                .and('be.visible')
                .select(dropdown.key.other)
                .invoke('val')
                .should('deep.equal', dropdown.value.other)

            cy.wait('@scoresAttemptPercentile').its('response.statusCode').should('eq', 200)
        }
        checkAllDropdownListAt(1)
        checkAllDropdownListAt(2)
        checkAllDropdownListAt(3)
    }
    const checkTestPage = () => {
        isCurrentAQuestionPage()
        cy.wait(1000)
        cy.get('@foundQuestionnairePage').then(({ selector }) => {
            if (selector.found) {
                alertAndPause()
                questionnaireFlow()
            } else {
                submitTestFlow()
            }
        })
        const questionnaireFlow = () => {
            checkAnswer()
            routeToScorePage()
            downloadCertificate()
        }
        const submitTestFlow = () => {
            submitTest()
            questionnaireFlow()
        }
        const submitTest = () => {
            clickSubmit()
            selectTheLast()
            waitLinearProgressBar()
            markOnFilm()
            saveMarkPoint()
            backToHome()
        }
    }
    navigateToScoreOrTestPage()
}
