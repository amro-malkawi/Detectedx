import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';

const moveHandleNearImagePoint = cornerstoneTools.import('manipulators/moveHandleNearImagePoint');
const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawTextBox = cornerstoneTools.import('drawing/drawTextBox');
const draw = cornerstoneTools.import('drawing/draw');
const triggerEvent = cornerstoneTools.import('util/triggerEvent');

export default class MarkerTool extends BaseAnnotationTool {
    constructor(configuration = {}) {
        const defaultConfig = {
            name: 'Marker',
            supportedInteractionTypes: ['Mouse', 'Touch'],
            configuration: {
                truthColour: 'red',
                answerColour: 'yellow'
            }
        };

        const initialConfiguration = Object.assign(defaultConfig, configuration);
        super(initialConfiguration);
        this.initialConfiguration = initialConfiguration;
        this.addMarkFunc = configuration.addMarkFunc;
        this.editMarkFunc = configuration.editMarkFunc;
    }

    createNewMeasurement(eventData) {
        const { currentPoints, element } = eventData;
        if (!currentPoints || !currentPoints.image)
            throw 'currentPoints.image not supplied to MarkerTool createNewMeasurement';

        const data  = {
            toolName: this.name,
            element,
            measurementData: {
                point: currentPoints.image
            },
        };
        this._handleMouseUp(_ => {
            triggerEvent(element, 'cornerstonetoolsmeasurementcompleted', data );
            this.addMarkFunc && this.addMarkFunc(currentPoints.image);
        });

        // return mark;
    }

    handleSelectedCallback(evt, toolData, handle, interactionType = 'mouse') {
        const { element } = evt.detail;
        // precondition: toolData is a Mark object
        moveHandleNearImagePoint(evt, this, toolData, handle, interactionType);
        toolData.originalX = toolData.handles.end.x;
        toolData.originalY = toolData.handles.end.y;
        const data = {
            toolName: this.name,
            element,
            measurementData: toolData,
        };
        this._handleMouseUp(_ => {
            triggerEvent(element, 'cornerstonetoolsmarkerselected', data );
            this.editMarkFunc && this.editMarkFunc(toolData);
        });
    }

    pointNearTool(element, data, coords) {
        // precondition: toolData is a Mark object
        const markCoords = cornerstone.pixelToCanvas(element, data.handles.end);
        return cornerstoneMath.point.distance(markCoords, coords) < 10;
    }

    renderToolData(evt) {
        const eventData = evt.detail;
        const context   = getNewContext(eventData.canvasContext.canvas);
        const viewport  = cornerstone.getViewport(evt.currentTarget);
        const toolData  = cornerstoneTools.getToolState(evt.currentTarget, this.name);

        // we can't draw anything unless the tool instance has some marks
        if (toolData === undefined || toolData.data === undefined) {
            return;
        }

        // check show information
        let isShowInfo = eventData.element.parentElement.querySelector('.eye').firstElementChild.classList.contains('zmdi-eye');


        // precondition: toolData.data is an array of Mark objects
        for (let mark of toolData.data) {
            // circle size is defined as a % of the image height. since
            // images can be zoomed, the size then needs to be scaled
            // by the current viewport scale (zoom amount).
            let radius = mark.radius * viewport.scale;

            draw(context, context => {
                let lesionNames = [];
                const rootLesion = Object.keys(mark.lesionList)[0];
                if(rootLesion !== undefined) {
                    if(typeof mark.lesionList[rootLesion] === "object") {
                        lesionNames.push(rootLesion);
                        Object.keys(mark.lesionList[rootLesion]).forEach((key) => {
                            lesionNames.push(mark.lesionList[rootLesion][key]);
                        });
                    } else if(typeof mark.lesionList[rootLesion] === "string" && mark.lesionList[rootLesion].length > 0) {
                        lesionNames.push(rootLesion);
                        lesionNames.push(mark.lesionList[rootLesion]);
                    } else {
                        lesionNames.push(rootLesion);
                    }
                }
                // replace Nil and Present to "No associated features", "Associated features present"
                lesionNames.forEach((v, i) => {
                    if(v === 'Nil') lesionNames[i] = 'No associated features';
                    if(v === 'Present') lesionNames[i] = 'Associated features present';
                });

                let colour;
                let padding;
                if (mark.isTruth) {
                    colour = this.configuration.truthColour;
                    padding = -15 - (lesionNames.length * 15) - radius;
                }
                else {
                    colour = this.configuration.answerColour;
                    padding = radius + 15;
                }

                drawHandles(context, eventData, mark.handles, {
                    handleRadius: radius,
                    color: colour,
                });
                if(isShowInfo && mark.isTruth !== undefined) {
                    let textCoords = cornerstone.pixelToCanvas(eventData.element, mark.handles.end);
                    let ratingLabel = mark.rating;
                    const ratingLabelObj = MarkerTool.modalityRatings.find((v) => v.value === mark.rating);
                    if(ratingLabelObj !== undefined) ratingLabel = ratingLabelObj.label;

                    if ( !mark.isTruth ) {
                        drawTextBox(context, 'Your answer. Rate: ' + ratingLabel, textCoords.x, textCoords.y + padding, colour, {fontSize: 100, centering: {x: true, y: true}});
                        // drawTextBox(context, `(x: ${mark.handles.end.x.toFixed(0)}, y: ${mark.handles.end.y.toFixed(0)})`, textCoords.x, textCoords.y + padding + 15, colour, {centering: {x: true, y: true}});
                    } else {
                        drawTextBox(context, 'Lesion Number: ' + mark.lesionNumber, textCoords.x, textCoords.y + padding, colour, {centering: {x: true, y: true}});
                        // drawTextBox(context, `(x: ${mark.handles.end.x.toFixed(0)}, y: ${mark.handles.end.y.toFixed(0)}) (R = ${mark.radius})`, textCoords.x, textCoords.y + padding + 15, colour, {centering: {x: true, y: true}});
                    }
                    lesionNames.forEach((v, i) => {
                        drawTextBox(context, v, textCoords.x, textCoords.y + padding + (15 * (i + 1)), colour, {centering: {x: true, y: true}});
                    });
                }
            });
        }
    }

    _handleMouseUp(handler) {
        function _handler(event) {
            handler(event);
            document.removeEventListener('mouseup', _handler);
        }

        document.addEventListener('mouseup', _handler);
    }

    static lesions = [];

    static loadMarks(id) {
        if (!window.marks || !window.marks[id])
            return;

        let imageElement = document.getElementById('image' + id).querySelector('.dicom');

        for (var mark of window.marks[id]) {
            let data = MarkerTool.newMarkData(mark.x, mark.y, false);
            data.truth = mark.truth;
            data.id = mark.id;
            data.rating = mark.rating;
            cornerstoneTools.addToolState(imageElement, 'MarkerTool', data);
        }

        cornerstone.invalidate(imageElement);
    }
}
