import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import IntlMessages from "Util/IntlMessages";

export default function ({open, score, remainCount, onPostTestAgain}) {
    return (
        <CustomDialog
            open={open}
            onClose={null}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                {
                    remainCount > 0 ?
                        <CustomDialogContentText >
                            <IntlMessages id={"testView.viewer.reattemptModalText1"} values={{score: <span className={'text-primary'}>{score}%</span>}}/><br/>
                            <IntlMessages id={"testView.viewer.reattemptModalText2"} values={{remainCount: <span className={'text-primary'}>{remainCount}</span>}}/>
                        </CustomDialogContentText> :
                        <CustomDialogContentText >
                            <IntlMessages id={"testView.viewer.reattemptModalText1"} values={{score: <span className={'text-primary'}>{score}%</span>}}/><br/>
                            <IntlMessages id={"testView.viewer.reattemptModalText3"}/>
                        </CustomDialogContentText>
                }
            </DialogContent>
            <DialogActions className={'justify-content-center'}>
                <Button variant="contained" onClick={onPostTestAgain} color="primary" className={'mr-10'} autoFocus>
                    {
                        remainCount > 0 ? <IntlMessages id={"testView.viewer.reviewAnswers"}/> : <IntlMessages id={"testView.viewer.home"}/>
                    }
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

const CustomDialogTitle = withStyles((theme) => ({
    root: {
        textAlign: 'center',
        color: 'white'
    }
}))(DialogTitle);

const CustomDialogContentText = withStyles((theme) => ({
    root: {
        marginTop: 20,
        color: '#ffffff99'
    }
}))(DialogContentText);