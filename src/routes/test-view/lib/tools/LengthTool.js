import cornerstone from 'cornerstone-core';
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from "cornerstone-math";

const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const drawLine = cornerstoneTools.import('drawing/drawLine');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');
const LengthTool = cornerstoneTools.LengthTool;

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

export default class MyLengthTool extends LengthTool {
    pointNearTool(element, data, coords) {
        const hasStartAndEndHandles =
            data && data.handles && data.handles.start && data.handles.end;
        const validParameters = hasStartAndEndHandles;

        if (!validParameters) {
            return false;
        }

        if (data.visible === false) {
            return false;
        }

        return (
            lineSegDistance(element, data.handles.start, data.handles.end, coords) <
            3
        );
    }

    renderToolData(evt) {
        const eventData = evt.detail;
        const { handleRadius, drawHandlesOnHover } = this.configuration;
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
                // Configurable shadow
                setShadow(context, this.configuration);

                const color = getColorIfActive(data);

                // Draw the measurement line
                drawLine(context, element, data.handles.start, data.handles.end, {
                    color,
                });

                // Draw the handles
                const handleOptions = {
                    color,
                    handleRadius,
                    drawHandlesIfActive: drawHandlesOnHover,
                };

                drawHandles(context, eventData, data.handles, handleOptions);

                if (!data.handles.textBox.hasMoved) {
                    // const coords = {
                    //     x: Math.max(data.handles.start.x, data.handles.end.x),
                    // };
                    //
                    // // Depending on which handle has the largest x-value,
                    // // Set the y-value for the text box
                    // if (coords.x === data.handles.start.x) {
                    //     coords.y = data.handles.start.y;
                    // } else {
                    //     coords.y = data.handles.end.y;
                    // }
                    //
                    // data.handles.textBox.x = coords.x;
                    // data.handles.textBox.y = coords.y;

                    // change for middle text
                    data.handles.textBox.x = (data.handles.start.x + data.handles.end.x) / 2 - 20;
                    data.handles.textBox.y = (data.handles.start.y + data.handles.end.y) / 2 - 70;
                }

                // Move the textbox slightly to the right and upwards
                // So that it sits beside the length tool handle
                const xOffset = 10;

                // Update textbox stats
                if (data.invalidated === true) {
                    if (data.length) {
                        this.throttledUpdateCachedStats(image, element, data);
                    } else {
                        this.updateCachedStats(image, element, data);
                    }
                }

                const text = textBoxText(data, rowPixelSpacing, colPixelSpacing);

                drawLinkedTextBox(
                    context,
                    element,
                    data.handles.textBox,
                    text,
                    data.handles,
                    textBoxAnchorPoints,
                    color,
                    lineWidth,
                    xOffset,
                    true
                );
            });
        }

        function textBoxText(data, rowPixelSpacing, colPixelSpacing) {
            // Set the length text suffix depending on whether or not pixelSpacing is available
            let suffix = ' mm';

            if (!rowPixelSpacing || !colPixelSpacing) {
                suffix = ' pixels';
            }

            return `${data.length.toFixed(0)}${suffix}`;
        }

        function textBoxAnchorPoints(handles) {
            const midpoint = {
                x: (handles.start.x + handles.end.x) / 2,
                y: (handles.start.y + handles.end.y) / 2,
            };

            return [handles.start, midpoint, handles.end];
        }
    }
}