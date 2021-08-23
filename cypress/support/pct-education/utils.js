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