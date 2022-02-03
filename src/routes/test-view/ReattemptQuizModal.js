import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import IntlMessages from "Util/IntlMessages";

export default function ({open, score, onReattempt}) {
    return (
        <CustomDialog
            open={open}
            onClose={null}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <CustomDialogContentText>
                    You scored<span className={'text-primary'}>{score}%</span>, A passing score of 75% is needed to finish quiz.
                </CustomDialogContentText>
            </DialogContent>
            <DialogActions className={'justify-content-center'}>
                <Button data-cy="review-answers-button" variant="contained" onClick={onReattempt} color="primary" className={'mr-10'} autoFocus>
                    Restart quiz
                </Button>
            </DialogActions>
        </CustomDialog>
    )
}

const CustomDialog = withStyles((theme) => ({
    paper: {
        marginBottom: 100,
        boxShadow: "2px 2px 4px #777",
        backgroundColor: '#424242'
    }
}))(Dialog);

const CustomDialogContentText = withStyles((theme) => ({
    root: {
        marginTop: 20,
        color: '#ffffff99'
    }
}))(DialogContentText);