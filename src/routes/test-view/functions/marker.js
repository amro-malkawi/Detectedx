import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import Mark from './mark';
import Dtx from './dtx';

const moveHandleNearImagePoint = cornerstoneTools.import('manipulators/moveHandleNearImagePoint');
const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool');
const getNewContext = cornerstoneTools.import('drawing/getNewContext');
const drawHandles = cornerstoneTools.import('drawing/drawHandles');
const draw = cornerstoneTools.import('drawing/draw');

export default class MarkerTool extends BaseAnnotationTool {
    constructor(configuration = {}) {
        const defaultConfig = {
            name: 'Marker',
            supportedInteractionTypes: ['Mouse'],
            configuration: {
                circleSize: 0.058,
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
        })

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
        let diameter = eventData.image.height * this.configuration.circleSize;
        diameter *= viewport.scale;
        let radius = diameter / 2;

        // precondition: toolData.data is an array of Mark objects
        for (let mark of toolData.data) {
            draw(context, context => {
                let colour;
                if (mark.isTruth)
                    colour = this.configuration.truthColour;
                else
                    colour = this.configuration.answerColour;

                drawHandles(context, eventData, mark.handles, {
                    handleRadius: radius,
                    color: colour,
                });
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
