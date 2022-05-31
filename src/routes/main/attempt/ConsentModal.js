import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import IntlMessages from "Util/IntlMessages";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

const ConsentModal = function (props) {
    const {isOpen, onClose} = props;
    return (
        <Dialog open={isOpen} onClose={() => null} aria-labelledby="alert-dialog-title" maxWidth='md' classes={{paper: 'p-20'}}>
            <CustomDialogTitle id="alert-dialog-title" onClose={onClose} >
                <div className={'text-center fs-23'}><IntlMessages id={"test.consent"}/></div>
            </CustomDialogTitle>
            <DialogContent>
                <span className={'fs-17'}><IntlMessages id={"test.attempt.consent.understand"}/></span>
                <div>
                    <span className="dot badge-secondary mr-10">&nbsp;</span>
                    <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text1"}/></span>
                </div>
                <div>
                    <span className="dot badge-secondary mr-10">&nbsp;</span>
                    <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text2"}/></span>
                </div>
                <div className={'fs-17 mt-15'}><IntlMessages id={"test.attempt.consent.consent"}/></div>
                <div>
                    <span className="dot badge-secondary mr-10">&nbsp;</span>
                    <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text3"}/></span>
                </div>
                <div>
                    <span className="dot badge-secondary mr-10">&nbsp;</span>
                    <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text4"}/></span>
                </div>
            </DialogContent>
            <DialogActions className={'justify-content-center mt-20'}>
                <Button variant="contained" onClick={() => onClose()} color="primary" className="text-white" autoFocus> <IntlMessages id={"test.agree"}/> </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ConsentModal;