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
import CornerstoneViewport from "../lib/CornerstoneViewport";
import DownloadProgress from "./DownloadProgress";
import WebWorker from "../worker/WebWorker";
import WorkerProc from "../worker/WorkerProc";

import MarkerTool from "../lib/tools/MarkerTool";
import MarkerFreehandTool from "../lib/tools/MarkerFreehandTool";

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

class ImageViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
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
                <CornerstoneViewport

                />
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