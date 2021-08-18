import { apiHostStatic, MORE_ICON } from '../constants/index'

export function checkLoadingIndicator() {
    cy.get('.loading-indicator').should('not.exist')
}
export function clearSymbols() {
    cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
}
export function routeToScorePage() {
    return cy.get('button').contains('Scores').click({ force: true })
}
export function checkAnswer() {
    return cy.get('button').contains('Answers').click()
}
export function downloadCertificate() {
    return cy.get('button').contains('Certificate of Completion').click()
}
export function toggleInvertAction () {
    cy.getBySel('tool-invert').should('be.visible').first().click();
}
export function toggleSeriesIcon () {
    cy.get('.series-icon').click()
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
                        target = button
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
export function waitForUserInputQuestionnairePage() {
    cy.wait(2000)
    isCurrentAQuestionPage()
    cy.wait(1000)
    cy.get('@foundQuestionnairePage').then(({ selector }) => {
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
        cy.wrap(value).select(position)
    })
}
export function waitLinearProgressBar() {
    cy.getBySel('linear-progress').then((value) => {
        if (value.length > 0) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                cy.wrap(element).should('not.exist')
            }
        }
    })
}
export function clickOnModalityTab(modality_name) {
    cy.getBySel('modality-tab-item').then((value) => {
        if (value[3].innerText.includes(modality_name)) {
            cy.contains(modality_name).should('be.visible').click();
        }
    })
}