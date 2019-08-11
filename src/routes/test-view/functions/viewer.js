import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import MarkerTool from './marker';
import Mark from './mark';
import Dtx from './dtx';

const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

export default class Viewer {
    constructor(element, synchronizer) {
        this.imageId = element.dataset.imageId;
        this.imageStack = isNaN(element.dataset.stack) ? 1 : Number(element.dataset.stack);
        this.imageURL = [];
        Array.from(Array(this.imageStack).keys()).map(v => {
            this.imageURL.push(`dtx://${element.dataset.url}/${v}`);
        });
        console.log(this.imageURL);
        element.oncontextmenu = _ => false;
        // element.onmousedown = _ => false;

        this.imageElement  = element.querySelector('.dicom');
        this.windowOverlay = element.querySelector('.window');
        this.zoomOverlay   = element.querySelector('.zoom');
        this.locationOverlay = element.querySelector('.location');
        this.resetButton   = element.querySelector('.reset');
        this.invertButton  = element.querySelector('.invert');
        this.toggleMarkInfoButton = element.querySelector('.eye');
        this.stackSlider = element.querySelector('.stack-scrollbar input');
        this.synchronizer = synchronizer;

        this.imageElement.viewer = this;
        this.originalViewport = {};
        this.loaded = false;

        this.loadImage();
        this.initEvents();
    }

    loadImage() {
        cornerstone.enable(this.imageElement);
        cornerstone.loadImage(this.imageURL[0]).then((image) => {
            cornerstone.displayImage(this.imageElement, image);
            this.initTools();
        });
    }

    initEvents() {
        this.imageElement.addEventListener('cornerstoneimagerendered', (event) => {
            this.wasDrawn(event);
        });

        this.imageElement.addEventListener('cornerstonetoolsmousemove', (event) => {
            this._updateMouseLocation(event);
        });

        this.imageElement.addEventListener('cornerstonetoolsmousedoubleclick', (event) => {
            let mark = new Mark(event.detail.element.viewer.imageId, {
                x: event.detail.currentPoints.image.x,
                y: event.detail.currentPoints.image.y,
                active: true
            });
            cornerstoneTools.addToolState(this.imageElement, 'Marker', mark);
            Dtx.popup.show(mark);
            cornerstone.invalidate(this.imageElement);
        });

        this.resetButton.addEventListener('click', () => {
            this.reset();
        });

        this.invertButton.addEventListener('click', () => {
            this.invert();
        });

        this.toggleMarkInfoButton.addEventListener('click', () => {
            this.toggleMarkInfo();
        });


    }

    static adjustSlideSize() {
        let sliders = document.querySelectorAll('div .stack-scrollbar input');
        for( let i = 0; i < sliders.length; i++ ) {
            sliders[i].style.width=sliders[i].parentNode.clientHeight + 'px';
        }
        window.addEventListener('resize', () => {
            let sliders = document.querySelectorAll('div .stack-scrollbar input');
            for( let i = 0; i < sliders.length; i++ ) {
                sliders[i].style.width=sliders[i].parentNode.clientHeight + 'px';
            }
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

        //add synchronizer
        this.synchronizer.add(this.imageElement);

        //add image stack
       /* const stack = {
            currentImageIdIndex: 0,
            imageIds: this.imageURL
        };

        cornerstoneTools.addStackStateManager(this.imageElement, ['stack']);
        cornerstoneTools.addToolState(this.imageElement, 'stack', stack);
        cornerstoneTools.addToolForElement(this.imageElement, StackScrollMouseWheelTool);
        cornerstoneTools.setToolActiveForElement(this.imageElement, 'StackScrollMouseWheel', {});*/

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

    toggleMarkInfo() {
        let eyeElement = this.toggleMarkInfoButton.firstElementChild;
        if(eyeElement.classList.contains('zmdi-eye')) {
            eyeElement.classList.remove('zmdi-eye');
            eyeElement.classList.add('zmdi-eye-off');

        } else {
            eyeElement.classList.remove('zmdi-eye-off');
            eyeElement.classList.add('zmdi-eye');
        }
        cornerstone.invalidate(this.imageElement);
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

    _updateMouseLocation(event) {
        let point = event.detail.currentPoints.image;
        const x = point.x.toFixed(0);
        const y = point.y.toFixed(0);
        this.locationOverlay.textContent = `(x: ${x}, y: ${y})`;
    }
}
