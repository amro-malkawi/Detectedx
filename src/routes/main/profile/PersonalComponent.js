import React, {useState, useEffect} from 'react'
import {Input} from "reactstrap";
import {Button, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {Scrollbars} from "react-custom-scrollbars";
import classNames from 'classnames';
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import TestSetItem from "Routes/main/home/TestSetItem";
import * as Apis from "Api";
import {NotificationManager} from "react-notifications";

function PersonalComponent() {
    const history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [lastName, setLastName] = useState('');
    const [errorLastName, setErrorLastName] = useState(false);
    const [gender, setGender] = useState(null);
    const [birthday, setBirthday] = useState();
    const [country, setCountry] = useState('');
    const [recentTestSetList, setRecentTestSetList] = useState([]);

    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Promise.all([
            Apis.userInfo(),
            Apis.countryList(),
            Apis.testSetRecentlyCompleted(),
        ]).then(([info, countries, recentlyCompetedTestSet]) => {
            setFirstName(info.first_name);
            setLastName(info.last_name);
            setGender(info.gender);
            setBirthday(info.birthday);
            setCountry(info.country);
            setRecentTestSetList(recentlyCompetedTestSet);
            setCountryList(countries);
        });
    }

    const checkValidation = () => {
        let valid = true;
        if(firstName.trim().length === 0) {
            valid = false;
            setErrorFirstName(true);
        }
        if(lastName.trim().length === 0) {
            valid = false;
            setErrorLastName(true);
        }
        return valid;
    }

    const onSave = () => {
        if(!checkValidation()) return;
        Apis.userUpdate({
            first_name: firstName,
            last_name: lastName,
            gender,
            birthday,
            country
        }).then(resp => {
            NotificationManager.success("User information was updated");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {

        })
    }

    const onGoAttempt = (id) => {
        if(id) history.push('/main/attempt/' + id + '/score')
    }

    return (
        <div className={'profile-content flex-row'}>
            <div className={'personal-content'}>
                <div className={'personal-item-list'}>
                    <div className={classNames('personal-item', {'error': errorFirstName})}>
                        <span>First Name</span>
                        <Input
                            type={'text'}
                            value={firstName}
                            onChange={(e) => {setFirstName(e.target.value); setErrorFirstName(false)}}
                        />
                    </div>
                    <div className={classNames('personal-item', {'error': errorLastName})}>
                        <span>Last Name</span>
                        <Input
                            type={'text'}
                            value={lastName}
                            onChange={(e) => {setLastName(e.target.value); setErrorLastName(false)}}
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
                        <span>DATE OF BIRTH</span>
                        <Input
                            type={'date'}
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                    <div className={'personal-item'}>
                        <span>Country</span>
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
                    <div className={'d-flex flex-row mt-50'}>
                    <Button className={'profile-save-btn'} onClick={onSave}>Save Information</Button>
                    </div>
                </div>
            </div>
            <div className={'completed-list'}>
                <span className={'fs-15 text-primary1 mb-3'} >RECENTLY COMPLETED</span>
                <Scrollbars
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
                </Scrollbars>
            </div>
        </div>
    )
}

export default PersonalComponent