import React, {Component} from 'react';
import {Button} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import IntlMessages from "Util/IntlMessages";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

export default class QualityModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quality: -1, // 0: Inadequate, 1: Moderate, 2: Good, 3: Perfect
        }
    }

    onConfirm() {
        this.props.confirm(this.state.quality);
        this.setState({quality: -1});
    }

    render() {
        const {isOpen, toggle} = this.props;
        return (
            <Dialog open={isOpen} onClose={toggle} aria-labelledby="alert-dialog-title" maxWidth='md'>
                <div className={'quality-container'}>
                    <CustomDialogTitle onClose={toggle}>
                        <span className={'quality-title'}><IntlMessages id={"testView.modal.selectImageDensity"}/></span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <div className={'quality-button-container'}>
                            <div className={'density-button ' + (this.state.quality === 0 ? 'active' : '')} onClick={() => this.setState({quality: 0})}>
                                <div>a</div>
                            </div>
                            <div className={'density-button ' + (this.state.quality === 1 ? 'active' : '')} onClick={() => this.setState({quality: 1})}>
                                <div>b</div>
                            </div>
                            <div className={'density-button ' + (this.state.quality === 2 ? 'active' : '')} onClick={() => this.setState({quality: 2})}>
                                <div>c</div>
                            </div>
                            <div className={'density-button ' + (this.state.quality === 3 ? 'active' : '')} onClick={() => this.setState({quality: 3})}>
                                <div>d</div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div style={{margin: 'auto'}}>
                            <Button variant="contained" onClick={() => this.onConfirm()} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;<IntlMessages
                                id={"testView.confirm"}/>&nbsp;&nbsp;</Button>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
        )
    }
}