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


export default class Signin extends Component {

    state = {
        email: ''
    };

    /**
     * On User Login
     */
    onResetPassword(e) {
        e.preventDefault();
        if (this.state.email !== '') {
            Apis.forgotPassword(this.state.email).then(resp => {

            }).catch(error => {

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
                                            <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35"/>
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
                                            <h1 className="font-weight-bold">Did you forgot your password?</h1>
                                        </div>
                                        <div className={'mb-30 fs-13'}>
                                            <span>Enter your email address you're using for you account below and we will send you a password link</span>
                                        </div>
                                        <Form onSubmit={this.onResetPassword.bind(this)}>
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
                                                <span className="has-icon"><i className="ti-email"></i></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    type={'submit'}
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="contained"
                                                    size="large"
                                                >
                                                    Reset Password
                                                </Button>
                                            </FormGroup>
                                            <div className={'d-flex justify-content-center mt-30 fs-14'}>
                                                <Link to="/signin">Back to Sign in</Link>
                                            </div>
                                        </Form>
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