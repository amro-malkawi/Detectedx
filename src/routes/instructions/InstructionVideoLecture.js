import React from 'react';
import {Button} from "reactstrap";
import {DialogActions, DialogContent} from "@material-ui/core";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

export default ({onClose, theme, type, video}) => {
    return (
        <div className={theme === 'black' ? 'instruction-theme-black' : 'instruction-theme-white'}>
            <div className={'instruction-container'}>
                <CustomDialogTitle onClose={onClose}>
                    <p className={'fs-23 instruction-title'}>Instruction</p>
                </CustomDialogTitle>
                <DialogContent className={'instruction-content'}>
                    <object data={video.link}
                            width="100%"
                            height="100%">
                    </object>
                </DialogContent>
                <DialogActions className={'mt-10'}>
                    <div style={{margin: 'auto'}}>
                        {
                            onClose ? <Button variant="contained" onClick={onClose} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Close&nbsp;&nbsp;</Button> : null
                        }
                    </div>
                </DialogActions>
            </div>
        </div>
    )
}