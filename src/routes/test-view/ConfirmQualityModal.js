import React, {Component} from 'react';
import {Button, Input} from "reactstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import IntlMessages, {IntlStringMessage} from "Util/IntlMessages";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

export default class ConfirmQualityModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
        }
    }

    render() {
        const {isOpen, toggle, confirm} = this.props;
        return (
            <div>
                <Dialog open={isOpen} onClose={toggle} aria-labelledby="alert-dialog-title" maxWidth='md'>
                    <div className={'quality-container'} style={{padding: '3px 50px'}}>
                        <CustomDialogTitle onClose={toggle}>
                            <span className={'quality-title'}>Confirm Image Quality</span>
                        </CustomDialogTitle>
                        <DialogContent>
                            <div>
                                <span className={'confirm-quality-text'}><IntlMessages id={"testView.confirm.correctImageQuality"}/> <b style={{color: '#FFB300'}}>{this.props.quality}</b>. <IntlMessages id={"testView.confirm.areYouAgree"}/></span>
                            </div>
                            <Input
                                type="textarea"
                                name="first_name"
                                id="first_name"
                                placeholder={"Please input feedback"}
                                value={this.state.msg}
                                className={'quality-feedback'}
                                onChange={(e) => this.setState({msg: e.target.value})}
                            />
                        </DialogContent>
                        <DialogActions>
                            <div style={{margin: 'auto'}}>
                                <Button variant="contained" onClick={() => confirm(true, this.state.msg)} color="success" className="text-white"
                                        style={{marginRight: 12}}>&nbsp;&nbsp;<IntlMessages id={"testView.confirm.agree"}/>&nbsp;&nbsp;</Button>
                                <Button variant="contained" onClick={() => confirm(false, this.state.msg)} color="danger" className="text-white">&nbsp;<IntlMessages id={"testView.confirm.disagree"}/>&nbsp;</Button>
                            </div>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        )
    }
}