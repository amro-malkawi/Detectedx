import cornerstone from 'cornerstone-core';
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from "cornerstone-math";

const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const drawJoinedLines = cornerstoneTools.import('drawing/drawJoinedLines');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');
const roundToDecimal = cornerstoneTools.import('util/roundToDecimal');
const AngleTool = cornerstoneTools.AngleTool;


function getColorIfActive(data) {
    if (data.color) {
        return data.color;
    }

    return data.active ? 'greenyellow' : 'white';
}

function getPixelSpacing(image) {
    const imagePlane = cornerstone.metaData.get(
        'imagePlaneModule',
        image.imageId
    );

    if (imagePlane) {
        return {
            rowPixelSpacing:
                imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing,
            colPixelSpacing:
                imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing,
        };
    }

    return {
        rowPixelSpacing: image.rowPixelSpacing,
        colPixelSpacing: image.columnPixelSpacing,
    };
}

function lineSegDistance(element, start, end, coords) {
    const lineSegment = {
        start: cornerstone.pixelToCanvas(element, start),
        end: cornerstone.pixelToCanvas(element, end),
    };

    return cornerstoneMath.lineSegment.distanceToPoint(
        lineSegment,
        coords
    );
}

function length(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

export default class MyAngleTool extends AngleTool {
    pointNearTool(element, data, coords) {
        if (data.visible === false) {
            return false;
        }

        return (
            lineSegDistance(
                element,
                data.handles.start,
                data.handles.middle,
                coords
            ) < 3 ||
            lineSegDistance(element, data.handles.middle, data.handles.end, coords) <
            3
        );
    }

    updateCachedStats(image, element, data) {
        const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

        const sideA = {
            x: (data.handles.middle.x - data.handles.start.x) * colPixelSpacing,
            y: (data.handles.middle.y - data.handles.start.y) * rowPixelSpacing,
        };

        const sideB = {
            x: (data.handles.end.x - data.handles.middle.x) * colPixelSpacing,
            y: (data.handles.end.y - data.handles.middle.y) * rowPixelSpacing,
        };

        const sideC = {
            x: (data.handles.end.x - data.handles.start.x) * colPixelSpacing,
            y: (data.handles.end.y - data.handles.start.y) * rowPixelSpacing,
        };

        const sideALength = length(sideA);
        const sideBLength = length(sideB);
        const sideCLength = length(sideC);

        // Cosine law
        let angle = Math.acos(
            (Math.pow(sideALength, 2) +
                Math.pow(sideBLength, 2) -
                Math.pow(sideCLength, 2)) /
            (2 * sideALength * sideBLength)
        );

        angle *= 180 / Math.PI;

        data.rAngle = roundToDecimal(angle, 2);

        // Set rowPixelSpacing and columnPixelSpacing to 1 if they are undefined (or zero)
        const dx1 = (data.handles.middle.x - data.handles.start.x) * (colPixelSpacing || 1);
        const dy1 = (data.handles.middle.y - data.handles.start.y) * (rowPixelSpacing || 1);
        const dx2 = (data.handles.end.x - data.handles.middle.x) * (colPixelSpacing || 1);
        const dy2 = (data.handles.end.y - data.handles.middle.y) * (rowPixelSpacing || 1);
        // Calculate the length, and create the text variable with the millimeters or pixels suffix
        const length1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const length2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        data.lengthLine1 = length1;
        data.lengthLine2 = length2;

        data.invalidated = false;
    }

    renderToolData(evt) {
        const eventData = evt.detail;
        const enabledElement = eventData.enabledElement;
        const { handleRadius, drawHandlesOnHover } = this.configuration;
        // If we have no toolData for this element, return immediately as there is nothing to do
        const toolData = cornerstoneTools.getToolState(evt.currentTarget, this.name);

        if (!toolData) {
            return;
        }

        // We have tool data for this element - iterate over each one and draw it
        const context = getNewContext(eventData.canvasContext.canvas);
        const { image, element } = eventData;
        const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

        const lineWidth = 1;

        for (let i = 0; i < toolData.data.length; i++) {
            const data = toolData.data[i];

            if (data.visible === false) {
                continue;
            }

            draw(context, context => {
                setShadow(context, this.configuration);

                // Differentiate the color of activation tool
                const color = getColorIfActive(data);

                const handleStartCanvas = cornerstone.pixelToCanvas(
                    eventData.element,
                    data.handles.start
                );
                const handleMiddleCanvas = cornerstone.pixelToCanvas(
                    eventData.element,
                    data.handles.middle
                );

                drawJoinedLines(
                    context,
                    eventData.element,
                    data.handles.start,
                    [data.handles.middle, data.handles.end],
                    { color }
                );

                // Draw the handles
                const handleOptions = {
                    color,
                    handleRadius,
                    drawHandlesIfActive: drawHandlesOnHover,
                };

                drawHandles(context, eventData, data.handles, handleOptions);

                // Update textbox stats
                if (data.invalidated === true) {
                    if (data.rAngle && data.lengthLine1 && data.lengthLine2) {
                        this.throttledUpdateCachedStats(image, element, data);
                    } else {
                        this.updateCachedStats(image, element, data);
                    }
                }

                if (data.rAngle) {
                    const text = textBoxText(data, rowPixelSpacing, colPixelSpacing);

                    const distance = 15;

                    let textCoords;

                    if (!data.handles.textBox.hasMoved) {
                        textCoords = {
                            x: handleMiddleCanvas.x,
                            y: handleMiddleCanvas.y,
                        };

                        const padding = 5;
                        const textWidth = context.measureText(text).width + 2 * padding;


                        if (handleMiddleCanvas.x > handleStartCanvas.x) {
                            textCoords.x -= distance + textWidth + 10;
                        } else {
                            textCoords.x += distance;
                        }

                        const transform = cornerstone.internal.getTransform(
                            enabledElement
                        );

                        transform.invert();

                        const coords = transform.transformPoint(textCoords.x, textCoords.y);

                        data.handles.textBox.x = coords.x;
                        data.handles.textBox.y = coords.y;
                    }

                    drawLinkedTextBox(
                        context,
                        eventData.element,
                        data.handles.textBox,
                        text,
                        data.handles,
                        textBoxAnchorPoints,
                        color,
                        lineWidth,
                        0,
                        true
                    );


                    // draw angle line length
                    drawLinkedTextBox(
                        context,
                        element,
                        {x: (data.handles.start.x + data.handles.middle.x) / 2 - 20, y: (data.handles.start.y + data.handles.middle.y) / 2 - 20},
                        textBoxLineText(data.lengthLine1, rowPixelSpacing, colPixelSpacing),
                        data.handles,
                        textBoxAnchorPoints,
                        color,
                        lineWidth,
                        0,
                        true
                    );
                    drawLinkedTextBox(
                        context,
                        element,
                        {x: (data.handles.middle.x + data.handles.end.x) / 2 - 20, y: (data.handles.middle.y + data.handles.end.y) / 2 - 20},
                        textBoxLineText(data.lengthLine2, rowPixelSpacing, colPixelSpacing),
                        data.handles,
                        textBoxAnchorPoints,
                        color,
                        lineWidth,
                        0,
                        true
                    );
                }
            });
        }

        function textBoxText(data, rowPixelSpacing, colPixelSpacing) {
            const suffix = !rowPixelSpacing || !colPixelSpacing ? ' (isotropic)' : '';
            const str = '00B0'; // Degrees symbol

            return (
                data.rAngle.toString() + String.fromCharCode(parseInt(str, 16)) + suffix
            );
        }

        function textBoxLineText(length, rowPixelSpacing, colPixelSpacing) {
            // Set the length text suffix depending on whether or not pixelSpacing is available
            let suffix = ' mm';

            if (!rowPixelSpacing || !colPixelSpacing) {
                suffix = ' pixels';
            }

            return `${length.toFixed(2)}${suffix}`;
        }

        function textBoxAnchorPoints(handles) {
            return [handles.start, handles.middle, handles.end];
        }
    }
}