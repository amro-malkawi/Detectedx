import React from 'react';
import {
    Dialog,
    withStyles
} from "@material-ui/core";

const DarkerDialog = withStyles({
    root: {

    },
    scrollPaper: {
        backgroundColor: '#ffffff20'
    },
    paper: {
        backgroundColor: 'black',
        color: 'white',
        boxShadow: '1px 1px 7px 1px #555'
    }
})(Dialog);


export default DarkerDialog;