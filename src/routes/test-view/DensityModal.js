import React, {Component} from 'react';
import {Button} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import IntlMessages from "Util/IntlMessages";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

export default class QualityModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onConfirm(quality) {
        this.props.confirm(quality);
    }

    render() {
        const {isOpen, toggle} = this.props;
        return (
            <Dialog open={isOpen} onClose={toggle} aria-labelledby="alert-dialog-title" maxWidth='md'>
                <div className={'quality-container'}>
                    <CustomDialogTitle onClose={toggle}>
                        <span className={'quality-title'}><IntlMessages id={"testView.modal.selectBreastDensity"}/></span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <div data-cy="quality-button-container" className={'quality-button-container'}>
                            <div className={'density-button ' + (this.state.quality === 0 ? 'active' : '')} onClick={() => this.onConfirm(0)}>
                                <div>a</div>
                            </div>
                            <div className={'density-button ' + (this.state.quality === 1 ? 'active' : '')} onClick={() => this.onConfirm(1)}>
                                <div>b</div>
                            </div>
                            <div className={'density-button ' + (this.state.quality === 2 ? 'active' : '')} onClick={() => this.onConfirm(2)}>
                                <div>c</div>
                            </div>
                            <div className={'density-button ' + (this.state.quality === 3 ? 'active' : '')} onClick={() => this.onConfirm(3)}>
                                <div>d</div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </div>
            </Dialog>
        )
    }
}