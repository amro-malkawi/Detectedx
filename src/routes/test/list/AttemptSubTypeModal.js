import React from 'react';
import {Dialog, DialogTitle, DialogActions, Button, Tooltip} from "@material-ui/core";
import IntlMessages from "Util/IntlMessages";


const AttemptSubTypeModal = ({open, onClose, onSelectSubType}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle className={'ml-70 mr-70'}><IntlMessages id={"test.attemptSubModalTitle"}/></DialogTitle>
            <DialogActions>
                <Tooltip
                    title={
                        <span className={'fs-13'}>
                            <span className={'fs-14 fw-bold'}><IntlMessages id={'test.attemptSubModalScreeningOption'}/></span><IntlMessages id={"test.attemptSubModalScreeningTooltip"}/>
                        </span>}
                    placement="bottom"
                >
                    <Button variant="contained" onClick={() => onSelectSubType('screening')} color="primary" className="text-white"><IntlMessages id={"test.attemptSubModalScreening"}/></Button>
                </Tooltip>
                <Tooltip
                    title={
                        <span className={'fs-13'}>
                            <span className={'fs-14 fw-bold'}><IntlMessages id={'test.attemptSubModalDiagnosticOption'}/></span><IntlMessages id={"test.attemptSubModalDiagnosticTooltip"}/>
                        </span>
                    }
                    placement="bottom"
                >
                    <Button variant="contained" onClick={() => onSelectSubType('')} color="primary" className="text-white"><IntlMessages id={"test.attemptSubModalDiagnostic"}/></Button>
                </Tooltip>
            </DialogActions>
        </Dialog>
    )
}

export default AttemptSubTypeModal;