import cornerstoneTools from "cornerstone-tools";
import cornerstone from 'cornerstone-core';

const BaseTool = cornerstoneTools.import('base/BaseTool');
/**
 * @public
 * @class ZoomMouseWheelTool
 * @memberof Tools
 *
 * @classdesc Tool for changing magnification with the mouse wheel.
 * @extends Tools.Base.BaseTool
 */
export default class ZoomMouseWheelTool extends BaseTool {
    constructor(configuration = {}) {
        const defaultConfig = {
            name: 'ZoomMouseWheel',
            supportedInteractionTypes: ['MouseWheel'],
            configuration: {
                minScale: 0.25,
                maxScale: 20.0,
                invert: false,
            },
        };
        const initialConfiguration = Object.assign(defaultConfig, configuration);

        super(initialConfiguration);

        this.initialConfiguration = initialConfiguration;
    }

    changeViewportScale(viewport, ticks, scaleLimits) {
        const { maxScale, minScale } = scaleLimits;
        const pow = 1.7;
        const oldFactor = Math.log(viewport.scale) / Math.log(pow);
        const factor = oldFactor + ticks;
        const scale = Math.pow(pow, factor);

        if (maxScale && scale > maxScale) {
            viewport.scale = maxScale;
        } else if (minScale && scale < minScale) {
            viewport.scale = minScale;
        } else {
            viewport.scale = scale;
        }

        return viewport;
    }

    correctShift(shift, viewportOrientation) {
        const { hflip, vflip, rotation } = viewportOrientation;

        // Apply Flips
        shift.x *= hflip ? -1 : 1;
        shift.y *= vflip ? -1 : 1;

        // Apply rotations
        if (rotation !== 0) {
            const angle = (rotation * Math.PI) / 180;

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            const newX = shift.x * cosA - shift.y * sinA;
            const newY = shift.x * sinA + shift.y * cosA;

            shift.x = newX;
            shift.y = newY;
        }

        return shift;
    }

    mouseWheelCallback(evt) {
        const { element, viewport, spinY, image } = evt.detail;
        const { invert, maxScale, minScale } = this.configuration;
        const ticks = invert ? spinY / 4 : -spinY / 4;
        const [startX, startY, imageX, imageY] = [
            evt.detail.pageX,
            evt.detail.pageY,
            evt.detail.imageX,
            evt.detail.imageY,
        ];
        const previousX = viewport.translation.x;
        const previousScale = viewport.scale;
        const updatedViewport = this.changeViewportScale(viewport, ticks, {
            maxScale,
            minScale,
        });
        cornerstone.setViewport(element, updatedViewport);

        // fix for RIV-126
        const newCoords = cornerstone.pageToPixel(element, startX, startY);
        let shift = {
            x: imageX - newCoords.x,
            y: imageY - newCoords.y,
        };
        shift = this.correctShift(shift, updatedViewport);
        // Apply the shift to the Viewport's translation setting
        viewport.translation.y -= shift.y;
        const hangingId = element.parentElement.dataset.hangingId;
        // const imageWidth = viewport.displayedArea.brhc.x;
        const imageWidth = image.width;
        const canvasWidth = element.clientWidth;
        if(hangingId && hangingId.split('-')[1]) {
            if(hangingId.split('-')[1] === 'L') {
                updatedViewport.translation.x = (imageWidth - canvasWidth / updatedViewport.scale) / 2 - ((imageWidth - canvasWidth / previousScale) / 2 - previousX);
            } else if(hangingId.split('-')[1] === 'R') {
                // updatedViewport.translation.x = -((imageWidth - canvasWidth / updatedViewport.scale) / 2);
                updatedViewport.translation.x = -(((imageWidth + canvasWidth / previousScale) / 2 - previousX) - imageWidth / 2 - (canvasWidth / updatedViewport.scale) / 2);
            }
        }
    }
}