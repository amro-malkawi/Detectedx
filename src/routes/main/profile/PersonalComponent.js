import React, {useState, useEffect} from 'react'
import {Input} from "reactstrap";
import {Button, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {Scrollbars} from "react-custom-scrollbars";
import classNames from 'classnames';
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import TestSetItem from "Routes/main/home/TestSetItem";
import ScrollContainer from './ScrollContainer';
import {NotificationManager} from "react-notifications";
import validator from "validator";
import * as Apis from "Api";


function PersonalComponent() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [lastName, setLastName] = useState('');
    const [errorLastName, setErrorLastName] = useState(false);
    const [gender, setGender] = useState(null);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [postcode, setPostcode] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [errorJobTitle, setErrorJobTitle] = useState(false);
    const [institution, setInstitution] = useState('');
    const [errorInstitution, setErrorInstitution] = useState(false);

    const [recentTestSetList, setRecentTestSetList] = useState([]);

    const [countryList, setCountryList] = useState([]);
    const [positionList, setPositionList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Promise.all([
            Apis.userInfo(),
            Apis.countryList(),
            Apis.userPositions(),
            Apis.testSetRecentlyCompleted(),
        ]).then(([info, countries, positions, recentlyCompetedTestSet]) => {
            setEmail(info.email);
            setFirstName(info.first_name);
            setLastName(info.last_name);
            setGender(info.gender);
            setCountry(info.country);
            setState(info.state);
            setPostcode(info.postcode);
            setJobTitle(info.position);
            setInstitution(info.employer);
            setRecentTestSetList(recentlyCompetedTestSet);
            setCountryList(countries);
            setPositionList(positions);
        });
    }

    const checkValidation = () => {
        let valid = true;
        if (!firstName || firstName.trim().length === 0) {
            valid = false;
            setErrorFirstName(true);
        }
        if (!lastName || lastName.trim().length === 0) {
            valid = false;
            setErrorLastName(true);
        }
        if (email.length === 0 || !validator.isEmail(email)) {
            valid = false;
            setErrorEmail(true)
        }
        if (!jobTitle || jobTitle === '') {
            valid = false;
            setErrorJobTitle(true);
        }
        if (!institution || institution.trim().length === 0) {
            valid = false;
            setErrorInstitution(true);
        }
        return valid;
    }

    const onSave = () => {
        if (!checkValidation()) return;
        Apis.userUpdate({
            // email: email,
            first_name: firstName,
            last_name: lastName,
            gender,
            country,
            state: state,
            postcode: postcode,
            position: jobTitle,
            employer: institution,
        }).then(resp => {
            NotificationManager.success("User information was updated");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {

        })
    }

    const onGoAttempt = (id) => {
        if (id) history.push('/main/attempt/' + id + '/score')
    }

    return (
        <div className={'profile-content flex-row'}>
            <div className={'personal-content'}>
                <ScrollContainer
                    className="personal-item-list"
                    style={{marginBottom: 1}}
                    autoHide
                    autoHideDuration={100}
                >
                    <div className={classNames('personal-item', {'error': errorEmail})}>
                        <span>Email *</span>
                        <Input
                            type={'email'}
                            value={email}
                            disabled
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrorEmail(false)
                            }}
                        />
                    </div>
                    <div className={classNames('personal-item', {'error': errorFirstName})}>
                        <span>First Name *</span>
                        <Input
                            type={'text'}
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                setErrorFirstName(false)
                            }}
                        />
                    </div>
                    <div className={classNames('personal-item', {'error': errorLastName})}>
                        <span>Last Name *</span>
                        <Input
                            type={'text'}
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setErrorLastName(false)
                            }}
                        />
                    </div>
                    <div className={'personal-item'}>
                        <span>GENDER</span>
                        <RadioGroup
                            row defaultValue={''}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <FormControlLabel
                                value={''}
                                control={<Radio color={'primary'}/>}
                                label={'NOT SPECIFIED'}
                            />
                            <FormControlLabel
                                value={'male'}
                                control={<Radio color={'primary'}/>}
                                label={'FEMALE'}
                            />
                            <FormControlLabel
                                value={'female'}
                                control={<Radio color={'primary'}/>}
                                label={'MALE'}
                            />
                        </RadioGroup>
                    </div>
                    <div className={'personal-item'}>
                        <span>Country *</span>
                        <Input
                            type={'select'}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option style={{display: 'none'}}/>
                            {
                                countryList.map((v) => (
                                    <option value={v.country_name} key={v.id}>{v.country_name}</option>
                                ))
                            }
                        </Input>
                    </div>
                    <div className={'personal-item'}>
                        <span>State</span>
                        <Input
                            type={'text'}
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                    <div className={'personal-item'}>
                        <span>Postcode</span>
                        <Input
                            type={'text'}
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                        />
                    </div>

                    <div className={classNames('personal-item', {'error': errorJobTitle})}>
                        <span>Job Title *</span>
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
                    <div className={classNames('personal-item', {'error': errorInstitution})}>
                        <span>Institution *</span>
                        <Input
                            type={'text'}
                            value={institution}
                            onChange={(e) => {
                                setInstitution(e.target.value);
                                setErrorInstitution(false)
                            }}
                        />
                    </div>
                    <div className={'d-flex flex-row mt-50'}>
                        <Button className={'profile-save-btn'} onClick={onSave}>Save Information</Button>
                    </div>
                </ScrollContainer>
            </div>
            <div className={'completed-list'}>
                <span className={'fs-15 text-primary1 mb-3'}>RECENTLY COMPLETED</span>
                <ScrollContainer
                    style={{marginBottom: 1}}
                    autoHide
                    autoHideDuration={100}
                >
                    <div className="personal-completed-test">
                        {
                            recentTestSetList.map((v) => (
                                <TestSetItem smallSize data={v} onClick={() => onGoAttempt(v.lastAttemptId)}/>
                            ))
                        }
                    </div>
                </ScrollContainer>
            </div>
        </div>
    )
}

export default PersonalComponent