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
import MarkerTool from "../lib/tools/MarkerTool";
import {FloatingMenu, MainButton, ChildButton} from 'Components/FloatingMenu';
import * as Apis from "Api/index";
import LengthTool from "../lib/tools/LengthTool";
import IntlMessages from "Util/IntlMessages";

const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
// const LengthTool = cornerstoneTools.LengthTool;
const AngleTool = cornerstoneTools.AngleTool;
const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
const FreehandMouseTool = cornerstoneTools.FreehandMouseTool;
const EraserTool = cornerstoneTools.EraserTool;

const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

class ImageViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowMarkInfo: true,
            stackCount: this.props.imageInfo.stack_count,
            currentStack: 1,
            isShowFloatingMenu: false,
        };
        // this.toolList = ['Length', 'Angle', 'EllipticalRoi', 'RectangleRoi', 'ArrowAnnotate', 'FreehandMouse', 'Eraser'];
        this.toolList = ['Angle', 'EllipticalRoi', 'RectangleRoi', 'ArrowAnnotate', 'FreehandMouse', 'Eraser'];
        this.imageElement = undefined;
        this.originalViewport = undefined;
        this.stack = {
            currentImageIdIndex: 0,
            imageIds: []
        };
        this.markList = this.props.imageInfo.answers.markList;
        this.shapeList = this.props.imageInfo.answers.shapeList;
        this.tempModifiedShape = null;
        this.imageElementRef = React.createRef();
    }

    componentDidMount() {
        console.log('component did mount');
        const {imageInfo} = this.props;
        this.imageElement = this.imageElementRef.current;
        this.stack.imageIds = Array.from(Array(this.state.stackCount).keys()).map(v => {
            return `dtx://${imageInfo.id}/${v}`;
        });
        cornerstone.enable(this.imageElement);
        cornerstone.loadImage(this.stack.imageIds[0]).then((image) => {
            cornerstone.displayImage(this.imageElement, image);
            this.initTools();
        });
        this.initEvents();
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
            this.imageElement.addEventListener('cornerstonetoolsmousedoubleclick', (event) => this.handleAddMark(event.detail.currentPoints.image));
        }

        this.imageElement.addEventListener('cornerstonenewimage', this.handleChangeStack.bind(this));

        this.imageElement.querySelector('canvas').oncontextmenu = function () {
            return false;
        }

        this.imageElement.addEventListener('cornerstonetoolsmeasurementcompleted', this.handleAddShape.bind(this));
        this.imageElement.addEventListener('cornerstonetoolsmeasurementremoved', this.handleRemoveShape.bind(this));
        this.imageElement.addEventListener('cornerstonetoolsmeasurementmodified', this.handleModifyShape.bind(this));
        this.imageElement.addEventListener('cornerstonetoolsmouseup', this.handleMouseUp.bind(this));
    }

    initTools() {
        // now the image has been displayed, deep copy the original viewport
        // so we can reset zoom and position
        let viewport = cornerstone.getViewport(this.imageElement);
        this.originalViewport = this.duplicateViewport(viewport);
        // add all tools to the image
        const setToolElementFunc = this.props.complete || this.props.stage >= 2 ? 'setToolEnabledForElement' : 'setToolPassiveForElement';
        cornerstoneTools.addToolForElement(this.imageElement, MarkerTool, {addMarkFunc: this.handleAddMark.bind(this), editMarkFunc: this.handleEditMark.bind(this)});
        cornerstoneTools.addToolForElement(this.imageElement, PanTool);
        cornerstoneTools.addToolForElement(this.imageElement, WwwcTool);
        this.toolList.forEach(toolName => {
            cornerstoneTools.addToolForElement(this.imageElement, cornerstoneTools[toolName + 'Tool']);
            cornerstoneTools[setToolElementFunc](this.imageElement, toolName);
        });
        cornerstoneTools.addToolForElement(this.imageElement, LengthTool);
        cornerstoneTools[setToolElementFunc](this.imageElement, 'Length');
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


        // the marker tool is always in passive or active mode (passive so
        // existing marks can be rendered at all times)
        if (this.props.currentTool !== 'Marker') {
            cornerstoneTools[setToolElementFunc](this.imageElement, 'Marker');
        }

        // enable the current tool as well (used when adding a new image after
        // the toolbar has been loaded)
        cornerstoneTools.setToolActiveForElement(this.imageElement, this.props.currentTool, {
            mouseButtonMask: 1
        });

        //add synchronizer
        this.props.synchronizer.add(this.imageElement);

        if (this.state.stackCount > 1) {
            //add image stack
            cornerstoneTools.addStackStateManager(this.imageElement, ['stack']);
            cornerstoneTools.addToolState(this.imageElement, 'stack', this.stack);
            cornerstoneTools.addToolForElement(this.imageElement, StackScrollMouseWheelTool);
            cornerstoneTools.setToolActiveForElement(this.imageElement, 'StackScrollMouseWheel', {});
        } else {
            // images are loaded with the zoom mousewheel enabled by default
            cornerstoneTools.setToolActiveForElement(this.imageElement, 'ZoomMouseWheel', {});
        }
        // render the first appropriate level of the pyramid
        this._renderPyramid(this.originalViewport);
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

    handleChangeStack(e, data) {
        this.setState({currentStack: this.stack.currentImageIdIndex + 1}, () => {
            this.renderShapes();
            this.renderMarks();
        });
    }

    handleAddMark(point) {
        if (this.props.currentTool === 'FreehandMouse') return;
        let markerData = {
            active: true,
            handles: {
                end: {
                    x: point.x,
                    y: point.y,
                    active: true,
                    highlight: true
                }
            },
            imageId: this.props.imageInfo.id,
            radius: this.props.radius,
            lesionTypes: [],
            lesionList: {},
            isTruth: false,
            imageElement: this.imageElement,
            originalX: undefined,
            originalY: undefined,
            isNew: true,
        };
        cornerstoneTools.addToolState(this.imageElement, 'Marker', markerData);
        this.props.onShowPopup(markerData, this.handleMarkCancel.bind(this), this.handleMarkDelete.bind(this), this.handleMarkSave.bind(this));
        cornerstone.invalidate(this.imageElement);
    }

    handleEditMark(markerData) {
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
        data.stack = Number(this.state.currentStack) - 1;
        if (data.isNew) {
            act = 'answersAdd';
        } else {
            act = 'answersUpdate';
        }
        Apis[act](data).then(response => {
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
        this.tempModifiedShape = null;
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
                stack: Number(this.state.currentStack) - 1,
            };
            Apis.shapeAdd(data).then(resp => {
                if (this.shapeList[data.type] === undefined) this.shapeList[data.type] = [];
                this.shapeList[data.type].push({stack: data.stack, measurementData: JSON.parse(data.data)});
                this.props.setImageAnswer(this.props.imageInfo.id, 'shapeList', this.shapeList);
            });
        }
    }

    handleModifyShape(event) {
        this.tempModifiedShape = event.detail;
    }

    handleRemoveShape(event) {
        this.tempModifiedShape = null;
        const that = this;
        // This timeout is needed because remove event is sometimes called before complete event is called.
        setTimeout(function () {
            const shapeId = event.detail.measurementData.id;
            const type = event.detail.toolName || event.detail.toolType;
            if(that.shapeList[type] !== undefined) {
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
        setTimeout(function () {
            if (that.tempModifiedShape !== null && that.tempModifiedShape.measurementData.id !== undefined) {
                const data = {
                    id: that.tempModifiedShape.measurementData.id,
                    image_id: that.props.imageInfo.id,
                    attempt_id: that.props.attemptId,
                    test_case_id: that.props.imageInfo.test_case_id,
                    type: that.tempModifiedShape.toolName || that.tempModifiedShape.toolType,
                    data: JSON.stringify(that.tempModifiedShape.measurementData).replace(/-?\d+\.\d+/g, function (x) {
                        return parseFloat(x).toFixed(2)
                    }),
                    stack: Number(that.state.currentStack) - 1,
                };
                Apis.shapeUpdate(data).then(resp => {
                    console.log('modified shape');
                    const index = that.shapeList[data.type].map((v) => v.measurementData.id).indexOf(data.id);
                    that.shapeList[data.type][index] = {stack: data.stack, measurementData: JSON.parse(data.data)};
                    this.props.setImageAnswer(this.props.imageInfo.id, 'shapeList', this.shapeList);
                });
            }
        }, 500);
    }

    renderMarks() {
        cornerstoneTools.clearToolState(this.imageElement, 'Marker');
        this.markList.forEach((mark) => {
            if (mark.stack === Number(this.state.currentStack) - 1) {
                let active = true;
                let markerData = {
                    active: active,
                    handles: {
                        end: {
                            x: mark.x,
                            y: mark.y,
                            active: active,
                            highlight: active
                        }
                    },
                    id: mark.id,
                    imageId: this.props.imageInfo.id,
                    isTruth: mark.isTruth,
                    lesionNumber: mark.number,
                    rating: mark.rating,
                    radius: this.props.radius,
                    lesionTypes: mark.lesionTypes,
                    lesionList: mark.lesionList,
                    imageElement: this.imageElement,
                    originalX: undefined,
                    originalY: undefined,
                };
                cornerstoneTools.addToolState(this.imageElement, 'Marker', markerData);
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
                if (v.stack === Number(this.state.currentStack) - 1) {
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
        this._renderPyramid(event.detail.viewport);
    }

    resetTool(previousName, nextName) {
        // deactive
        // if (previousName != 'Marker') {
        //     cornerstoneTools.setToolDisabled(previousName);
        // } else {
        cornerstoneTools.setToolPassive(previousName);
        // }
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

    // onReset() {
    //     // reset the pan, zoom, invert, and windowing levels
    //     let original = this.duplicateViewport(this.originalViewport);
    //     cornerstone.setViewport(this.imageElement, original);
    //     this.setInitialSetParam();
    // }

    _renderPyramid(viewport) {
        this.imageElement.pyramid[this.stack.currentImageIdIndex].loadTilesForViewport(viewport);
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
        let value = Number(this.state.currentStack) + seek;
        if (value > this.state.stackCount || value < 1) return;
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
        const that = this;
        if (newIndex !== stackData.currentImageIdIndex && stackData.imageIds[newIndex] !== undefined) {
            cornerstone.loadAndCacheImage(stackData.imageIds[newIndex]).then(function (image) {
                let viewport = cornerstone.getViewport(that.imageElement);
                stackData.currentImageIdIndex = newIndex;
                cornerstone.displayImage(that.imageElement, image, viewport);
            });
        }
        // this.setState({currentStack: value});
    }

    renderImageQuality() {
        if(this.props.isShowQuality) {
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
        if (this.state.stackCount <= 1) {
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
                            <input type="range" min={1} max={this.state.stackCount} value={this.state.currentStack} onChange={this.onStackSlide.bind(this)}/>
                        </div>
                        <IconButton className={'change-btn'} onClick={() => this.onStepSlide(1)}>
                            <i className="zmdi zmdi-plus"/>
                        </IconButton>
                    </div>
                    <div className="slice status"><IntlMessages id={"testView.viewer.slice"}/>: [{this.state.currentStack}/{this.state.stackCount}]</div>
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
                                                active={this.state.currentStack === Number(v.stack) + 1}
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
        const {imageInfo, dndRef, isDragOver} = this.props;
        return (
            <div ref={dndRef} className={"image " + (isDragOver ? 'drag-hover' : '')} style={{width: this.props.width + '%'}} id={"image" + imageInfo.id} data-image-id={imageInfo.id} data-url={imageInfo.id}
                 data-index={this.props.index} data-stack={imageInfo.stack_count}>
                <div className={'control-btn'}>
                    <a className="eye" onClick={() => this.toggleMarkInfo()}>
                        <Tooltip title={<IntlMessages id={"testView.viewer.hideInfo"}/>} placement="bottom">
                            <i className={this.state.isShowMarkInfo ? "zmdi zmdi-eye fs-23" : "zmdi zmdi-eye-off fs-23"}/>
                        </Tooltip>
                    </a>
                    {/*<a onClick={() => null}>*/}
                    {/*    <Tooltip title="Reset" placement="bottom">*/}
                    {/*        <i className={"zmdi zmdi-refresh fs-23"} style={{paddingLeft: 6, paddingRight: 6}} onClick={() => this.onReset()}/>*/}
                    {/*    </Tooltip>*/}
                    {/*</a>*/}
                    <a onClick={() => null}>
                        <Tooltip title={<IntlMessages id={"testView.viewer.invert"}/>} placement="bottom">
                            <i className={"zmdi zmdi-brightness-6 fs-23"} onClick={() => this.onInvert()}/>
                        </Tooltip>
                    </a>
                    {
                        this.props.complete ? null :
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
                <div className="location status"/>
                <div className="zoom status"/>
                <div className="window status"/>
                {this.renderStackComponent()}
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