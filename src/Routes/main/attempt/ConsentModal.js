import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

const ConsentModal = function (props) {
    const {isOpen, onClose} = props;
    return (
        <Dialog open={!!isOpen} onClose={() => null} aria-labelledby="alert-dialog-title" maxWidth='md' classes={{paper: 'p-20'}}>
            <CustomDialogTitle id="alert-dialog-title" onClose={onClose} >
                <div className={'text-center fs-23'}>Consent</div>
            </CustomDialogTitle>
            <DialogContent>
                <span className={'fs-17'}>I understand that:</span>
                <div>
                    <span className="dot badge-secondary me-10">&nbsp;</span>
                    <span className="fs-14 me-10">The results of reading this module are de-identified, with  results identified only by Reader Numbers</span>
                </div>
                <div>
                    <span className="dot badge-secondary me-10">&nbsp;</span>
                    <span className="fs-14 me-10">My results may form part of the Quality Assurance Program of my Service or Clinic</span>
                </div>
                <div className={'fs-17 mt-15'}>I consent to:</div>
                <div>
                    <span className="dot badge-secondary me-10">&nbsp;</span>
                    <span className="fs-14 me-10">My de-identified results to be used to further develop the educational program</span>
                </div>
                <div>
                    <span className="dot badge-secondary me-10">&nbsp;</span>
                    <span className="fs-14 me-10">My de-identified results to be used for research which may be published in peer reviewed scientific journals</span>
                </div>
            </DialogContent>
            <DialogActions className={'justify-content-center mt-20'}>
                <Button variant="contained" onClick={() => onClose()} color="primary" className="text-white" autoFocus> Agree </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ConsentModal;