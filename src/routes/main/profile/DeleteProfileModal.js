import React, {useState, useEffect} from "react";
import {Button, Dialog, DialogContent} from "@material-ui/core";

function DeleteProfileModal({onClose, onDelete}) {
    return (
        <Dialog open={true} onClose={onClose} maxWidth='xl' className={'profile-delete-dialog'}>
            <span className={'fs-15 fw-semi-bold text-primary1 mb-3'}>DELETE PROFILE</span>
            <span className={'fs-26 fw-semi-bold mb-40'}>Are you sure?</span>
            <img src={require('Assets/img/main/icon_close.png')} alt={''}/>
            <Button className={'del-btn mt-40 mb-30'} onClick={onDelete}>Yes cancel my membership</Button>
            <div className={'del-cancel-btn'} onClick={onClose}>No, please take me back</div>
        </Dialog>
    )
}

export default DeleteProfileModal;