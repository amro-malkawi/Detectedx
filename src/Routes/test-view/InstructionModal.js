import React, {Component} from 'react';
import {Dialog} from "@mui/material";
import { withStyles } from 'tss-react/mui';
import Content from '../instructions/content';

export default class InstructionModal extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {isOpen, toggle, theme} = this.props;
        return (
            <FullDialog open={isOpen} onClose={toggle} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '80%'}}}>
                <Content onClose={toggle} theme={theme}/>
            </FullDialog>
        )
    }
}

const FullDialog = withStyles(Dialog, (theme) => ({
    paper: {
        height: '100%',
        maxWidth: 1090
    }
}));