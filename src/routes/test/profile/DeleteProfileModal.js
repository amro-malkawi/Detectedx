import React, {Component} from 'react';
import {Dialog, DialogContent, TextField, Button, CircularProgress, Typography} from "@material-ui/core";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {logoutUserFromEmail} from "Actions";
import * as Apis from 'Api';

class DeleteProfileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            invalidPassword: false,
            confirmPassword: false,
            loading: false
        }
    }

    onClose() {
        this.setState({
            password: '',
            invalidPassword: false,
            confirmPassword: false,
        });
        this.props.onClose();
    }

    onConfirmPassword() {
        this.setState({loading: true});
        Apis.userConfirmPassword(this.state.password).then((resp) => {
            if (resp.result) {
                this.setState({confirmPassword: true});
            } else {
                NotificationManager.error('Password is not correct');
                this.setState({password: '', invalidPassword: true})
            }
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
            this.setState({loading: false});
        })
    }

    onDeleteAccount() {
        this.setState({loading: true});
        Apis.userDeleteProfile().then((resp) => {
            NotificationManager.success('Your account was deleted permanently');
            this.props.logoutUserFromEmail();
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
            this.setState({loading: false});
        })
    }

    render() {
        const {open} = this.props;
        if (!this.state.confirmPassword) {
            return (
                <Dialog open={open} onClose={() => this.onClose()} aria-labelledby="alert-dialog-title" maxWidth='sm'>
                    <CustomDialogTitle id="alert-dialog-title" onClose={() => this.onClose()}>
                        <span className={'fs-23'}>Delete my account</span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <div>
                            You are trying to delete you account, This action will remove all of your personal information permanently, you will not be able to login.
                        </div>
                        <TextField
                            autoFocus margin="dense" label="User Password" type="password" fullWidth
                            inputProps={{
                                autocomplete: 'new-password'
                            }}
                            disabled={this.state.loading}
                            error={this.state.invalidPassword}
                            value={this.state.password}
                            onChange={((e) => this.setState({password: e.target.value, invalidPassword: false}))}
                        />
                        <div className={'d-flex justify-content-center mt-30'}>
                            <Button variant="contained" onClick={() => this.onConfirmPassword()} disabled={this.state.loading} color="default" className="btn-danger text-white mr-30"
                                    style={{width: 62}}>
                                {
                                    this.state.loading ? <CircularProgress size={17}/> : <IntlMessages id={"testView.viewer.delete"}/>
                                }
                            </Button>
                            <Button variant="contained" onClick={() => this.onClose()} disabled={this.state.loading} color="default" className="text-white" style={{width: 62}}>
                                <IntlMessages id={"testView.cancel"}/>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        } else {
            return (
                <Dialog open={open} onClose={() => this.onClose()} aria-labelledby="alert-dialog-title" maxWidth='sm'>
                    <DialogContent>
                        <div className={'d-flex justify-content-center mb-15'}>
                            <WarningRoundedIcon color="action" style={{fontSize: 90, color: '#f75a00'}}/>
                        </div>
                        <div className={'fs-23'}>
                            <Typography variant='h6'>Are you sure you want to permanently remove your account?</Typography>
                        </div>
                        <div className={'d-flex justify-content-center mt-30'}>
                            <Button variant="contained" onClick={() => this.onDeleteAccount()} disabled={this.state.loading} color="default" className="btn-danger text-white mr-30"
                                    style={{width: 62}}>
                                {
                                    this.state.loading ? <CircularProgress size={17}/> : <IntlMessages id={"profile.yes"}/>
                                }
                            </Button>
                            <Button variant="contained" onClick={() => this.onClose()} disabled={this.state.loading} color="default" className="text-white" style={{width: 62}}>
                                <IntlMessages id={"profile.no"}/>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        }
    }
}

export default withRouter(connect(null, {
    logoutUserFromEmail
})(DeleteProfileModal));
