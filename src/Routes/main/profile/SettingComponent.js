import React, {useState, useEffect} from 'react';
import {Button, FormControlLabel} from "@mui/material";
import {Input} from "reactstrap";
import {NotificationManager} from "react-notifications";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import classNames from 'classnames';
import {isMobile} from 'react-device-detect';
import DeleteProfileModal from "./DeleteProfileModal";
import {GreenCheckbox} from 'Components/CustomMuiComponent';
import {logoutUserFromEmail} from "Store/Actions";
import * as Apis from "Api";

function SettingComponent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState({});
    const [oldPassword, setOldPassword] = useState('');
    const [errorOldPassword, setErrorOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [enterpriseCode, setEnterpriseCode] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        getData();
    }, []);
    const getData = () => {
        Apis.userInfo().then((resp) => {
            setUserInfo(resp);
        });
    }

    const onChangePassword = () => {
        if (oldPassword.length < 3) {
            setErrorOldPassword(true);
            return;
        }
        if (newPassword.length < 3) {
            setErrorNewPassword(true);
            return;
        }
        if (confirmPassword !== newPassword) {
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

    const onDeleteProfile = () => {
        Apis.userDeleteProfile().then((resp) => {
            NotificationManager.success('Your account was deleted permanently');
            dispatch(logoutUserFromEmail());
            navigate('/');
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
        })
    }

    const onApplyCoupon = () => {
        Apis.enterpriseApplyTestSet(enterpriseCode).then((resp) => {
            getData();
            setEnterpriseCode('');
            NotificationManager.success(`The enterprise code was applied.`);
        }).catch((e) => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        });
    }

    const onChangeContactMe = (value) => {
        setUserInfo({...userInfo, allow_contact_me: value});
        Apis.userUpdate({
            allow_contact_me: value,
        }).then(resp => {
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
                            className={!isMobile ? 'me-20' : ''}
                            autoComplete="new-password"
                            value={oldPassword}
                            invalid={errorOldPassword}
                            onChange={(e) => {
                                setOldPassword(e.target.value);
                                setErrorOldPassword(false)
                            }}
                        />
                    </div>
                    <div className={classNames('d-flex', {'flex-column': isMobile})}>
                        <Input
                            type={'password'}
                            placeholder={'NEW PASSWORD'}
                            className={!isMobile ? 'me-20' : ''}
                            autoComplete="new-password"
                            value={newPassword}
                            invalid={errorNewPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setErrorNewPassword(false)
                            }}
                        />
                        <Input
                            type={'password'}
                            placeholder={'CONFIRM PASSWORD'}
                            className={!isMobile ? 'me-20' : 'mt-2'}
                            value={confirmPassword}
                            invalid={errorConfirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrorConfirmPassword(false)
                            }}
                        />
                        <Button className={classNames('contain-btn px-20', {'mt-2': isMobile})} onClick={onChangePassword}>SUBMIT</Button>
                    </div>
                </div>
                <div className={'divide-line mt-20 mb-4'}/>
                <div className={'d-flex flex-row justify-content-between'}>
                    <div className={'d-flex'}>
                        <div className={'d-flex flex-column me-50'}>
                            <span className={'fs-16 fw-semi-bold text-primary1'}>CURRENT CLINIC</span>
                            <span className={'fs-26 fw-semi-bold text-white mt-3'}>{userInfo.clinicName || 'NO CLINIC'}</span>
                        </div>
                        {/*<div className={'d-flex flex-column ms-50'}>*/}
                        {/*    <span className={'fs-16 fw-semi-bold text-primary1'}>PLAN</span>*/}
                        {/*    <span className={'fs-23 fw-semi-bold text-white mt-3'}>Annual Team Plan</span>*/}
                        {/*    <span className={'fs-16 fw-semi-bold text-white mt-3 plan-paid'}>PAID</span>*/}
                        {/*</div>*/}
                    </div>
                    <div className={'d-flex flex-column'}>
                    </div>
                </div>
                <div className={'divide-line mt-20 mb-4'}/>
                <div className={'d-flex flex-column'}>
                    <span className={'fs-16 fw-semi-bold text-primary1'}>Apply Enterprise Code</span>
                    <div className={'d-flex flex-row mt-3'}>
                        <Input
                            type={'text'}
                            placeholder={'ENTERPRISE CODE'}
                            className={'me-3'}
                            value={enterpriseCode}
                            onChange={(e) => {
                                setEnterpriseCode(e.target.value);
                            }}
                        />
                        <Button className={'contain-btn px-20'} onClick={onApplyCoupon}>SUBMIT</Button>
                    </div>
                </div>
                <div className={'divide-line mt-20 mb-4'}/>
                <div className={'ms-2'}>
                    <FormControlLabel
                        control={
                            <GreenCheckbox
                                checked={!!userInfo.allow_contact_me}
                                onChange={(e) => onChangeContactMe(e.target.checked)}
                            />
                        }
                        label={<span>I allow DetectedX to send me relevant marketing information about its products and services </span>}
                    />
                </div>
                <div className={'divide-line mt-20 mb-4'}/>
                <div className={'d-flex flex-column'}>
                    <span className={'fs-16 fw-semi-bold text-primary1'}>Personal Data</span>
                    <div className={'mt-3'}>
                        <Button className={'outline-btn mb-1 px-20'} onClick={() => setOpenDeleteModal(true)}>DELETE PROFILE</Button>
                    </div>
                </div>
            </div>
            {
                openDeleteModal && <DeleteProfileModal onClose={() => setOpenDeleteModal(false)} onDelete={onDeleteProfile}/>
            }
        </div>
    )
}

export default SettingComponent;