import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import { withStyles } from 'tss-react/mui';

export default function ({open, score, remainCount, onPostTestAgain}) {
    return (
        <CustomDialog
            open={!!open}
            onClose={null}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                {
                    remainCount > 0 ?
                        <CustomDialogContentText >
                            You scored <span className={'text-primary'}>{score}%</span>, A passing score of 75% is needed to gain AMA PRA Category 1 Credit(s)™.<br/>
                            Please review your answers and reattempt the post test. You have <span className={'text-primary'}>{remainCount}</span> attempts remaining
                        </CustomDialogContentText> :
                        <CustomDialogContentText >
                            You scored <span className={'text-primary'}>{score}%</span>, A passing score of 75% is needed to gain AMA PRA Category 1 Credit(s)™.<br/>
                            As you have failed the post-test 3 times you will have to restart the whole activity to reattempt the post test.
                        </CustomDialogContentText>
                }
            </DialogContent>
            <DialogActions className={'justify-content-center'}>
                <Button data-cy="review-answers-button" variant="contained" onClick={onPostTestAgain} color="primary" className={'me-10'} autoFocus>
                    {
                        remainCount > 0 ? "Review Answers" : "Home"
                    }
                </Button>
            </DialogActions>
        </CustomDialog>
    )
}

const CustomDialog = withStyles(Dialog, (theme) => ({
    paper: {
        marginBottom: 100,
        boxShadow: "2px 2px 4px #777",
        backgroundColor: '#424242'
    }
}));

const CustomDialogContentText = withStyles(DialogContentText, (theme) => ({
    root: {
        marginTop: 20,
        color: '#ffffff99'
    }
}));