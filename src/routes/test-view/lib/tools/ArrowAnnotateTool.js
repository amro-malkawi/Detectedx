
import cornerstone from 'cornerstone-core';
import cornerstoneTools from "cornerstone-tools";
import toolStyle from './util/toolStyle.js';
import toolColors from './util/toolColors.js';
import textStyle from './util/textStyle.js';

const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawArrow = cornerstoneTools.import('drawing/drawArrow');
const lineSegDistance = cornerstoneTools.import('util/lineSegDistance');
const pointInsideBoundingBox = cornerstoneTools.import('util/pointInsideBoundingBox');
const moveNewHandle = cornerstoneTools.import('manipulators/moveNewHandle');

function textBoxWidth(context, text, padding) {
    const font = textStyle.getFont();
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
/**
 * @public
 * @class ArrowAnnotateTool
 * @memberof Tools.Annotation
 * @classdesc Create and position an arrow and label
 * @extends Tools.Base.BaseAnnotationTool
 */
export default class ArrowAnnotateTool extends BaseAnnotationTool {
    constructor(props = {}) {
        const defaultProps = {
            name: 'ArrowAnnotate',
            supportedInteractionTypes: ['Mouse', 'Touch'],
            configuration: {
                getTextCallback,
                changeTextCallback,
                drawHandles: false,
                drawHandlesOnHover: true,
                arrowFirst: true,
            },
            // svgCursor: arrowAnnotateCursor,
        };

        super(props, defaultProps);
        this.preventNewMeasurement = false;
    }

    createNewMeasurement(evt) {
        // Create the measurement data for this tool with the end handle activated
        return {
            visible: true,
            active: true,
            color: undefined,
            handles: {
                start: {
                    x: evt.detail.currentPoints.image.x,
                    y: evt.detail.currentPoints.image.y,
                    highlight: true,
                    active: false,
                },
                end: {
                    x: evt.detail.currentPoints.image.x,
                    y: evt.detail.currentPoints.image.y,
                    highlight: true,
                    active: false,
                },
                textBox: {
                    active: false,
                    hasMoved: false,
                    movesIndependently: false,
                    drawnIndependently: true,
                    allowedOutsideImage: true,
                    hasBoundingBox: true,
                },
            },
        };
    }

    pointNearTool(element, data, coords) {
        if (data.visible === false) {
            return false;
        }

        return (
            lineSegDistance(element, data.handles.start, data.handles.end, coords) <
            25
        );
    }

    updateCachedStats() {
        // Implementing to satisfy BaseAnnotationTool
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

        const lineWidth = toolStyle.getToolWidth();

        for (let i = 0; i < toolData.data.length; i++) {
            const data = toolData.data[i];

            if (data.visible === false) {
                continue;
            }

            draw(context, context => {
                setShadow(context, this.configuration);

                const color = toolColors.getColorIfActive(data);

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
                    const textHeight = textStyle.getFontSize() + 10;

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

    addNewMeasurement(evt, interactionType) {
        const element = evt.detail.element;
        const measurementData = this.createNewMeasurement(evt);

        // Associate this data with this imageId so we can render it and manipulate it
        cornerstoneTools.addToolState(element, this.name, measurementData);
        cornerstone.updateImage(element);

        moveNewHandle(
            evt.detail,
            this.name,
            measurementData,
            measurementData.handles.end,
            this.options,
            interactionType,
            () => {
                if (measurementData.text === undefined) {
                    this.configuration.getTextCallback(text => {
                        if (text) {
                            measurementData.text = text;
                        } else {
                            cornerstoneTools.removeToolState(element, this.name, measurementData);
                        }

                        measurementData.active = false;
                        cornerstone.updateImage(element);
                    });
                }
                cornerstone.updateImage(element);
            }
        );
    }

    doubleClickCallback(evt) {
        return this._updateTextForNearbyAnnotation(evt);
    }

    touchPressCallback(evt) {
        return this._updateTextForNearbyAnnotation(evt);
    }

    _updateTextForNearbyAnnotation(evt) {
        const element = evt.detail.element;
        const coords = evt.detail.currentPoints.canvas;
        const toolState = cornerstoneTools.getToolState(element, this.name);

        if (!toolState) {
            return false;
        }

        for (let i = 0; i < toolState.data.length; i++) {
            const data = toolState.data[i];

            if (
                this.pointNearTool(element, data, coords) ||
                pointInsideBoundingBox(data.handles.textBox, coords)
            ) {
                data.active = true;
                cornerstone.updateImage(element);
                // Allow relabelling via a callback
                this.configuration.changeTextCallback(
                    data,
                    evt.detail,
                    this._doneChangingTextCallback.bind(this, element, data)
                );

                evt.stopImmediatePropagation();
                evt.preventDefault();
                evt.stopPropagation();

                return true;
            }
        }
    }

    _doneChangingTextCallback(element, data, updatedText, deleteTool) {
        if (deleteTool === true) {
            cornerstoneTools.removeToolState(element, this.name, data);
        } else {
            data.text = updatedText;
        }

        data.active = false;
        cornerstone.updateImage(element);
    }
}

function getTextCallback(doneChangingTextCallback) {
    doneChangingTextCallback(prompt('Enter your annotation:'));
}

function changeTextCallback(data, eventData, doneChangingTextCallback) {
    doneChangingTextCallback(prompt('Change your annotation:'));
}