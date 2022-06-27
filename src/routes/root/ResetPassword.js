/**
 * Signin
 */

import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {FormGroup, Input} from 'reactstrap';
import QueueAnim from 'rc-queue-anim';
import QueryString from 'query-string';
import * as Apis from 'Api';

// app config
import AppConfig from 'Constants/AppConfig';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import MainLayout from "Components/MainLayout";
import {CircularProgress, Tooltip} from "@material-ui/core";


export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            errorPassword: false,
            confirmPassword: '',
            errorConfirmPassword: false,
            loading: false,
            errorMsg: '',
            accessToken: '',
        };
    }

    componentDidMount() {
        const param = QueryString.parse(this.props.location.search);
        if(param.token === undefined) {
            this.props.history.push('/signin');
        } else {
            this.setState({
                accessToken: param.token
            });
        }
    }

    /**
     * On User Login
     */
    checkValidation() {
        let valid = true;
        if(this.state.password === '') {
            this.setState({errorPassword: true});
            valid = false;
        }
        if(this.state.password !== this.state.confirmPassword) {
            this.setState({errorConfirmPassword: true});
            valid = false;
        }
        return valid;
    }

    onResetPassword() {
        if (this.checkValidation()) {
            this.setState({loading: true});
            Apis.resetPassword(this.state.password, this.state.accessToken).then(resp => {
                NotificationManager.success(<IntlMessages id={"user.resetPassword.success"}/>);
                this.props.history.push('/signin');
            }).catch(error => {
                this.setState({errorMsg: (error.response ? error.response.data.error.message : error.message)});
            }).finally(() => {
                this.setState({loading: false});
            });
        }
    }


    onKeyPress (event) {
        if(event.key === 'Enter') {
            this.onResetPassword();
        }
    }

    render() {
        return (
            <MainLayout>
                <div className={'main-signup'}>
                    <div className={'main-signup-content'} style={{width: 800, marginBottom: 150}}>
                        <div className={'signup-title mb-4'}><IntlMessages id={"user.resetPassword.title"}/></div>
                        <div className={'input-item'}>
                            <span>NEW PASSWORD</span>
                            <Input
                                type={'password'}
                                autoComplete="new-password"
                                value={this.state.password}
                                invalid={this.state.errorPassword}
                                onChange={(event) => this.setState({password: event.target.value, errorPassword: false,})}
                                onKeyPress={this.onKeyPress.bind(this)}
                            />
                        </div>
                        <div className={'input-item'}>
                            <span>CONFIRM PASSWORD</span>
                            <Input
                                type={'password'}
                                autoComplete="new-password"
                                value={this.state.confirmPassword}
                                invalid={this.state.errorConfirmPassword}
                                onChange={(event) => this.setState({confirmPassword: event.target.value, errorConfirmPassword: false})}
                                onKeyPress={this.onKeyPress.bind(this)}
                            />
                        </div>
                        <div>
                            <Button className={'signup-submit'} disabled={this.state.loading} onClick={this.onResetPassword.bind(this)}>
                                {
                                    !this.state.loading ? 'Reset Password' : <CircularProgress size={28}/>
                                }
                            </Button>
                        </div>
                        <div className={'d-flex justify-content-center mt-1'} style={{height: 22}}>
                            {
                                this.state.errorMsg !== '' && <span className={'text-red'}>{this.state.errorMsg}</span>
                            }
                        </div>
                    </div>
                </div>
            </MainLayout>
        )
    }

    render1() {
        const {password, confirmPassword} = this.state;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <a href="https://www.detectedx.com">
                                            <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35"/>
                                        </a>
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
                                            <h1 className="font-weight-bold"><IntlMessages id={"user.resetPassword.title"}/></h1>
                                        </div>
                                        <div className={'mb-30 fs-13'}>
                                            <span><IntlMessages id={"user.resetPassword.enterNew"}/></span>
                                        </div>
                                        <div>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="password"
                                                    value={password}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="New password"
                                                    onChange={(event) => this.setState({password: event.target.value})}
                                                />
                                                <span className="has-icon"><i className="ti-lock"/></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="password"
                                                    value={confirmPassword}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="Confirm new password"
                                                    onChange={(event) => this.setState({confirmPassword: event.target.value})}
                                                />
                                                <span className="has-icon"><i className="ti-lock"/></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => this.onResetPassword()}
                                                >
                                                    <IntlMessages id={"user.forgotPassword.resetPassword"}/>
                                                </Button>
                                            </FormGroup>
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