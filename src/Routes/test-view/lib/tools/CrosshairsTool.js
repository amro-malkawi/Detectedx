import cornerstoneTools from "cornerstone-tools";
import cornerstone from 'cornerstone-core';
import cornerstoneMath from "cornerstone-math";

const BaseTool = cornerstoneTools.import('base/BaseTool');
const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');
const {loadHandlerManager, addToolState, getToolState, clearToolState, EVENTS, setToolOptions} = cornerstoneTools;

const convertToVector3 = cornerstoneTools.import('util/convertToVector3');
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const draw = cornerstoneTools.import('drawing/draw');
const setShadow = cornerstoneTools.import('drawing/setShadow');
const drawLines = cornerstoneTools.import('drawing/drawLines');
const drawLine = cornerstoneTools.import('drawing/drawLine');

/**
 * Projects an image point to a patient point
 * @export @public @method
 * @name imagePointToPatientPoint
 *
 * @param  {Object} imagePoint   The image point.
 * @param  {Object} imagePlane   The image plane used for projection.
 * @returns {Object}              The projected coordinates.
 */
function imagePointToPatientPoint(imagePoint, imagePlane) {
    const rowCosines = convertToVector3(imagePlane.rowCosines);
    const columnCosines = convertToVector3(imagePlane.columnCosines);
    const imagePositionPatient = convertToVector3(
        imagePlane.imagePositionPatient
    );

    const x = rowCosines.clone().multiplyScalar(imagePoint.x);

    x.multiplyScalar(imagePlane.columnPixelSpacing);
    const y = columnCosines.clone().multiplyScalar(imagePoint.y);

    y.multiplyScalar(imagePlane.rowPixelSpacing);
    const patientPoint = x.add(y);

    patientPoint.add(imagePositionPatient);

    return patientPoint;
}


/**
 * @public
 * @class CrosshairsTool
 * @memberof Tools
 *
 * @classdesc Tool for finding the slice in another element corresponding to the
 * image position in a synchronized image series.
 * @extends Tools.Base.BaseTool
 */

export default class CrosshairsTool extends BaseTool {
    constructor(props = {}) {
        const defaultProps = {
            name: 'Crosshairs',
            strategies: {
                default: defaultStrategy,
            },
            defaultStrategy: 'default',
            supportedInteractionTypes: ['Mouse', 'Touch'],
            // svgCursor: crosshairsCursor,
        };

        super(props, defaultProps);
        this.touchDragCallback = this._movingEventCallback.bind(this);
        this.touchEndCallback = this._endMovingEventCallback.bind(this);
        this.mouseDragCallback = this._movingEventCallback.bind(this);
        this.mouseUpCallback = this._endMovingEventCallback.bind(this);
        this.dragEventCurrentPoints = {};
    }

    _movingEventCallback(evt) {
        const eventData = evt.detail;
        const {element} = eventData;
        this._chooseLocation(evt);
        this.dragEventCurrentPoints = eventData.currentPoints;
        cornerstone.updateImage(element);
    }

    _endMovingEventCallback(evt) {
        // const eventData = evt.detail;
        // const {element} = eventData;
        // this.dragEventCurrentPoints = {};
        // cornerstone.updateImage(element);
    }

    renderToolData(evt) {
        if (!this.dragEventCurrentPoints) {
            return;
        }
        if (
            evt &&
            evt.detail &&
            Boolean(Object.keys(this.dragEventCurrentPoints).length)
        ) {
            evt.detail.currentPoints = this.dragEventCurrentPoints;
            this.applyActiveStrategy(evt);
        }
    }

    _chooseLocation(evt) {
        const eventData = evt.detail;
        const {element} = eventData;

        // Prevent CornerstoneToolsTouchStartActive from killing any press events
        evt.stopImmediatePropagation();

        // If we have no toolData for this element, return immediately as there is nothing to do
        const toolData = getToolState(element, this.name);

        if (!toolData) {
            return;
        }

        // Get current element target information
        const sourceElement = element;
        const sourceEnabledElement = cornerstone.getEnabledElement(
            sourceElement
        );
        const sourceImageId = sourceEnabledElement.image.imageId;
        const sourceImagePlane = cornerstone.metaData.get(
            'imagePlaneModule',
            sourceImageId + '_stack'
        );

        if (!sourceImagePlane) {
            return;
        }

        // Get currentPoints from mouse cursor on selected element
        const sourceImagePoint = eventData.currentPoints.image;

        // Transfer this to a patientPoint given imagePlane metadata
        const patientPoint = imagePointToPatientPoint(
            sourceImagePoint,
            sourceImagePlane
        );

        // Get the enabled elements associated with this synchronization context
        const syncContext = toolData.data[0].synchronizationContext;
        const enabledElements = syncContext.getSourceElements();
        const toolName = this.name;
        // Iterate over each synchronized element
        enabledElements.forEach(function (targetElement) {
            // draw crosshairs line on other elements
            const tool = cornerstoneTools.getToolForElement(targetElement, toolName);
            tool.dragEventCurrentPoints = eventData.currentPoints;

            // Don't do anything if the target is the same as the source
            if (targetElement === sourceElement) {
                return;
            }

            const stackToolDataSource = getToolState(targetElement, 'stack');

            if (stackToolDataSource === undefined) {
                return;
            }

            const stackData = stackToolDataSource.data[0];

            const getDistance = (imageId) => {
                const imagePlane = cornerstone.metaData.get(
                    'imagePlaneModule',
                    imageId + '_stack'
                );

                // Skip if the image plane is not ready
                if (
                    !imagePlane ||
                    !imagePlane.imagePositionPatient ||
                    !imagePlane.rowCosines ||
                    !imagePlane.columnCosines
                ) {
                    return;
                }

                const imagePosition = convertToVector3(imagePlane.imagePositionPatient);
                const row = convertToVector3(imagePlane.rowCosines);
                const column = convertToVector3(imagePlane.columnCosines);
                const normal = column.clone().cross(row.clone());
                return Math.abs(
                    normal.clone().dot(imagePosition) - normal.clone().dot(patientPoint)
                );
            }


            const getNearestStackIndex = (imageIds, startIndex, endIndex) => {
                if(endIndex - startIndex < 5) {
                    let minDistance = Number.MAX_VALUE;
                    let nearestIndex = -1;
                    for(let i = startIndex; i <= endIndex; i++) {
                        const distance = getDistance(imageIds[i]);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearestIndex = i;
                        }
                    }
                    return nearestIndex;
                }
                const startDistance = getDistance(imageIds[startIndex]);
                const endDistance = getDistance(imageIds[endIndex]);
                const midIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
                if(startDistance < endDistance) {
                    return getNearestStackIndex(imageIds, startIndex, midIndex);
                } else {
                    return getNearestStackIndex(imageIds, midIndex, endIndex);
                }
            };

            // Find within the element's stack the closest image plane to selected location
            if(stackData.imageIds.length <= 1) return;
            const newImageIdIndex = getNearestStackIndex(stackData.imageIds, 0, stackData.imageIds.length - 1);
            // stackData.imageIds.forEach(function (imageId, index) {
            //     const distance = getDistance(imageId)
            //
            //     if (distance < minDistance) {
            //         minDistance = distance;
            //         newImageIdIndex = index;
            //     }
            // });

            if (newImageIdIndex === stackData.currentImageIdIndex) {
                return;
            }

            // Switch the loaded image to the required image
            if (
                newImageIdIndex !== -1 &&
                stackData.imageIds[newImageIdIndex] !== undefined
            ) {
                const startLoadingHandler = loadHandlerManager.getStartLoadHandler(
                    targetElement
                );
                const endLoadingHandler = loadHandlerManager.getEndLoadHandler(
                    targetElement
                );
                const errorLoadingHandler = loadHandlerManager.getErrorLoadingHandler(
                    targetElement
                );

                if (startLoadingHandler) {
                    startLoadingHandler(targetElement);
                }

                let loader;

                if (stackData.preventCache === true) {
                    loader = cornerstone.loadImage(
                        stackData.imageIds[newImageIdIndex]
                    );
                } else {
                    loader = cornerstone.loadAndCacheImage(
                        stackData.imageIds[newImageIdIndex]
                    );
                }

                loader.then(
                    function (image) {
                        const viewport = cornerstone.getViewport(targetElement);

                        stackData.currentImageIdIndex = newImageIdIndex;
                        cornerstone.displayImage(targetElement, image, viewport);
                        if (endLoadingHandler) {
                            endLoadingHandler(targetElement, image);
                        }
                    },
                    function (error) {
                        const imageId = stackData.imageIds[newImageIdIndex];

                        if (errorLoadingHandler) {
                            errorLoadingHandler(targetElement, imageId, error);
                        }
                    }
                );
            }
        });
    }

    activeCallback(element, {mouseButtonMask, synchronizationContext}) {
        setToolOptions(this.name, element, {mouseButtonMask});
        // Clear any currently existing toolData
        clearToolState(element, this.name);

        addToolState(element, this.name, {
            synchronizationContext,
            handles: {}
        });
    }

    passiveCallback(element) {
        this.dragEventCurrentPoints = {};
        cornerstone.updateImage(element);
        // clearToolState(element, this.name);
        // console.log(`passive crosshairs!`);
    }
}

function defaultStrategy(evt) {
    const config = this.configuration;
    const eventData = evt.detail;
    const {
        element,
        image,
        currentPoints,
        canvasContext,
        isTouchEvent,
    } = eventData;
    const context = getNewContext(canvasContext.canvas);
    const position = currentPoints.image;
    draw(context, context => {
        setShadow(context, config);
        // const position = cornerstone.pixelToCanvas(element, toolCoords);
        drawLines(context, element, [
            {start: {x: position.x, y: 0}, end: {x: position.x, y: position.y - 20}},
            {start: {x: position.x, y: position.y + 20}, end: {x: position.x, y: eventData.image.height}},
        ], {color: '#00f600'});
        drawLines(context, element, [
            {start: {x: 0, y: position.y}, end: {x: position.x - 20, y: position.y}},
            {start: {x: position.x + 20, y: position.y}, end: {x: eventData.image.width, y: position.y}},
        ], {color: 'red'});
    });
}