/**
 * Sign Up
 */
import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {connect, useDispatch, useSelector} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {Col, Form, FormGroup} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles, createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {NotificationManager} from 'react-notifications';
import {FormControl, TextField, Divider, CircularProgress} from '@material-ui/core';
import PropTypes from 'prop-types';
import ConsentModal from "Routes/main/attempt/ConsentModal";
import * as Apis from 'Api';
import AppConfig from 'Constants/AppConfig';
import IntlMessages from "Util/IntlMessages";
import { login } from 'Actions';
import * as selectors from "Selectors";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

const RegisterForm = ({ onFinish}) => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => selectors.getIsLogin(state));
    const [state, setState] = useState({
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
        interestList: [],
        placeOfWorkList: [],
        countryList: [],
        showConsentModal: false,
        loading: true,
    })

    useEffect(() => {
        if (isLogin) {
            onFinish();
        }
        getData();
    }, []);

    const getData = () => {
        Promise.all([
            Apis.userPositions(),
            Apis.userPlaceOfWorks(),
            Apis.countryList(),
        ]).then(([positionList, placeOfWorkList, countryList]) => {
            setState({
                ...state,
                positionList,
                placeOfWorkList,
                countryList,
                loading: false,
            });
        }).catch(e => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    const validateEmail = (email) => {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    const validate = () => {
        const {email, password, confirmPassword, checkTerms} = state;
        let valid = true;
        let inValidObj = {};
        if (state.firstName.trim().length === 0) {
            valid = false;
            inValidObj.firstNameInvalid = true;
        }
        if (state.lastName.trim().length === 0) {
            valid = false;
            inValidObj.lastNameInvalid = true;
        }
        if (email.length === 0 || !validateEmail(email)) {
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
        if (state.country === undefined) {
            valid = false;
            inValidObj.countryInvalid = true;
        }
        if (state.postcode.trim().length === 0) {
            valid = false;
            inValidObj.postcodeInvalid = true;
        }
        if (state.employer.trim().length === 0) {
            valid = false;
            inValidObj.employerInvalid = true;
        }

        if (!checkTerms) {
            valid = false;
            inValidObj.checkTermsInvalid = true;
        }
        if (!valid) {
            setState({...state, ...inValidObj});
        }
        return valid;
    }

    const onSetValue = (key, value) => {
        setState({...state, [key]: value, [key + 'Invalid']: false});
    }

    /**
     * On User Signup
     */
    const onUserSignUp = () => {
        if (validate()) {
            setState({...state, loading: true});
            Apis.signUp({
                email: state.email,
                password: state.password,
                first_name: state.firstName,
                last_name: state.lastName,
                country: state.country,
                state: state.state,
                postcode: state.postcode,
                position: state.position,
                employer: state.employer,
                allow_contact_me: state.allowContactMe,
            }).then((resp) => {
                //success register
                NotificationManager.success(<IntlMessages id={"user.createSuccessful"}/>);
                return Apis.login(state.email, state.password);
            }).then((result) => {
                dispatch(login(result.userId, result.userName, result.userEmail, result.id, null, null, () => {
                    onFinish()
                }));
            }).catch((e) => {
                setState({...state, loading: false});
                NotificationManager.error(e.response ? e.response.data.error.message : e.message);
            });
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <div className="session-inner-wrapper pt-10" style={{width: 720}}>
            <div className="container">
                <div className="row row-eq-height">
                    <div className={"col-sm-12 col-md-12 col-lg-10"} style={{margin: 'auto'}}>
                        <div className="session-body text-center">
                            <div className="session-head mb-40">
                                <h1 className="font-weight-bold">{AppConfig.brandName} Sign up</h1>
                            </div>
                            <div className={'signup-form'}>
                                <FormGroup row className="has-wrapper">
                                    <Col sm={6}>
                                        <TextField
                                            id="first_name"
                                            value={state.firstName}
                                            onChange={(event) => onSetValue('firstName', event.target.value)}
                                            label={<IntlMessages id={"user.signup.firstName"}/>}
                                            className={'mb-10'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            error={state.firstNameInvalid}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <TextField
                                            id="last_name"
                                            value={state.lastName}
                                            onChange={(event) => onSetValue('lastName', event.target.value)}
                                            label={<IntlMessages id={"user.signup.lastName"}/>}
                                            className={'mb-10'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            error={state.lastNameInvalid}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="has-wrapper">
                                    <TextField
                                        id="email"
                                        type="email"
                                        value={state.email}
                                        onChange={(event) => onSetValue('email', event.target.value)}
                                        label={<IntlMessages id={"user.signup.email"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        error={state.emailInvalid}
                                    />
                                    <span className="has-icon mt-5"><i className="ti-email"/></span>
                                </FormGroup>

                                <FormGroup row className="has-wrapper">
                                    <Col sm={6}>
                                        <TextField
                                            id="password"
                                            type="password"
                                            value={state.password}
                                            onChange={(event) => onSetValue('password', event.target.value)}
                                            label={<IntlMessages id={"user.signup.password"}/>}
                                            className={'mb-10'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            error={state.passwordInvalid}
                                        />
                                        <span className="has-icon mt-5"><i className="ti-lock"/></span>
                                    </Col>
                                    <Col sm={6}>
                                        <TextField
                                            id="confirmPassword"
                                            type="password"
                                            value={state.confirmPassword}
                                            onChange={(event) => onSetValue('confirmPassword', event.target.value)}
                                            label={<IntlMessages id={"user.signup.confirmPassword"}/>}
                                            className={'mb-10'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            error={state.confirmPasswordInvalid}
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
                                        onChange={(e) => onSetValue('country', e.target.value)}
                                        value={state.country}
                                        error={state.countryInvalid}
                                    >
                                        <option style={{display: 'none'}}/>
                                        {
                                            state.countryList.map((v) => (
                                                <option value={v.country_name} key={v.id}>{v.country_name}</option>
                                            ))
                                        }
                                    </TextField>
                                </FormGroup>
                                <FormGroup row className="has-wrapper">
                                    <Col sm={6}>
                                        <TextField
                                            id="state"
                                            value={state.state}
                                            onChange={(event) => onSetValue('state', event.target.value)}
                                            label={<IntlMessages id={"user.signup.state"}/>}
                                            className={'mb-10'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            error={state.stateInvalid}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <TextField
                                            id="postcode"
                                            type="number"
                                            value={state.postcode}
                                            onChange={(event) => onSetValue('postcode', event.target.value)}
                                            label={<IntlMessages id={"user.signup.postcode"}/>}
                                            className={'mb-10'}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            error={state.postcodeInvalid}
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
                                        onChange={(e) => onSetValue('position', e.target.value)}
                                        value={state.position}
                                        error={state.positionInvalid}
                                    >
                                        <option style={{display: 'none'}}/>
                                        {
                                            state.positionList.map((v) => (
                                                <option value={v.id} key={v.id}>{v.name}</option>
                                            ))
                                        }
                                    </TextField>
                                </FormControl>
                                <FormGroup className={'has-wrapper'}>
                                    <TextField
                                        id="employer"
                                        value={state.employer}
                                        onChange={(event) => onSetValue('employer', event.target.value)}
                                        label={<IntlMessages id={"user.signup.institution"}/>}
                                        className={'mb-10'}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        error={state.employerInvalid}
                                    />
                                </FormGroup>
                                <div className={'d-flex justify-content-left'}>
                                    <FormControlLabel
                                        control={
                                            <GreenCheckbox
                                                checked={state.allowContactMe}
                                                onChange={(event) => onSetValue('allowContactMe', event.target.checked)}
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
                                                checked={state.checkTerms}
                                                onChange={(event) => onSetValue('checkTerms', event.target.checked)}
                                                style={state.checkTermsInvalid ? {color: 'red'} : {}}
                                                value=""
                                            />
                                        }
                                        label={
                                            <span>
                                <IntlMessages id={"user.signup.agreeTerm"}/>
                                <a href='https://detectedx.com/website-terms/' target="_blank"><IntlMessages id={"user.signup.term"}/></a>&nbsp;and&nbsp;
                                                <a href="https://detectedx.com/privacy-policy/" target="_blank"><IntlMessages id={"user.signup.consentStatements"}/></a>
                                                &nbsp;*
                            </span>
                                        }
                                    />
                                </div>
                                <FormGroup className="mb-15 mt-10">
                                    <Button
                                        disabled={state.loading}
                                        onClick={() => onUserSignUp()}
                                        className="btn-info text-white btn-block w-100"
                                        variant="contained"
                                        size="large"
                                    >
                                        {
                                            state.loading ? <CircularProgress size={24}/> : <IntlMessages id={"user.signup"}/>
                                        }
                                    </Button>
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConsentModal
                isOpen={state.showConsentModal}
                onClose={() => setState({...state, showConsentModal: false})}
            />
        </div>
        </ThemeProvider>
    );
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

RegisterForm.propTypes = {
 onFinish: PropTypes.func
}

RegisterForm.defaultProps = {
    onFinish: () => null
}

export default RegisterForm;

