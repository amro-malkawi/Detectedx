/**
 * Sign Up With Firebase
 */
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {Col, Form, FormGroup, Input} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from '@material-ui/core/styles';
import {NotificationManager} from 'react-notifications';
import {Fab} from '@material-ui/core';

// components
import {SessionSlider} from 'Components/Widgets';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
    signupUserInEmail,
} from 'Actions';

class Signup extends Component {

    state = {
        email: '',
        emailInvalid: false,
        firstName: '',
        firstNameInvalid: false,
        lastName: '',
        lastNameInvalid: false,
        password: '',
        passwordInvalid: false,
        confirmPassword: '',
        confirmPasswordInvalid: false,
        checkTerms: false,
        termInvalid: false,
        loading: false,
    };

    validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    validate() {
        const {email, firstName, lastName, password, confirmPassword, checkTerms} = this.state;
        let valid = true;
        let inValidObj = {};
        if (email.length === 0 || !this.validateEmail(email)) {
            valid = false;
            inValidObj.emailInvalid = true;
        }
        if (firstName.length === 0) {
            valid = false;
            inValidObj.firstNameInvalid = true;
        }
        if (lastName.length === 0) {
            valid = false;
            inValidObj.lastNameInvalid = true;
        }
        if (password.length === 0) {
            valid = false;
            inValidObj.passwordInvalid = true;
        }
        if (confirmPassword.length === 0 || confirmPassword !== password) {
            valid = false;
            inValidObj.confirmPasswordInvalid = true;
        }
        if (confirmPassword !== password) {
            valid = false;
            inValidObj.confirmPasswordInvalid = true;
            NotificationManager.error("Password does not matched");
        }
        if(!checkTerms) {
            valid = false;
            NotificationManager.error("You have to agree terms and conditions");
        }
        if (!valid) {
            this.setState(inValidObj);
        }
        return valid;
    }

    /**
     * On User Signup
     */
    onUserSignUp(e) {
        e.preventDefault();
        if (this.validate()) {
            this.setState({loading: true});
            const {email, firstName, lastName, password, confirmPassword} = this.state;
            this.props.signupUserInEmail({email, firstName, lastName, password}, this.props.history).then((result) => {
                NotificationManager.success('Account Created Successfully!');
                this.props.history.push('/users/send-email/' + result.id);
            }).catch((error) => {
                this.setState({loading: false});
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    onSetValue(key, value) {
        this.setState({[key]: value, [key + 'Invalid']: false});
    }

    render() {
        const {email, firstName, lastName, password, confirmPassword} = this.state;
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
                                <div className="col-sm-12 col-md-8 col-lg-7" style={{margin: 'auto'}}>
                                    <div className="session-body text-center">
                                        <div className="session-head mb-15">
                                            <h2>{AppConfig.brandName} Sign up</h2>
                                        </div>
                                        <Form onSubmit={this.onUserSignUp.bind(this)}>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="mail"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className={this.state.emailInvalid ? "has-error-input input-lg" : "has-input input-lg"}
                                                    placeholder="Enter Email Address"
                                                    onChange={(e) => this.onSetValue('email', e.target.value)}
                                                />
                                                <span className="has-icon"><i className="ti-email"/></span>
                                            </FormGroup>
                                            <FormGroup row className="has-wrapper">
                                                <Col sm={6}>
                                                    <Input
                                                        value={firstName}
                                                        type="text"
                                                        name="first_name"
                                                        id="first_name"
                                                        className={this.state.firstNameInvalid ? "has-error-input input-lg" : "has-input input-lg"}
                                                        placeholder="First Name"
                                                        onChange={(e) => this.onSetValue('firstName', e.target.value)}
                                                    />
                                                </Col>
                                                <Col sm={6}>
                                                    <Input
                                                        value={lastName}
                                                        type="text"
                                                        name="last_name"
                                                        id="last_name"
                                                        className={this.state.lastNameInvalid ? "has-error-input input-lg" : "has-input input-lg"}
                                                        placeholder="Last Name"
                                                        onChange={(e) => this.onSetValue('lastName', e.target.value)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={password}
                                                    type="Password"
                                                    name="user-pwd"
                                                    id="pwd"
                                                    className={this.state.passwordInvalid ? "has-error-input input-lg" : "has-input input-lg"}
                                                    placeholder="Password"
                                                    onChange={(e) => this.onSetValue('password', e.target.value)}
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper mb-5">
                                                <Input
                                                    value={confirmPassword}
                                                    type="Password"
                                                    name="user-confirm-pwd"
                                                    id="cpwd"
                                                    className={this.state.confirmPasswordInvalid ? "has-error-input input-lg" : "has-input input-lg"}
                                                    placeholder="Confirm Password"
                                                    onChange={(e) => this.onSetValue('confirmPassword', e.target.value)}
                                                />
                                                <span className="has-icon"><i className="ti-lock"/></span>
                                            </FormGroup>
                                            <div className={'d-flex justify-content-left'}>
                                                <FormControlLabel
                                                    control={
                                                        <GreenCheckbox
                                                            checked={this.state.checkTerms}
                                                            onChange={(event) => this.setState({checkTerms: event.target.checked})}
                                                            value=""
                                                        />
                                                    }
                                                    label={<span>I have read and agree to the <Link to="/terms">terms of conditions</Link></span>}
                                                />
                                            </div>
                                            <FormGroup className="mb-15 mt-10">
                                                <Button
                                                    disabled={this.state.loading}
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

const GreenCheckbox = withStyles({
    root: {
        color: '#66bb6a',
        '&$checked': {
            color: '#43a047',
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

// map state to props
const mapStateToProps = ({authUser}) => {
    const {loading} = authUser;
    return {loading};
};

export default connect(mapStateToProps, {
    signupUserInEmail,
})(Signup);

