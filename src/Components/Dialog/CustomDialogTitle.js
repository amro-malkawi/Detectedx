import React from 'react';
import {
    DialogTitle,
    Typography,
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CustomDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={'dialog-title'} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={'close-button'} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default CustomDialogTitle;