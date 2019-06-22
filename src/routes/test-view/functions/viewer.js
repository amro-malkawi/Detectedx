import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import MarkerTool from './marker';
import Dtx from './dtx';

const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;

export default class Viewer {
    constructor(element) {
        this.imageId = element.dataset.imageId;
        this.imageURL  = `dtx://${element.dataset.url}`;

        element.oncontextmenu = _ => false
        element.onmousedown = _ => false;

        this.imageElement  = element.querySelector('.dicom');
        this.windowOverlay = element.querySelector('.window');
        this.zoomOverlay   = element.querySelector('.zoom');
        this.resetButton   = element.querySelector('.reset');
        this.invertButton  = element.querySelector('.invert');

        this.imageElement.viewer = this;
        this.originalViewport = {};
        this.loaded = false;

        this.loadImage();
        this.initEvents();
    }

    loadImage() {
        cornerstone.enable(this.imageElement);
        cornerstone.loadImage(this.imageURL).then((image) => {
            cornerstone.displayImage(this.imageElement, image);
            this.initTools();
        });
    }

    initEvents() {
        this.imageElement.addEventListener('cornerstoneimagerendered', (event) => {
            this.wasDrawn(event);
        });

        this.resetButton.addEventListener('click', _ => {
            this.reset();
        });

        this.invertButton.addEventListener('click', _ => {
            this.invert();
        });
    }

    initTools() {
        // now the image has been displayed, deep copy the original viewport
        // so we can reset zoom and position
        let viewport = cornerstone.getViewport(this.imageElement);
        this.originalViewport = this.duplicateViewport(viewport);

        // add all tools to the image
        cornerstoneTools.addToolForElement(this.imageElement, MarkerTool);
        cornerstoneTools.addToolForElement(this.imageElement, PanTool);
        cornerstoneTools.addToolForElement(this.imageElement, WwwcTool);

        // add the zoom tools, setting the min scale (which defaults to
        // 0.25 - too large to show the whole image within frame)
        cornerstoneTools.addToolForElement(this.imageElement, ZoomTool, {
            configuration: {
                minScale: viewport.scale
            }
        });

        cornerstoneTools.addToolForElement(this.imageElement, ZoomMouseWheelTool, {
            configuration: {
                minScale: viewport.scale
            }
        });

        // images are loaded with the zoom mousewheel enabled by default
        cornerstoneTools.setToolActiveForElement(this.imageElement, 'ZoomMouseWheel', {});

        // the marker tool is always in passive or active mode (passive so
        // existing marks can be rendered at all times)
        if (window.viewerToolbar.currentTool.name != 'Marker') {
            cornerstoneTools.setToolPassiveForElement(this.imageElement, 'Marker');
        }

        // enable the current tool as well (used when adding a new image after
        // the toolbar has been loaded)
        cornerstoneTools.setToolActiveForElement(this.imageElement, window.viewerToolbar.currentTool.name, {
            mouseButtonMask: 1
        });

        // render the first appropriate level of the pyramid
        this._renderPyramid(this.originalViewport);

        // render answers and truths
        this.loaded = true;
        Dtx.loadMarks();
    }

    duplicateViewport(viewport) {
        let copy = {}
        Object.assign(copy, viewport);

        // deep copy
        copy.displayedArea = {};
        Object.assign(copy.displayedArea, viewport.displayedArea);

        copy.translation = {};
        Object.assign(copy.translation, viewport.translation);

        copy.voi = {};
        Object.assign(copy.voi, viewport.voi);

        return copy;
    }

    wasDrawn(event) {
        this._updateImageInfo(event);
        this._renderPyramid(event.detail.viewport);
    }

    invert() {
        let viewport = cornerstone.getViewport(this.imageElement);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(this.imageElement, viewport);
    }

    reset() {
        // reset the pan, zoom, invert, and windowing levels
        let original = this.duplicateViewport(this.originalViewport);
        cornerstone.setViewport(this.imageElement, original);
    }

    _renderPyramid(viewport) {
        this.imageElement.pyramid.loadTilesForViewport(viewport);
    }

    _updateImageInfo(event) {
        const eventData = event.detail;
        const windowWidth = Math.round(eventData.viewport.voi.windowWidth);
        const windowLength = Math.round(eventData.viewport.voi.windowCenter);
        const zoom = eventData.viewport.scale.toFixed(2);
        this.windowOverlay.textContent = `WW/WL: ${windowWidth} / ${windowLength}`;
        this.zoomOverlay.textContent = `Zoom: ${zoom}`;
    }
}
