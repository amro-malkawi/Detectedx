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
                        <div className={'fs-13'}>
                            <div className={'fs-14 fw-bold'}>Allows you to choose either:</div>
                            <div className={'ml-2 mt-1'}>• Recall (BIRADS 0)</div>
                            <div className={'ml-2 mt-1'}>• Next case (Normal)</div>
                        </div>}
                    placement="bottom"
                >
                    <Button variant="contained" onClick={() => onSelectSubType('screening')} color="primary" className="text-white"><IntlMessages id={"test.attemptSubModalScreening"}/></Button>
                </Tooltip>
                <Tooltip
                    title={
                        <div className={'fs-13'}>
                            <div className={'fs-14 fw-bold'}>Allows you to assign either:</div>
                            <div className={'ml-2 mt-1'}>• BIRADS assessment category</div>
                            <div className={'ml-2 mt-1'}>• 3-Probably benign, 4-Suspicious<br/>&nbsp;&nbsp; or 5-Highly suspicious</div>
                            <div className={'ml-2 mt-1'}>• Abnormality appearances</div>
                            <div className={'ml-2 mt-1'}>• BIRADS assessment category</div>
                            <div className={'ml-2 mt-1'}>• 2-benign</div>
                            <div className={'ml-2 mt-1'}>• Next case (1-Normal)</div>
                        </div>
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