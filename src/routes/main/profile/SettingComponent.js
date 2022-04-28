import React, {useState, useEffect} from 'react';
import {Button} from "@material-ui/core";
import {Input} from "reactstrap";
import * as Apis from "Api";
import {NotificationManager} from "react-notifications";

function SettingComponent() {
    const [oldPassword, setOldPassword] = useState('');
    const [errorOldPassword, setErrorOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [enterpriseCode, setEnterpriseCode] = useState('');

    const onChangePassword = () => {
        if(oldPassword.length < 3) {
            setErrorOldPassword(true);
            return;
        }
        if(newPassword.length < 3) {
            setErrorNewPassword(true);
            return;
        }
        if(confirmPassword !== newPassword) {
            setErrorConfirmPassword(true);
            return;
        }
        Apis.changePassword(oldPassword, newPassword).then((resp) => {
            NotificationManager.success("Password changed");
        }).catch(e => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {

        })
    }
    
    return (
        <div className={'profile-content'}>
            <div className={'setting-content'}>
                <div className={'f-flex flex-row'}>
                    <div className={'fs-16 fw-semi-bold text-primary1 mb-20'}>UPDATE PASSWORD</div>
                    <div className={'mb-2'}>
                        <Input
                            type={'password'}
                            placeholder={'CURRENT PASSWORD'}
                            className={'mr-20'}
                            autoComplete="new-password"
                            value={oldPassword}
                            invalid={errorOldPassword}
                            onChange={(e) => {setOldPassword(e.target.value); setErrorOldPassword(false)}}
                        />
                    </div>
                    <div className={'d-flex flex-row'}>
                        <Input
                            type={'password'}
                            placeholder={'NEW PASSWORD'}
                            className={'mr-20'}
                            autoComplete="new-password"
                            value={newPassword}
                            invalid={errorNewPassword}
                            onChange={(e) => {setNewPassword(e.target.value); setErrorNewPassword(false)}}
                        />
                        <Input
                            type={'password'}
                            placeholder={'CONFIRM PASSWORD'}
                            className={'mr-20'}
                            value={confirmPassword}
                            invalid={errorConfirmPassword}
                            onChange={(e) => {setConfirmPassword(e.target.value); setErrorConfirmPassword(false)}}
                        />
                        <Button className={'contain-btn'} onClick={onChangePassword}>SUBMIT</Button>
                    </div>
                </div>
                <div className={'divide-line mt-20 mb-4'}/>
                <div className={'d-flex flex-row justify-content-between'}>
                    <div className={'d-flex'}>
                        <div className={'d-flex flex-column mr-50'}>
                            <span className={'fs-16 fw-semi-bold text-primary1'}>CURRENT CLINIC</span>
                            <span className={'fs-26 fw-semi-bold text-white mt-3'}>North Western Indiana Scans</span>
                            <Input
                                type={'text'}
                                placeholder={'ENTERPRISE CODE'}
                                className={'mt-3'}
                                value={enterpriseCode}
                                onChange={(e) => {setEnterpriseCode(e.target.value);}}
                            />
                        </div>
                        <div className={'d-flex flex-column ml-50'}>
                            <span className={'fs-16 fw-semi-bold text-primary1'}>PLAN</span>
                            <span className={'fs-23 fw-semi-bold text-white mt-3'}>Annual Team Plan</span>
                            <span className={'fs-16 fw-semi-bold text-white mt-3 plan-paid'}>PAID</span>
                        </div>
                    </div>
                    <div className={'d-flex flex-column'}>
                        <Button className={'contain-btn mb-1 px-20'}>NEED TO CHANGE CLINICS?</Button>
                    </div>
                </div>
                <div className={'divide-line mt-20 mb-4'}/>
                <div className={'d-flex flex-column'}>
                    <span className={'fs-16 fw-semi-bold text-primary1'}>DELETE PROFILE</span>
                    <div className={'mt-3'}>
                        <Button className={'outline-btn mb-1 px-20'}>CANCEL MEMBERSHIP</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingComponent;