import React from 'react';
import {changeCurrentTool, changeHangingLayout} from 'Actions';
import {connect} from "react-redux";
import IntlMessages from "Util/IntlMessages";
import CornerstoneToolIcon from "./CornerstoneToolIcon";
import GridToolButton from "./GridToolButton";

const Toolbar = (props) => {
    const {
        complete, isShowToolModal, onClickShowToolModal, onClose,
        toolList, currentTool, changeCurrentTool, changeHangingLayout
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

    return (
        <div className={toolContainerClass}>
            <div className={"tool option more-icon"} onClick={() => onClickShowToolModal()}>
                <CornerstoneToolIcon name={currentTool}/>
                <p><IntlMessages id={"testView.tool.moreTools"}/>{isShowToolModal ? '▲' : '▼'}</p>
            </div>
            {
                toolList.indexOf('Pan') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Pan' ? ' active' : '')} data-tool="Pan" onClick={() => onChangeTool('Pan')}>
                        <CornerstoneToolIcon name={'Pan'}/>
                        <p><IntlMessages id={"testView.tool.pan"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Zoom') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Zoom' ? ' active' : '')} data-tool="Zoom" data-synchronize="true"
                         onClick={() => onChangeTool('Zoom')}>
                        <CornerstoneToolIcon name={'Zoom'}/>
                        <p><IntlMessages id={"testView.tool.zoom"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Magnify') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Magnify' ? ' active' : '')} data-tool="Magnify" onClick={() => onChangeTool('Magnify')}>
                        <CornerstoneToolIcon name={'Magnify'}/>
                        <p><IntlMessages id={"testView.tool.magnify"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Wwwc') !== -1 ?
                    <div className={"tool option" + (currentTool === 'Wwwc' ? ' active' : '')} data-tool="Wwwc" onClick={() => onChangeTool('Wwwc')}>
                        <CornerstoneToolIcon name={'Wwwc'}/>
                        <p><IntlMessages id={"testView.tool.window"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Length') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Length' ? ' active' : '')} data-tool="Length" onClick={() => onChangeTool('Length')}>
                        <CornerstoneToolIcon name={'Length'}/>
                        <p><IntlMessages id={"testView.tool.length"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Angle') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Angle' ? ' active' : '')} data-tool="Angle" onClick={() => onChangeTool('Angle')}>
                        <CornerstoneToolIcon name={'Angle'}/>
                        <p><IntlMessages id={"testView.tool.angle"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('EllipticalRoi') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'EllipticalRoi' ? ' active' : '')} data-tool="EllipticalRoi"
                         onClick={() => onChangeTool('EllipticalRoi')}>
                        <CornerstoneToolIcon name={'EllipticalRoi'}/>
                        <p><IntlMessages id={"testView.tool.ellipse"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('RectangleRoi') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'RectangleRoi' ? ' active' : '')} data-tool="RectangleRoi" onClick={() => onChangeTool('RectangleRoi')}>
                        <CornerstoneToolIcon name={'RectangleRoi'}/>
                        <p><IntlMessages id={"testView.tool.rectangle"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('ArrowAnnotate') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'ArrowAnnotate' ? ' active' : '')} data-tool="ArrowAnnotate"
                         onClick={() => onChangeTool('ArrowAnnotate')}>
                        <CornerstoneToolIcon name={'ArrowAnnotate'}/>
                        <p><IntlMessages id={"testView.tool.arrow"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Eraser') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Eraser' ? ' active' : '')} data-tool="Eraser" onClick={() => onChangeTool('Eraser')}>
                        <CornerstoneToolIcon name={'Eraser'}/>
                        <p><IntlMessages id={"testView.tool.erase"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('Marker') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'Marker' ? ' active' : '')} data-tool="Marker" onClick={() => onChangeTool('Marker')}>
                        <CornerstoneToolIcon name={'Marker'}/>
                        <p><IntlMessages id={"testView.tool.mark"}/></p>
                    </div> : null
            }
            {
                toolList.indexOf('MarkerFreehand') !== -1 && !complete ?
                    <div className={"tool option" + (currentTool === 'MarkerFreehand' ? ' active' : '')} data-tool="MarkerFreehand"
                         onClick={() => onChangeTool('MarkerFreehand')}>
                        <CornerstoneToolIcon name={'MarkerFreehand'}/>
                        <p><IntlMessages id={"testView.tool.freehand"}/></p>
                    </div> : null
            }
            <div className={"tool option"} data-tool="Reset" onClick={() => onResetImageViewer()}>
                <CornerstoneToolIcon name={'Reset'}/>
                <p><IntlMessages id={"testView.tool.reset"}/></p>
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
        currentTool: state.testView.currentTool
    };
};

export default connect(mapStateToProps, {
    changeHangingLayout,
    changeCurrentTool
})(Toolbar);

