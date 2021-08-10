const second = 180
const duration = second * 1000
const customTimeout = { timeout: duration }
import { apiHostStatic } from '../constants/index'

export function getTool(name) {
    cy.get('.more-icon', customTimeout)
        .should('exist')
        .and('be.visible').click()
    cy.get(`.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="${name}"]`, customTimeout)
        .should('exist')
        .and('be.visible')
        .click()
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
    cy.get("body", customTimeout).then((body) => {
        const Questionnaires = 'Questionnaires'
        if (body.find('h2').length > 0) {
            cy.get('h2').then((value) => {
                if (value[0].innerHTML === Questionnaires) {
                    return cy.get({ found: true }).as('foundQuestionnairePage')
                }
            })
        } else {
            return cy.get({ found: false }).as('foundQuestionnairePage')
        }
    });
}
export function isCurrentAnEvaluationFormPage() {
    cy.get("body", customTimeout).then((body) => {
        const EvaluationForm = 'Evaluation Form'
        if (body.find('h2').length > 0) {
            cy.get('h2').then((value) => {
                if (value[0].innerHTML === EvaluationForm) {
                    return cy.get({ found: true }).as('foundEvaluationFormPage')
                }
            })
        } else {
            return cy.get({ found: false }).as('foundEvaluationFormPage')
        }
    });
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