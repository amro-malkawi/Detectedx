import React, {useState, useEffect} from 'react';
import {Input} from "reactstrap";
import {Button, FormControlLabel} from "@mui/material";
import {GreenCheckbox, markerSelectStyles} from 'Components/CustomMuiComponent';
import {NotificationManager} from "react-notifications";
import Select from "react-select/creatable";
import validator from "validator";
import * as Apis from "Api";

function SignupFormComponent({onComplete}) {
    const [firstName, setFirstName] = useState('');
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [lastName, setLastName] = useState('');
    const [errorLastName, setErrorLastName] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [country, setCountry] = useState('');
    const [errorCountry, setErrorCountry] = useState(false);
    const [state, setState] = useState('');
    const [postcode, setPostcode] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [errorJobTitle, setErrorJobTitle] = useState(false);
    const [institution, setInstitution] = useState(null);
    const [errorInstitution, setErrorInstitution] = useState(false);
    const [nameTitle, setNameTitle] = useState('');
    const [errorNameTitle, setErrorNameTitle] = useState(false);
    const [hasEnterpriseCode, setHasEnterpriseCode] = useState(false);
    const [allowContactMe, setAllowContactMe] = useState(true);
    const [checkTerms, setCheckTerms] = useState(false);
    const [errorCheckTerms, setErrorCheckTerms] = useState(false);
    const [positionList, setPositionList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [clinicList, setClinicList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Promise.all([
            Apis.userPositions(),
            Apis.userPlaceOfWorks(),
            Apis.countryList(),
            Apis.clinicList(),
            // Apis.userInterests(),
        ]).then(([positions, placeOfWorks, countries, clinics]) => {
            setPositionList(positions);
            // setPlaceOfWorkList(placeOfWorks);
            setCountryList(countries);
            setClinicList(clinics);
        }).catch(e => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    const checkValidate = () => {
        let valid = true;
        if (firstName.trim().length === 0) {
            valid = false;
            setErrorFirstName(true);
        }
        if (lastName.trim().length === 0) {
            valid = false;
            setErrorLastName(true);
        }
        if (email.length === 0 || !validator.isEmail(email)) {
            valid = false;
            setErrorEmail(true)
        }
        if (nameTitle.length === 0) {
            valid = false;
            setErrorNameTitle(true);
        }
        if (password.length === 0) {
            valid = false;
            setErrorPassword(true);
        }
        if (confirmPassword.length === 0 || confirmPassword !== password) {
            valid = false;
            setErrorConfirmPassword(true);
        }
        if (country === '') {
            valid = false;
            setErrorCountry(true);
        }
        if (jobTitle === '') {
            valid = false;
            setErrorJobTitle(true);
        }
        if (!institution) {
            valid = false;
            setErrorInstitution(true);
        }

        if (!checkTerms) {
            valid = false;
            setErrorCheckTerms(true);
        }
        return valid;
    }

    const onFinish = () => {
        if (!checkValidate()) return;
        Apis.userCheckEmail(email).then((resp) => {
            onComplete({
                first_name: firstName,
                last_name: lastName,
                email: email,
                title: nameTitle,
                password: password,
                phone: phone,
                // gender: this.state.gender,
                // place_of_work: this.state.placeOfWork,
                country: country,
                // address1: this.state.address1,
                // address2: this.state.address2,
                // suburb: this.state.suburb,
                state: state,
                postcode: postcode,
                position: jobTitle,
                employer: institution.value,
                allow_contact_me: allowContactMe,
            }, hasEnterpriseCode);
        }).catch((e) => {
            setErrorEmail(true);
            NotificationManager.error('Email already exist');
        });
    }

    return (
        <div className={'main-signup'}>
            <div className={'main-signup-content'} style={{width: 1100}}>
                <div>
                    <div className={'signup-title mb-4'}>DetectedX Sign Up</div>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-2 input-item'}>
                            <span>TITLE *</span>
                            <Input
                                type={'select'}
                                invalid={errorNameTitle}
                                value={nameTitle}
                                onChange={(e) => {
                                    setNameTitle(e.target.value);
                                    setErrorNameTitle(false)
                                }}
                            >
                                <option style={{display: 'none'}}/>
                                {
                                    ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'].map((v) => (
                                        <option value={v} key={v}>{v}</option>
                                    ))
                                }
                            </Input>
                        </div>
                        <div className={'col-sm-12 col-md-5 input-item'}>
                            <span>FIRST NAME *</span>
                            <Input
                                name={'firstname'}
                                type={'text'}
                                invalid={errorFirstName}
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    setErrorFirstName(false)
                                }}
                            />
                        </div>
                        <div className={'col-sm-12 col-md-5 input-item'}>
                            <span>LAST NAME *</span>
                            <Input
                                name={'lastname'}
                                type={'text'}
                                invalid={errorLastName}
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    setErrorLastName(false)
                                }}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>EMAIL *</span>
                            <Input
                                name={'new-email'}
                                type={'text'}
                                invalid={errorEmail}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorEmail(false)
                                }}
                            />
                        </div>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>PHONE</span>
                            <Input
                                name={'phone'}
                                type={'text'}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>PASSWORD *</span>
                            <Input
                                name={'new-pass'}
                                type={'password'}
                                autoComplete="new-password"
                                invalid={errorPassword}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorPassword(false)
                                }}
                            />
                        </div>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>CONFIRM PASSWORD *</span>
                            <Input
                                name={'confirm-pass'}
                                type={'password'}
                                invalid={errorConfirmPassword}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrorConfirmPassword(false)
                                }}
                            />
                        </div>
                    </div>
                    <div className={'input-item'}>
                        <span>COUNTRY *</span>
                        <Input
                            name={'country'}
                            type={'select'}
                            invalid={errorCountry}
                            value={country}
                            onChange={(e) => {
                                setCountry(e.target.value);
                                setErrorCountry(false)
                            }}
                        >
                            <option style={{display: 'none'}}/>
                            {
                                countryList.map((v) => (
                                    <option value={v.country_name} key={v.id}>{v.country_name}</option>
                                ))
                            }
                        </Input>
                    </div>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>STATE</span>
                            <Input
                                type={'text'}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </div>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>POSTCODE</span>
                            <Input
                                type={'text'}
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>JOB TITLE *</span>
                            <Input
                                type={'select'}
                                invalid={errorJobTitle}
                                value={jobTitle}
                                onChange={(e) => {
                                    setJobTitle(e.target.value);
                                    setErrorJobTitle(false)
                                }}
                            >
                                <option style={{display: 'none'}}/>
                                {
                                    positionList.map((v) => (
                                        <option value={v.id} key={v.id}>{v.name}</option>
                                    ))
                                }
                            </Input>
                        </div>
                        <div className={'col-sm-12 col-md-6 input-item'}>
                            <span>INSTITUTION *</span>
                            <Select
                                placeholder={''}
                                name="institution"
                                isClearable
                                isSearchable={true}
                                options={clinicList.map((v) => ({label: v.name, value: v.id}))}
                                value={institution}
                                styles={{
                                    control: styles => ({...styles, borderRadius: 7, borderColor: (errorInstitution ? 'red' : '#ced4da')}),
                                    singleValue: styles => ({...styles, paddingTop: 5}),
                                }}
                                onChange={(option) => {
                                    setInstitution(option);
                                    setErrorInstitution(false)
                                }}
                                defaultMenuIsOpen={false}
                            />
                            {/*<Input*/}
                            {/*    type={'text'}*/}
                            {/*    invalid={errorInstitution}*/}
                            {/*    value={institution}*/}
                            {/*    onChange={(e) => {setInstitution(e.target.value); setErrorInstitution(false)}}*/}
                            {/*/>*/}
                        </div>
                    </div>
                    <div className={'signup-checkbox'}>
                        <FormControlLabel
                            control={
                                <GreenCheckbox
                                    checked={hasEnterpriseCode}
                                    onChange={(e) => setHasEnterpriseCode(e.target.checked)}
                                    value=""
                                />
                            }
                            label={<span className={'signup-checkbox-label'}>I have enterprise code</span>}
                        />
                    </div>
                    {/*<div className={'signup-checkbox'}>*/}
                    {/*    <FormControlLabel*/}
                    {/*        control={*/}
                    {/*            <GreenCheckbox*/}
                    {/*                checked={allowContactMe}*/}
                    {/*                onChange={(e) => setAllowContactMe(e.target.checked )}*/}
                    {/*                value=""*/}
                    {/*            />*/}
                    {/*        }*/}
                    {/*        label={<span className={'signup-checkbox-label'}>I allow DetectedX to send me relevant marketing information about its products and services </span>}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className={'signup-checkbox'}>
                        <FormControlLabel
                            control={
                                <GreenCheckbox
                                    checked={checkTerms}
                                    onChange={(e) => {
                                        setCheckTerms(e.target.checked);
                                        setErrorCheckTerms(false)
                                    }}
                                    style={errorCheckTerms ? {color: 'red'} : {}}
                                    value=""
                                />
                            }
                            label={
                                <span className={'signup-checkbox-label'}>I have read and agree to the
                                <strong onClick={() => window.open('https://detectedx.com/website-terms/', "_self")}>terms and conditions</strong>
                                and
                                <strong onClick={() => window.open('https://detectedx.com/privacy-policy/', "_self")}>consent statements</strong>
                                *</span>
                            }
                        />
                    </div>
                    <div>
                        <Button className={'signup-submit'} onClick={onFinish}>
                            {/*{hasEnterpriseCode ? 'Register' : 'Proceed To Payment'}*/}
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupFormComponent