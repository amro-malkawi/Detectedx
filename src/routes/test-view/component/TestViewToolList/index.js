import React from 'react';
import cornerstone from "cornerstone-core";
import {connect} from "react-redux";
import CornerstoneToolIcon from "./CornerstoneToolIcon";
import GridToolButton from "./GridToolButton";
import {changeCurrentTool, changeHangingLayout} from 'Store/Actions';

const Toolbar = (props) => {
    const {
        complete, isShowToolModal, onClickShowToolModal, onClose,
        toolList, currentTool, changeCurrentTool, changeHangingLayout, focusImageViewerIndex
    } = props;
    //mobile-tool-container
    const toolsWidth = 61 * (toolList.length + 1);
    const toolContainerClass = (((window.innerWidth / 2 ) - 240) > toolsWidth) ? 'tool-container' : 'tool-container mobile-tool-container';

    const onChangeTool = (selectedTool) => {
        changeCurrentTool(selectedTool);
        onClose();
    }

    const onResetImageViewer = () => {
        // call to fix freehand release issue
        onChangeTool('Pan');
        setTimeout(() => changeHangingLayout('reset'), 500);
    }

    const onToolExecute = (toolName) => {
        if(!focusImageViewerIndex) return;
        const viewerComponent = document.querySelector(`[data-index="${focusImageViewerIndex}"]`);
        if(!viewerComponent) return;
        const element = viewerComponent.querySelector("[class='dicom']");
        if(!element) return;
        const viewport = cornerstone.getViewport(element);
        if(toolName === 'RotateRight') {
            viewport.rotation += 90;
        } else if(toolName === 'FlipH') {
            viewport.hflip = !viewport.hflip;
        } else if(toolName === 'FlipV') {
            viewport.vflip = !viewport.vflip;
        }
        cornerstone.setViewport(element, viewport);
        cornerstone.invalidate(element);
    }

    return (
        <div className={toolContainerClass}>
            <div className={"tool option more-icon"} onClick={() => onClickShowToolModal()}>
                <CornerstoneToolIcon name={currentTool}/>
                <p>Tools{isShowToolModal ? '▲' : '▼'}</p>
            </div>
            {
                toolList.indexOf('Pan') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Pan' ? ' active' : '')} data-tool="Pan" onClick={() => onChangeTool('Pan')}>
                        <CornerstoneToolIcon name={'Pan'}/>
                        <p>Pan</p>
                    </div> : null
            }
            {
                toolList.indexOf('Zoom') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Zoom' ? ' active' : '')} data-tool="Zoom" data-synchronize="true" onClick={() => onChangeTool('Zoom')}>
                        <CornerstoneToolIcon name={'Zoom'}/>
                        <p>Zoom</p>
                    </div> : null
            }
            {
                toolList.indexOf('Magnify') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Magnify' ? ' active' : '')} data-tool="Magnify" onClick={() => onChangeTool('Magnify')}>
                        <CornerstoneToolIcon name={'Magnify'}/>
                        <p>Magnify</p>
                    </div> : null
            }
            {
                toolList.indexOf('RotateRight') !== -1 ?
                    <div className={"tool option" + (currentTool === 'RotateRight' ? ' active' : '')} data-tool="RotateRight" onClick={() => onToolExecute('RotateRight')}>
                        <CornerstoneToolIcon name={'RotateRight'}/>
                        <p>Rotate Right</p>
                    </div> : null
            }
            {
                toolList.indexOf('FlipH') !== -1 ?
                    <div className={"tool option" + (currentTool === 'FlipH' ? ' active' : '')} data-tool="FlipH" onClick={() => onToolExecute('FlipH')}>
                        <CornerstoneToolIcon name={'FlipH'}/>
                        <p>Flip H</p>
                    </div> : null
            }
            {
                toolList.indexOf('FlipV') !== -1 ?
                    <div className={"tool option" + (currentTool === 'FlipV' ? ' active' : '')} data-tool="FlipV" onClick={() => onToolExecute('FlipV')}>
                        <CornerstoneToolIcon name={'FlipV'}/>
                        <p>Flip V</p>
                    </div> : null
            }
            {
                toolList.indexOf('Wwwc') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Wwwc' ? ' active' : '')} data-tool="Wwwc" onClick={() => onChangeTool('Wwwc')}>
                        <CornerstoneToolIcon name={'Wwwc'}/>
                        <p>Window</p>
                    </div> : null
            }
            {
                toolList.indexOf('Length') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Length' ? ' active' : '')} data-tool="Length" onClick={() => onChangeTool('Length')}>
                        <CornerstoneToolIcon name={'Length'}/>
                        <p>Length</p>
                    </div> : null
            }
            {
                toolList.indexOf('Angle') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Angle' ? ' active' : '')} data-tool="Angle" onClick={() => onChangeTool('Angle')}>
                        <CornerstoneToolIcon name={'Angle'}/>
                        <p>Angle</p>
                    </div> : null
            }
            {
                toolList.indexOf('EllipticalRoi') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'EllipticalRoi' ? ' active' : '')} data-tool="EllipticalRoi" onClick={() => onChangeTool('EllipticalRoi')}>
                        <CornerstoneToolIcon name={'EllipticalRoi'}/>
                        <p>Ellipse</p>
                    </div> : null
            }
            {
                toolList.indexOf('RectangleRoi') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'RectangleRoi' ? ' active' : '')} data-tool="RectangleRoi" onClick={() => onChangeTool('RectangleRoi')}>
                        <CornerstoneToolIcon name={'RectangleRoi'}/>
                        <p>Rectangle</p>
                    </div> : null
            }
            {
                toolList.indexOf('ArrowAnnotate') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'ArrowAnnotate' ? ' active' : '')} data-tool="ArrowAnnotate" onClick={() => onChangeTool('ArrowAnnotate')}>
                        <CornerstoneToolIcon name={'ArrowAnnotate'}/>
                        <p>Arrow</p>
                    </div> : null
            }
            {
                toolList.indexOf('Eraser') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Eraser' ? ' active' : '')} data-tool="Eraser" onClick={() => onChangeTool('Eraser')}>
                        <CornerstoneToolIcon name={'Eraser'}/>
                        <p>Erase</p>
                    </div> : null
            }
            {
                toolList.indexOf('Marker') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Marker' ? ' active' : '')} data-tool="Marker" onClick={() => onChangeTool('Marker')}>
                        <CornerstoneToolIcon name={'Marker'}/>
                        <p>Mark</p>
                    </div> : null
            }
            {
                toolList.indexOf('MarkerFreehand') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'MarkerFreehand' ? ' active' : '')} data-tool="MarkerFreehand" onClick={() => onChangeTool('MarkerFreehand')}>
                        <CornerstoneToolIcon name={'MarkerFreehand'}/>
                        <p>Freehand</p>
                    </div> : null
            }
            {
                toolList.indexOf('Crosshairs') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Crosshairs' ? ' active' : '')} data-tool="Crosshairs" onClick={() => onChangeTool('Crosshairs')}>
                        <CornerstoneToolIcon name={'Crosshairs'}/>
                        <p>Crosshairs</p>
                    </div> : null
            }
            <div className={"tool option"} data-tool="Reset" onClick={() => onResetImageViewer()}>
                <CornerstoneToolIcon name={'Reset'}/>
                <p>Reset</p>
            </div>
            {
                toolList.indexOf('Grid') !== -1 && <GridToolButton/>
            }
        </div>
    )
}


// map state to props
const mapStateToProps = (state) => {
    return {
        toolList: state.testView.toolList,
        currentTool: state.testView.currentTool,
        focusImageViewerIndex: state.testView.focusImageViewerIndex,
    };
};

export default connect(mapStateToProps, {
    changeHangingLayout,
    changeCurrentTool
})(Toolbar);

