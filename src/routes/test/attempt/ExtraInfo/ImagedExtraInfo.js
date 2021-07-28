import React, {useState} from 'react';
import {Button, DialogContent} from "@material-ui/core";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import DarkerDialog from "Components/Dialog/DarkerDialog";
import IntlMessages from "Util/IntlMessages";

const infoDialog = function (open, onClose) {
    return (
        <DarkerDialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
            <div style={{padding: 30}}>
                <CustomDialogTitle id="alert-dialog-title" onClose={onClose}>
                    <span className={'fs-23'}>Definitions</span>
                </CustomDialogTitle>
                <DialogContent>
                    <ul style={{height: 400}}>
                    </ul>
                </DialogContent>
            </div>
        </DarkerDialog>
    )
}

export default function () {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={'score-extra'}>
            <p className={'extra-title'}><IntlMessages id="test.attempt.scoreDefinitions"/></p>
            <p className={'extra-desc'}><IntlMessages id="test.attempt.scoreDefinitionsDesc"/></p>
            <div className={'extra-button-container'}>
                <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => setShowModal(true)}>
                    <IntlMessages id="test.attempt.definition"/>
                </Button>
            </div>
            {
                infoDialog(showModal, () => setShowModal(false))
            }
        </div>
    )
}