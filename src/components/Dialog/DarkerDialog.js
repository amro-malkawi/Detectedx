import {
    Dialog,
} from "@mui/material";
import { withStyles } from 'tss-react/mui';

const DarkerDialog = withStyles(
    Dialog,
    {
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
});


export default DarkerDialog;