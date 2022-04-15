/**
 * Sign Up
 */
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link, NavLink} from 'react-router-dom';
import {Col, Form, FormGroup, Input, Label} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from '@material-ui/core/styles';
import {NotificationManager} from 'react-notifications';
import {FormControl, InputLabel, Radio, RadioGroup, TextField, Divider, CircularProgress, Switch} from '@material-ui/core';
import ConsentModal from "Routes/test/attempt/ConsentModal";
import * as Apis from 'Api';
import AppConfig from 'Constants/AppConfig';
import { login } from 'Actions';
import IntlMessages from "Util/IntlMessages";
import * as selectors from "Selectors";

class Signup extends Component {

    state = {
        formType: 'email',
        email: '',
        emailInvalid: false,
        password: '',
        passwordInvalid: false,
        confirmPassword: '',
        confirmPasswordInvalid: false,

        firstName: '',
        firstNameInvalid: false,
        lastName: '',
        lastNameInvalid: false,
        position: undefined,
        positionInvalid: false,
        country: undefined,
        countryInvalid: false,
        state: '',
        stateInvalid: false,
        postcode: '',
        postcodeInvalid: false,
        employer: '',
        employerInvalid: false,
        allowContactMe: false,
        checkTerms: false,
        checkTermsInvalid: false,

        positionList: [],
        placeOfWorkList: [],
        countryList: [],
        showConsentModal: false,
        loading: true,
    };

    componentDidMount() {
        if (this.props.isLogin) {
            this.props.history.push('/');
        }
        this.getData();
    }

    getData() {
        Promise.all([
            Apis.userPositions(),
            Apis.userPlaceOfWorks(),
            Apis.countryList(),
            // Apis.userInterests(),
        ]).then(([positionList, placeOfWorkList, countryList]) => {
            this.setState({
                positionList,
                placeOfWorkList,
                countryList,
                loading: false,
            });
        }).catch(e => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    validate() {
        const {email, password, confirmPassword, checkTerms} = this.state;
        let valid = true;
        let inValidObj = {};
        if (this.state.firstName.trim().length === 0) {
            valid = false;
            inValidObj.firstNameInvalid = true;
        }
        if (this.state.lastName.trim().length === 0) {
            valid = false;
            inValidObj.lastNameInvalid = true;
        }
        if (email.length === 0 || !this.validateEmail(email)) {
            valid = false;
            inValidObj.emailInvalid = true;
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
        if (this.state.country === undefined) {
            valid = false;
            inValidObj.countryInvalid = true;
        }
        if (this.state.postcode.trim().length === 0) {
            valid = false;
            inValidObj.postcodeInvalid = true;
        }
        if(this.state.position === undefined) {
            valid = false;
            inValidObj.positionInvalid = true;
        }
        if(this.state.employer.trim().length === 0) {
            valid = false;
            inValidObj.employerInvalid = true;
        }

        if (!checkTerms) {
            valid = false;
            inValidObj.checkTermsInvalid = true;
        }
        if (!valid) {
            this.setState(inValidObj);
        }
        return valid;
    }

    onSetValue(key, value) {
        this.setState({[key]: value, [key + 'Invalid']: false});
    }

    /**
     * On User Signup
     */
    onUserSignUp() {
        if (this.validate()) {
            this.setState({loading: true});
            Apis.singUp({
                email: this.state.email,
                password: this.state.password,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                country: this.state.country,
                state: this.state.state,
                postcode: this.state.postcode,
                position: this.state.position,
                employer: this.state.employer,
                allow_contact_me: this.state.allowContactMe,
            }).then((resp) => {
                //success register
                return Apis.login(this.state.email, this.state.password);
            }).then((result) => {
                this.props.login(result.userId, result.userName, result.userEmail, result.id, () => {
                    this.props.history.push('/')
                });
            }).catch((e) => {
                this.setState({loading: false});
                NotificationManager.error(e.response ? e.response.data.error.message : e.message);
            });


            // this.props.signupUserInEmail({
            //     email: this.state.email,
            //     password: this.state.password,
            //     first_name: this.state.firstName,
            //     last_name: this.state.lastName,
            //     country: this.state.country,
            //     state: this.state.state,
            //     postcode: this.state.postcode,
            //     position: this.state.position,
            //     employer: this.state.employer,
            //     allow_contact_me: this.state.allowContactMe,
            // }, this.props.history).then((result) => {
            //     NotificationManager.success(<IntlMessages id={"user.createSuccessful"}/>);
            //     this.props.signinUserInEmail(this.state, this.props.history);
            // }).catch((error) => {
            //     this.setState({loading: false});
            //     NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            // });
        }
    }

    renderMainForm() {
        return (
            <Form className={'signup-form'}>
                <FormGroup row className="has-wrapper">
                    <Col sm={6}>
                        <TextField
                            id="first_name"
                            value={this.state.firstName}
                            onChange={(event) => this.onSetValue('firstName', event.target.value)}
                            label={<IntlMessages id={"user.signup.firstName"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.firstNameInvalid}
                        />
                    </Col>
                    <Col sm={6}>
                        <TextField
                            id="last_name"
                            value={this.state.lastName}
                            onChange={(event) => this.onSetValue('lastName', event.target.value)}
                            label={<IntlMessages id={"user.signup.lastName"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.lastNameInvalid}
                        />
                    </Col>
                </FormGroup>
                <FormGroup className="has-wrapper">
                    <TextField
                        id="email"
                        type="email"
                        value={this.state.email}
                        onChange={(event) => this.onSetValue('email', event.target.value)}
                        label={<IntlMessages id={"user.signup.email"}/>}
                        className={'mb-10'}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={this.state.emailInvalid}
                    />
                    <span className="has-icon mt-5"><i className="ti-email"/></span>
                </FormGroup>

                <FormGroup row className="has-wrapper">
                    <Col sm={6}>
                        <TextField
                            id="password"
                            type="password"
                            value={this.state.password}
                            onChange={(event) => this.onSetValue('password', event.target.value)}
                            label={<IntlMessages id={"user.signup.password"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.passwordInvalid}
                        />
                        <span className="has-icon mt-5"><i className="ti-lock"/></span>
                    </Col>
                    <Col sm={6}>
                        <TextField
                            id="confirmPassword"
                            type="password"
                            value={this.state.confirmPassword}
                            onChange={(event) => this.onSetValue('confirmPassword', event.target.value)}
                            label={<IntlMessages id={"user.signup.confirmPassword"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.confirmPasswordInvalid}
                        />
                        <span className="has-icon mt-5"><i className="ti-lock"/></span>
                    </Col>
                </FormGroup>

                <FormGroup className={"has-wrapper"}>
                    <TextField
                        id="country"
                        select
                        label={<IntlMessages id={"user.signup.country"}/>}
                        SelectProps={{native: true}}
                        variant="outlined"
                        className={'mb-10'}
                        margin="dense"
                        fullWidth
                        onChange={(e) => this.onSetValue('country', e.target.value)}
                        value={this.state.country}
                        error={this.state.countryInvalid}
                    >
                        <option style={{display: 'none'}}/>
                        {
                            this.state.countryList.map((v) => (
                                <option value={v.country_name} key={v.id}>{v.country_name}</option>
                            ))
                        }
                    </TextField>
                </FormGroup>
                <FormGroup row className="has-wrapper">
                    <Col sm={6}>
                        <TextField
                            id="state"
                            value={this.state.state}
                            onChange={(event) => this.onSetValue('state', event.target.value)}
                            label={<IntlMessages id={"user.signup.state"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.stateInvalid}
                        />
                    </Col>
                    <Col sm={6}>
                        <TextField
                            id="postcode"
                            type="number"
                            value={this.state.postcode}
                            onChange={(event) => this.onSetValue('postcode', event.target.value)}
                            label={<IntlMessages id={"user.signup.postcode"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.postcodeInvalid}
                        />
                    </Col>
                </FormGroup>
                <Divider variant="middle" className={'mt-5 mb-5'}/>
                <FormControl variant="outlined" fullWidth style={{paddingTop: 8}}>
                    <TextField
                        id="position"
                        select
                        label={<IntlMessages id={"user.signup.jobTitle"}/>}
                        SelectProps={{native: true}}
                        variant="outlined"
                        className={'mb-10'}
                        margin="dense"
                        fullWidth
                        onChange={(e) => this.onSetValue('position', e.target.value)}
                        value={this.state.position}
                        error={this.state.positionInvalid}
                    >
                        <option style={{display: 'none'}}/>
                        {
                            this.state.positionList.map((v) => (
                                <option value={v.id} key={v.id}>{v.name}</option>
                            ))
                        }
                    </TextField>
                </FormControl>
                <FormGroup className={'has-wrapper'}>
                    <TextField
                        id="employer"
                        value={this.state.employer}
                        onChange={(event) => this.onSetValue('employer', event.target.value)}
                        label={<IntlMessages id={"user.signup.institution"}/>}
                        className={'mb-10'}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={this.state.employerInvalid}
                    />
                </FormGroup>
                <div className={'d-flex justify-content-left'}>
                    <FormControlLabel
                        control={
                            <GreenCheckbox
                                checked={this.state.allowContactMe}
                                onChange={(event) => this.onSetValue('allowContactMe', event.target.checked)}
                                value=""
                            />
                        }
                        label={<span><IntlMessages id={"user.signup.allowService"} values={{detectedx: <strong>DetectED-X</strong>}}/></span>}
                    />
                </div>

                <Divider variant="middle" className={'mt-5 mb-5'}/>

                <div className={'d-flex justify-content-left'}>
                    <FormControlLabel
                        control={
                            <GreenCheckbox
                                checked={this.state.checkTerms}
                                onChange={(event) => this.onSetValue('checkTerms', event.target.checked)}
                                style={this.state.checkTermsInvalid ? {color: 'red'} : {} }
                                value=""
                            />
                        }
                        label={
                            <span>
                                <IntlMessages id={"user.signup.agreeTerm"}/>
                                <Link to='/terms' target="_blank"><IntlMessages id={"user.signup.term"}/></Link>&nbsp;and&nbsp;
                                <Link to="#" onClick={() => this.setState({showConsentModal: true})}><IntlMessages id={"user.signup.consentStatements"}/></Link>
                                &nbsp;*
                            </span>
                        }
                    />
                </div>
                <FormGroup className="mb-15 mt-10">
                    <Button
                        disabled={this.state.loading}
                        onClick={() => this.onUserSignUp()}
                        // type={'submit'}
                        className="btn-info text-white btn-block w-100"
                        variant="contained"
                        size="large"
                    >
                        {
                            this.state.loading ? <CircularProgress size={24}/> : <IntlMessages id={"user.signup"}/>
                        }
                    </Button>
                </FormGroup>
                <div className={'social-icons mt-30'}>
                    <span className={'mr-20'}><IntlMessages id={"user.signup.connectLinkedin"}/></span>
                    <a href="https://www.linkedin.com/company/detected-x" target="_blank">
                        <div className="linkedin-icon"/>
                    </a>
                </div>
            </Form>
        )
    }

    render() {
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
                                        <a href="https://www.detectedx.com">
                                            <img src={AppConfig.appLogo} alt="session-logo" width="120" height="29"/>
                                        </a>
                                    </div>
                                    <div>
                                        <Button
                                            component={Link}
                                            to="/signin"
                                            variant="contained"
                                            className="btn-light mr-10"
                                        >
                                            <IntlMessages id={"user.signin"}/>
                                        </Button>
                                        {/*<LanguageProvider />*/}
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper pt-10">
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className={"col-sm-12 col-md-12 col-lg-10"} style={{margin: 'auto'}}>
                                    <div className="session-body text-center">
                                        <div className="session-head mb-40">
                                            <h1 className="font-weight-bold">{AppConfig.brandName} Sign up</h1>
                                        </div>
                                        {this.renderMainForm()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ConsentModal
                    isOpen={this.state.showConsentModal}
                    onClose={() => this.setState({showConsentModal: false})}
                />
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
    return {loading, isLogin: selectors.getIsLogin(null)};
};

export default connect(mapStateToProps, {
    login,
})(Signup);

