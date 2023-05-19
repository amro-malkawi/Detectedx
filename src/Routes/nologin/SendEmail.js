/**
 * Sign Up With
 */
import React, {Component} from 'react';
import {Button, AppBar, Toolbar, LinearProgress} from '@mui/material';
import {Link} from 'react-router-dom';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";

export default class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.params.user_id,
            loading: false,
        };
        this.onCheckVerify();
    }

    onCheckVerify() {
        Apis.checkEmailStatus(this.state.userId).then((resp) => {
            if (!resp.result) {
                this.props.navigate('/signin', {replace: true});
            }
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        })
    }

    onResendEmail() {
        this.setState({loading: true});
        Apis.userVerify(this.state.userId).then((resp) => {
            NotificationManager.success('Resend email. Please check again');
        }).catch((e) => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {
            this.setState({loading: false});
        });
    }

    render() {
        const {loading} = this.state;
        return (
            <div className="rct-session-wrapper">
                {loading &&
                    <LinearProgress/>
                }
                <AppBar position="static" className="session-header">
                    <Toolbar>
                        <div className="container">
                            <div className="d-flex justify-content-between">
                                <div className="session-logo">
                                    <a href="https://www.detectedx.com">
                                        <img src={require('Assets/img/site-logo.png')} alt="session-logo" width="110" height="35"/>
                                    </a>
                                </div>
                                <div>
                                    <Button
                                        component={Link}
                                        to="/signin"
                                        variant="contained"
                                        className="btn-light"
                                    >
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="session-inner-wrapper">
                    <div className="container">
                        <div className="row row-eq-height">
                            <div className="col-sm-12 col-md-8 col-lg-7" style={{margin: 'auto'}}>
                                <div className="session-body text-center">
                                    <div className="session-head mb-15">
                                        <h2>We've Sent You a Confirmation Email</h2>
                                        <p>Time to check your email</p>
                                    </div>
                                    <div>
                                        <img className={'mt-20 mb-20'} src={require('Assets/img/inbox.png')} width={170} height={170} alt={''}/>
                                        <div>
                                            <span>Click the link in your email to confirm your account.</span>
                                        </div>
                                        <div>
                                            <span>If you can't find the email check your spam folder or click the link below to resend.</span>
                                        </div>
                                    </div>
                                    <Button component="span" disabled={this.state.loading} className={'mt-20 mb-20'} style={{color: '#0D47A1'}} onClick={() => this.onResendEmail()}>
                                        Resend Confirmation Email
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}