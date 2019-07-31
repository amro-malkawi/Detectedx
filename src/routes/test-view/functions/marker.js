import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import Mark from './mark';
import Dtx from './dtx';

const moveHandleNearImagePoint = cornerstoneTools.import('manipulators/moveHandleNearImagePoint');
const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const drawTextBox = cornerstoneTools.import('drawing/drawTextBox');
const draw = cornerstoneTools.import('drawing/draw');

export default class MarkerTool extends BaseAnnotationTool {
    constructor(configuration = {}) {
        const defaultConfig = {
            name: 'Marker',
            supportedInteractionTypes: ['Mouse'],
            configuration: {
                truthColour: 'red',
                answerColour: 'yellow'
            }
        };

        const initialConfiguration = Object.assign(defaultConfig, configuration);
        super(initialConfiguration);
        this.initialConfiguration = initialConfiguration;
    }

    createNewMeasurement(eventData) {
        if (!eventData.currentPoints || !eventData.currentPoints.image)
            throw 'currentPoints.image not supplied to MarkerTool createNewMeasurement';

        if (!eventData.element.viewer)
            throw 'Target element has no viewer object';

        let mark = new Mark(eventData.element.viewer.imageId, {
            x: eventData.currentPoints.image.x,
            y: eventData.currentPoints.image.y,
            active: true
        });

        this._handleMouseUp(_ => {
            Dtx.popup.show(mark);
        });

        return mark;
    }

    pointNearTool(element, data, coords) {
        // precondition: toolData is a Mark object
        const markCoords = cornerstone.pixelToCanvas(element, data.handle);
        return cornerstoneMath.point.distance(markCoords, coords) < 10;
    }

    renderToolData(evt) {
        const eventData = evt.detail;
        const context   = getNewContext(eventData.canvasContext.canvas);
        const viewport  = cornerstone.getViewport(evt.currentTarget);
        const toolData  = cornerstoneTools.getToolState(evt.currentTarget, this.name);

        // we can't draw anything unless the tool instance has some marks
        if (toolData == undefined || toolData.data == undefined) {
            return;
        }

        // circle size is defined as a % of the image height. since
        // images can be zoomed, the size then needs to be scaled
        // by the current viewport scale (zoom amount).
        let diameter = Dtx.radius * 2;//eventData.image.height * this.configuration.circleSize;
        diameter *= viewport.scale;
        let radius = diameter / 2;

        // check show information
        let isShowInfo = eventData.element.parentElement.querySelector('.eye').firstElementChild.classList.contains('zmdi-eye');


        // precondition: toolData.data is an array of Mark objects
        for (let mark of toolData.data) {
            draw(context, context => {
                let lesionNames = [];
                Dtx.lesions.forEach((v) => {
                    if(mark.lesionTypes.indexOf(v.id.toString()) !== -1) {
                        lesionNames.push(v.name);
                    }
                });
                let colour;
                let padding;
                if (mark.isTruth) {
                    colour = this.configuration.truthColour;
                    padding = (lesionNames.length > 0 ? -45 : -30) - radius;
                }
                else {
                    colour = this.configuration.answerColour;
                    padding = radius + 15;
                }

                drawHandles(context, eventData, mark.handles, {
                    handleRadius: radius,
                    color: colour,
                });

                if(isShowInfo) {
                    let textCoords = cornerstone.pixelToCanvas(eventData.element, mark.handles.end);
                    if ( !mark.isTruth ) {
                        drawTextBox(context, 'Your answer. Rate: ' + mark.rating, textCoords.x, textCoords.y + padding, colour, {fontSize: 100, centering: {x: true, y: true}});
                        drawTextBox(context, `(x: ${mark.handles.end.x.toFixed(0)}, y: ${mark.handles.end.y.toFixed(0)})`, textCoords.x, textCoords.y + padding + 15, colour, {centering: {x: true, y: true}});
                    } else {
                        drawTextBox(context, 'Lesion Number: ' + mark.lesionNumber, textCoords.x, textCoords.y + padding, colour, {centering: {x: true, y: true}});
                        drawTextBox(context, `(x: ${mark.handles.end.x.toFixed(0)}, y: ${mark.handles.end.y.toFixed(0)}) (R = ${Dtx.radius})`, textCoords.x, textCoords.y + padding + 15, colour, {centering: {x: true, y: true}});
                    }
                    drawTextBox(context, lesionNames.join(','), textCoords.x, textCoords.y + padding + 30, colour, {centering: {x: true, y: true}});
                }
            });
        }
    }

    handleSelectedCallback(evt, toolData, handle, interactionType = 'mouse') {
        // precondition: toolData is a Mark object
        moveHandleNearImagePoint(evt, this, toolData, handle, interactionType);
        toolData.prepareForMove();

        this._handleMouseUp(_ => {
            Dtx.popup.show(toolData);
        });
    }

    _handleMouseUp(handler) {
        function _handler(event) {
            handler(event);
            document.removeEventListener('mouseup', _handler);
        }

        document.addEventListener('mouseup', _handler);
    }

    static loadMarks(id) {
        if (!window.marks || !window.marks[id])
            return;

        let imageElement = document.getElementById('image' + id).querySelector('.dicom');

        for (var mark of window.marks[id]) {
            let data = MarkerTool.newMarkData(mark.x, mark.y, false);
            data.truth = mark.truth;
            data.id = mark.id;
            data.rating = mark.rating;
            data.lesionTypes = mark.lesionTypes;
            cornerstoneTools.addToolState(imageElement, 'MarkerTool', data);
        }

        cornerstone.invalidate(imageElement);
    }
}
