import React, {Component, useState, useEffect} from 'react';
import {Button, CircularProgress} from '@mui/material';
import {Input} from 'reactstrap';
import {useNavigate, useSearchParams} from "react-router-dom";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import MainLayout from "Components/MainLayout";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        if(searchParams.get('token') === null) {
            navigate('/signin');
        } else {
            setAccessToken(searchParams.get('token'));
        }
    }, []);

    const checkValidation = () => {
        let valid = true;
        if(password === '') {
            setErrorPassword(true);
            valid = false;
        }
        if(password !== confirmPassword) {
            setErrorConfirmPassword(true);
            valid = false;
        }
        return valid;
    }

    const onResetPassword = () => {
        if (checkValidation()) {
            setLoading(true);
            Apis.resetPassword(password, accessToken).then(resp => {
                NotificationManager.success("Password Reset, Please login again");
                navigate('/signin');
            }).catch(error => {
                setErrorMsg(error.response ? error.response.data.error.message : error.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    const onKeyPress = (event) => {
        if(event.key === 'Enter') {
            onResetPassword();
        }
    }

    return (
        <MainLayout>
            <div className={'main-signup'}>
                <div className={'main-signup-content'} style={{width: 800, marginBottom: 150}}>
                    <div className={'signup-title mb-4'}>Reset password?</div>
                    <div className={'input-item'}>
                        <span>NEW PASSWORD</span>
                        <Input
                            type={'password'}
                            autoComplete="new-password"
                            value={password}
                            invalid={errorPassword}
                            onChange={(event) => {setPassword(event.target.value); setErrorPassword(false)}}
                        />
                    </div>
                    <div className={'input-item'}>
                        <span>CONFIRM PASSWORD</span>
                        <Input
                            type={'password'}
                            autoComplete="new-password"
                            value={confirmPassword}
                            invalid={errorConfirmPassword}
                            onChange={(event) => {setConfirmPassword(event.target.value); setErrorConfirmPassword(false)}}
                            onKeyPress={onKeyPress}
                        />
                    </div>
                    <div>
                        <Button className={'signup-submit'} disabled={loading} onClick={onResetPassword}>
                            {
                                !loading ? 'Reset Password' : <CircularProgress size={28}/>
                            }
                        </Button>
                    </div>
                    <div className={'d-flex justify-content-center mt-1'} style={{height: 22}}>
                        {
                            errorMsg !== '' && <span className={'text-red'}>{errorMsg}</span>
                        }
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default ResetPassword;