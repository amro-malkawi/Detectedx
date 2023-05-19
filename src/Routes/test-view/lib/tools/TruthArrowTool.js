import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const drawArrow = cornerstoneTools.import('drawing/drawArrow');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');
const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;

function getColorIfActive(data) {
    if (data.color) {
        return data.color;
    }
    return data.active ? 'greenyellow' : 'yellow';
}

export function textBoxWidth(context, text, padding) {
    const font = '15px px Arial';
    const origFont = context.font;

    if (font && font !== origFont) {
        context.font = font;
    }
    const width = context.measureText(text).width;

    if (font && font !== origFont) {
        context.font = origFont;
    }

    return width + 2 * padding;
}

export default class TruthArrowTool extends ArrowAnnotateTool {
    constructor() {
        super({name: 'TruthArrow'});
    }

    renderToolData(evt) {
        const { element, enabledElement } = evt.detail;
        const { handleRadius, drawHandlesOnHover } = this.configuration;

        // If we have no toolData for this element, return immediately as there is nothing to do
        const toolData = cornerstoneTools.getToolState(element, this.name);

        if (!toolData) {
            return;
        }

        // We have tool data for this element - iterate over each one and draw it
        const canvas = evt.detail.canvasContext.canvas;
        const context = getNewContext(canvas);

        const lineWidth = 2;

        for (let i = 0; i < toolData.data.length; i++) {
            const data = toolData.data[i];

            if (data.visible === false) {
                continue;
            }

            draw(context, context => {
                setShadow(context, this.configuration);

                const color = getColorIfActive(data);

                // Draw the arrow
                const handleStartCanvas = cornerstone.pixelToCanvas(
                    element,
                    data.handles.start
                );
                const handleEndCanvas = cornerstone.pixelToCanvas(
                    element,
                    data.handles.end
                );

                // Config.arrowFirst = false;
                if (this.configuration.arrowFirst) {
                    drawArrow(
                        context,
                        handleEndCanvas,
                        handleStartCanvas,
                        color,
                        lineWidth
                    );
                } else {
                    drawArrow(
                        context,
                        handleStartCanvas,
                        handleEndCanvas,
                        color,
                        lineWidth
                    );
                }

                const handleOptions = {
                    color,
                    handleRadius,
                    drawHandlesIfActive: drawHandlesOnHover,
                };

                if (this.configuration.drawHandles) {
                    drawHandles(context, evt.detail, data.handles, handleOptions);
                }

                const text = textBoxText(data);

                // Draw the text
                if (text && text !== '') {
                    // Calculate the text coordinates.
                    const padding = 5;
                    const textWidth = textBoxWidth(context, text, padding);
                    const textHeight = 15 + 10;

                    let distance = Math.max(textWidth, textHeight) / 2 + 5;

                    if (handleEndCanvas.x < handleStartCanvas.x) {
                        distance = -distance;
                    }

                    if (!data.handles.textBox.hasMoved) {
                        let textCoords;

                        if (this.configuration.arrowFirst) {
                            textCoords = {
                                x: handleEndCanvas.x - textWidth / 2 + distance,
                                y: handleEndCanvas.y - textHeight / 2,
                            };
                        } else {
                            // If the arrow is at the End position, the text should
                            // Be placed near the Start position
                            textCoords = {
                                x: handleStartCanvas.x - textWidth / 2 - distance,
                                y: handleStartCanvas.y - textHeight / 2,
                            };
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
                        element,
                        data.handles.textBox,
                        text,
                        data.handles,
                        textBoxAnchorPoints,
                        color,
                        lineWidth,
                        0,
                        false
                    );
                }
            });
        }

        function textBoxText(data) {
            return data.text;
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
