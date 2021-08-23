import React, {Component} from "react";
import cornerstone from "cornerstone-core";
import AutosizeInput from 'react-input-autosize';
import {Input} from 'reactstrap';
import _ from 'lodash';
import Tooltip from "@material-ui/core/Tooltip";
import IntlMessages from "Util/IntlMessages";
import {isMobile} from "react-device-detect";
import GEThicknessSwitch from "./GEThicknessSwitch";
import ImageScrollBar, {adjustSlideSize} from "./ImageScrollBar";
import ImageEDMamoQuality from "../ImageEDMamoQuality";
import {connect} from "react-redux";

class ImageOverlap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cursorPosition: {x: 0, y: 0},
            imageZoomLevel: 0,
            imageWW: props.ww ? props.ww : 255,
            imageWL: props.wc ? props.wc : 128,
            voiList: [],
            isShowMarkInfo: !isMobile,
        }
        this.windowWidth = 255;
        this.windowLength = 128;
        this.handleImageRenderEvent = this.handleImageRenderEvent.bind(this);
    }

    componentDidMount() {
        if (this.props.imageElement) {
            const voiLutModuleInfo = cornerstone.metaData.get(
                'voiLutModule',
                this.props.imageId
            );
            if (voiLutModuleInfo) {
                const imageWW = voiLutModuleInfo.windowWidth[0];
                const imageWL = voiLutModuleInfo.windowCenter[0];
                const voiList = [];
                voiLutModuleInfo.windowWidth.forEach((v, i) => {
                    if (voiLutModuleInfo.windowCenter[i]) {
                        const ww = Math.round(v);
                        const wl = Math.round(voiLutModuleInfo.windowCenter[i])
                        if (!voiList.some((vv) => (vv.ww === ww && vv.wl === wl))) {
                            voiList.push({ww: ww, wl: wl});
                        }
                    }
                });
                if (voiList.length === 0) {
                    voiList.push({ww: 255, wl: 128});
                }
                this.windowWidth = imageWW;
                this.windowLength = imageWL;
                this.setState({
                    // imageWW,
                    // imageWL,
                    voiList
                })
            }
            this.initEvent();
            adjustSlideSize();
        }
    }

    initEvent() {
        this.props.imageElement.addEventListener('cornerstonetoolsmousemove', _.throttle(this.handleMousemoveEvent.bind(this), 100));

        this.props.imageElement.addEventListener('cornerstoneimagerendered', _.throttle(this.handleImageRenderEvent.bind(this), 100));
    }

    handleMousemoveEvent(event) {
        let point = event.detail.currentPoints.image;
        const x = point.x.toFixed(0);
        const y = point.y.toFixed(0);
        this.setState({cursorPosition: {x, y}});
    }

    handleImageRenderEvent(event) {
        const eventData = event.detail;
        let windowWidth = Math.round(eventData.viewport.voi.windowWidth);
        let windowLength = Math.round(eventData.viewport.voi.windowCenter);
        const zoom = eventData.viewport.scale.toFixed(2);
        if (this.windowWidth !== 0 && this.windowLength !== 0) {
            windowWidth = Math.round(this.windowWidth * windowWidth / 255);
            windowLength = Math.round(this.windowLength * windowLength / 128);
        }
        this.setState({
            imageZoomLevel: zoom,
            imageWW: windowWidth,
            imageWL: windowLength
        });
    }

    handleSetImageVoi() {
        const that = this;
        this.props.imageElement.removeEventListener('cornerstoneimagerendered', this.handleImageRenderEvent);
        let viewport = cornerstone.getViewport(this.props.imageElement);
        viewport.voi.windowWidth = Math.round(this.state.imageWW * 255 / this.windowWidth);
        viewport.voi.windowCenter = Math.round(this.state.imageWL * 128 / this.windowLength);
        cornerstone.setViewport(this.props.imageElement, viewport);
        setTimeout(() => {
            that.props.imageElement.addEventListener('cornerstoneimagerendered', this.handleImageRenderEvent);
        }, 500);
    }

    onChangeVoi(type, value) {
        this.setState({[type]: value}, _.debounce(this.handleSetImageVoi, 10));
    }

    onChangeVoiSelect(event) {
        const values = event.target.value.split('/');
        if (values.length !== 2) return;
        if (Number(values[0]) === this.state.imageWW && Number(values[1]) === this.state.imageWL) return;
        console.log('change');
        this.setState({imageWW: Number(values[0]), imageWL: Number(values[1])}, this.handleSetImageVoi);
    }

    onToggleMarkInfo() {
        this.setState({isShowMarkInfo: !this.state.isShowMarkInfo}, () => {
            cornerstone.invalidate(this.props.imageElement);
        });
    }

    onInvert() {
        let viewport = cornerstone.getViewport(this.props.imageElement);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(this.props.imageElement, viewport);
    }

    render() {
        const {canDrawMarker, onClearSymbols, age, imageMetaData, imagePosition} = this.props;
        const {cursorPosition, imageZoomLevel, imageWW, imageWL} = this.state;
        // const isRightBrestImage = (this.props.stackCount > 1 && imagePosition !== undefined && imagePosition.imageLaterality === 'R');
        const isRightBrestImage = (imagePosition !== undefined && imagePosition.imageLaterality === 'R');
        let containerClass = 'image-overlap-container ';
        if(!isRightBrestImage) {
            if(this.props.stackCount > 1) {
                containerClass += 'pr-30';
            } else {
                containerClass += 'pr-10';
            }
        } else {
            containerClass += 'right-brest-overlap ';
            if(this.props.stackCount > 1) {
                containerClass += 'pl-30';
            } else {
                containerClass += 'pl-10';
            }
        }



        return (
            <div className={containerClass}>
                <div className={'image-overlap-content'}>
                    <div className={'image-overlap-top'}>
                        <div className={'overlap-control-btn'}>
                            {
                                canDrawMarker &&
                                <a className="eye" data-cy="tool-mark-info" onClick={() => this.onToggleMarkInfo()}>
                                    <Tooltip title={<IntlMessages id={"testView.viewer.hideInfo"}/>} placement="bottom">
                                        <i className={this.state.isShowMarkInfo ? "zmdi zmdi-eye fs-23" : "zmdi zmdi-eye-off fs-23"}/>
                                    </Tooltip>
                                </a>
                            }
                            <a data-cy="tool-invert" onClick={() => this.onInvert()}>
                                <Tooltip title={<IntlMessages id={"testView.viewer.invert"}/>} placement="bottom">
                                    <i className={"zmdi zmdi-brightness-6 fs-23"}/>
                                </Tooltip>
                            </a>
                            {
                                (!this.props.complete && canDrawMarker) &&
                                <a data-cy="tool-clear-symbols" onClick={() => onClearSymbols()}>
                                    <Tooltip title={<IntlMessages id={"testView.viewer.delete"}/>} placement="bottom">
                                        <i className={"zmdi zmdi-delete fs-23 ml-2"}/>
                                    </Tooltip>
                                </a>
                            }
                        </div>
                        {
                            this.props.modalityInfo.modality_type === 'imaged_mammo' &&
                            <ImageEDMamoQuality imagePosition={imagePosition}/>
                        }
                        <GEThicknessSwitch
                            age={age}
                            metaData={imageMetaData}
                        />
                    </div>
                    <div className={'overlap-info-text'}>
                        <div>
                            <div style={{marginRight: 3}}>
                                (x: {cursorPosition.x}, y: {cursorPosition.y})
                            </div>
                            <div style={{marginRight: 3}}>Zoom: {imageZoomLevel}</div>
                            <div className={'ww-wl-input-container'}>
                                <span className='mr-5'>WW/WL: </span>
                                <AutosizeInput type='number' extraWidth={0} value={imageWW} onChange={(e) => this.onChangeVoi('imageWW', e.target.value)}/>
                                <span className='ml-1 mr-1'>/</span>
                                <AutosizeInput type='number' extraWidth={0} value={imageWL} onChange={(e) => this.onChangeVoi('imageWL', e.target.value)}/>
                                <div>
                                    {
                                        this.state.voiList.length > 1 &&
                                        <Input type={'select'} value={''} onChange={(e) => this.onChangeVoiSelect(e)}>
                                            <option value='' style={{display: 'none'}}/>
                                            {
                                                this.state.voiList.map((v, i) =>
                                                    <option value={`${v.ww}/${v.wl}`} key={i}>{`${v.ww} / ${v.wl}`}</option>
                                                )
                                            }
                                        </Input>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'image-overlap-scroll'}>
                    <ImageScrollBar imageId={this.props.imageId} imageElement={this.props.imageElement}/>
                </div>
            </div>
        )
    }
}


// map state to props
const mapStateToProps = (state) => {
    return {
        modalityInfo: state.testView.modalityInfo
    };
};

export default connect(mapStateToProps)(ImageOverlap);