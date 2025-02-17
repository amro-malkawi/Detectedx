import React from 'react';
import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import CornerstoneToolIcon from "./CornerstoneToolIcon";
import {connect} from "react-redux";
import {changeCurrentTool, changeHangingLayout} from "Store/Actions";

const TestViewContextMenu = ({toolList, complete, currentTool, changeHangingLayout, changeCurrentTool}) => {
    const onClickMenuItem = (e, data) => {
        if (data.tool === 'Reset') {
            changeHangingLayout('reset');
        } else {
            changeCurrentTool(data.tool);
        }
    }
    return (
        <ContextMenu id="images" className='test-view-context-menu'>
            {
                toolList.indexOf('Pan') !== -1 &&
                <MenuItem data={{tool: 'Pan'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Pan' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Pan'}/>
                        <span>Pan></span>
                    </div>
                    <span className='shortcut-key'>[P]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Zoom') !== -1 &&
                <MenuItem data={{tool: 'Zoom'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Zoom' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Zoom'}/>
                        <span>Zoom</span>
                    </div>
                    <span className='shortcut-key'>[Z]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Magnify') !== -1 &&
                <MenuItem data={{tool: 'Magnify'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Magnify' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Magnify'}/>
                        <span>Magnify</span>
                    </div>
                    <span className='shortcut-key'>[G]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Wwwc') !== -1 &&
                <MenuItem data={{tool: 'Wwwc'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Wwwc' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Wwwc'}/>
                        <span>Window</span>
                    </div>
                    <span className='shortcut-key'>[W]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Length') !== -1 && !complete &&
                <MenuItem data={{tool: 'Length'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Length' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Length'}/>
                        <span>Length</span>
                    </div>
                    <span className='shortcut-key'>[L]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Angle') !== -1 && !complete &&
                <MenuItem data={{tool: 'Angle'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Angle' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Angle'}/>
                        <span>Angle</span>
                    </div>
                    <span className='shortcut-key'>[A]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('EllipticalRoi') !== -1 && !complete &&
                <MenuItem data={{tool: 'EllipticalRoi'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'EllipticalRoi' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'EllipticalRoi'}/>
                        <span>Ellipse</span>
                    </div>
                    <span className='shortcut-key'>[E]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('RectangleRoi') !== -1 && !complete &&
                <MenuItem data={{tool: 'RectangleRoi'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'RectangleRoi' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'RectangleRoi'}/>
                        <span>Rectangle</span>
                    </div>
                    <span className='shortcut-key'>[O]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('ArrowAnnotate') !== -1 && !complete &&
                <MenuItem data={{tool: 'ArrowAnnotate'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'ArrowAnnotate' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'ArrowAnnotate'}/>
                        <span>Arrow</span>
                    </div>
                    <span className='shortcut-key'>[T]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Eraser') !== -1 && !complete &&
                <MenuItem data={{tool: 'Eraser'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Eraser' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Eraser'}/>
                        <span>Erase</span>
                    </div>
                    <span className='shortcut-key'>[X]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('Marker') !== -1 && !complete &&
                <MenuItem data={{tool: 'Marker'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'Marker' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'Marker'}/>
                        <span>Mark</span>
                    </div>
                    <span className='shortcut-key'>[M]</span>
                </MenuItem>
            }
            {
                toolList.indexOf('MarkerFreehand') !== -1 && !complete &&
                <MenuItem data={{tool: 'MarkerFreehand'}} onClick={onClickMenuItem} attributes={{className: currentTool === 'MarkerFreehand' ? 'tool-selected' : ''}}>
                    <div>
                        <CornerstoneToolIcon name={'MarkerFreehand'}/>
                        <span>Freehand</span>
                    </div>
                    <span className='shortcut-key'>[F]</span>
                </MenuItem>
            }
            <MenuItem data={{tool: 'Reset'}} onClick={onClickMenuItem}>
                <div>
                    <CornerstoneToolIcon name={'Reset'}/>
                    <span>Reset</span>
                </div>
                <span className='shortcut-key'>[R]</span>
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
