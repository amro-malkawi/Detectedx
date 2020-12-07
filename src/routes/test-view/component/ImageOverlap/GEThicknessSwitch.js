import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeThicknessType} from "Actions/TestViewAction";

const GEThicknessSwitch = ({metaData, currentThicknessType, changeThicknessType}) => {
    if(currentThicknessType === 'NOTHICKNESS' || (metaData.positionDesc !== 'GE-PLANES' && metaData.positionDesc !== 'GE-SLABS')) return null;
    const onChange = (type) => {
        if(type !== null) changeThicknessType(type);
    }
    return (
        <div className={'ge-thickness-switch'}>
            <StyledToggleButtonGroup size="small" value={currentThicknessType} exclusive onChange={(e, type) => onChange(type)}>
                <StyledToggleButton value="SLABS">
                    SLABS
                </StyledToggleButton>
                <StyledToggleButton value="PLANES">
                    PLANES
                </StyledToggleButton>
            </StyledToggleButtonGroup>
        </div>
    )
}

// map state to props
const mapStateToProps = (state) => {
    return {
        currentThicknessType: state.testView.currentThicknessType,
    };
};

export default withRouter(connect(mapStateToProps, {
    changeThicknessType
})(GEThicknessSwitch));


const StyledToggleButtonGroup = withStyles((theme) => ({
    root: {
        backgroundColor: 'grey'
    }
}))(ToggleButtonGroup);

const StyledToggleButton = withStyles((theme) => ({
    root: {
        width: 66,
        padding: '0 7px',
        color: '#bbbbbb',
    },
    selected: {
        color: 'yellow !important',
        backgroundColor: 'rgba(0, 0, 0, 0.5) !important'
    },
    label: {}
}))(ToggleButton);



