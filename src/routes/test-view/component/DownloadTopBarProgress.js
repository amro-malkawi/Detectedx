import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        top: 0,
        width: '100%',
        textAlign: 'center',
        color: '#5483e0',
        fontWeight: 'bold',
        fontSize: 11,
    },
});

export default ({totalCount, downCount}) => {
    const classes = useStyles();
    if(totalCount === downCount) {
        return null;
    } else {
        return (
            <div className={classes.root}>
                <LinearProgress variant="determinate" value={Math.round((downCount * 100) / totalCount)} style={{height: 2}}/>
                <span>{`Loading... (${downCount} / ${totalCount})`}</span>
            </div>
        )
    }
}