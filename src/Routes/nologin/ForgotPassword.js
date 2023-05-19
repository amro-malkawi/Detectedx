import React, {useState, useEffect} from 'react';
import MainLayout from "Components/MainLayout";
import {Input} from "reactstrap";
import {Button, CircularProgress} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onResetPassword = () => {
        if(email !== '') {
            setLoading(true);
            Apis.forgotPassword(email).then(resp => {
                NotificationManager.success("Sent email to reset password. Please check email.");
                navigate('/signin');
            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    return (
        <MainLayout>
            <div className={'main-signup mb-50'}>
                <div className={'main-signup-content'} style={{width: 800}}>
                    <div className={'signup-title mb-4'}>Did you forgot your password?</div>
                    <div className={'fs-15 mb-3'}>Enter your email address you're using for you account below and we will send you a password link</div>
                    <div className={'input-item'}>
                        <span>EMAIL</span>
                        <Input type={'text'} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <Button className={'signup-submit'} disabled={loading} onClick={onResetPassword}>
                            {
                                !loading ? 'Reset Password' : <CircularProgress size={28}/>
                            }
                        </Button>
                    </div>
                    <div className={'d-flex justify-content-center mt-30 fs-14'}>
                        <span>Back to <Link to="/signin">Login</Link></span>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default ForgotPassword;