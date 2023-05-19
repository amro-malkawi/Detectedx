import React, {useState, useEffect} from "react";
import {Button, Dialog, DialogContent} from "@mui/material";

function DeleteProfileModal({onClose, onDelete}) {
    return (
        <Dialog open={true} onClose={onClose} maxWidth='xl' className={'profile-delete-dialog'}>
            <span className={'fs-15 fw-semi-bold text-primary1 mb-3'}>This will delete your profile and all personal data an cannot be reverted</span>
            <span className={'fs-26 fw-semi-bold mb-40'}>Are you sure?</span>
            <img src={require('Assets/img/main/icon_close.png')} alt={''}/>
            <Button className={'del-btn mt-40 mb-30'} onClick={onDelete}>Yes Delete My Profile</Button>
            <div className={'del-cancel-btn'} onClick={onClose}>No, please take me back</div>
        </Dialog>
    )
}

export default DeleteProfileModal;