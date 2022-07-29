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
        const { element, viewport, spinY } = evt.detail;
        const { invert, maxScale, minScale } = this.configuration;
        const ticks = invert ? spinY / 4 : -spinY / 4;
        const [startX, startY, imageX, imageY] = [
            evt.detail.pageX,
            evt.detail.pageY,
            evt.detail.imageX,
            evt.detail.imageY,
        ];

        const updatedViewport = this.changeViewportScale(viewport, ticks, {
            maxScale,
            minScale,
        });

        cornerstone.setViewport(element, updatedViewport);

        // Now that the scale has been updated, determine the offset we need to apply to the center so we can
        // Keep the original start location in the same position
        const newCoords = cornerstone.pageToPixel(element, startX, startY);

        // The shift we will use is the difference between the original image coordinates of the point we've selected
        // And the image coordinates of the same point on the page after the viewport scaling above has been performed
        // This shift is in image coordinates, and is designed to keep the target location fixed on the page.
        let shift = {
            x: imageX - newCoords.x,
            y: imageY - newCoords.y,
        };

        // Correct the required shift using the viewport rotation and flip parameters
        shift = this.correctShift(shift, updatedViewport);

        // Apply the shift to the Viewport's translation setting
        viewport.translation.x -= shift.x;
        viewport.translation.y -= shift.y;
    }
}