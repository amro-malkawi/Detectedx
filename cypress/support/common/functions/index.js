export function getTool(name) {
    cy.get('.tool-container').should('be.visible').click()
    cy.get(`.MuiPaper-root > .test-view-toolbar > .tool-container > [data-tool="${name}"]`)
        .click()
        .should('exist')
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
    cy.get("body").then($body => {
        const h2 = $body.find('h2')
        const Questionnaire = 'Questionnaire'
        const foundQuestionnairePage = h2.length > 0 && h2[0].innerText.includes(Questionnaire) ? { found: true } : { found: false }
        return cy.get(foundQuestionnairePage).as('foundQuestionnairePage')
    });
}
export function isCurrentAnEvaluationFormPage() {
    cy.get("body").then($body => {
        const h2 = $body.find('h2')
        const EvaluationForm = 'Evaluation Form'
        const foundEvaluationFormPage = h2.length > 0 && h2[0].innerText.includes(EvaluationForm) ? { found: true } : { found: false }
        return cy.get(foundEvaluationFormPage).as('foundEvaluationFormPage')
    });
}