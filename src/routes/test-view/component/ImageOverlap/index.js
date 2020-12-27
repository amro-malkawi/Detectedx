import React, {Component} from "react";
import cornerstone from "cornerstone-core";
import AutosizeInput from 'react-input-autosize';
import _ from 'lodash';

export default class ImageOverlap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cursorPosition: {x: 0, y: 0},
            imageZoomLevel: 0,
            imageWW: 0,
            imageWL: 0,
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
                this.windowWidth = voiLutModuleInfo.windowWidth;
                this.windowLength = voiLutModuleInfo.windowCenter;
            }
            this.initEvent();
        }
    }

    initEvent() {
        this.props.imageElement.addEventListener('cornerstonetoolsmousemove', (event) => {
            let point = event.detail.currentPoints.image;
            const x = point.x.toFixed(0);
            const y = point.y.toFixed(0);
            this.setState({cursorPosition: {x, y}});
        });

        this.props.imageElement.addEventListener('cornerstoneimagerendered', this.handleImageRenderEvent);
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
        console.log(this.windowWidth, windowWidth)
        this.setState({
            imageZoomLevel: zoom,
            imageWW: windowWidth,
            imageWL: windowLength
        });
    }

    onChangeVoi(type, value) {
        const that = this;
        this.setState({[type]: value}, _.debounce(() => {
            this.props.imageElement.removeEventListener('cornerstoneimagerendered', this.handleImageRenderEvent);
            let viewport = cornerstone.getViewport(this.props.imageElement);
            viewport.voi.windowWidth = Math.round(this.state.imageWW * 255 / this.windowWidth);
            viewport.voi.windowCenter = Math.round(this.state.imageWL * 128 / this.windowLength);
            cornerstone.setViewport(this.props.imageElement, viewport);
            setTimeout(() => {
                that.props.imageElement.addEventListener('cornerstoneimagerendered', this.handleImageRenderEvent);
            }, 500);
        }, 10));
    }


    render() {
        const {cursorPosition, imageZoomLevel, imageWW, imageWL} = this.state;
        return (
            <div className={'image-overlap-container'}>
                <div>

                </div>
                <div className={'overlap-info-text'}>
                    <div>
                        (x: {cursorPosition.x}, y: {cursorPosition.y})
                    </div>
                    <div>Zoom: {imageZoomLevel}</div>
                    <div className={'ww-wl-input-container'}>
                        <span className='mr-5'>WW/WL: </span>
                        <AutosizeInput type='number' extraWidth={0} value={imageWW} onChange={(e) => this.onChangeVoi('imageWW', e.target.value)}/>
                        <span className='ml-1 mr-1'>/</span>
                        <AutosizeInput type='number' extraWidth={0} value={imageWL} onChange={(e) => this.onChangeVoi('imageWL', e.target.value)}/>
                    </div>
                </div>
            </div>
        )
    }
}
