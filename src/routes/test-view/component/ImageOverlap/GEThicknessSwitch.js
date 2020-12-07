import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {withStyles} from '@material-ui/core/styles';

const GEThicknessSwitch = ({metaData}) => {
    console.log('123123asdf', metaData);
    if(metaData.positionDesc !== 'GE-PLANES' && metaData.positionDesc !== 'GE-SLABS') return null;
    const onChange = (value) => {

    }


    return (
        <div className={'ge-thickness-switch'}>
            <StyledToggleButtonGroup size="small" value={'planes'} exclusive onChange={onChange}>
                <StyledToggleButton value="planes">
                    PLANES
                </StyledToggleButton>
                <StyledToggleButton value="slabs">
                    SLABS
                </StyledToggleButton>
            </StyledToggleButtonGroup>
        </div>
    )
}

export default GEThicknessSwitch;


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



