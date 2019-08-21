import React, {Component} from 'react';
import {Button, IconButton} from "@material-ui/core";
import {FloatingMenu, MainButton, ChildButton} from 'Components/FloatingMenu';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import MarkerTool from "./marker";
import * as Apis from "Api/index";

const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
const ZoomTool = cornerstoneTools.ZoomTool;
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

export default class ImageViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowMarkInfo: true,
            stackCount: this.props.stackCount,
            currentStack: 1,
            isShowFloatingMenu: false,
        };

        this.imageElement = undefined;
        this.originalViewport = undefined;
        this.stack  = {
            currentImageIdIndex: 0,
            imageIds: []
        };

        this.markList = [];
        this.props.marker.answers && this.props.marker.answers.forEach((mark) => {
            mark.isTruth = false;
            mark.lesionTypes = mark.answers_lesion_types.map((v) => v.lesion_type_id);
            this.markList.push(mark);
        });
        this.props.marker.truths && this.props.marker.truths.forEach((mark) => {
            mark.isTruth = true;
            mark.lesionTypes = mark.truths_lesion_types.map((v) => v.lesion_type_id);
            this.markList.push(mark);
        });
    }

    componentDidMount() {
        const {imageInfo, viewerRef} = this.props;
        this.imageElement = viewerRef.current.querySelector('.dicom');
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

        if(!this.props.complete) {
            this.imageElement.addEventListener('cornerstonetoolsmousedoubleclick', (event) => this.handleAddMark(event.detail.currentPoints.image));
        }

        this.imageElement.addEventListener('cornerstonenewimage', this.handleChangeStack.bind(this));

        this.imageElement.querySelector('canvas').oncontextmenu = function() {return false;}
    }

    initTools() {
        // now the image has been displayed, deep copy the original viewport
        // so we can reset zoom and position
        let viewport = cornerstone.getViewport(this.imageElement);
        this.originalViewport = this.duplicateViewport(viewport);

        // add all tools to the image
        cornerstoneTools.addToolForElement(this.imageElement, MarkerTool, {addMarkFunc: this.handleAddMark.bind(this), editMarkFunc: this.handleEditMark.bind(this)});
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

        if(this.state.stackCount > 1) {
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

        this.renderMarks();
    }

    static adjustSlideSize() {
        let sliders = document.querySelectorAll('div .stack-scrollbar input');
        for (let i = 0; i < sliders.length; i++) {
            sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
        }
        window.addEventListener('resize', () => {
            let sliders = document.querySelectorAll('div .stack-scrollbar input');
            for (let i = 0; i < sliders.length; i++) {
                sliders[i].style.width = sliders[i].parentNode.clientHeight + 'px';
            }
        });
    }

    handleChangeStack(e, data) {
        this.setState({currentStack: this.stack.currentImageIdIndex + 1}, () => {
            this.renderMarks();
        });
    }

    handleAddMark(point) {
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
        console.warn('cancel')
        this.renderMarks();
    }

    handleMarkDelete(deleteId) {
        Apis.answersDelete(deleteId).then((resp) => {
            this.markList = this.markList.filter((v) => {
                return !(v.id === deleteId && !v.isTruth);
            });
            this.renderMarks();
        }).catch(e => {
            alert('An error occurred deleting this mark');
        }).finally(() => {
        });
        console.warn('delete', deleteId);
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
        console.warn(data.id);
        Apis[act](data).then(response => {
            response.lesionTypes = response.answer_lesion_types.map((v) => Number(v));
            if (data.isNew) {
                this.markList.push(response);
            } else {
                let index = this.markList.findIndex((v) => v.id === response.id);
                this.markList[index] = response;
            }
            this.renderMarks();
        }).catch(e_ => {
            alert('An error occurred saving this mark');
        }).finally(() => {
        });
        console.warn('save')
    }

    renderMarks() {
        cornerstoneTools.clearToolState(this.imageElement, 'Marker');
        this.markList.forEach((mark) => {
            if(mark.stack === Number(this.state.currentStack) - 1) {
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
                    imageElement: this.imageElement,
                    originalX: undefined,
                    originalY: undefined,
                };
                cornerstoneTools.addToolState(this.imageElement, 'Marker', markerData);
            }
        });
        cornerstone.invalidate(this.imageElement);
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
        } else {
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
        if(value > this.state.stackCount || value < 1) return;
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
        if(newIndex !== stackData.currentImageIdIndex && stackData.imageIds[newIndex] !== undefined) {
            cornerstone.loadAndCacheImage(stackData.imageIds[newIndex]).then(function(image) {
                let viewport = cornerstone.getViewport(that.imageElement);
                stackData.currentImageIdIndex = newIndex;
                cornerstone.displayImage(that.imageElement, image, viewport);
            });
        }
        // this.setState({currentStack: value});
    }

    renderStackComponent() {
        if (this.state.stackCount <= 1) {
            return null;
        } else {
            let countPerStack = {};
            this.markList.forEach((v) => {
                if(countPerStack[v.stack] === undefined) {
                    countPerStack[v.stack] = {answerCount: 0, truthCount: 0};
                }
                if(v.isTruth) {
                    countPerStack[v.stack].truthCount++;
                } else {
                    countPerStack[v.stack].answerCount++;
                }
            });
            let floatingButton = [];
            for(let v in countPerStack) {
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
                        <IconButton className={'change-btn'}  onClick={() => this.onStepSlide(1)}>
                            <i className="zmdi zmdi-plus"/>
                        </IconButton>
                    </div>
                    <div className="slice status">Slice: [{this.state.currentStack}/{this.state.stackCount}]</div>
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
        const {imageInfo, viewerRef} = this.props;
        return (
            <div className="image" id={"image" + imageInfo.id} data-image-id={imageInfo.id} data-url={imageInfo.id} data-index={this.props.index} data-stack={imageInfo.stack_count} ref={viewerRef}>
                <div className={'control-btn'}>
                    <a className="eye" onClick={() => this.toggleMarkInfo()}>
                        <i className={this.state.isShowMarkInfo ? "zmdi zmdi-eye fs-23" : "zmdi zmdi-eye-off fs-23"}/>
                    </a>
                    <a onClick={() => null}>
                        <i className={"zmdi zmdi-refresh fs-23"} style={{paddingLeft: 6, paddingRight: 6}} onClick={() => this.onReset()}/>
                    </a>
                    <a onClick={() => null}>
                        <i className={"zmdi zmdi-brightness-6 fs-23"} onClick={() => this.onInvert()}/>
                    </a>
                </div>
                <div className="dicom"/>
                <div className="location status"/>
                <div className="zoom status"/>
                <div className="window status"/>
                {/*<Button className="invert" variant="contained" onClick={() => this.onInvert()}>Invert</Button>*/}
                {/*<Button className="reset" variant="contained" onClick={() => this.onReset()}>Reset</Button>*/}
                {this.renderStackComponent()}
            </div>
        )
    }
}