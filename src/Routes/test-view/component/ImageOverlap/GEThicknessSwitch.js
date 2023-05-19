import React from 'react';
import ToggleButton from '@mui/lab/ToggleButton';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
import { withStyles } from 'tss-react/mui';
import withRouter from 'Components/WithRouter';
import {connect} from "react-redux";
import {changeThicknessType} from "Store/Actions";

const GEThicknessSwitch = ({imageId, metaData, age, currentThicknessType, changeThicknessType, imageList}) => {
    // if(currentThicknessType === 'NOTHICKNESS' || (metaData.positionDesc !== 'GE-PLANES' && metaData.positionDesc !== 'GE-SLABS')) return null;
    const onChange = (type) => {
        if(type !== null) changeThicknessType(type);
    }

    const renderAge = () => {
        if(age !== 0) {
            return <div className="age-info status fs-14 text-white">Age: {age}</div>
        } else {
            return null;
        }
    }

    const renderImageType = () => {
        const imageInfo = imageList.find((v) => v.id === imageId);
        if(imageInfo && imageInfo.type === 'prior') {
            return <div className="age-info status fs-14 text-white">Type: Prior</div>
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
            {renderImageType()}
            {renderToggleButtonGroup()}
        </div>
    )
}

// map state to props
const mapStateToProps = (state) => {
    return {
        currentThicknessType: state.testView.currentThicknessType,
        imageList: state.testView.imageList
    };
};

export default withRouter(connect(mapStateToProps, {
    changeThicknessType
})(GEThicknessSwitch));


const StyledToggleButtonGroup = withStyles(ToggleButtonGroup, (theme) => ({
    root: {
        marginTop: 7,
        backgroundColor: 'grey'
    }
}));

const StyledToggleButton = withStyles(ToggleButton, (theme) => ({
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
}));



