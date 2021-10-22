import { TOOL } from "../common/constants";
import { clearSymbols, clickSave, selectTool, toggleMarkInfo, waitLoadingResources } from "../common/functions";

export function selectDropdownIfExist() {
    cy.get('body').then($body => {
        if ($body.find('#mark-details').length > 0) {
            if ($body.find('#mark-details').is(':visible')) {
                cy.get('div').contains('Select nodule type').click().type('{downarrow}{enter}');
                cy.get('div').contains('Select size').click().type('{downarrow}{enter}');
            } else {
                assert.isOk(`mark-details exist but not visible`);
            }
        } else {
            assert.isOk(`mark-details not exist`);
        }
    });
}
function markWithSaveAction(row, x, y) {
    if (x && y) {
        cy.wrap(row).click(x,y)
    } else {
        cy.wrap(row).click()
    }
    selectDropdownIfExist()
    clickSave()
}
export function validateHideInfoFeature() {
    waitLoadingResources()
    selectTool(TOOL.MARKER)
    clearSymbols()
    cy.get('.image-row').then((row) => {
        const image = row[0].childNodes[0]
        markWithSaveAction(image)
    })
    toggleMarkInfo()
    cy.wait(1000)
    toggleMarkInfo()
}

export function validateClearSymbols() {
    waitLoadingResources()
    selectTool(TOOL.MARKER)
    clearSymbols()
    cy.get('.image-row').then((row) => {
        const image = row[0].childNodes[0]
        markWithSaveAction(image)
    })
    cy.wait(1000)
    clearSymbols()
}