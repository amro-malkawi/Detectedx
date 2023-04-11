import React from 'react'
import LinearProgress from '@mui/material/LinearProgress';

export default ({totalCount, downCount}) => {
    if(totalCount === downCount) {
        return null;
    } else {
        return (
            <div className={'test-view-down-progress'} data-cy="linear-progress">
                <LinearProgress variant="determinate" value={Math.round((downCount * 100) / totalCount)} style={{height: 2}}/>
                <span>{`Loading... (${downCount} / ${totalCount})`}</span>
            </div>
        )
    }
}