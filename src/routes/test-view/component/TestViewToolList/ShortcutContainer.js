import React from 'react';
import { HotKeys} from "react-hotkeys";
import {connect} from "react-redux";
import {changeCurrentTool, changeHangingLayout} from "Actions/TestViewAction";

const ShortcutContainer = ({className, children, toolList, currentTool, changeHangingLayout, changeCurrentTool}) => {
    const keyMap = {
        TOOL_PAN: "p",
        TOOL_ZOOM: "z",
        TOOL_MAGNIFY: "g",
        TOOL_WWWC: "w",
        TOOL_LENGTH: "l",
        TOOL_ANGLE: "a",
        TOOL_ELLIPTICALROI: "e",
        TOOL_RECTANGLEROI: "o",
        TOOL_ARROWANNOTATE: "t",
        TOOL_ERASE: "x",
        TOOL_MARKER: "m",
        TOOL_MARKERFREEHAND: "f",
        TOOL_RESET: "r",
    };

    const handlers = {
        TOOL_PAN: () => onChangeTool('Pan'),
        TOOL_ZOOM: () => onChangeTool('Zoom'),
        TOOL_MAGNIFY: () => onChangeTool('Magnify'),
        TOOL_WWWC: () => onChangeTool('Wwwc'),
        TOOL_LENGTH: () => onChangeTool('Length'),
        TOOL_ANGLE: () => onChangeTool('Angle'),
        TOOL_ELLIPTICALROI: () => onChangeTool('EllipticalRoi'),
        TOOL_RECTANGLEROI: () => onChangeTool('RectangleRoi'),
        TOOL_ARROWANNOTATE: () => onChangeTool('ArrowAnnotate'),
        TOOL_ERASE: () => onChangeTool('Eraser'),
        TOOL_MARKER: () => onChangeTool('Marker'),
        TOOL_MARKERFREEHAND: () => onChangeTool('MarkerFreehand'),
        TOOL_RESET: () => changeHangingLayout('MLO-R_MLO-L_CC-R_CC-L'),
    };

    const onChangeTool = (selectedTool) => {
        if(toolList.indexOf(selectedTool) !== -1) {
            changeCurrentTool(selectedTool);
        }
    }

    return (
        <HotKeys className={className} keyMap={keyMap} handlers={handlers}>
            {children}
        </HotKeys>
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
})(ShortcutContainer);