import { selectHangingType, waitLoadingResources } from "../common/functions"

export function validateHangingButtonFeature() {
    const validateFirst = () => {
        selectHangingType('first')
        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(1)
            expect(row[0].childElementCount).to.eq(4)
        })
    }
    const validateSecond = () => {
        selectHangingType('second')
        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(1)
            expect(row[0].childElementCount).to.eq(2)
        })
    }
    const validateLast = () => {
        selectHangingType('last')
        cy.get('.thickness-toggle').then((value) => {
            cy.wrap(value).find('button').contains('SLABS').should('exist').and('be.visible').click()
            waitLoadingResources()
            cy.wrap(value).find('button').contains('PLANES').should('exist').and('be.visible').click()  
        })
        cy.get('.image-row').then((row) => {
            expect(row.length).to.eq(1)
            expect(row[0].childElementCount).to.eq(2)
        })

    }
    validateLast()
    cy.wait(1000)
    validateSecond()
    cy.wait(1000)
    validateFirst()
    cy.wait(1000)
}