import { dropdown } from '../../support/breasted-mammography/breasted-mammography-dropdown-list'
const apiHost = Cypress.env('apiUrl')
const apiSelectDrownDownList = {
    method: 'GET',
    url: `${apiHost}/scores/attempt_percentile**`
}
const CARD = {
    PriorCasesCancers2019: '2019 Prior Cases Cancers',
    MammographyDemo: 'Mammography Demo'
}
const CURRENT_TEST = {
    CARD: CARD.MammographyDemo
}
const BUTTON = {
    Continue: 'Continue',
    Restart: 'Re-Start',
    Scores: 'Scores',
}
const viewButtonIndex = 2

function getButtonByNameOfCard(card_name, button_name) {
    cy.getReact('CardBody').then((cards) => {
        let target = null;
        cards.some(element => {
            if (element.node.innerText.includes(card_name)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                array.forEach(button => {
                    if (button.innerText.includes(button_name)) {
                        target = button
                        return true;
                    }
                });
            }
        });
        cy.get(target).click();
    });
}

function getClickableButtonInCard(card_name) {
    let buttons = [];
    cy.getReact('CardBody').then((cards) => {
        cards.some(element => {
            if (element.node.innerText.includes(card_name)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                array.forEach(button => {
                    buttons.push(button.innerText)
                });
            }
        })
    });
    return cy.get(buttons).as('clickableButtons')
}

function clickExistButtonInCard(possibleNames) {
    cy.getReact('CardBody').then((cards) => {
        let target = null;
        cards.some(element => {
            if (element.node.innerText.includes(CURRENT_TEST.CARD)) {
                const array = element.node.childNodes[0].childNodes[1].childNodes;
                let existingFoundButtons = [];
                array.forEach(button => {
                    existingFoundButtons.push(button.innerText)
                });
                const intersect = existingFoundButtons.filter(value => possibleNames.includes(value));
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
function navigateToScorePage() {
    const selector = {
        card: CURRENT_TEST.CARD,
        button: BUTTON.Scores
    }
    getButtonByNameOfCard(selector.card, selector.button)
}

function clickViewButton(index) {
    cy.get('button').then((buttons) => {
        cy.wrap(buttons[index])
            .contains('View')
            .should('exist')
            .and('be.visible')
            .click()
    })
}

function isCurrentAQuestionPage() {
    cy.get("body").then($body => {
        const h2 = $body.find('h2')
        const Questionnaire = 'Questionnaire'
        const foundQuestionnairePage = h2.length > 0 && h2[0].innerText.includes(Questionnaire) ? { found: true } : { found: false }
        return cy.get(foundQuestionnairePage).as('foundQuestionnairePage')
    });
}

function interceptDropdownRequest() {
    cy.intercept({
        method: apiSelectDrownDownList.method,
        url: apiSelectDrownDownList.url,
    }).as("scoresAttemptPercentile");
}

context('Breasted Mammography - Score Page', () => {
    describe('Expect to see breasted mammography score page functional', () => {
        beforeEach(() => {
            cy.loginWithEmailPassword(Cypress.env('test_username'), Cypress.env('test_password'));
            cy.visit('/app/test/list')
            cy.waitForReact()
            cy.contains('BreastED - Mammography').click();
            cy.wait(1000)
        })
        afterEach(() => {
            cy.wait(1000)
        })

        it.only('should be able to submit test or make questionnaire on score page', () => {
            clickExistButtonInCard([BUTTON.Continue, BUTTON.Restart])
            cy.wait(2000)
            isCurrentAQuestionPage()
            cy.get('@foundQuestionnairePage').then(({ selector }) => {
                if (selector.found) {
                    cy.pause()
                    // answerQuestionnaire()
                } else {
                    submitTest()
                }
            })
            const submitTest = () => {
                cy.get('.form-control').then((value) => {
                    const position = (value[0].length - 1).toString()
                    cy.wrap(value).select(position)
                })
                cy.get('.image-row').then((row) => {
                    const image = row[0].childNodes[0]
                    cy.wait(1000)
                    cy.get('.more-icon').click()
                    cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="Marker"]').click()
                    cy.wait(1000)
                    cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
                    cy.wait(2000)
                    cy.wrap(image).click()
                })
                cy.wait(1000)
                cy.get('.right > .MuiButtonBase-root').click()
                cy.get('.test-previous-finish').click()
            }
            const answerQuestionnaire = () => {
                cy.get(':nth-child(1) > :nth-child(1) > .row > .MuiFormGroup-root > :nth-child(4) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get(':nth-child(1) > .row > .MuiFormGroup-root > :nth-child(5) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get(':nth-child(3) > :nth-child(1) > .row > .MuiFormGroup-root > :nth-child(3) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get(':nth-child(4) > :nth-child(1) > .row > .MuiFormGroup-root > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get(':nth-child(1) > .MuiFormGroup-root > #name').type(0)
                cy.get(':nth-child(1) > :nth-child(2) > .row > .MuiFormGroup-root > :nth-child(3) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get(':nth-child(2) > :nth-child(2) > .MuiFormGroup-root > #name').type(0)
                cy.get(':nth-child(3) > :nth-child(2) > .MuiFormGroup-root > #name').type(0)
                cy.get(':nth-child(4) > :nth-child(2) > .row > .MuiFormGroup-root > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get(':nth-child(5) > :nth-child(2) > .row > .MuiFormGroup-root > :nth-child(2) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                cy.get('.text-center > .MuiButtonBase-root').click()
                cy.wait(2000)
                cy.get(':nth-child(2) > .extra-button-container > .MuiButtonBase-root').click()
                cy.wait(2000)
                cy.get('.ml-20 > .MuiButton-label > .test-action-btn-label').click()
                cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root > .MuiButton-label').click()
            }
        })

        it('should be able to re-select the drop down list on score page', () => {
            const navigateToScoreOrTestPage = () => {
                getClickableButtonInCard(CURRENT_TEST.CARD)
                cy.get('@clickableButtons').then(({ selector }) => {
                    const buttons = selector
                    if (buttons.includes(BUTTON.Scores)) {
                        clickExistButtonInCard(BUTTON.Scores)
                        checkScorePage()
                    } else {
                        clickExistButtonInCard(buttons)
                        checkTestPage()
                    }
                })
            }
            const checkScorePage = () => {
                clickViewButton(viewButtonIndex)
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
                cy.wait(2000)
                isCurrentAQuestionPage()
                cy.get('@foundQuestionnairePage').then(({ selector }) => {
                    if (selector.found) {
                        cy.pause()
                        // answerQuestionnaire()
                    } else {
                        doTheTest()
                    }
                })

                const answerQuestionnaire = () => {
                    cy.get(':nth-child(1) > :nth-child(1) > .row > .MuiFormGroup-root > :nth-child(4) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get(':nth-child(1) > .row > .MuiFormGroup-root > :nth-child(5) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get(':nth-child(3) > :nth-child(1) > .row > .MuiFormGroup-root > :nth-child(3) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get(':nth-child(4) > :nth-child(1) > .row > .MuiFormGroup-root > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get(':nth-child(1) > .MuiFormGroup-root > #name').type(0)
                    cy.get(':nth-child(1) > :nth-child(2) > .row > .MuiFormGroup-root > :nth-child(3) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get(':nth-child(2) > :nth-child(2) > .MuiFormGroup-root > #name').type(0)
                    cy.get(':nth-child(3) > :nth-child(2) > .MuiFormGroup-root > #name').type(0)
                    cy.get(':nth-child(4) > :nth-child(2) > .row > .MuiFormGroup-root > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get(':nth-child(5) > :nth-child(2) > .row > .MuiFormGroup-root > :nth-child(2) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-14').click()
                    cy.get('.text-center > .MuiButtonBase-root').click() // next button

                    // after click next page will route to score page

                    cy.get(':nth-child(2) > .extra-button-container > .MuiButtonBase-root').click() // answer button
                    cy.get('.ml-20 > .MuiButton-label > .test-action-btn-label').click() // score button
                    cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root').click() // get certificate button
                }

                const doTheTest = () => {
                    const selectTheLast = () => {
                        cy.get('.form-control').then((value) => {
                            const position = (value[0].length - 1).toString()
                            cy.wrap(value).select(position)
                        })
                    }
                    const markOnFilm = () => {
                        cy.get('.image-row').then((row) => {
                            const image = row[0].childNodes[0]
                            cy.wait(1000)
                            cy.get('.more-icon').click()
                            cy.get('.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="Marker"]').click()
                            cy.wait(1000)
                            cy.getBySel('tool-clear-symbols').should('be.visible').first().click();
                            cy.wait(2000)
                            cy.wrap(image).click()
                        })
                    }
                    const saveMarkPoint = () => {
                        cy.get('.right > .MuiButtonBase-root').click()
                    }
                    const submitResult = () => {
                        cy.get('.test-previous-finish').click()
                    }
                    const backToHome = () => {
                        cy.get('.navbar-right > :nth-child(1) > .MuiButtonBase-root').click()
                    }
                    selectTheLast()
                    markOnFilm()
                    saveMarkPoint()
                    submitResult()
                    backToHome()
                }
            }
            navigateToScoreOrTestPage()

        })


        it('should be able to click on view button and navigate to score page', () => {
            navigateToScorePage()
            clickViewButton(viewButtonIndex)
            cy.get('.rct-page').should('be.visible')
            cy.get('.score-circle-container').should('be.visible')
        })

        it('should be able to see score data on score page', () => {
            navigateToScorePage()
            clickViewButton(viewButtonIndex)
            cy.get('.normal-score-data')
                .should('exist')
                .and('be.visible')
        })

        it('should be able to download the certificate of completion on score page', () => {
            navigateToScorePage()
            clickViewButton(viewButtonIndex)
            cy.get(':nth-child(1) > .extra-button-container > .MuiButtonBase-root')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
        })

        it('should be able to see the definition on score page by clicking button', () => {
            navigateToScorePage()
            clickViewButton(viewButtonIndex)
            cy.getBySel('test-attempt-definition-button')
                .should('exist')
                .scrollIntoView()
                .and('be.visible')
                .click()
                .should('exist')
            cy.wait(3000)
            cy.get('#alert-dialog-title > .MuiButtonBase-root').click()
        })
    })
})