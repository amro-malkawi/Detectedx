import React, {Component} from 'react';
import Button from "@material-ui/core/Button";

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import Mark from "./functions/mark";
import Dtx from "./functions/dtx";
import MarkerTool from "./functions/marker";

const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

export default class ImageViewer extends Component{

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 1,
            windowLength: 1,
            zoom: 1,
            isShowMarkInfo: true,
        }
    }

    componentDidMount() {
        const {imageInfo, viewerRef} = this.props;
        this.imageElement = viewerRef.current.querySelector('.dicom');
        let imageURL = Array.from(Array(this.imageStack).keys()).map(v => {
            return `dtx://${imageInfo.id}/${v}`;
        });
        cornerstone.enable(this.imageElement);
        cornerstone.loadImage(imageURL[0]).then((image) => {
            cornerstone.displayImage(this.imageElement, image);
            this.initTools();
        });
        this.initEvents();
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     return null;
    // }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.currentTool !== nextProps.currentTool) {
            this.resetTool(this.props.currentTool, nextProps.currentTool);
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    initEvents() {
        this.imageElement.addEventListener('cornerstoneimagerendered', (event) => {
            this.wasDrawn(event);
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
        if (this.props.currentTool !== 'Marker') {
            cornerstoneTools.setToolPassiveForElement(this.imageElement, 'Marker');
        }

        // enable the current tool as well (used when adding a new image after
        // the toolbar has been loaded)
        cornerstoneTools.setToolActiveForElement(this.imageElement, this.props.currentTool, {
            mouseButtonMask: 1
        });

        //add synchronizer
        this.props.synchronizer.add(this.imageElement);

        /*//add image stack
        const stack = {
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
        this.renderAnswer();
    }

    renderAnswer() {
        cornerstoneTools.clearToolState(this.imageElement, 'Marker');
        this.props.marker.answers.forEach(mark => new Mark(this.props.imageInfo.id, mark));
        if (this.props.marker.truths) {
            this.props.marker.truths.forEach(mark => new Mark(this.props.imageInfo.id, { ...mark, isTruth: true}));
        }

        let imageElement = Mark._imageElement(this.props.imageInfo.id);
        cornerstone.invalidate(imageElement);
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

    resetTool(previousName, nextName) {
        // deactive
        if (previousName != 'Marker') {
            cornerstoneTools.setToolDisabled(previousName);
        }else {
            cornerstoneTools.setToolPassive(previousName);
        }
        //active
        cornerstoneTools.setToolActive(nextName, {
            mouseButtonMask: 1
        });
    }

    onInvert() {
        let viewport = cornerstone.getViewport(this.imageElement);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(this.imageElement, viewport);
    }

    toggleMarkInfo() {
        this.setState({isShowMarkInfo: !this.state.isShowMarkInfo}, () => {
            cornerstone.invalidate(this.imageElement);
        });
    }

    onReset() {
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
        this.setState({
            windowWidth,
            windowLength,
            zoom,
        });
    }

    render () {
        const {imageInfo, viewerRef} = this.props;
        return (
            <div className="image" id={"image" + imageInfo.id} data-image-id={imageInfo.id} data-url={imageInfo.id} data-index={this.props.index} data-stack={imageInfo.stack_count} ref={viewerRef}>
                <a className="eye" onClick={() => this.toggleMarkInfo()}>
                    <i className={this.state.isShowMarkInfo ? "zmdi zmdi-eye fs-23" : "zmdi zmdi-eye-off fs-23"} />
                </a>
                <div className="dicom" />
                <div className="zoom status" >Zoom: {this.state.zoom}</div>
                <div className="window status" >WW/WL: {this.state.windowWidth + ' / ' + this.state.windowLength}</div>
                <Button className="invert" variant="contained" onClick={() => this.onInvert()}>Invert</Button>
                <Button className="reset" variant="contained" onClick={() => this.onReset()}>Reset</Button>
            </div>
        )
    }
}