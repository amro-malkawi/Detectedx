/**
 * Sign Up With Firebase
 */
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {Col, Form, FormGroup, Input, Label} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from '@material-ui/core/styles';
import {NotificationManager} from 'react-notifications';
import {FormControl, InputLabel, Radio, RadioGroup, TextField, Divider, CircularProgress, Switch} from '@material-ui/core';
import * as Apis from 'Api';

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
    signupUserInEmail,
} from 'Actions';
import CreatableSelect from 'react-select/creatable';
import IntlMessages from "Util/IntlMessages";
import LanguageProvider from "Components/Header/LanguageProvider";

class Signup extends Component {

    state = {
        formType: 'email1',
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
        gender: '',
        genderInvalid: false,
        title: '',
        titleInvalid: false,
        // yearOfBirth: '',
        // yearOfBirthInvalid: false,
        placeOfWork: null,
        placeOfWorkInvalid: false,
        position: undefined,
        positionInvalid: false,
        country: undefined,
        countryInvalid: false,
        address1: '',
        address1Invalid: false,
        address2: '',
        address2Invalid: false,
        suburb: '',
        suburbInvalid: false,
        state: '',
        stateInvalid: false,
        postcode: '',
        postcodeInvalid: false,
        employer: '',
        employerInvalid: false,
        jobTitle: '',
        jobTitleInvalid: false,
        hearFromWhere: null,
        hearFromWhereInvalid: false,
        hearFromOtherText: '',
        hearFromOtherTextInvalid: false,
        extraInfo: '',
        extraInfoInvalid: false,
        allowContactMe: false,
        checkTerms: false,
        termInvalid: false,

        // interest: null,
        // interestInvalid: false,
        // referrerBy: '',
        // referrerByInvalid: false,

        positionList: [],
        interestList: [],
        placeOfWorkList: [],
        countryList: [],
        loading: true,

    };

    componentDidMount() {
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
                // interestList,
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
        if(!checkTerms) {
            valid = false;
            NotificationManager.error("You have to agree terms and conditions");
        }
        if (!valid) {
            this.setState(inValidObj);
        }
        return valid;
    }

    validateInfo() {
        let valid = true;
        let invalidObj = {};
        if (this.state.firstName.trim().length === 0) {
            valid = false;
            invalidObj.firstNameInvalid = true;
        }
        if (this.state.lastName.trim().length === 0) {
            valid = false;
            invalidObj.lastNameInvalid = true;
        }
        // if(this.state.placeOfWork === null) {
        //     valid = false;
        //     invalidObj.placeOfWorkInvalid = true;
        // }
        if(this.state.title.trim().length === 0) {
            valid = false;
            invalidObj.titleInvalid = true;
        }
        if(this.state.position === undefined) {
            valid = false;
            invalidObj.positionInvalid = true;
        }
        if(this.state.country === undefined) {
            valid = false;
            invalidObj.countryInvalid = true;
        }
        if(this.state.address1.trim().length === 0) {
            valid = false;
            invalidObj.address1Invalid = true;
        }
        if(this.state.suburb.trim().length === 0) {
            valid = false;
            invalidObj.suburbInvalid = true;
        }
        if(this.state.postcode.trim().length === 0) {
            valid = false;
            invalidObj.postcodeInvalid = true;
        }
        if(this.state.employer.trim().length === 0) {
            valid = false;
            invalidObj.employerInvalid = true;
        }
        // if(this.state.jobTitle.trim().length === 0) {
        //     valid = false;
        //     invalidObj.jobTitleInvalid = true
        // }
        if(this.state.hearFromWhere === null) {
            valid = false;
            invalidObj.hearFromWhereInvalid = true;
        }
        if(this.state.hearFromWhere === 'Other-Specify' && this.state.hearFromOtherText.trim().length === 0) {
            valid = false;
            invalidObj.hearFromOtherTextInvalid = true;
        }
        if (!valid) {
            this.setState(invalidObj);
        }
        console.log(invalidObj, valid);
        return valid;
    }
    onSetValue(key, value) {
        this.setState({[key]: value, [key + 'Invalid']: false});
    }

    onChangeSelectData(key, data) {
        if (data === null) {
            this.onSetValue(key, '');
        } else if (typeof data === 'object' && !Array.isArray(data)) {
            this.onSetValue(key, data.value);
        } else if (typeof data === 'object' && Array.isArray(data)) {
            this.onSetValue(key, data.map((v) => v.value).join(','));
        }
    }

    onNextForm() {
        if(this.validate()) {
            console.log('asdfasdfasdf');
            this.setState({formType: 'info'});
        }
    }

    /**
     * On User Signup
     */
    onUserSignUp() {
        if (this.validateInfo()) {
            this.setState({loading: true});
            this.props.signupUserInEmail({
                email: this.state.email,
                password: this.state.password,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                gender: this.state.gender,
                title: this.state.title,
                // place_of_work: this.state.placeOfWork,
                position: this.state.position,
                country: this.state.country,
                address1: this.state.address1,
                address2: this.state.address2,
                suburb: this.state.suburb,
                state: this.state.state,
                postcode: this.state.postcode,
                employer: this.state.employer,
                // job_title: this.state.jobTitle,
                hear_from_where: this.state.hearFromWhere,
                hear_from_other_text: this.state.hearFromOtherText,
                extra_info: this.state.extraInfo,
                allow_contact_me: this.state.allowContactMe,
            }, this.props.history).then((result) => {
                NotificationManager.success(<IntlMessages id={"user.createSuccessful"}/>);
                this.props.history.push('/users/send-email/' + result.id);
            }).catch((error) => {
                this.setState({loading: false});
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    renderMainForm() {
        return (
            <Form className={'signup-form'}>
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

                <FormGroup className="has-wrapper">
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
                </FormGroup>
                <FormGroup className="has-wrapper mb-5">
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
                        label={<span><IntlMessages id={"user.signup.agreeTerm"}/><Link to='/terms'><IntlMessages id={"user.signup.term"}/></Link></span>}
                    />
                </div>
                <FormGroup className="mb-15 mt-10">
                    <Button
                        disabled={this.state.loading}
                        onClick={() => this.onNextForm()}
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
            </Form>
        )
    }

    renderInfoForm() {
        // const placeOfWorkOptions = this.state.placeOfWorkList.map(v => ({value: v.id, label: v.name}));
        // const placeOfWorkDefault = this.state.placeOfWork === null ? [] : placeOfWorkOptions.filter((v) => this.state.placeOfWork.split(',').indexOf(v.value.toString()) !== -1);
        // const interestOptions = this.state.interestList.map(v => ({value: v.id, label: v.name}));
        // const interestDefault = this.state.interest === null ? [] : interestOptions.filter((v) => this.state.interest.split(',').indexOf(v.value.toString()) !== -1);
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

                <FormGroup row className="has-wrapper">
                    <Col sm={6}>
                        <FormGroup row className={'mb-0'}>
                            <Label style={{padding: '12px 25px 0px 13px', fontSize: 16}}><IntlMessages id={"profile.gender"}/>: </Label>
                            <RadioGroup
                                aria-label="gender"
                                name="gender"
                                value={this.state.gender}
                                onChange={(event) => this.onSetValue('gender', event.target.value)}
                                row
                            >
                                <FormControlLabel
                                    value={''}
                                    control={<Radio/>}
                                    label={<IntlMessages id={"profile.position.notSpecified"}/>}
                                />
                                <FormControlLabel
                                    value={'female'}
                                    control={<Radio/>}
                                    label={<IntlMessages id={"profile.position.female"}/>}
                                />
                                <FormControlLabel
                                    value={'male'}
                                    control={<Radio/>}
                                    label={<IntlMessages id={"profile.position.male"}/>}
                                />
                            </RadioGroup>
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <TextField
                            id="title"
                            select
                            label={<IntlMessages id={"user.signup.title"}/>}
                            SelectProps={{ native: true}}
                            variant="outlined"
                            className={'mb-10'}
                            margin="dense"
                            fullWidth
                            onChange={(e) => this.onSetValue('title', e.target.value)}
                            value={this.state.title}
                            error={this.state.titleInvalid}
                        >
                            <option style={{display: 'none'}} />
                            <option value={'Dr'}>Dr</option>
                            <option value={'Prof'}>Prof</option>
                            <option value={'Mr'}>Mr</option>
                            <option value={'Mrs'}>Mrs</option>
                            <option value={'Miss'}>Miss</option>
                            <option value={'Ms'}>Ms</option>
                        </TextField>
                    </Col>
                </FormGroup>
                <FormControl variant="outlined" fullWidth style={{paddingTop: 8}}>
                    <TextField
                        id="position"
                        select
                        label={<IntlMessages id={"user.signup.jobTitle"}/>}
                        SelectProps={{ native: true}}
                        variant="outlined"
                        className={'mb-10'}
                        margin="dense"
                        fullWidth
                        onChange={(e) => this.onSetValue('position', e.target.value)}
                        value={this.state.position}
                        error={this.state.positionInvalid}
                    >
                        <option style={{display: 'none'}} />
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
                        label={<IntlMessages id={"user.signup.employer"}/>}
                        className={'mb-10'}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={this.state.employerInvalid}
                    />
                </FormGroup>
               {/* <FormControl variant="outlined" fullWidth style={{paddingTop: 8}}>
                    <CustomInputLabel
                        htmlFor="placeOfWork"
                        shrink
                    >
                        Place of work *
                    </CustomInputLabel>
                    <CreatableSelect
                        id={'placeOfWork'}
                        defaultValue={placeOfWorkDefault}
                        // value={[]}
                        placeholder={'Select place of work'}
                        options={placeOfWorkOptions}
                        onChange={(data) => this.onChangeSelectData('placeOfWork', data)}
                        isMulti
                        styles={selectStyles}
                    />
                </FormControl>*/}
                <Divider variant="middle" className={'mt-20 mb-20'}/>
                <FormGroup row className="has-wrapper">
                    <Col sm={3}>
                        <TextField
                            id="country"
                            select
                            label={<IntlMessages id={"user.signup.country"}/>}
                            SelectProps={{ native: true}}
                            variant="outlined"
                            className={'mb-10'}
                            margin="dense"
                            fullWidth
                            onChange={(e) => this.onSetValue('country', e.target.value)}
                            value={this.state.country}
                            error={this.state.countryInvalid}
                        >
                            <option style={{display: 'none'}} />
                            {
                                this.state.countryList.map((v) => (
                                    <option value={v.country_name} key={v.id}>{v.country_name}</option>
                                ))
                            }
                        </TextField>
                    </Col>
                    <Col sm={9}>
                        <TextField
                            id="address1"
                            value={this.state.address1}
                            onChange={(event) => this.onSetValue('address1', event.target.value)}
                            label={<IntlMessages id={"user.signup.address1"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.address1Invalid}
                        />
                    </Col>
                </FormGroup>
                <FormGroup className="has-wrapper">
                        <TextField
                            id="address2"
                            value={this.state.address2}
                            onChange={(event) => this.onSetValue('address2', event.target.value)}
                            label={<IntlMessages id={"user.signup.address2"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.address2Invalid}
                        />
                </FormGroup>
                <FormGroup row className="has-wrapper">
                    <Col sm={4}>
                        <TextField
                            id="suburb"
                            value={this.state.suburb}
                            onChange={(event) => this.onSetValue('suburb', event.target.value)}
                            label={<IntlMessages id={"user.signup.suburb"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.suburbInvalid}
                        />
                    </Col>
                    <Col sm={4}>
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
                    <Col sm={4}>
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
                <Divider variant="middle" className={'mt-20 mb-20'}/>
                <FormGroup className={'has-wrapper'}>
                    <TextField
                        id="extraInfo"
                        value={this.state.extraInfo}
                        onChange={(event) => this.onSetValue('extraInfo', event.target.value)}
                        label={<IntlMessages id={"user.signup.professionalAssoc"}/>}
                        className={'mb-10'}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        error={this.state.extraInfoInvalid}
                    />
                </FormGroup>
                <FormGroup className={'has-wrapper'}>
                    <TextField
                        id="hearFromWhere"
                        select
                        label={<IntlMessages id={"user.signup.howDidHear"}/>}
                        SelectProps={{ native: true}}
                        variant="outlined"
                        className={'mb-10'}
                        margin="dense"
                        fullWidth
                        onChange={(e) => this.onSetValue('hearFromWhere', e.target.value)}
                        value={this.state.hearFromWhere}
                        error={this.state.hearFromWhereInvalid}
                    >
                        <option style={{display: 'none'}} />
                        <option value={'GE Healthcare'}>GE Healthcare</option>
                        <option value={'Volpara'}>Volpara</option>
                        <option value={'Social media'}>Social media</option>
                        <option value={'News media'}>News media</option>
                        <option value={'Word of mouth'}>Word of mouth</option>
                        <option value={'World Continuing Education Alliance'}>World Continuing Education Alliance</option>
                        <option value={'Other-Specify'}>Other-Specify</option>
                    </TextField>
                </FormGroup>
                {
                    this.state.hearFromWhere === 'Other-Specify' &&
                    <FormGroup className={'has-wrapper'}>
                        <TextField
                            id="hearFromOtherText"
                            value={this.state.hearFromOtherText}
                            onChange={(event) => this.onSetValue('hearFromOtherText', event.target.value)}
                            label={<IntlMessages id={"user.signup.whereDidHear"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            error={this.state.hearFromOtherTextInvalid}
                        />
                    </FormGroup>
                }
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
                <FormGroup className="mb-15 mt-10">
                    <Button
                        disabled={this.state.loading}
                        // type={'submit'}
                        className="btn-info text-white btn-block w-100"
                        variant="contained"
                        size="large"
                        onClick={() => this.onUserSignUp()}
                    >
                        {
                            this.state.loading ? <CircularProgress size={24}/> : <IntlMessages id={"user.signup.confirm"}/>
                        }
                    </Button>
                </FormGroup>
                <div className={'social-icons mt-30'}>
                    <span className={'mr-20'}><IntlMessages id={"user.signup.connectLinkedin"}/></span>
                    {/*<a href="https://twitter.com/detected_x" target="_blank">*/}
                    {/*    <div className="twitter-icon"/>*/}
                    {/*</a>*/}
                    <a href="https://www.linkedin.com/company/detected-x" target="_blank">
                        <div className="linkedin-icon"/>
                    </a>
                    {/*<a href="https://www.facebook.com/DetectEDX1" target="_blank">*/}
                    {/*    <div className="facebook-icon"/>*/}
                    {/*</a>*/}
                    {/*<a href="https://www.instagram.com/detected.x" target="_blank">*/}
                    {/*    <div className="instagram-icon"/>*/}
                    {/*</a>*/}
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
                                        <Link to="/">
                                            <img src={AppConfig.appLogo} alt="session-logo" width="209" height="44"/>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/signin" className="mr-15 text-white">Already have an account?</Link>
                                        <Button
                                            component={Link}
                                            to="/signin"
                                            variant="contained"
                                            className="btn-light mr-10"
                                        >
                                            Sign In
                                        </Button>
                                        <LanguageProvider />
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper pt-10" >
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className={this.state.formType === 'email' ? "col-sm-12 col-md-8 col-lg-7 mt-70" : "col-sm-12 col-md-12 col-lg-12"} style={{margin: 'auto'}}>
                                    <div className="session-body text-center">
                                        <div className="session-head mb-40">
                                            {
                                                this.state.formType === 'email' ?
                                                    <h1 className="font-weight-bold">{AppConfig.brandName} Sign up</h1> :
                                                    <h1 className="font-weight-bold">User Information</h1>
                                            }
                                        </div>
                                        {
                                            this.state.formType === 'email' ?
                                            this.renderMainForm() : this.renderInfoForm()
                                        }
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

const selectStyles = {
    container: styles => ({...styles, marginBottom: 10}),
    control: styles => ({...styles, padding: 0}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        return {
            ...styles,
            textAlign: 'left'
        };
    },
    menu: styles => ({...styles, zIndex: 5}),
};


const CustomInputLabel = withStyles(theme => ({
    shrink: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingLeft: 2,
        paddingRight: 2,
    }
}))(InputLabel);


const IOSSwitch = withStyles(theme => ({
    colorSwitchBase: {
        color: '#BA68C8',
        '&$colorChecked': {
            color: '#9C27B0',
            '& + $colorBar': {
                backgroundColor: '#9C27B0',
            },
        },
    },
    colorBar: {},
    colorChecked: {},
    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: '#52d869',
            },
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    iOSChecked: {
        transform: 'translateX(15px)',
        '& + $iOSBar': {
            opacity: 1,
            border: 'none',
        },
    },
    iOSBar: {
        borderRadius: 13,
        width: 42,
        height: 26,
        marginTop: -13,
        marginLeft: -21,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    iOSIcon: {
        width: 24,
        height: 24,
    },
    iOSIconChecked: {
        boxShadow: theme.shadows[1],
    },
}))(({classes, ...props}) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                switchBase: classes.iOSSwitchBase,
                bar: classes.iOSBar,
                icon: classes.iOSIcon,
                iconChecked: classes.iOSIconChecked,
                checked: classes.iOSChecked,
            }}
            {...props}
        />
    );
});

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

