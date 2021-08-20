export function validateHangingButtonFeature() {
    const selectFirst = () => {
        cy.get('.hanging-type-container').click().should('exist')
        cy.get('.MuiList-root > :nth-child(1)').click()
        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(2)
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
    const selectLast = () => {
        cy.get('.hanging-type-container').click().should('exist')
        cy.get('.MuiList-root > :nth-child(7)').click().should('exist')
        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(1)
            expect(row[0].childElementCount).to.eq(4)
        })

    }
    selectLast()
    cy.wait(3000)
    selectSecond()
    cy.wait(3000)
    selectFirst()
    cy.wait(3000)
}