/**
 * Signin
 */

import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {Form, FormGroup, Input} from 'reactstrap';
import QueueAnim from 'rc-queue-anim';
import * as Apis from 'Api';

// app config
import AppConfig from 'Constants/AppConfig';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";


export default class ForgotPassword extends Component {

    state = {
        email: ''
    };

    /**
     * On User Login
     */
    onForgotPassword() {
        if (this.state.email !== '') {
            Apis.forgotPassword(this.state.email).then(resp => {
                NotificationManager.success(<IntlMessages id={"user.forgotPassword.sentEmail"}/>);
                this.props.history.push('/signin');
            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    render() {
        const {email} = this.state;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <Link to="/">
                                            <img src={AppConfig.appLogo} alt="session-logo" width="120" height="29"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-md-3">
                                    <div className="session-body text-center">
                                        <div className="session-head mt-10">
                                            <h1 className="font-weight-bold"><IntlMessages id={"user.forgotPassword.title"}/></h1>
                                        </div>
                                        <div className={'mb-30 fs-13'}>
                                            <span><IntlMessages id={"user.forgotPassword.desc"}/></span>
                                        </div>
                                        <div>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="mail"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Email Address"
                                                    onChange={(event) => this.setState({email: event.target.value})}
                                                />
                                                <span className="has-icon"><i className="ti-email"/></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => this.onForgotPassword()}
                                                >
                                                    <IntlMessages id={"user.forgotPassword.resetPassword"}/>
                                                </Button>
                                            </FormGroup>
                                            <div className={'d-flex justify-content-center mt-30 fs-14'}>
                                                <Link to="/signin"><IntlMessages id={"user.forgotPassword.back"}/></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </QueueAnim>
        );
    }
}