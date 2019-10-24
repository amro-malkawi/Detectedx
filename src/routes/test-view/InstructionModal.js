import React, {Component} from 'react';
import {Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab, TabPanel, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
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

const FullDialog = withStyles(theme => ({
    paper: {
        height: '100%',
        maxWidth: 1090
    }
}))(Dialog);