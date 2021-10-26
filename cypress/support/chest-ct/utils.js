export function validateGridFeature(opts) {
    let selectGridTool = null
    let dismissSelection = null
    if (opts && opts.selectMoreIcon) {
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
        dismissSelection = () => {}
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
}