import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeThicknessType} from "Actions/TestViewAction";
import IntlMessages from "Util/IntlMessages";

const GEThicknessSwitch = ({metaData, age, currentThicknessType, changeThicknessType}) => {
    // if(currentThicknessType === 'NOTHICKNESS' || (metaData.positionDesc !== 'GE-PLANES' && metaData.positionDesc !== 'GE-SLABS')) return null;
    const onChange = (type) => {
        if(type !== null) changeThicknessType(type);
    }

    const renderAge = () => {
        if(age !== 0) {
            return <div className="age-info status fs-14 text-white"><IntlMessages id="testView.age"/>: {age}</div>
        } else {
            return null;
        }
    }

    const renderToggleButtonGroup = () => {
        if(currentThicknessType === 'NOTHICKNESS' || (metaData.positionDesc !== 'GE-PLANES' && metaData.positionDesc !== 'GE-SLABS')) return null;
        return (
            <StyledToggleButtonGroup className='thickness-toggle' size="small" value={currentThicknessType} exclusive orientation="vertical" onChange={(e, type) => onChange(type)}>
                <StyledToggleButton value="SLABS">
                    SLABS
                </StyledToggleButton>
                <StyledToggleButton value="PLANES">
                    PLANES
                </StyledToggleButton>
            </StyledToggleButtonGroup>
        )
    }

    return (
        <div className={'ge-thickness-switch'}>
            {renderAge()}
            {renderToggleButtonGroup()}
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
        marginTop: 7,
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



