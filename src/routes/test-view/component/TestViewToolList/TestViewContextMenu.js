import React from 'react';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import CornerstoneToolIcon from "./CornerstoneToolIcon";
import IntlMessages from "Util/IntlMessages";
import GridToolButton from "Routes/test-view/component/TestViewToolList/GridToolButton";
import {connect} from "react-redux";
import {changeCurrentTool, changeHangingLayout} from "Actions/TestViewAction";

const TestViewContextMenu = ({toolList, complete, stage, currentTool, changeHangingLayout, changeCurrentTool}) => {
    const onClickMenuItem = (e, data) => {
        if(data.tool === 'Reset') {
            changeHangingLayout('MLO-R_MLO-L_CC-R_CC-L');
        } else {
            changeCurrentTool(data.tool);
        }
    }
    return (
        <ContextMenu id="images" className='test-view-context-menu'>
            {
                toolList.indexOf('Pan') !== -1 &&
                    <MenuItem data={{tool: 'Pan'}} onClick={onClickMenuItem}
                              attributes={{className: currentTool === 'Pan' ? 'tool-selected' : ''}}
                    >
                        <CornerstoneToolIcon name={'Pan'}/>
                        <span><IntlMessages id={"testView.tool.pan"}/></span>
                    </MenuItem>
            }
            {
                toolList.indexOf('Zoom') !== -1 &&
                    <MenuItem data={{tool: 'Zoom'}} onClick={onClickMenuItem}
                              attributes={{className: currentTool === 'Zoom' ? 'tool-selected' : ''}}
                    >
                        <CornerstoneToolIcon name={'Zoom'}/>
                        <span><IntlMessages id={"testView.tool.zoom"}/></span>
                    </MenuItem>
            }
            {
                toolList.indexOf('Magnify') !== -1 &&
                <MenuItem data={{tool: 'Magnify'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'Magnify' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'Magnify'}/>
                    <span><IntlMessages id={"testView.tool.magnify"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('Wwwc') !== -1 &&
                <MenuItem data={{tool: 'Wwwc'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'Wwwc' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'Wwwc'}/>
                    <span><IntlMessages id={"testView.tool.window"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('Length') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'Length'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'Length' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'Length'}/>
                    <span><IntlMessages id={"testView.tool.length"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('Angle') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'Angle'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'Angle' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'Angle'}/>
                    <span><IntlMessages id={"testView.tool.angle"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('EllipticalRoi') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'EllipticalRoi'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'EllipticalRoi' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'EllipticalRoi'}/>
                    <span><IntlMessages id={"testView.tool.ellipse"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('RectangleRoi') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'RectangleRoi'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'RectangleRoi' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'RectangleRoi'}/>
                    <span><IntlMessages id={"testView.tool.rectangle"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('ArrowAnnotate') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'ArrowAnnotate'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'ArrowAnnotate' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'ArrowAnnotate'}/>
                    <span><IntlMessages id={"testView.tool.arrow"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('Eraser') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'Eraser'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'Eraser' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'Eraser'}/>
                    <span><IntlMessages id={"testView.tool.erase"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('Marker') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'Marker'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'Marker' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'Marker'}/>
                    <span><IntlMessages id={"testView.tool.mark"}/></span>
                </MenuItem>
            }
            {
                toolList.indexOf('MarkerFreehand') !== -1 && !complete && stage === 1 &&
                <MenuItem data={{tool: 'MarkerFreehand'}} onClick={onClickMenuItem}
                          attributes={{className: currentTool === 'MarkerFreehand' ? 'tool-selected' : ''}}
                >
                    <CornerstoneToolIcon name={'MarkerFreehand'}/>
                    <span><IntlMessages id={"testView.tool.freehand"}/></span>
                </MenuItem>
            }
            <MenuItem data={{tool: 'Reset'}} onClick={onClickMenuItem}>
                <CornerstoneToolIcon name={'Reset'}/>
                <span><IntlMessages id={"testView.tool.reset"}/></span>
            </MenuItem>
        </ContextMenu>
    )
}



// map state to props
const mapStateToProps = (state) => {
    return {
        currentTool: state.testView.currentTool
    };
};

export default connect(mapStateToProps, {
    changeHangingLayout,
    changeCurrentTool
})(TestViewContextMenu);
