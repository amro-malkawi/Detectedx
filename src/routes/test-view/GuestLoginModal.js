import React, {useState, useEffect} from 'react';
import {Dialog, Button} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import LoginForm from "Components/LoginComponent/LoginForm";
import RegisterForm from "Components/LoginComponent/RegisterForm";
import PropTypes from "prop-types";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";

const MyDialog = withStyles({
    paper: {
        color: 'white',
        padding: '30px 10px',
        backgroundColor: 'black',
        border: '1px solid #222'
    },
})(Dialog);

const GuestLoginModal = ({open, attemptId, onClose, onComplete}) => {
    const [status, setStatus] = useState('first');  // first, login, register

    useEffect(() => {
        setStatus('first');
    }, [open])

    const onFinishLogin = () => {
        Apis.attemptsAssignFromGuest(attemptId).then((resp) => {
            onComplete()
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    const renderContent = () => {
        return (
            <div className={''} style={{width: 450}}>
                <div className={'fs-19 text-white mb-30 ml-10'}>You have to login site to get score.</div>
                <div className={'d-flex flex-row justify-content-center'}>
                    <Button onClick={() => setStatus('login')} variant="contained" color="primary" className={'mr-20'}>
                        Login
                    </Button>
                    <Button onClick={() => setStatus('register')} variant="contained" color="primary" >
                        Register
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <MyDialog
            open={open}
            onClose={onClose}
            maxWidth={'lg'}
        >
            { status === 'first' && renderContent()}
            { status === 'login' && <LoginForm onFinish={onFinishLogin}/>}
            { status === 'register' && <RegisterForm onFinish={onFinishLogin}/>}
        </MyDialog>
    )
};

GuestLoginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    attemptId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onComplete: PropTypes.func
}

GuestLoginModal.defaultProps = {
    open: false,
    attemptId: '',
    onClose: () => null,
    onComplete: () => null
}

export default GuestLoginModal;