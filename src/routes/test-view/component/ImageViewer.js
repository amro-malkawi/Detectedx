import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {setImageAnswer} from "Actions";
import ResizeDetector from 'react-resize-detector';
import {Button, IconButton} from "@material-ui/core";
import cornerstone from 'cornerstone-core';
import Tooltip from "@material-ui/core/Tooltip";
import cornerstoneTools from 'cornerstone-tools';
import {NotificationManager} from "react-notifications";
import {FloatingMenu, MainButton, ChildButton} from 'Components/FloatingMenu';
import * as Apis from "Api/index";
import IntlMessages from "Util/IntlMessages";
import {v4 as uuidv4} from 'uuid';
import {isMobile} from 'react-device-detect';
import DownloadProgress from "./DownloadProgress";
import LoadingIndicator from "./LoadingIndicator";
import _ from 'lodash';
import WebWorker from "../worker/WebWorker";
import WorkerProc from "../worker/WorkerProc";

import MarkerTool from "../lib/tools/MarkerTool";
import MarkerFreehandTool from "../lib/tools/MarkerFreehandTool";
import stackPrefetch from '../lib/stackTools/stackPrefetch';

const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
const ZoomTouchPinch = cornerstoneTools.ZoomTouchPinchTool;
// import LengthTool from "../lib/tools/LengthTool";
const MagnifyTool = cornerstoneTools.MagnifyTool;
const LengthTool = cornerstoneTools.LengthTool;
const AngleTool = cornerstoneTools.AngleTool;
const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
const FreehandMouseTool = cornerstoneTools.FreehandMouseTool;
const EraserTool = cornerstoneTools.EraserTool;

const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
const stackToIndex = cornerstoneTools.import('util/scrollToIndex');
const {loadHandlerManager} = cornerstoneTools;

class ImageViewer extends Component {

    constructor(props) {
        super(props);
        const imageIds = Array.from(Array(props.imageInfo.stack_count).keys()).map(v => {
            return `${props.imageInfo.image_url_path}${v}.png`;
        });
        this.state = {
            imageIds,
            currentStackIndex: 0,
            downStatus: Array(props.imageInfo.stack_count).fill(props.imageInfo.stack_count === 1),
            isLoading: false,
            isShowMarkInfo: !isMobile,
            isShowFloatingMenu: false,
        };
        this.toolList = ['Magnify', 'Length', 'Angle', 'EllipticalRoi', 'RectangleRoi', 'ArrowAnnotate', 'Eraser'];
        // this.toolList = ['Magnify', 'Length', 'Angle', 'EllipticalRoi', 'RectangleRoi', 'ArrowAnnotate', 'FreehandMouse', 'Eraser'];
        this.imageElement = undefined;
        this.originalViewport = undefined;
        this.markList = props.imageInfo.answers.markList;
        this.shapeList = props.imageInfo.answers.shapeList;
        this.tempMeasureToolData = null;
        this.imageElementRef = React.createRef();
    }

    componentDidMount() {
        this.imageElement = this.imageElementRef.current;
        cornerstone.enable(this.imageElement);
        this.setupLoadHandlers();

        cornerstone.loadAndCacheImage(this.state.imageIds[0]).then((image) => {
            cornerstone.displayImage(this.imageElement, image);
            this.initTools();
        });
        this.initEvents();
        ImageViewer.adjustSlideSize();
        this.runWorker();
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     return null;
    // }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.currentTool !== nextProps.currentTool) {
            this.resetTool(this.props.currentTool, nextProps.currentTool);
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {
        console.log('component unmount');
        this.setupLoadHandlers(true);
        if (this.state.imageIds.length > 1) {
            stackPrefetch.disable(this.imageElement);
        }

        cornerstoneTools.clearToolState(this.imageElement, 'stackPrefetch');
        cornerstone.imageCache.purgeCache();
        cornerstoneTools.stopClip(this.imageElement);
        cornerstone.disable(this.imageElement);

        if (this.webWorker) this.webWorker.terminate();
    }

    runWorker() {
        // this.webWorker = new WebWorker(new WorkerProc({imageElement: this.imageElement, imageIds: this.state.imageIds}));
    }

    initEvents() {
        this.imageElement.addEventListener('cornerstoneimagerendered', (event) => {
            this.wasDrawn(event);
        });

        this.imageElement.addEventListener('cornerstonetoolsmousemove', (event) => {
            let point = event.detail.currentPoints.image;
            const x = point.x.toFixed(0);
            const y = point.y.toFixed(0);
            this.imageElement.parentNode.querySelector('.location').textContent = `(x: ${x}, y: ${y})`;
        });

        if (!this.props.complete && this.props.tools.indexOf('Marker') !== -1) {
            this.imageElement.addEventListener('cornerstonetoolsmousedoubleclick', (event) => this.handleDoubleClickEvent(event));
            this.imageElement.addEventListener('cornerstonetoolsdoubletap', (event) => this.handleDoubleClickEvent(event));
        }

        this.imageElement.addEventListener('cornerstonenewimage', _.debounce((e) => this.handleChangeStack(e), 0));

        this.imageElement.querySelector('canvas').oncontextmenu = function () {
            return false;
        }

        this.imageElement.addEventListener('cornerstonetoolsmeasurementcompleted', this.handleMeasureCompleteEvent.bind(this));
        this.imageElement.addEventListener('cornerstonetoolsmeasurementmodified', this.handleMeasureModifyEvent.bind(this));
        this.imageElement.addEventListener('cornerstonetoolsmeasurementremoved', this.handleMeasureRemoveEvent.bind(this));
        this.imageElement.addEventListener('cornerstonetoolsmarkerselected', (event) => this.handleEditMark(event.detail.toolName, event.detail));
        this.imageElement.addEventListener('cornerstonetoolsmouseup', this.handleMouseUp.bind(this));
        cornerstone.events.addEventListener('cornerstoneimageloadprogress', this.handleImageLoadProgress.bind(this));
    }

    initTools() {
        // now the image has been displayed, deep copy the original viewport
        // so we can reset zoom and position
        let viewport = cornerstone.getViewport(this.imageElement);
        this.originalViewport = this.duplicateViewport(viewport);
        // add all tools to the image
        const setToolElementFunc = this.props.complete || this.props.stage >= 2 ? 'setToolEnabledForElement' : 'setToolPassiveForElement';
        // cornerstoneTools.addToolForElement(this.imageElement, MarkerTool, {addMarkFunc: this.handleAddMark.bind(this), editMarkFunc: this.handleEditMark.bind(this)});
        cornerstoneTools.addToolForElement(this.imageElement, MarkerTool);
        cornerstoneTools.addToolForElement(this.imageElement, MarkerFreehandTool);
        cornerstoneTools.addToolForElement(this.imageElement, PanTool);
        cornerstoneTools.addToolForElement(this.imageElement, WwwcTool);
        this.toolList.forEach(toolName => {
            cornerstoneTools.addToolForElement(this.imageElement, cornerstoneTools[toolName + 'Tool']);
            cornerstoneTools[setToolElementFunc](this.imageElement, toolName);
        });

        // cornerstoneTools.addToolForElement(this.imageElement, LengthTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'Length');
        // cornerstoneTools.addToolForElement(this.imageElement, AngleTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'Angle');
        // cornerstoneTools.addToolForElement(this.imageElement, EllipticalRoiTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'EllipticalRoi');
        // cornerstoneTools.addToolForElement(this.imageElement, RectangleRoiTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'RectangleRoi');
        // cornerstoneTools.addToolForElement(this.imageElement, ArrowAnnotateTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'ArrowAnnotate');
        // cornerstoneTools.addToolForElement(this.imageElement, FreehandMouseTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'FreehandMouse');
        // cornerstoneTools.addToolForElement(this.imageElement, EraserTool);
        // cornerstoneTools[setToolElementFunc](this.imageElement, 'Eraser');

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
        cornerstoneTools.addTool(ZoomTouchPinch, {configuration: {minScale: viewport.scale}});
        cornerstoneTools.setToolActive('ZoomTouchPinch', {});

        // the marker tool is always in passive or active mode (passive so
        // existing marks can be rendered at all times)
        if (this.props.currentTool !== 'Marker') {
            cornerstoneTools[setToolElementFunc](this.imageElement, 'Marker');
        }
        if (this.props.currentTool !== 'MarkerFreehand') {
            cornerstoneTools[setToolElementFunc](this.imageElement, 'MarkerFreehand');
        }

        // enable the current tool as well (used when adding a new image after
        // the toolbar has been loaded)
        cornerstoneTools.setToolActiveForElement(this.imageElement, this.props.currentTool, {
            mouseButtonMask: 1
        });

        //add synchronizer
        this.props.synchronizer && this.props.synchronizer.add(this.imageElement);

        if (this.state.imageIds.length > 1) {
            //add image stack
            cornerstoneTools.addStackStateManager(this.imageElement, ['stack']);


            /*======== cache image data ========*/
            // cornerstoneTools.addToolState(this.imageElement, 'stack', {
            //     imageIds: this.state.imageIds, currentImageIdIndex: this.state.currentStackIndex, preventCache: false
            // });
            // stackPrefetch.enable(this.imageElement);
            /*=======================================*/

            /*======== don't cache image data ========*/
            cornerstoneTools.addToolState(this.imageElement, 'stack', {
                imageIds: this.state.imageIds, currentImageIdIndex: this.state.currentStackIndex, preventCache: true
            });
            const tempImageIds = [...this.state.imageIds];
            const imageIdGroups = [];
            while (tempImageIds.length) imageIdGroups.push(tempImageIds.splice(0, 10));
            imageIdGroups.reduce((accumulatorPromise, idGroup) => {
                return accumulatorPromise.then(() => {
                    return Promise.all(idGroup.map((id) => cornerstone.loadImage(id).then(() => {
                        const downStatus = [...this.state.downStatus];
                        const index = this.state.imageIds.indexOf(id);
                        if (index !== -1) downStatus[index] = true;
                        this.setState({downStatus});
                        // that.setState({downImageCount: that.state.downImageCount + 1});
                    })));
                });
            }, Promise.resolve()).then(() => {
                cornerstone.triggerEvent(
                    cornerstone.events,
                    'cornerstoneimageviewimageloaded',
                    {imageViewImageId: this.props.imageInfo.id}
                );
            });
            /*=======================================*/
            cornerstoneTools.addToolForElement(this.imageElement, StackScrollMouseWheelTool);
            cornerstoneTools.setToolActiveForElement(this.imageElement, 'StackScrollMouseWheel', {});
        } else {
            cornerstone.triggerEvent(
                cornerstone.events,
                'cornerstoneimageviewimageloaded',
                {imageViewImageId: this.props.imageInfo.id}
            );
            // images are loaded with the zoom mousewheel enabled by default
            cornerstoneTools.setToolActiveForElement(this.imageElement, 'ZoomMouseWheel', {});
        }
        // render shapes
        this.renderShapes();
        this.renderMarks();
        this.setInitialSetParam();
    }

    static adjustSlideSize() {
        let sliders = document.querySelectorAll('div .stack-scrollbar input');
        for (let i = 0; i < sliders.length; i++) {
            sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
        }
        window.addEventListener('resize', () => {
            console.log('resize----------------------')
            let sliders = document.querySelectorAll('div .stack-scrollbar input');
            for (let i = 0; i < sliders.length; i++) {
                sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
            }
        });
    }

    setInitialSetParam() {
        let viewport = cornerstone.getViewport(this.imageElement);
        // viewport.invert = !viewport.invert;
        if (this.props.brightness !== undefined && this.props.brightness !== null && !isNaN(this.props.brightness) && Number(this.props.brightness) !== 0) {
            viewport.voi.windowWidth = Number(this.props.brightness);
        }
        if (this.props.contrast !== undefined && this.props.contrast !== null && !isNaN(this.props.contrast) && Number(this.props.contrast) !== 0) {
            viewport.voi.windowCenter = Number(this.props.contrast);
        }
        if (this.props.zoom !== undefined && this.props.zoom !== null && !isNaN(this.props.zoom)) {
            viewport.scale = viewport.scale * Number(this.props.zoom);
        }
        cornerstone.setViewport(this.imageElement, viewport);
    }

    setupLoadHandlers(clear = false) {
        if (clear) {
            loadHandlerManager.removeHandlers(this.imageElement);
            return;
        }
        const loadIndicatorDelay = 45;
        // We use this to "flip" `isLoading` to true, if our startLoading request
        // takes longer than our "loadIndicatorDelay"
        const startLoadHandler = element => {
            clearTimeout(this.loadHandlerTimeout);
            // We're taking too long. Indicate that we're "Loading".
            this.loadHandlerTimeout = setTimeout(() => {
                this.setState({isLoading: true});
            }, loadIndicatorDelay);
        };

        const endLoadHandler = (element, image) => {
            clearTimeout(this.loadHandlerTimeout);
            if (this.state.isLoading) {
                this.setState({isLoading: false});
            }
        };

        loadHandlerManager.setStartLoadHandler(startLoadHandler, this.imageElement);
        loadHandlerManager.setEndLoadHandler(endLoadHandler, this.imageElement);
    }

    handleChangeStack(e, data) {
        const currentStackIndex = this.state.imageIds.indexOf(e.detail.image.imageId);
        this.setState({currentStackIndex: currentStackIndex});
        this.renderShapes();
        this.renderMarks();
    }

    handleDoubleClickEvent(event) {
        // disable double click when current tool is freehand
        if (this.props.currentTool === 'MarkerFreehand') return;
        this.handleAddMark('Marker', {measurementData: {point: event.detail.currentPoints.image}})
    }

    handleMeasureCompleteEvent(event) {
        if (event.detail.toolName === 'Marker' || event.detail.toolName === 'MarkerFreehand') {
            if (event.detail.measurementData.id === undefined) {
                console.log('marker complete', event.detail.toolName)
                this.handleAddMark(event.detail.toolName, event.detail);
            } else {
                this.handleEditMark(event.detail.toolName, event.detail);
            }
        } else {
            this.handleAddShape(event);
        }
    }

    handleMeasureModifyEvent(event) {
        console.log('measure modify', event.detail.toolName)
        this.tempMeasureToolData = event.detail;
    }

    handleMeasureRemoveEvent(event) {
        console.log('measure remove', event.detail.toolName)
        if (event.detail.toolName === 'Marker' || event.detail.toolName === 'MarkerFreehand') {

        } else {
            this.handleRemoveShape(event)
        }
    }

    handleAddMark(toolName, eventDetail) {
        let markerData = {
            marker_tool_type: toolName,
            active: true,
            imageId: this.props.imageInfo.id,
            lesionTypes: [],
            lesionList: {},
            isTruth: false,
            imageElement: this.imageElement,
            isNew: true,
        };
        if (toolName === 'Marker') {
            markerData.handles = {
                end: {
                    x: eventDetail.measurementData.point.x,
                    y: eventDetail.measurementData.point.y,
                    active: true,
                    highlight: true
                }
            };
            markerData.radius = this.props.radius;
            cornerstoneTools.addToolState(this.imageElement, 'Marker', markerData);
        } else if (toolName === 'MarkerFreehand') {
            markerData.handles = eventDetail.measurementData.handles
        }
        this.props.onShowPopup(markerData, this.handleMarkCancel.bind(this), this.handleMarkDelete.bind(this), this.handleMarkSave.bind(this));
        cornerstone.invalidate(this.imageElement);
    }

    handleEditMark(toolName, eventDetail) {
        console.log('marker edit', toolName, eventDetail);
        const markerData = eventDetail.measurementData;
        markerData.isNew = false;
        markerData.marker_tool_type = toolName;
        this.props.onShowPopup(markerData, this.handleMarkCancel.bind(this), this.handleMarkDelete.bind(this), this.handleMarkSave.bind(this));
    }

    handleMarkCancel() {
        this.renderMarks();
    }

    handleMarkDelete(deleteId) {
        Apis.answersDelete(deleteId).then((resp) => {
            this.markList = this.markList.filter((v) => {
                return !(v.id === deleteId && !v.isTruth);
            });
            this.props.setImageAnswer(this.props.imageInfo.id, 'markList', this.markList);
            this.renderMarks();
        }).catch(e => {
            alert('An error occurred deleting this mark');
        }).finally(() => {
        });
    }

    handleMarkSave(data) {
        let act;
        data.image_id = this.props.imageInfo.id;
        data.stack = Number(this.state.currentStackIndex);
        if (data.isNew) {
            act = 'answersAdd';
        } else {
            act = 'answersUpdate';
        }
        Apis[act](data).then(response => {
            response.isTruth = false;
            response.lesionTypes = response.answer_lesion_types;
            response.lesionList = JSON.parse(response.answer_lesion_list);
            if (data.isNew) {
                this.markList.push(response);
            } else {
                let index = this.markList.findIndex((v) => v.id === response.id);
                this.markList[index] = response;
            }
            this.props.setImageAnswer(this.props.imageInfo.id, 'markList', this.markList);
            this.renderMarks();
        }).catch(e_ => {
            alert('An error occurred saving this mark');
        }).finally(() => {
        });
    }

    handleAddShape(event) {
        this.tempMeasureToolData = null;
        if (event.detail.measurementData.id === undefined) {
            event.detail.measurementData.id = uuidv4();
            const data = {
                id: event.detail.measurementData.id,
                image_id: this.props.imageInfo.id,
                attempt_id: this.props.attemptId,
                test_case_id: this.props.imageInfo.test_case_id,
                type: event.detail.toolName || event.detail.toolType,
                data: JSON.stringify(event.detail.measurementData).replace(/-?\d+\.\d+/g, function (x) {
                    return parseFloat(x).toFixed(2)
                }),
                stack: Number(this.state.currentStackIndex),
            };
            Apis.shapeAdd(data).then(resp => {
                if (this.shapeList[data.type] === undefined) this.shapeList[data.type] = [];
                this.shapeList[data.type].push({stack: data.stack, measurementData: JSON.parse(data.data)});
                this.props.setImageAnswer(this.props.imageInfo.id, 'shapeList', this.shapeList);
            });
        }
    }

    handleRemoveShape(event) {
        this.tempMeasureToolData = null;
        const that = this;
        // This timeout is needed because remove event is sometimes called before complete event is called.
        setTimeout(function () {
            const shapeId = event.detail.measurementData.id;
            const type = event.detail.toolName || event.detail.toolType;
            if (that.shapeList[type] !== undefined) {
                Apis.shapeDelete(shapeId).then(resp => {
                    const index = that.shapeList[type].map((v) => v.measurementData.id).indexOf(shapeId);
                    that.shapeList[type].splice(index, 1);
                    this.props.setImageAnswer(that.props.imageInfo.id, 'shapeList', that.shapeList);
                });
            }
        }, 500);
    }

    handleMouseUp(event) {
        const that = this;
        if (that.tempMeasureToolData !== null && that.tempMeasureToolData.measurementData.id !== undefined) {
            if (that.tempMeasureToolData.toolName === 'Marker' || that.tempMeasureToolData.toolName === 'MarkerFreehand') {

            } else {
                setTimeout(function () {
                    const data = {
                        id: that.tempMeasureToolData.measurementData.id,
                        image_id: that.props.imageInfo.id,
                        attempt_id: that.props.attemptId,
                        test_case_id: that.props.imageInfo.test_case_id,
                        type: that.tempMeasureToolData.toolName || that.tempMeasureToolData.toolType,
                        data: JSON.stringify(that.tempMeasureToolData.measurementData).replace(/-?\d+\.\d+/g, function (x) {
                            return parseFloat(x).toFixed(2)
                        }),
                        stack: Number(that.state.currentStackIndex),
                    };
                    Apis.shapeUpdate(data).then(resp => {
                        console.log('modified shape');
                        const index = that.shapeList[data.type].map((v) => v.measurementData.id).indexOf(data.id);
                        that.shapeList[data.type][index] = {stack: data.stack, measurementData: JSON.parse(data.data)};
                        this.props.setImageAnswer(this.props.imageInfo.id, 'shapeList', this.shapeList);
                    });
                }, 500);
            }
        }
    }

    handleImageLoadProgress(event) {
        // if(event.detail.loaded === event.detail.total) {
        //         //     const downStatus = [...this.state.downStatus];
        //         //     const index = this.state.imageIds.indexOf(event.detail.imageId);
        //         //     if (index !== -1) downStatus[index] = true;
        //         //     this.setState({downStatus});
        //         // }
    }

    renderMarks() {
        cornerstoneTools.clearToolState(this.imageElement, 'Marker');
        cornerstoneTools.clearToolState(this.imageElement, 'MarkerFreehand');
        this.markList.forEach((mark) => {
            if (mark.stack === Number(this.state.currentStackIndex)) {
                try {
                    const markHandlesData = JSON.parse(mark.marker_data);
                    const active = true;
                    const markerData = {
                        active: active,
                        id: mark.id,
                        imageId: this.props.imageInfo.id,
                        isTruth: mark.isTruth,
                        lesionNumber: mark.number,
                        rating: mark.rating,
                        radius: this.props.radius,
                        lesionTypes: mark.lesionTypes,
                        lesionList: mark.lesionList,
                        imageElement: this.imageElement
                    };
                    if (mark.marker_tool_type === 'Marker') {
                        markerData.handles = {
                            end: {
                                x: markHandlesData.x,
                                y: markHandlesData.y,
                                active: active,
                                highlight: active
                            }
                        };
                        cornerstoneTools.addToolState(this.imageElement, 'Marker', markerData);
                    } else if (mark.marker_tool_type === 'MarkerFreehand') {
                        markerData.handles = markHandlesData;
                        const topLeftPoint = {};
                        const bottomRightPoint = {};
                        markerData.handles.points.forEach((v) => {
                            if (topLeftPoint.x === undefined || topLeftPoint.x > v.x) topLeftPoint.x = v.x;
                            if (topLeftPoint.y === undefined || topLeftPoint.y > v.y) topLeftPoint.y = v.y;
                            if (bottomRightPoint.x === undefined || bottomRightPoint.x < v.x) bottomRightPoint.x = v.x;
                            if (bottomRightPoint.y === undefined || bottomRightPoint.y < v.y) bottomRightPoint.y = v.y;
                        });
                        markerData.polyBoundingBox = {
                            left: topLeftPoint.x,
                            top: topLeftPoint.y,
                            width: Math.abs(bottomRightPoint.x - topLeftPoint.x),
                            height: Math.abs(bottomRightPoint.y - topLeftPoint.y)
                        };
                        cornerstoneTools.addToolState(this.imageElement, 'MarkerFreehand', markerData);
                    }
                } catch (e) {
                    console.error('mark parse error', e);
                }
            }
        });
        cornerstone.invalidate(this.imageElement);
    }

    renderShapes() {
        this.toolList.forEach(toolName => {
            cornerstoneTools.clearToolState(this.imageElement, toolName);
        });
        for (let type in this.shapeList) {
            this.shapeList[type].forEach((v) => {
                if (v.stack === Number(this.state.currentStackIndex)) {
                    cornerstoneTools.addToolState(this.imageElement, type, v.measurementData);
                }
            });
        }
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
    }

    resetTool(previousName, nextName) {
        cornerstoneTools.setToolPassive(previousName);
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

    onClearSymbols() {
        if (this.props.currentTool !== 'Marker') {
            Apis.shapeDeleteAll(this.props.imageInfo.id, this.props.attemptId, this.props.imageInfo.test_case_id, this.props.currentTool).then((resp) => {
                cornerstoneTools.clearToolState(this.imageElement, this.props.currentTool);
                cornerstone.invalidate(this.imageElement);
            }).catch((error) => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        } else {
            Apis.answersDeleteAll(this.props.imageInfo.id, this.props.attemptId, this.props.imageInfo.test_case_id).then((resp) => {
                this.markList = [];
                this.renderMarks();
            }).catch((error) => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    _updateImageInfo(event) {
        const eventData = event.detail;
        const windowWidth = Math.round(eventData.viewport.voi.windowWidth);
        const windowLength = Math.round(eventData.viewport.voi.windowCenter);
        const zoom = eventData.viewport.scale.toFixed(2);
        this.imageElement.parentNode.querySelector('.window').textContent = `WW/WL: ${windowWidth} / ${windowLength}`;
        this.imageElement.parentNode.querySelector('.zoom').textContent = `Zoom: ${zoom}`;
    }

    onStepSlide(seek) {
        let value = Number(this.state.currentStackIndex) + 1 + seek;
        if (value > this.state.imageIds.length || value < 1) return;
        this.setStack(value);
    }

    onStackSlide(event) {
        this.setStack(Number(event.target.value));
    }

    setStack(value) {
        const newIndex = Number(value) - 1;
        let stackToolDataSource = cornerstoneTools.getToolState(this.imageElement, 'stack');
        if (stackToolDataSource === undefined) {
            return;
        }
        let stackData = stackToolDataSource.data[0];
        // Switch images, if necessary
        if (newIndex !== stackData.currentImageIdIndex && stackData.imageIds[newIndex] !== undefined) {
            stackToIndex(this.imageElement, newIndex);
            stackData.currentImageIdIndex = newIndex;
            // cornerstone.loadAndCacheImage(stackData.imageIds[newIndex]).then(function (image) {
            //     let viewport = cornerstone.getViewport(that.imageElement);
            //     stackData.currentImageIdIndex = newIndex;
            //     cornerstone.displayImage(that.imageElement, image, viewport);
            // });
        }
        // this.setState({currentStackIndex: newIndex});
    }

    renderImageQuality() {
        if (this.props.isShowQuality) {
            const imageQuality = Number(this.props.stage === 1 ? this.props.imageInfo.imageQuality : this.props.imageInfo.quality);
            return (
                <div className={'individual-quality-btn'}>
                    <a className="eye" onClick={() => this.props.stage === 1 ? this.props.onShowQualityModal(this.props.imageInfo.id) : null}>
                        <Tooltip title="Image Quality" placement="bottom">
                            <div className={(imageQuality === -1 ? 'quality-none' : ['inadequate', 'moderate', 'good', 'perfect'][imageQuality]) + '-icon'}/>
                        </Tooltip>
                    </a>
                </div>
            )
        } else {
            return null;
        }
    }

    renderStackComponent() {
        if (this.state.imageIds.length <= 1) {
            return null;
        } else {
            let countPerStack = {};
            this.markList.forEach((v) => {
                if (countPerStack[v.stack] === undefined) {
                    countPerStack[v.stack] = {answerCount: 0, truthCount: 0};
                }
                if (v.isTruth) {
                    countPerStack[v.stack].truthCount++;
                } else {
                    countPerStack[v.stack].answerCount++;
                }
            });
            let floatingButton = [];
            for (let v in countPerStack) {
                floatingButton.push({
                    stack: v,
                    answerCount: countPerStack[v].answerCount,
                    truthCount: countPerStack[v].truthCount,
                });
            }

            return (
                <div>
                    <div className={'side-bar'}>
                        <IconButton className={'change-btn'} onClick={() => this.onStepSlide(-1)}>
                            <i className="zmdi zmdi-minus"/>
                        </IconButton>
                        <div className="stack-scrollbar">
                            <input type="range" min={1} max={this.state.imageIds.length} value={this.state.currentStackIndex + 1} onChange={this.onStackSlide.bind(this)}/>
                        </div>
                        <IconButton className={'change-btn'} onClick={() => this.onStepSlide(1)}>
                            <i className="zmdi zmdi-plus"/>
                        </IconButton>
                    </div>
                    <div className="slice status"><IntlMessages id={"testView.viewer.slice"}/>: [{this.state.currentStackIndex + 1}/{this.state.imageIds.length}]</div>
                    {
                        floatingButton.length > 0 ?
                            <div className={'floating-menu'}>
                                <FloatingMenu
                                    slideSpeed={500}
                                    direction={'down'}
                                    isOpen={this.state.isShowFloatingMenu}
                                    spacing={8}
                                    onClose={() => this.setState({isShowFloatingMenu: !this.state.isShowFloatingMenu})}
                                    isScroll={floatingButton.length > 10}
                                    itemContainerClass={'floating-item-content'}
                                >
                                    {
                                        floatingButton.map((v, i) =>
                                            <ChildButton
                                                key={i}
                                                answerCount={v.answerCount}
                                                truthCount={v.truthCount}
                                                label={'Slice ' + (Number(v.stack) + 1)}
                                                buttonTooltip={''}
                                                active={Number(this.state.currentStackIndex) === Number(v.stack)}
                                                size={40}
                                                onClick={() => this.setStack(Number(v.stack) + 1)}
                                            />
                                        )
                                    }
                                </FloatingMenu>
                            </div> : null
                    }
                </div>
            )
        }
    }

    render() {
        const {imageInfo, dndRef, isDragOver, tools} = this.props;
        const canDrawMarker = tools.filter((v) => (v === 'Marker' || v === 'MarkerFreehand')).length > 0;
        return (
            <div ref={dndRef}
                 className={"image " + (isDragOver ? 'drag-hover' : '')}
                 id={"image" + imageInfo.id}
                 data-image-id={imageInfo.id}
                 data-url={imageInfo.id}
                 data-index={this.props.index}
                 data-stack={imageInfo.stack_count}
                 data-hanging-id={imageInfo.hangingId}
                 style={{width: this.props.width + '%'}}
            >
                <div className={'control-btn'}>
                    {
                        canDrawMarker &&
                        <a className="eye" onClick={() => this.toggleMarkInfo()}>
                            <Tooltip title={<IntlMessages id={"testView.viewer.hideInfo"}/>} placement="bottom">
                                <i className={this.state.isShowMarkInfo ? "zmdi zmdi-eye fs-23" : "zmdi zmdi-eye-off fs-23"}/>
                            </Tooltip>
                        </a>
                    }
                    <a onClick={() => null}>
                        <Tooltip title={<IntlMessages id={"testView.viewer.invert"}/>} placement="bottom">
                            <i className={"zmdi zmdi-brightness-6 fs-23"} onClick={() => this.onInvert()}/>
                        </Tooltip>
                    </a>
                    {
                        (!this.props.complete && canDrawMarker) &&
                        <a onClick={() => null}>
                            <Tooltip title={<IntlMessages id={"testView.viewer.delete"}/>} placement="bottom">
                                <i className={"zmdi zmdi-delete fs-23 ml-2"} onClick={() => this.onClearSymbols()}/>
                            </Tooltip>
                        </a>
                    }
                </div>
                {this.renderImageQuality()}
                <ResizeDetector
                    handleWidth
                    handleHeight
                    skipOnMount={true}
                    refreshMode={'throttle'}
                    refreshRate={500}
                    onResize={() => {
                        cornerstone.resize(this.imageElement);
                    }}
                >
                    <div className="dicom" ref={this.imageElementRef}/>
                </ResizeDetector>
                <DownloadProgress
                    totalCount={this.state.downStatus.length}
                    downCount={this.state.downStatus.filter((v) => v).length}
                />
                <div className="location status"/>
                <div className="zoom status"/>
                <div className="window status"/>
                {this.renderStackComponent()}
                {/*{this.state.isLoading && <LoadingIndicator type="image"/>}*/}
            </div>
        )
    }
}


// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        showImageList: state.testView.showImageList
    };
};

export default withRouter(connect(mapStateToProps, {
    setImageAnswer
})(ImageViewer));