import { apiAttempt, apiDeleteShapes, apiImages, apiSelectDrownDownList, BUTTON, MORE_ICON, TOOL } from '../constants/index'
import { dropdown } from '../../../support/breasted-mammography/breasted-mammography-dropdown-list'

export function loginWithEmailPasswordWithCookiesPreserved() {
    cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'))
    const preserveOptions = {
        preserve: ['AUTHID', 'user_id', 'user_email' ,'user_name', 'access_token'],
    }
    Cypress.Cookies.defaults(preserveOptions)
}
export function waitLoadingResources() {
    cy.wait(2000)
    checkPageLoader()
    checkLoadingIndicator()
    waitLinearProgressBar()
}
export function waitUntilOptionsBuilder(errorMsg, timeout, interval) {
    return {
        errorMsg: errorMsg ? errorMsg : null,
        timeout: timeout ? timeout : 60 * 1000,
        interval: interval ? interval : 500
    }
}
export function checkPageLoader() {
    cy.get('body').then($body => {
        if ($body.find('.page-loader').length > 0) {
            if ($body.find('.page-loader').is(':visible')) {
                const errorMsg = 'Failed waiting page loader to disappear (timeout)'
                const opts = waitUntilOptionsBuilder(errorMsg)
                cy.waitUntil(() => cy.get('.page-loader').then((pageLoader) => {
                    cy.wrap(pageLoader).should('not.exist')
                }), opts);

            } else {
                assert.isOk(`page loader exist but not visible`);
            }
        } else {
            assert.isOk(`page loader not exist`);
        }
    });
}
export function checkLoadingIndicator() {
    cy.get('body').then($body => {
        if ($body.find('.loading-indicator').length > 0) {
            if ($body.find('.loading-indicator').is(':visible')) {
                const errorMsg = 'Failed waiting load indicator to disappear (timeout)'
                const opts = waitUntilOptionsBuilder(errorMsg)
                cy.waitUntil(() => cy.get('.loading-indicator').then((loadingIndicator) => {
                    cy.wrap(loadingIndicator).should('not.exist')
                }), opts);
                waitUntilCanvasIsReady()
            } else {
                assert.isOk(`loading indicator exist but not visible`);
            }
        } else {
            assert.isOk(`loading indicator not exist`);
        }
    });
}
export function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}
export function waitUntilCanvasIsReady(canvas) {
    const errorMsg = 'Image loading failed (timeout)'
    const opts = waitUntilOptionsBuilder(errorMsg)
    if (canvas) {
        // Check for specific canvas
        cy.waitUntil(() => isCanvasBlank(canvas) === false, opts);
        cy.log('Image is now ready to interact.')
    } else {
        // Check for all canvases
        cy.get('body').then($body => {
            if ($body.find('.image-row').length > 0) {
                if ($body.find('.image-row').is(':visible')) {
                    cy.get('.image-row').then((row) => {
                        if (row.length > 0) {
                            for (let index = 0; index < row.length; index++) {
                                const gridRow = row[index];
                                const imageLength = gridRow.childNodes.length
                                for (let j = 0; j < imageLength; j++) {
                                    const canvas = gridRow.childNodes[j].childNodes[0].childNodes[0];
                                    cy.waitUntil(() => isCanvasBlank(canvas) === false, opts);
                                }
                            }
                            cy.log('All images is now ready to interact.')
                        }
                    })
                } else {
                    assert.isOk(`image row exist but not visible`);
                }
            } else {
                assert.isOk(`image row not exist`);
            }
        });
    }
    
}
export function clearSymbols() {
    interceptClearSymbols()
    cy.getBySel('tool-clear-symbols').eq(0).should('exist').and('be.visible').click();
    cy.wait('@deleteShapesResponse').its('response.statusCode').should('eq', 200)
}
export function clearSymbolsAt(index) {
    interceptClearSymbols()
    cy.getBySel('tool-clear-symbols').eq(index).should('exist').and('be.visible').click();
    cy.wait('@deleteShapesResponse').its('response.statusCode').should('eq', 200)
}
export function routeToScorePage() {
    cy.get('button').contains('Scores').click({ force: true })
}
export function checkAnswer() {
    cy.get('button').contains('Answers').click()
}
export function downloadCertificate() {
    cy.get('button').contains('Certificate of Completion').click()
}
export function downloadCertificates() {
    cy.get('button').contains('Certificate of Completion').click()
    cy.get('button').contains('Physicians').click()
    cy.get('button').contains('Non Physicians').click()
}
export function toggleInvertAction() {
    cy.getBySel('tool-invert').should('be.visible').first().click();
}
export function toggleSeriesIcon() {
    cy.get('.series-icon').should('be.visible').click()
}
export function toggleMarkInfo() {
    cy.getBySel('tool-mark-info').should('be.visible').first().click()
}
export function isButtonExist(name) {
    cy.get('button').then(($button) => {
        if ($button.text().includes(name)) {
            return cy.get({ found: true }).as(`found${name}Button`)
        } else {
            return cy.get({ found: false }).as(`found${name}Button`)
        }
    })
}
export function selectHangingType(type) {
    cy.get('.hanging-type-container').then((hangingButton) => {
        cy.wrap(hangingButton).should('exist').and('be.visible').click()
        cy.get('.MuiList-root').then((list) => {
            let target = null
            switch (type) {
                case 'first':
                    target = list[0].childNodes[0]
                    break;
                case 'second':
                    target = list[0].childNodes[1]
                    break;
                case 'last':
                    target = list[0].childNodes[list[0].childNodes.length - 1]
                    break;
                default:
                    break;
            }
            cy.wrap(target).click()
        })
    })
}

export function navigateToSpecificTestPage(cardName) {
    const possibleButton = [BUTTON.Continue, BUTTON.Restart]
    clickExistButtonInCard(cardName, possibleButton)
}
export function navigateToTestPage(modality_name) {
    cy.getBySel(`"${modality_name}"`).then((modality_info) => {
        cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
            if (test_set.find("button:contains('Start')").length > 0) {
                cy.wrap(test_set).find('button').contains('Start').click({ force: true })
            } else {
                cy.wrap(test_set).find('button').contains('Continue').click({ force: true })
            }
        })
    })
    cy.wait(2000)
}
export function navigateToScorePage(modality_name) {
    cy.getBySel(`"${modality_name}"`).then((modality_info) => {
        cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
            if (test_set.find("button:contains('Scores')").length > 0) {
                cy.wrap(test_set).find('button').contains('Scores').click({ force: true })
            }
        })
    })
}
export function clickViewButton(index) {
    cy.get('button').then((buttons) => {
        cy.wrap(buttons[index])
            .contains('View')
            .should('exist')
            .and('be.visible')
            .click()
    })
}
export function getTool(name, opts) {
    if (opts && opts.MORE_ICON) {
        cy.get('.more-icon')
            .should('exist')
            .and('be.visible').click()
        cy.get(`.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="${name}"]`)
            .should('exist')
            .and('be.visible')
            .click()
    } else {
        cy.get(`[data-tool="${name}"]`).should('exist').and('be.visible').click()
    }
}
export function selectTool(name) {
    cy.get('.test-view-toolbar').should('exist').and('be.visible')
    cy.get('body').then($body => {
        if ($body.find('.more-icon').length > 0) {
            if ($body.find('.more-icon').is(':visible')) {
                // more icon is visible
                getToolWithMoreIcon(name)
            } else {
                // more icon is exist but not visible
                getTool(name)
            }
        } else {
            // more icon is not exist
            getTool(name)
        }
    });
}
export function getToolWithMoreIcon(name) {
    getTool(name, MORE_ICON)
}
export function getClickableButtonInCard(cardName) {
    let buttons = [];
    cy.getReact('CardBody').then((cards) => {
        cards.some(element => {
            if (element.node.innerText.includes(cardName)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                array.forEach(button => {
                    buttons.push(button.innerText)
                });
            }
        })
    });
    return cy.get(buttons).as('clickableButtons')
}
export function getButtonByNameOfCard(cardName, buttonName) {
    cy.getReact('CardBody').then((cards) => {
        let target = null;
        cards.some(element => {
            if (element.node.innerText.includes(cardName)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                array.forEach(button => {
                    if (button.innerText.includes(buttonName)) {
                        target = button
                        return true;
                    }
                });
            }
        });
        cy.get(target).click();
    });
}
export function clickExistButtonInCard(cardName, buttonNames) {
    cy.getReact('CardBody').then((cards) => {
        let target = null;
        cards.some(element => {
            if (element.node.innerText.includes(cardName)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                let existingFoundButtons = [];
                array.forEach(button => {
                    existingFoundButtons.push(button.innerText)
                });
                const intersect = existingFoundButtons.filter(value => buttonNames.includes(value));
                array.forEach(button => {
                    if (button.innerText.includes(intersect.toString())) {
                        target = button
                        // if (button.parentNode.parentNode.innerText === `${cardName}\n${intersect.toString()}`) {
                        //     target = button
                        // }
                    }
                });
            }
        });
        cy.get(target).click();
    });
}
export function isCurrentAQuestionPage() {
    cy.wait(3000)
    cy.url().then((url) => {
        const mainQuestions = 'mainQuestions'
        if (url.includes(mainQuestions)) {
            waitLoadingResources()
            cy.get("body").then((body) => {
                const Questionnaires = 'Questionnaires'
                if (body.find('h2').length > 0) {
                    cy.get('h2').then((value) => {
                        if (value[0].innerHTML === Questionnaires) {
                            return cy.get({ found: true }).as('foundQuestionnairePage')
                        } else {
                            return cy.get({ found: false }).as('foundQuestionnairePage')
                        }
                    })
                } else {
                    return cy.get({ found: false }).as('foundQuestionnairePage')
                }
            });
        } else {
            return cy.get({ found: false }).as('foundQuestionnairePage')
        }
    })
}
export function isCurrentAnEvaluationFormPage() {
    cy.wait(3000)
    cy.url().then((url) => {
        const postQuestions = 'postQuestions'
        if (url.includes(postQuestions)) {
            waitLoadingResources()
            return cy.get({ found: true }).as('foundEvaluationFormPage')
        } else {
            return cy.get({ found: false }).as('foundEvaluationFormPage')
        }
    })
}
export function interceptAttemptRequest() {
    cy.intercept({
        method: apiAttempt.method,
        url: apiAttempt.url,
    }).as("attemptResponse");
}
export function interceptDropdownRequest() {
    cy.intercept({
        method: apiSelectDrownDownList.method,
        url: apiSelectDrownDownList.url,
    }).as("scoresAttemptPercentile");
}
export function interceptClearSymbols() {
    cy.intercept({
        method: apiDeleteShapes.method,
        url: apiDeleteShapes.url,
    }).as("deleteShapesResponse");
}
export function interceptDicomImages() {
    cy.intercept({
        method: apiImages.method,
        url: apiImages.url,
    }).as("dicomImagesResponse");
}
export function pauseIfVideoModalExist() {
    cy.wait(3000)
    cy.get('body').then((value) => {
        if (value.find('video').length > 0) {
            const message = 'After finish watching video please click "X" (Close) button \nand Click "Resume" to continue the test.'
            cy.log(message)
            alert(message)
            cy.pause()
        }
    })
}
export function waitLoadingToTestView() {
    cy.location('pathname').should('include', '/test-view');
}
export function waitForUserInputQuestionnairePage() {
    cy.wait(3000)
    isCurrentAQuestionPage()
    cy.get('@foundQuestionnairePage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
export function waitForUserInputEvaluationPage() {
    cy.wait(3000)
    isCurrentAnEvaluationFormPage()
    cy.get('@foundEvaluationFormPage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
export function alertAndPause() {
    const message = 'After input all questionnaire, please click "Next" button below the questionnaire page. After that to continue the test please click "Resume" button.'
    cy.log(message)
    alert(message)
    return cy.pause()
}
export function navigateToTestSet(modality_name) {
    cy.getBySel(`"${modality_name}"`).then((modality_info) => {
        cy.wrap(modality_info).find(`[data-cy="test-set"]`).then((test_set) => {
            if (test_set.find("[data-cy=test-start-button]:contains('Start')").length > 0) {
                cy.wrap(test_set).contains('Start').click({ force: true })
            } else {
                if (test_set.find("[data-cy=test-continue-button]:contains('Continue')").length > 0) {
                    cy.wrap(test_set).contains('Continue').click({ force: true })
                }
            }
        })
    })
}
export function selectDensity(text) {
    cy.getBySel('density-icon').click()
    cy.getBySel('quality-button-container').within((value) => {
        cy.wrap(value).find('div').contains(text).click()
    })
}
export function selectConfidenceBySelector(level, selector) {
    let count = 0
    const click = $el => {
        count += 1
        return $el.click()
    }
    cy.getBySel(`${selector}`).then((value) => {
        const choiceIndex = level
        const element = value[0].children[choiceIndex].childNodes[0]
        cy.wrap(element)
            .pipe(click)
            .should($el => {
                expect($el).to.be.visible
            }).then(() => {
                cy.log(`clicked ${count} time(s)`)
            })
    })
}
export function selectChestCTConfidence(level) {
    selectConfidenceBySelector(level, 'chest-ct-confidence-position')
}
export function selectCovidConfidence(level) {
    selectConfidenceBySelector(level, 'covid-confidence-position')
}
export function selectChestConfidence(level) {
    selectConfidenceBySelector(level, 'chest-confidence-position')
}
export function selectTheLast() {
    cy.getBySel('test-case-selector').should('exist').and('be.visible').then((value) => {
        const position = (value[0].length - 1).toString()
        cy.wrap(value[0]).select(position)
    })
}
export function selectTestCaseAt(order) {
    cy.getBySel('test-case-selector').should('exist').and('be.visible').then((value) => {
        cy.wrap(value[0]).select((order - 1).toString(), { force: true })
    })
}
export function waitLinearProgressBar() {
    cy.wait(3000)
    cy.get("body").then($body => {
        if ($body.find(`[data-cy=linear-progress]`).length > 0) {
            cy.getBySel('linear-progress').then($elment => {
                if ($elment.is(':visible')) {
                    if ($elment.length > 0) {
                        for (let index = 0; index < $elment.length; index++) {
                            const element = $elment[index];
                            cy.wrap(element).should('not.exist')
                        }
                    }
                }
            });
        }
    });
}
export function clickOnModalityTab(modality_name) {
    cy.getBySel('modality-tab-item').then((value) => {
        if (value[3].innerText.includes(modality_name)) {
            cy.contains(modality_name).should('be.visible').click();
        }
    })
}
export function answerQuestionImagEDChest() {
    cy.get('.covid-questions').then((value) => {
        cy.wrap(value).find('input[type=radio]').check('Yes').should('exist')
        cy.wrap(value).find('input[type=radio]').check('Yes').should('exist')
    })
}
export function answerQuestionImagEDMammography() {
    cy.get('.quality-question-container').then((questionContainer) => {
        cy.wrap(questionContainer).find('.question-title').each((questionTitle) => {
            const forwardIcon = questionTitle[0].children[0].childNodes[0].outerHTML
            if (forwardIcon.includes('rotate-90')) {
                cy.wrap(questionTitle).click().should('exist')
            }
        })
        cy.wrap(questionContainer).find('.question-number').each((questionNumber) => {
            cy.wrap(questionNumber).click().should('exist')  
        })
    })
}
// ---------------- post-test ----------------
export function checkRadioButton(value) {
    cy.get('[type="radio"]').check(value)
}
export function clickStartPostTest() {
    cy.get('button').contains('Start').should('exist').and('be.visible').click()
}
export function clickSubmit() {
    cy.get('button').contains('Submit').should('exist').and('be.visible').click()
    cy.wait(2000)
}
export function clickSave() {
    cy.get('button').contains('Save').should('exist').and('be.visible').click()
}
export function clickReattempt() {
    cy.get('button').contains('Reattempt').should('exist').and('be.visible').click()
}
export function clickReviewAnswers() {
    const selector = 'review-answers-button'
    cy.get(`[data-cy=${selector}]`).should('exist').and('be.visible').click()
}
export function waitUntilAllImagesLoaded() {
    checkLoadingIndicator()
    cy.wait('@dicomImagesResponse').its('response.statusCode').should('eq', 200)
    cy.wait('@dicomImagesResponse').its('response.body').should('be.exist')
    cy.wait('@dicomImagesResponse').then(({ response }) => {
        if (response.body) {
            cy.window().its('store').invoke('getState').then(({ testView }) => {
                const { showImageList } = testView
                cy.wrap(showImageList).its('length').should('be.gte', 1)
            })
        }
    })
}

// ---------------- score-spec -------------------

export function checkAllDropdownListAt(number) {
    interceptDropdownRequest()
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

    cy.wait('@scoresAttemptPercentile').its('response.statusCode').should('be.oneOf', [200, 304])
}
export function markOnFilm() {
    cy.get('.image-row').then((row) => {
        const canvas = row[0].childNodes[0].childNodes[0].childNodes[0]
        waitUntilCanvasIsReady(canvas)
        const image = row[0].childNodes[0]
        selectTool(TOOL.MARKER)
        clearSymbols()
        cy.wrap(image).click()
    })
}
export function saveMarkPoint() {
    cy.get('.right > .MuiButtonBase-root').should('exist').click()
}
export function backToHome() {
    cy.get('.navbar-right > :nth-child(1) > .MuiButtonBase-root').should('exist').click()
}
export function clickDefinitionButton() {
    cy.get('button').contains('Definitions')
        .should('exist')
        .scrollIntoView()
        .and('be.visible')
        .click()
    cy.wait(3000)
}
export function closeDefinition() {
    cy.get('#alert-dialog-title > .MuiButtonBase-root').click()
}