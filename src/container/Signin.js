/**
 * Signin
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {Form, FormGroup, Input} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import LanguageProvider from "Components/Header/LanguageProvider";
import AppConfig from 'Constants/AppConfig';
import { login} from 'Actions';
import * as selectors from "Selectors";
import IntlMessages from "Util/IntlMessages";
import * as Apis from "Api";


class Signin extends Component {

    state = {
        email: '',
        password: '',
        errorMsg: '',
        loading: false
    };

    componentDidMount() {
        if(this.props.isLogin) {
            this.props.history.push('/');
        }
    }
    /**
     * On User Login
     */
    onUserLogin(e) {
        e.preventDefault();
        this.setState({loading: true});
        if (this.state.email !== '' && this.state.password !== '') {
            Apis.login(this.state.email, this.state.password).then((result) => {
                this.props.login(result.userId, result.userName, result.userEmail, result.id, this.props.history);
            }).catch((e) => {
                this.setState({errorMsg: e.response.data.error.message, loading: false});
            });
        }
    }

    /**
     * On User Sign Up
     */
    onUserSignUp() {
        this.props.history.push('/signup');
    }

    render() {
        const {email, password, loading} = this.state;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    {loading &&
                    <LinearProgress/>
                    }
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <Link to="/">
                                            <img src={AppConfig.appLogo} alt="session-logo" width="120" height="29"/>
                                        </Link>
                                    </div>
                                    <div>
                                        <Button variant="contained" className="btn-light mr-10" onClick={() => this.onUserSignUp()}><IntlMessages id={"user.signup"}/></Button>
                                        {/*<LanguageProvider />*/}
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                                    <div className="session-body text-center">
                                        <div className="session-head mb-30">
                                            <h1 className="font-weight-bold">{AppConfig.brandName} <IntlMessages id={"user.login"}/></h1>
                                        </div>
                                        <Form onSubmit={this.onUserLogin.bind(this)}>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="mail"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Email Address"
                                                    onChange={(event) => this.setState({email: event.target.value, errorMsg: ''})}
                                                />
                                                <span className="has-icon"><i className="ti-email"/></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={password}
                                                    type="Password"
                                                    name="user-pwd"
                                                    id="pwd"
                                                    className="has-input input-lg"
                                                    placeholder="Password"
                                                    onChange={(event) => this.setState({password: event.target.value, errorMsg: ''})}
                                                />
                                                <span className="has-icon"><i className="ti-lock"/></span>
                                            </FormGroup>
                                            {
                                                this.state.errorMsg !== '' &&
                                                <div style={{margin: "-17px 10px 7px", textAlign: 'left', color: '#f34949'}}>Invalid username and password</div>
                                            }
                                            <FormGroup className="mb-15">
                                                <Button
                                                    type={'submit'}
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="contained"
                                                    size="large"
                                                >
                                                    <IntlMessages id={"user.signin"}/>
                                                </Button>
                                            </FormGroup>
                                            <div className={'d-flex justify-content-center mt-30 fs-14'}>
                                                <Link to="/forgot-password"><IntlMessages id={"user.forgotPassword"}/></Link>
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

// map state to props
const mapStateToProps = ({authUser}) => {
    const {user, loading} = authUser;
    return {user, loading, isLogin: selectors.getIsLogin(null)}
};

export default connect(mapStateToProps, {
    login,
})(Signin);
