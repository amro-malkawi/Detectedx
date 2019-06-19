/**
 * Sign Up With Firebase
 */
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {Form, FormGroup, Input} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import {NotificationManager} from 'react-notifications';
import {Fab} from '@material-ui/core';

// components
import {SessionSlider} from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
    signupUserInEmail,
    signupUserInFirebase,
    signinUserWithFacebook,
    signinUserWithGoogle,
    signinUserWithGithub,
    signinUserWithTwitter
} from 'Actions';

class Signup extends Component {

    state = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    /**
     * On User Signup
     */
    onUserSignUp(e) {
        e.preventDefault();
        const {email, password, confirmPassword} = this.state;
        if (email !== '' && password !== '' && confirmPassword !== '') {
            if (password !== confirmPassword) {
                NotificationManager.error("Password does not matched");
            } else {
                this.props.signupUserInEmail({email, password}, this.props.history);
            }
        }
    }

    render() {
        const {email, password, confirmPassword} = this.state;
        const {loading} = this.props;
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
                                            <img src={AppConfig.appLogo} alt="session-logo" width="110" height="35"/>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/signin" className="mr-15 text-white">Already have an account?</Link>
                                        <Button
                                            component={Link}
                                            to="/signin"
                                            variant="contained"
                                            className="btn-light"
                                        >
                                            Sign In
                                        </Button>
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
                                        <div className="session-head mb-15">
                                            <h2>{AppConfig.brandName} Sign up</h2>
                                        </div>
                                        <Form  onSubmit={this.onUserSignUp.bind(this)}>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="mail"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Email Address"
                                                    onChange={(e) => this.setState({email: e.target.value})}
                                                />
                                                <span className="has-icon"><i className="ti-email"></i></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={password}
                                                    type="Password"
                                                    name="user-pwd"
                                                    id="pwd"
                                                    className="has-input input-lg"
                                                    placeholder="Password"
                                                    onChange={(e) => this.setState({password: e.target.value})}
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={confirmPassword}
                                                    type="Password"
                                                    name="user-confirm-pwd"
                                                    id="cpwd"
                                                    className="has-input input-lg"
                                                    placeholder="Confirm Password"
                                                    onChange={(e) => this.setState({confirmPassword: e.target.value})}
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    type={'submit'}
                                                    className="btn-info text-white btn-block w-100"
                                                    variant="contained"
                                                    size="large">
                                                    Sign Up
                                                </Button>
                                            </FormGroup>
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
    const {loading} = authUser;
    return {loading};
};

export default connect(mapStateToProps, {
    signupUserInEmail,
    signupUserInFirebase,
    signinUserWithFacebook,
    signinUserWithGoogle,
    signinUserWithGithub,
    signinUserWithTwitter
})(Signup);
