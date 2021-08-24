export function panAction(row) {
    const pageX = 600
    const move = (row, i) => {
        cy.wrap(row[0].childNodes[0])
            .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
            .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
    }
    const smooth = 50;
    const pan = {
        up: {
            start: 75,
            end: 250
        },
        down: {
            start: 250,
            end: 100
        }
    }
    for (let i = pan.up.start; i < pan.up.end; i = i + smooth) {
        move(row, i)
    }
    for (let i = pan.down.start; i > pan.down.end; i = i - smooth) {
        move(row, i)
    }
}
export function magnifyAction(row, startPageX, startPageY) {
    startPageX = startPageX ? startPageX : 610
    startPageY = startPageY ? startPageY : 200
    const pageX = startPageX
    const pageY = startPageY
    const smooth = 1;
    const magnify = {
        start: startPageY,
        end: startPageY + 50
    }
    const movemouse = (row, i) => {
        cy.wrap(row[0].childNodes[0])
            .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
    }
    const move = () => {
        cy.wrap(row[0].childNodes[0]).trigger('mousedown', { which: 1, pageX: pageX, pageY: pageY })
        for (let i = magnify.start; i < magnify.end; i = i + smooth) {
            movemouse(row, i)
        }
        cy.wrap(row[0].childNodes[0]).trigger('mouseup')
    }
    move();
}

export function windowAction(row) {
    const element = row[0].childNodes[0]
    const pageX = 0
    const pageY = 0
    const moveY = (element, i) => {
        cy.wrap(element)
            .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
            .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
    }
    const moveX = (element, i) => {
        cy.wrap(element)
            .trigger('mousedown', { which: 1, pageX: i, pageY: pageY })
            .trigger('mousemove', { which: 1, pageX: i, pageY: pageY })
    }
    const smooth = 10;
    const window = {
        y: {
            in: {
                start: 1,
                end: 80
            },
            out: {
                start: 80,
                end: 1
            }
        },
        x: {
            in: {
                start: 1,
                end: 80
            },
            out: {
                start: 80,
                end: 1
            }
        }
    }
    for (let i = window.y.in.start; i < window.y.in.end; i = i + smooth) {
        moveY(element, i)
    }
    for (let i = window.y.out.start; i >= window.y.out.end; i = i - smooth) {
        moveY(element, i)
    }

    cy.wrap(element).trigger('mouseup')

    for (let i = window.x.in.start; i < window.x.in.end; i = i + smooth) {
        moveX(element, i)
    }
    for (let i = window.x.out.start; i >= window.x.out.end; i = i - smooth) {
        moveX(element, i)
    }
}

export function markAction(row, pageX, pageY) {
    if (pageX && pageY) {
        cy.wrap(row[0].childNodes[0])
            .trigger('mousedown', { which: 1, pageX: pageX, pageY: pageY })
            .trigger('mouseup', { which: 1, pageX: pageY, pageY: pageY })
    } else {
        cy.wrap(row[0].childNodes[0]).click()
    }
}

export function markWithSaveAction(row, x, y) {
    if (x && y) {
        cy.wrap(row).click(x,y)
    } else {
        cy.wrap(row).click()
    }
    cy.get('.save > .MuiButton-label').should('be.visible').click()
}

export function markerFreehandAction(row) {
    cy.wrap(row[0].childNodes[0])
        .trigger('mousedown', { which: 1, pageX: 511, pageY: 239 })
        .trigger('mousemove', { which: 1, pageX: 553, pageY: 168 })
        .trigger('mousemove', { which: 1, pageX: 598, pageY: 234 })
        .trigger('mousemove', { which: 1, pageX: 511, pageY: 240 })
        .trigger('mouseup')
}

export function zoomAction(row) {
    const pageX = 450
    const smooth = 0.8;
    const zoom = {
        in: {
            start: 500,
            end: 520
        },
        out: {
            start: 520,
            end: 512
        }
    }
    const move = (row, i) => {
        cy.wrap(row[0].childNodes[0])
            .trigger('mousedown', { which: 1, pageX: pageX, pageY: i })
            .trigger('mousemove', { which: 1, pageX: pageX, pageY: i })
    }
    for (let i = zoom.in.start; i < zoom.in.end; i = i + smooth) {
        move(row, i)
    }
}
export function lengthAction(row) {
    cy.wrap(row)
        .trigger('mousedown', { which: 1, pageX: 900, pageY: 500 })
        .trigger('mousemove', { which: 1, pageX: 910, pageY: 510 })
        .trigger('mouseup')
}