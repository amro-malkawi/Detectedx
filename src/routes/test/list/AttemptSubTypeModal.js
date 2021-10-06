import React from 'react';
import {Dialog, DialogTitle, DialogActions, Button} from "@material-ui/core";


const AttemptSubTypeModal = ({open, onClose, onSelectSubType}) =>{
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle className={'ml-70 mr-70'}>Which type test do you want?</DialogTitle>
            <DialogActions>
                <Button variant="contained" onClick={() => onSelectSubType('screening')} color="primary" className="text-white" > Screening test</Button>
                <Button variant="contained" onClick={() => onSelectSubType('')} color="primary" className="text-white" > Diagnostic test</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AttemptSubTypeModal;