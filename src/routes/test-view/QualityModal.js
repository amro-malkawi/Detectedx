import React, {Component} from 'react';
import {Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Tabs, Tab, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";

export default class QualityModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            quality: -1, // 0: Inadequate, 1: Moderate, 2: Good, 3: Perfect
        }
    }

    render() {
        const {isOpen, toggle, confirm} = this.props;
        return (
            <Dialog open={isOpen} onClose={toggle} aria-labelledby="alert-dialog-title" maxWidth='md' >
                <div className={'quality-container'}>
                    <DialogTitle>
                        <span className={'quality-title'}>Select Image Quality</span>
                    </DialogTitle>
                    <DialogContent>
                        <div className={'quality-button-container'}>
                            <div className={'quality-button ' + (this.state.quality === 3 ? 'active' : '')} onClick={() => this.setState({quality: 3})}>
                                <div className={'perfect-icon'} />
                                <span>Perfect</span>
                            </div>
                            <div className={'quality-button ' + (this.state.quality === 2 ? 'active' : '')} onClick={() => this.setState({quality: 2})}>
                                <div className={'good-icon'} />
                                <span>Good</span>
                            </div>
                            <div className={'quality-button ' + (this.state.quality === 1 ? 'active' : '')} onClick={() => this.setState({quality: 1})}>
                                <div className={'moderate-icon'} />
                                <span>Moderate</span>
                            </div>
                            <div className={'quality-button ' + (this.state.quality === 0 ? 'active' : '')} onClick={() => this.setState({quality: 0})}>
                                <div className={'inadequate-icon'} />
                                <span>Inadequate</span>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div style={{margin: 'auto'}}>
                            <Button variant="contained" onClick={() => confirm(this.state.quality)} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Confirm&nbsp;&nbsp;</Button>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
        )
    }
}


// https://thenounproject.com/term/bad-quality/252641/
// https://thenounproject.com/grega.cresnar/uploads/?i=252627
// https://thenounproject.com/search/?q=quality&creator=753582&i=216832
// https://thenounproject.com/grega.cresnar/collection/quality/