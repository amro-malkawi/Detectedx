import React, {Component} from 'react';
import withRouter from 'Components/WithRouter';
import {connect} from "react-redux";
import {setImageAnswer, setFullImageViewer, setFocusImageId} from "Store/Actions";
import ResizeDetector from 'react-resize-detector';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import {NotificationManager} from "react-notifications";
import * as Apis from "Api/index";
import {v4 as uuidv4} from 'uuid';

import DownloadTopBarProgress from "./DownloadTopBarProgress";
import ImageOverlap from "./ImageOverlap";
import _ from 'lodash';

import stackPrefetch from '../lib/stackTools/stackPrefetch';
import cornerstoneResize from "../lib/resize";

import MarkerTool from "../lib/tools/MarkerTool";
import MarkerFreehandTool from "../lib/tools/MarkerFreehandTool";
import LengthTool from "../lib/tools/LengthTool";
import AngleTool from "../lib/tools/AngleTool";
import TruthArrowTool from "../lib/tools/TruthArrowTool";
import ZoomMouseWheelTool from "../lib/tools/ZoomMouseWheelTool";
import CrosshairsTool from '../lib/tools/CrosshairsTool';

// const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
const ZoomTouchPinch = cornerstoneTools.ZoomTouchPinchTool;

// const MagnifyTool = cornerstoneTools.MagnifyTool;
// const LengthTool = cornerstoneTools.LengthTool;
// const AngleTool = cornerstoneTools.AngleTool;
// const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
// const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
// const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
// const FreehandMouseTool = cornerstoneTools.FreehandMouseTool;
// const EraserTool = cornerstoneTools.EraserTool;

const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
const stackToIndex = cornerstoneTools.import('util/scrollToIndex');
const {loadHandlerManager} = cornerstoneTools;

function insidePolygon(point, polygon) {
    const {x, y} = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

class ImageViewer extends Component {

    constructor(props) {
        super(props);
        const imageIds = Array.from(Array(props.imageInfo.stack_count).keys()).map(v => {
            // return `${props.imageInfo.image_url_path}${v}.png`;
            return `${props.imageInfo.image_url_path}${v}`;
        });
        this.state = {
            imageIds,
            currentStackIndex: 0,
            downStatus: Array(props.imageInfo.stack_count).fill(props.imageInfo.stack_count === 1),
            isLoading: false,
            isShowFloatingMenu: false,
            age: 0,
            loadedImage: false,
        };
        this.toolList = ['Magnify', 'Length', 'Angle', 'EllipticalRoi', 'RectangleRoi', 'ArrowAnnotate', 'TruthArrow', 'Eraser'];
        this.imageElement = undefined;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.markList = props.imageInfo.answers.markList;
        this.shapeList = props.imageInfo.answers.shapeList;
        this.tempMeasureToolData = null;
        this.imageElementRef = React.createRef();
        this.isComponentMount = false;

        this.handleClickEvent = this.handleClickEvent.bind(this)
        this.handleDoubleClickEvent = this.handleDoubleClickEvent.bind(this)
        this.handleMouseMoveEvent = _.throttle(this.handleMouseMoveEvent.bind(this), 150);
        this.handleChangeStack = this.handleChangeStack.bind(this)
        this.handleMeasureCompleteEvent = this.handleMeasureCompleteEvent.bind(this)
        this.handleMeasureModifyEvent = this.handleMeasureModifyEvent.bind(this)
        this.handleMeasureRemoveEvent = this.handleMeasureRemoveEvent.bind(this)
        this.handleEditMark = this.handleEditMark.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handlePrefecthDone = this.handlePrefecthDone.bind(this)



        this.handleDatasetsCacheChanged = this.handleDatasetsCacheChanged.bind(this)
    }

    componentDidMount() {
        console.log('image viewer did mount')
        this.isComponentMount = true;
        this.getMetaInfo();
        this.imageElement = this.imageElementRef.current;
        cornerstone.enable(this.imageElement);
        this.setupLoadHandlers();
        if (this.state.imageIds.length !== 0) {
            cornerstone.loadImage(this.state.imageIds[0], {type: 'firstFrame'}).then((image) => {
                this.imageWidth = image.width;
                this.imageHeight = image.height;
                const initialViewport = this.getInitialViewport();
                cornerstone.displayImage(this.imageElement, image, initialViewport);
                this.initTools();
                this.setState({loadedImage: true});
            });
        }
        this.initEvents();
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
        this.isComponentMount = false;
        this.setupLoadHandlers(true);
        if (this.state.imageIds.length > 1) {
            stackPrefetch.disable(this.imageElement);
        }
        this.clearEvents();
        cornerstoneTools.clearToolState(this.imageElement, 'stackPrefetch');
        cornerstone.imageCache.purgeCache();
        cornerstoneTools.stopClip(this.imageElement);
        cornerstone.disable(this.imageElement);
        // if (this.webWorker) this.webWorker.terminate();
    }

    getInitialViewport() {
        let initialViewport = {};
        let imgMLOMaxRealHeight = 0
        if (this.props.imageInfo.type === 'volpara') {
            return initialViewport;
        }
        this.imagePosition = cornerstone.metaData.get(
            'imagePosition',
            this.props.imageInfo.image_url_path
        );
        if (this.props.initialZoomLevel && this.props.initialZoomLevel.findIndex((v) => v.zoom_image_id === this.props.imageInfo.id) !== -1) {
            const initZoomInfo = this.props.initialZoomLevel.find((v) => v.zoom_image_id === this.props.imageInfo.id);
            initialViewport.scale = initZoomInfo.zoom_level
            imgMLOMaxRealHeight = initZoomInfo.zoom_real_height
            try {
                const canvasWidth = Math.floor(this.imageElementRef.current.clientWidth / initialViewport.scale);
                const canvasHeight = Math.floor(this.imageElementRef.current.clientHeight / initialViewport.scale);
                const realContentRegion = this.props.imageInfo.real_content_region.split(',');
                const realContentLeft = Number(realContentRegion[0]);
                const realContentTop = Number(realContentRegion[1]);
                const realContentRight = Number(realContentRegion[2]);
                const realContentBottom = Number(realContentRegion[3]);
                let offsetX = 0, offsetY = 0;
                if (this.props.showImageList[0].length > 1 && this.imagePosition !== undefined) {
                    if (this.imagePosition.imageLaterality === 'L') {
                        offsetX = (this.imageWidth / 2 - canvasWidth / 2 - realContentLeft);
                    } else if (this.imagePosition.imageLaterality === 'R') {
                        offsetX = -(realContentRight - this.imageWidth / 2 - canvasWidth / 2);
                    }
                    offsetY = (this.imageHeight / 2 - (realContentTop + (realContentBottom - realContentTop) / 2));
                }
                initialViewport.translation = {x: offsetX, y: offsetY};
            } catch (e) {
                console.error(e.message)
            }
        }

        // if (this.props.initialZoomLevel && this.props.initialZoomLevel.length > 0) {
        //     this.props.initialZoomLevel.forEach(v => {
        //         if (this.props.imageInfo.id === v.zoom_image_id) {
        //             if (!isNaN(v.zoom_level) && v.zoom_level !== Infinity && v.zoom_level !== 0) {
        //                 initialViewport.scale = v.zoom_level
        //                 imgMLOMaxRealHeight = v.zoom_real_height
        //                 try {
        //                     const imagePosition = cornerstone.metaData.get(
        //                         'imagePosition',
        //                         this.props.imageInfo.image_url_path
        //                     );
        //                     this.imagePosition = imagePosition;
        //                     const canvasWidth = Math.floor(this.imageElementRef.current.clientWidth / initialViewport.scale);
        //                     const canvasHeight = Math.floor(this.imageElementRef.current.clientHeight / initialViewport.scale);
        //                     const realContentRegion = this.props.imageInfo.real_content_region.split(',');
        //                     const realContentLeft = Number(realContentRegion[0]);
        //                     const realContentTop = Number(realContentRegion[1]);
        //                     const realContentRight = Number(realContentRegion[2]);
        //                     const realContentBottom = Number(realContentRegion[3]);
        //                     let offsetX = 0, offsetY = 0;
        //                     if (this.props.showImageList[0].length > 1 && imagePosition !== undefined) {
        //                         if (imagePosition.imageLaterality === 'L') {
        //                             offsetX = (this.imageWidth / 2 - canvasWidth / 2 - realContentLeft);
        //                         } else if (imagePosition.imageLaterality === 'R') {
        //                             offsetX = -(realContentRight - this.imageWidth / 2 - canvasWidth / 2);
        //                         }
        //                         // if (imagePosition.positionDesc === 'GE-V-PREVIEW') {
        //                         //     // offsetY = 385;
        //                         //     offsetY = (this.imageHeight / 2 - (realContentTop + (realContentBottom - realContentTop) / 2));
        //                         // }
        //
        //                         offsetY = (this.imageHeight / 2 - (realContentTop + (realContentBottom - realContentTop) / 2));
        //                         if (
        //                             imagePosition.viewPosition.indexOf('MLO') !== -1
        //                             && imgMLOMaxRealHeight !== 0
        //                             && this.props.imageInfo.type !== 'prior'
        //                         ) {
        //                             offsetY = offsetY + ((realContentBottom - realContentTop) - imgMLOMaxRealHeight) / 2;
        //                         }
        //                     }
        //                     initialViewport.translation = {x: offsetX, y: offsetY};
        //                 } catch (e) {
        //                     console.log(e.message)
        //                 }
        //             }
        //         }
        //     });
        // }
        if (this.props.imageInfo.ww && this.props.imageInfo.wc) {
            const voiLutModuleInfo = cornerstone.metaData.get(
                'voiLutModule',
                this.props.imageInfo.image_url_path
            );
            if (voiLutModuleInfo) {
                const imageWW = voiLutModuleInfo.windowWidth[0];
                const imageWL = voiLutModuleInfo.windowCenter[0];
                initialViewport.voi = {
                    windowWidth: Math.round(this.props.imageInfo.ww * 255 / imageWW),
                    windowCenter: Math.round(this.props.imageInfo.wc * 128 / imageWL)
                };
            }
        }
        return initialViewport;
    }

    getMetaInfo() {
        const age = cornerstone.metaData.get(
            'age',
            this.props.imageInfo.image_url_path
        );
        this.setState({age});
    }

    runWorker() {
        // this.webWorker = new WebWorker(new WorkerProc({imageElement: this.imageElement, imageIds: this.state.imageIds}));
    }

    initEvents() {
        this.imageElement.addEventListener('cornerstonetoolsmouseclick', this.handleClickEvent);
        this.imageElement.addEventListener('cornerstonetoolstap', this.handleClickEvent);
        this.imageElement.addEventListener('cornerstonetoolsmousedoubleclick', this.handleDoubleClickEvent);
        this.imageElement.addEventListener('cornerstonetoolsdoubletap', this.handleDoubleClickEvent);
        this.imageElement.addEventListener('cornerstonetoolsmousemove', this.handleMouseMoveEvent);
        this.imageElement.addEventListener('cornerstonenewimage', this.handleChangeStack);
        this.imageElement.querySelector('canvas').oncontextmenu = function () {
            return false;
        }
        this.imageElement.addEventListener('cornerstonetoolsmeasurementcompleted', this.handleMeasureCompleteEvent);
        this.imageElement.addEventListener('cornerstonetoolsmeasurementmodified', this.handleMeasureModifyEvent);
        this.imageElement.addEventListener('cornerstonetoolsmeasurementremoved', this.handleMeasureRemoveEvent);
        this.imageElement.addEventListener('cornerstonetoolsmarkerselected', this.handleEditMark);
        this.imageElement.addEventListener('cornerstonetoolsmouseup', this.handleMouseUp);
        this.imageElement.addEventListener(cornerstoneTools.EVENTS.STACK_PREFETCH_DONE, this.handlePrefecthDone);
        this.imageElement.addEventListener('cornerstonedatasetscachechanged', this.handleDatasetsCacheChanged);
        // cornerstone.events.addEventListener('cornerstoneimageloadprogress', this.handleImageLoadProgress.bind(this));
    }

    clearEvents() {
        this.imageElement.removeEventListener('cornerstonetoolsmouseclick', this.handleClickEvent);
        this.imageElement.removeEventListener('cornerstonetoolstap', this.handleClickEvent);
        this.imageElement.removeEventListener('cornerstonetoolsmousedoubleclick', this.handleDoubleClickEvent);
        this.imageElement.removeEventListener('cornerstonetoolsdoubletap', this.handleDoubleClickEvent);
        this.imageElement.removeEventListener('cornerstonetoolsmousemove', this.handleMouseMoveEvent);
        this.imageElement.removeEventListener('cornerstonenewimage', this.handleChangeStack);
        this.imageElement.removeEventListener('cornerstonetoolsmeasurementcompleted', this.handleMeasureCompleteEvent);
        this.imageElement.removeEventListener('cornerstonetoolsmeasurementmodified', this.handleMeasureModifyEvent);
        this.imageElement.removeEventListener('cornerstonetoolsmeasurementremoved', this.handleMeasureRemoveEvent);
        this.imageElement.removeEventListener('cornerstonetoolsmarkerselected', this.handleEditMark);
        this.imageElement.removeEventListener('cornerstonetoolsmouseup', this.handleMouseUp);
        this.imageElement.removeEventListener(cornerstoneTools.EVENTS.STACK_PREFETCH_DONE, this.handlePrefecthDone);
        this.imageElement.removeEventListener('cornerstonedatasetscachechanged', this.handleDatasetsCacheChanged);
    }

    initTools() {
        // now the image has been displayed, deep copy the original viewport
        // so we can reset zoom and position
        let viewport = cornerstone.getViewport(this.imageElement);
        // add all tools to the image
        const setToolElementFunc = this.props.complete ? 'setToolEnabledForElement' : 'setToolPassiveForElement';
        // cornerstoneTools.addToolForElement(this.imageElement, MarkerTool, {addMarkFunc: this.handleAddMark.bind(this), editMarkFunc: this.handleEditMark.bind(this)});
        cornerstoneTools.addToolForElement(this.imageElement, MarkerTool);
        cornerstoneTools.addToolForElement(this.imageElement, MarkerFreehandTool);
        cornerstoneTools.addToolForElement(this.imageElement, PanTool);
        cornerstoneTools.addToolForElement(this.imageElement, WwwcTool);
        cornerstoneTools.addToolForElement(this.imageElement, CrosshairsTool);
        this.toolList.forEach(toolName => {
            // customized tool
            if (toolName === 'Length') {
                cornerstoneTools.addToolForElement(this.imageElement, LengthTool);
            } else if (toolName === 'Angle') {
                cornerstoneTools.addToolForElement(this.imageElement, AngleTool);
            } else if (toolName === 'TruthArrow') {
                cornerstoneTools.addToolForElement(this.imageElement, TruthArrowTool);
            } else {
                cornerstoneTools.addToolForElement(this.imageElement, cornerstoneTools[toolName + 'Tool']);
            }
            if (toolName === 'TruthArrow') {
                cornerstoneTools.setToolEnabledForElement(this.imageElement, toolName);
            } else {
                cornerstoneTools[setToolElementFunc](this.imageElement, toolName);
            }
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
                minScale: viewport.scale / 2
            }
        });

        cornerstoneTools.addToolForElement(this.imageElement, ZoomMouseWheelTool, {
            configuration: {
                minScale: viewport.scale / 2
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

        //add synchronizer
        this.props.synchronizer && this.props.synchronizer.add(this.imageElement);

        if (this.state.imageIds.length > 1) {
            //add image stack
            cornerstoneTools.addStackStateManager(this.imageElement, ['stack', 'Crosshairs']);

            cornerstoneTools.addToolState(this.imageElement, 'stack', {
                imageIds: this.state.imageIds, currentImageIdIndex: this.state.currentStackIndex, preventCache: true
            });
            const tempImageIds = [...this.state.imageIds];
            const imageIdGroups = [];
            while (tempImageIds.length) imageIdGroups.push(tempImageIds.splice(0, 10));
            // --------------------------------
            // imageIdGroups.reduce((accumulatorPromise, idGroup) => {
            //     return accumulatorPromise.then(() => {
            //         return Promise.all(idGroup.map((id) => cornerstone.loadImage(id, {
            //             type: 'thumbnail',
            //             element: this.imageElement,
            //             originalWidth: this.imageWidth,
            //             originalHeight: this.imageHeight
            //         }).then(() => {
            //             const downStatus = [...this.state.downStatus];
            //             const index = this.state.imageIds.indexOf(id);
            //             if (index !== -1) downStatus[index] = true;
            //             this.setState({downStatus});
            //             // that.setState({downImageCount: that.state.downImageCount + 1});
            //         })));
            //     });
            // }, Promise.resolve()).then(() => {
            //     this.handlePrefecthDone(true);
            //     stackPrefetch.enable(this.imageElement);
            // });
            // ----------------------
            this.handlePrefecthDone(true);
            imageIdGroups.reduce((accumulatorPromise, idGroup) => {
                return accumulatorPromise.then(() => {
                    if (!this.isComponentMount) {
                        return Promise.resolve();
                    } else {
                        const downStatus = [...this.state.downStatus];
                        return Promise.all(idGroup.map((id) => cornerstone.loadImage(id, {type: 'prefetch'}).then(() => {
                            const index = this.state.imageIds.indexOf(id);
                            if (index !== -1) {
                                downStatus[index] = true;
                            }
                            this.setState({downStatus});
                        })));
                    }
                });
            }, Promise.resolve()).then(() => {
                this.handlePrefecthDone(false);
            });
            // ------------------------

            cornerstoneTools.addToolForElement(this.imageElement, StackScrollMouseWheelTool);
            cornerstoneTools.setToolActiveForElement(this.imageElement, 'StackScrollMouseWheel', {});
        } else {
            this.handlePrefecthDone(true);
            this.handlePrefecthDone(false);
            // images are loaded with the zoom mousewheel enabled by default
            cornerstoneTools.setToolActiveForElement(this.imageElement, 'ZoomMouseWheel', {});
        }
        // render shapes
        this.renderShapes();
        this.renderMarks();

        // enable the current tool as well (used when adding a new image after
        // the toolbar has been loaded)
        cornerstoneTools.setToolActiveForElement(this.imageElement, this.props.currentTool, {
            mouseButtonMask: 1,
            synchronizationContext: this.props.synchronizer,   // for only crosshairs tool
        });
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
        this.setState({currentStackIndex: currentStackIndex}, () => {
            this.renderShapes();
            this.renderMarks();
        });
    }

    handleClickEvent(event) {
        if(this.props.focusImageViewerIndex !== this.props.index) {
            this.props.setFocusImageId(this.props.index);
        }
    }

    handleDoubleClickEvent(event) {
        // disable double click when current tool is freehand
        if (this.props.index !== '-1_-1' && this.props.currentTool !== 'MarkerFreehand') {
            // index="-1_-1" disable focus image feature
            let viewerIndex;
            if (this.props.fullImageViewerIndex === this.props.index) {
                viewerIndex = '-1_-1';
                this.props.synchronizer && this.props.synchronizer.add(this.imageElement);
            } else {
                viewerIndex = this.props.index;
                this.props.synchronizer && this.props.synchronizer.remove(this.imageElement);
            }
            this.props.setFullImageViewer(viewerIndex);
        }
    }

    handleMouseMoveEvent(event) {
        const mousePoint = event.detail.currentPoints.image;
        const infoElement = this.imageElement.parentElement.querySelector('.overlap-marker-info-list');
        if (!infoElement) return;
        let infoHtml = "";
        this.markList.forEach((mark) => {
            const markHandlesData = JSON.parse(mark.marker_data);
            const isTruth = mark.isTruth;
            const lesionNumber = mark.number;
            const rating = mark.rating;
            if (
                mark.stack === this.state.currentStackIndex &&
                (
                    (mark.marker_tool_type === 'Marker' && cornerstoneMath.point.distance(markHandlesData, mousePoint) < this.props.radius) ||
                    (mark.marker_tool_type === 'MarkerFreehand' && insidePolygon(mousePoint, markHandlesData.points))
                )
            ) {
                let lesionNames = [];
                const rootLesion = Object.keys(mark.lesionList)[0];
                if (rootLesion !== undefined) {
                    if (typeof mark.lesionList[rootLesion] === "object") {
                        lesionNames.push(rootLesion);
                        Object.keys(mark.lesionList[rootLesion]).forEach((key) => {
                            lesionNames.push(mark.lesionList[rootLesion][key]);
                        });
                    } else if (typeof mark.lesionList[rootLesion] === "string" && mark.lesionList[rootLesion].length > 0) {
                        lesionNames.push(rootLesion);
                        lesionNames.push(mark.lesionList[rootLesion]);
                    } else {
                        lesionNames.push(rootLesion);
                    }
                }
                // replace Nil and Present to "No associated features", "Associated features present"
                lesionNames.forEach((v, i) => {
                    if (v === 'Nil') lesionNames[i] = 'No associated features';
                    if (v === 'Present') lesionNames[i] = 'Associated features present';
                });
                // if attempt is screening, don't need to show info
                if (rootLesion === 'screening') {
                    return;
                }

                infoHtml += `<div class='overlap-marker-info'>`;
                infoHtml += `<span class="fs-14 b-2"><u>${(isTruth ? "Truth" : "Your answer")}</u></span>`;
                if(this.props.modalityInfo.modality_type !== 'wb_ct') {
                    // hide rating when wb-ct-ss modality
                    infoHtml += isTruth ? `<span>Lesion Number: ${lesionNumber}</span>` : `<span>Rate: ${rating}</span>`;
                }
                lesionNames.forEach((v, i) => {
                    infoHtml += `<span>${v}</span>`;
                });
                if(this.props.modalityInfo.modality_type === 'wb_ct') {
                    // show other text when wb-ct-ss modality
                    if(mark.lesionList['otherText'] && mark.lesionList['otherText'].text) {
                        infoHtml += `<span>${mark.lesionList['otherText'].text}</span>`;
                    }
                }
                infoHtml += "</div>"
            }
        });
        infoElement.innerHTML = infoHtml;
    }

    handleMeasureCompleteEvent(event) {
        console.log('measure added', event.detail.toolName);
        if (event.detail.toolName === 'Marker' || event.detail.toolName === 'MarkerFreehand') {
            this.tempMeasureToolData = null;
            if (event.detail.measurementData.id === undefined) {
                console.log('marker complete', event.detail.toolName)
                this.handleAddMark(event.detail.toolName, event.detail);
            } else {
                this.handleEditMark(event);
            }
        } else if(event.detail.toolName === 'Crosshairs') {
            return;
        } else {
            this.handleAddShape(event);
        }
    }

    handleMeasureModifyEvent(event) {
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

    handleEditMark(event) {
        const toolName = event.detail.toolName;
        const eventDetail = event.detail;
        const markerData = eventDetail.measurementData;
        markerData.isNew = false;
        markerData.marker_tool_type = toolName;
        if(!markerData.isTruth) this.props.onShowPopup(markerData, this.handleMarkCancel.bind(this), this.handleMarkDelete.bind(this), this.handleMarkSave.bind(this));
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
        if (this.props.modalityInfo.modality_type === 'imaged_mammo') return;
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
                    that.props.setImageAnswer(that.props.imageInfo.id, 'shapeList', that.shapeList);
                });
            }
        }, 500);
    }

    handleMouseUp(event) {
        const that = this;
        if (that.tempMeasureToolData === null || that.tempMeasureToolData.toolName === 'Marker' || that.tempMeasureToolData.toolName === 'MarkerFreehand') {

        } else {
            setTimeout(function () {
                if (that.tempMeasureToolData !== null && that.tempMeasureToolData.measurementData.id !== undefined) {
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
                        that.props.setImageAnswer(that.props.imageInfo.id, 'shapeList', this.shapeList);
                    });
                }
            }, 500);
        }
    }

    handleImageLoadProgress(event) {
        // if(event.detail.loaded === event.detail.total) {
        //     const downStatus = [...this.state.downStatus];
        //     const index = this.state.imageIds.indexOf(event.detail.imageId);
        //     if (index !== -1) downStatus[index] = true;
        //     this.setState({downStatus});
        // }
    }

    handleDatasetsCacheChanged(event) {
        console.log('cache changed')
        if (this.state.imageIds[cornerstoneTools.getToolState(this.imageElement, 'stack').data[0].currentImageIdIndex] === event.detail.uri) {
            cornerstone.loadImage(event.detail.uri).then((image) => {
                if (this.state.imageIds[cornerstoneTools.getToolState(this.imageElement, 'stack').data[0].currentImageIdIndex] === event.detail.uri) {
                    cornerstone.displayImage(this.imageElement, image);
                }
            });
        }
    }

    handlePrefecthDone(doneThumbnail = false) {
        this.isComponentMount && cornerstone.triggerEvent(
            cornerstone.events,
            doneThumbnail ? 'cornerstoneimageviewthumbnaildone' : 'cornerstoneimageviewprefetchdone',
            {imageViewImageId: this.props.imageInfo.id}
        );
    }

    renderMarks() {
        cornerstoneTools.clearToolState(this.imageElement, 'Marker');
        cornerstoneTools.clearToolState(this.imageElement, 'MarkerFreehand');
        this.markList.forEach((mark) => {
            if (mark.stack === Number(this.state.currentStackIndex)) {
                try {
                    const markHandlesData = JSON.parse(mark.marker_data);
                    const active = false;
                    const markerData = {
                        active: active,
                        id: mark.id,
                        imageId: this.props.imageInfo.id,
                        isTruth: mark.isTruth,
                        lesionNumber: mark.number,
                        isCancerMarker: mark.is_cancer_marker,
                        rating: mark.rating,
                        radius: this.props.radius,
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

    resetTool(previousName, nextName) {
        if (previousName === 'MarkerFreehand') {
            // remove freehand markers
            const toolForElement = cornerstoneTools.getToolForElement(this.imageElement, 'MarkerFreehand');
            toolForElement.cancelDrawing(this.imageElement);
        }
        cornerstoneTools.setToolPassive(previousName);
        //active
        cornerstoneTools.setToolActive(nextName, {
            mouseButtonMask: 1,
            synchronizationContext: this.props.synchronizer,   // for only crosshairs tool
        });
    }

    onClearSymbols() {
        if (this.tempMeasureToolData !== null) {
            return;
        }
        if (this.props.currentTool.indexOf('Marker') !== 0) {
            Apis.shapeDeleteAll(this.props.imageInfo.id, this.props.attemptId, this.props.imageInfo.test_case_id, this.props.currentTool).then((resp) => {
                cornerstoneTools.clearToolState(this.imageElement, this.props.currentTool);
                cornerstone.invalidate(this.imageElement);
            }).catch((error) => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        } else {
            Apis.answersDeleteAll(this.props.imageInfo.id, this.props.attemptId, this.props.imageInfo.test_case_id).then((resp) => {
                this.markList = [];
                this.props.setImageAnswer(this.props.imageInfo.id, 'markList', this.markList);
                this.renderMarks();
            }).catch((error) => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    onStepSlide(seek) {
        let value = Number(this.state.currentStackIndex) + 1 + seek;
        if (value > this.state.imageIds.length || value < 1) return;
        this.setStack(value);
    }

    onStackSlide(event) {
        this.setStack(Number(event.target.value));
    }

    onResize() {
        let imagePosition = this.imagePosition;
        if (this.props.showImageList[0].length <= 1 || this.props.index === this.props.fullImageViewerIndex) {
            // if there is one image, don't need to change image position
            imagePosition = undefined;
        }
        cornerstoneResize(this.imageElement, this.props.imageInfo.real_content_region, imagePosition);
        // cornerstone.resize(this.imageElement, true)
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
    }

    render() {
        const {imageInfo, dndRef, isDragOver, toolList} = this.props;
        const viewerStyle = {};
        if (this.props.fullImageViewerIndex !== '-1_-1' && this.props.index !== '-1_-1' && this.props.fullImageViewerIndex !== this.props.index) {
            // viewerStyle.flex = 0;
            viewerStyle.display = 'none';
        }
        if(this.props.focusImageViewerIndex === this.props.index) viewerStyle.borderColor = '#1c556a';
        const canDrawMarker = toolList.filter((v) => (v === 'Marker' || v === 'MarkerFreehand')).length > 0;
        return (
            <div ref={dndRef}
                 className={"image " + (isDragOver ? 'drag-hover' : '')}
                 id={"image" + imageInfo.id}
                 data-image-id={imageInfo.id}
                 data-url={imageInfo.id}
                 data-index={this.props.index}
                 data-stack={imageInfo.stack_count}
                 data-hanging-id={imageInfo.hangingId}
                 style={viewerStyle}
            >
                <ResizeDetector
                    targetRef={this.imageElementRef}
                    handleWidth
                    handleHeight
                    skipOnMount={true}
                    refreshMode={'throttle'}
                    refreshRate={300}
                    onResize={() => this.onResize()}
                >
                    <div className="dicom" ref={this.imageElementRef}/>
                </ResizeDetector>
                <DownloadTopBarProgress
                    totalCount={this.state.downStatus.length}
                    downCount={this.state.downStatus.filter((v) => v).length}
                />
                {
                    this.state.loadedImage &&
                    <ImageOverlap
                        imageElement={this.imageElement}
                        imageId={this.props.imageInfo.id}
                        ww={this.props.imageInfo.ww}
                        wc={this.props.imageInfo.wc}
                        stackCount={this.props.imageInfo.stack_count}
                        complete={this.props.complete}
                        canDrawMarker={canDrawMarker}
                        onClearSymbols={this.onClearSymbols.bind(this)}
                        age={this.state.age}
                        imageMetaData={this.props.imageInfo.metaData}
                        imagePosition={this.imagePosition}
                    />
                }
                {/*{this.state.isLoading && <LoadingIndicator type="image"/>}*/}
            </div>
        )
    }
}


// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        showImageList: state.testView.showImageList,
        initialZoomLevel: state.testView.initialZoomLevel,
        modalityInfo: state.testView.modalityInfo,
        toolList:state.testView.toolList,
        currentTool: state.testView.currentTool,
        fullImageViewerIndex: state.testView.fullImageViewerIndex,
        focusImageViewerIndex: state.testView.focusImageViewerIndex,
    };
};

export default withRouter(connect(mapStateToProps, {
    setImageAnswer,
    setFullImageViewer,
    setFocusImageId
})(ImageViewer));

