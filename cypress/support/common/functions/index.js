import { apiHostStatic, BUTTON, MORE_ICON } from '../constants/index'

export function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
export function clearSymbols() {
    cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
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
    cy.wait(3000)
    cy.window().its('store').invoke('getState').then((state) => {
        const imageBrowser = state.testView.isShowImageBrowser
        if (imageBrowser) {
            cy.get('.image-browser').should('be.visible')
            toggleSeriesIcon()
            cy.get('.image-browser').should('not.be.visible')
        } else {
            cy.get('.image-browser').should('not.be.visible')
            toggleSeriesIcon()
            cy.get('.image-browser').should('be.visible')
        }
    })
}
export function validateInstructionFeature() {
    cy.get('button').contains('Instruction').should('exist').click()
    cy.get('.MuiDialogContent-root').scrollTo('bottom', { duration: 3000 })
    cy.get('.MuiDialogContent-root').scrollTo('top', { duration: 3000 })
    cy.get('button').contains('Close').click().should('not.exist')
}
export function validateNextPreviousFeature() {
    const testCaseValue = String(0)
    cy.get('select').select(testCaseValue)
    cy.get('select').should('have.value', testCaseValue)
    validateNextButton(testCaseValue)
    validatePreviousButton(testCaseValue)
}
export function validateGridFeature() {
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
}
export function validateInvertFeature() {
    toggleInvertAction()
    toggleInvertAction()
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
                        if (button.parentNode.parentNode.innerText === `${cardName}\n${intersect.toString()}`) {
                            target = button
                        }
                        // target = button
                        return true;
                    }
                });
            }
        });
        cy.get(target).click();
    });
}
export function isCurrentAQuestionPage() {
    cy.url().then((url) => {
        const mainQuestions = 'mainQuestions'
        if (url.includes(mainQuestions)) {
            checkLoadingIndicator()
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
    cy.url().then((url) => {
        const postQuestions = 'postQuestions'
        if (url.includes(postQuestions)) {
            checkLoadingIndicator()
            return cy.get({ found: true }).as('foundEvaluationFormPage')
        } else {
            return cy.get({ found: false }).as('foundEvaluationFormPage')
        }
    })
}
export function interceptAttemptRequest() {
    const apiHost = Cypress.env('apiUrl')
    const apiAttempt = {
        method: 'GET',
        url: `${apiHost}/attempts/**`
    }
    cy.intercept({
        method: apiAttempt.method,
        url: apiAttempt.url,
    }).as("attemptResponse");
}
export function interceptDicomImages() {
    const apiImages = {
        method: 'GET',
        url: `${apiHostStatic}/images/**`
    }
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
    cy.wait(1500)
    isCurrentAQuestionPage()
    cy.wait(1000)
    cy.get('@foundQuestionnairePage').then(({ selector }) => {
        if (selector.found) {
            alertAndPause()
        }
    })
}
export function waitForUserInputEvaluationPage() {
    cy.wait(1500)
    isCurrentAnEvaluationFormPage()
    cy.wait(1000)
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

export function selectCovidConfidence(level) {
    let count = 0
    const click = $el => {
        count += 1
        return $el.click()
    }
    cy.getBySel('covid-confidence-position').then((value) => {
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
export function selectConfidence(level) {
    let count = 0
    const click = $el => {
        count += 1
        return $el.click()
    }
    cy.getBySel('confidence-position').then((value) => {
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
export function selectTheLast() {
    cy.get('.form-control').should('exist').and('be.visible').then((value) => {
        const position = (value[0].length - 1).toString()
        cy.wrap(value[0]).select(position)
    })
}
export function selectDropDownAt(order) {
    cy.get('.form-control').then((value) => {
        cy.wrap(value[0]).select((order - 1).toString(), { force: true })
    })
}
export function waitLinearProgressBar() {
    cy.wait(1000)
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
// ---------------- post-test ----------------
export function clickStartPostTest() {
    cy.get('button').contains('Start').should('exist').and('be.visible').click()
}
export function clickSubmit() {
    cy.get('button').contains('Submit').should('exist').and('be.visible').click()
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