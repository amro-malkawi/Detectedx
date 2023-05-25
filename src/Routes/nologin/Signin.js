import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Input} from "reactstrap";
import {Button, Tooltip, CircularProgress} from "@mui/material";
import ReactGA from "react-ga4";
import MainLayout from "Components/MainLayout";
import {login} from 'Store/Actions';
import {useDispatch, useSelector} from "react-redux";
import * as Apis from "Api";
import { useTranslation } from "react-i18next";

function Signin() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.authUser.isLogin);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isLogin) navigate('/');
    }, []);


    const onKeyPress = (event) => {
        if(event.key === 'Enter') {
            onLogin();
        }
    }

    const onLogin = () => {
        if(email !== '' && password !== '') {
            setLoading(true);
            const fromUrl = '/';
            Apis.login(email, password).then((result) => {
                ReactGA.event('login');
                dispatch(login(result.userId, result.userName, result.userEmail, result.id, navigate, fromUrl));
            }).catch((e) => {
                setErrorMsg(e.response.data.error.message);
                setLoading(false);
            });
        }
    }

    return (
        <MainLayout>
            <div className={'main-signup'}>
                <div className={'main-signup-content'} style={{width: 800}}>
                    <div className={'signup-title mb-4'}>{t('user.detectedx_login')}</div>
                    <div className={'input-item'}>
                        <span>{t('user.signup.email')}</span>
                        <Input type={'text'} value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={onKeyPress}/>
                    </div>
                    <div className={'input-item'}>
                        <span>{t('user.signup.password')}</span>
                        <Input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={onKeyPress}/>
                    </div>
                    <div>
                        <Button className={'signup-submit'} disabled={loading} onClick={onLogin}>
                            {
                                !loading ? t('user.login') : <CircularProgress size={28}/>
                            }
                        </Button>
                    </div>
                    <div className={'d-flex justify-content-center mt-1'} style={{height: 22}}>
                        {
                            errorMsg !== '' && <span className={'text-red'}>{t('user.incorrect_credentials')}</span>
                        }
                    </div>
                    <div className={'d-flex justify-content-end mt-1 fs-14'}>
                        <Link to="/forgot-password">{t('user.forgot_password')}</Link>
                    </div>
                    <div className={'d-flex align-items-center mt-2'}>
                        <div className={'signin-sso-bar'}/>
                        <span>{t('common.or')}</span>
                        <div className={'signin-sso-bar'}/>
                    </div>
                    <div className={'d-flex justify-content-center mt-4'}>
                        {/*<div className={'sso-button'}>*/}
                        {/*    <Button onClick={() => window.location.href = "/sso/siemens_login"}>*/}
                        {/*        <Tooltip title={'Sign in with Siemens'}>*/}
                        {/*            <img src={require('Assets/img/sso/siemens_healthineers_logo.png')} className="" alt=""/>*/}
                        {/*        </Tooltip>*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                        <div className={'sso-button'}>
                            <Button onClick={() => window.location.href = "/sso/ge_login"}>
                                <Tooltip title={t('user.sign_in_with_ge_healthcare')}>
                                    <img src={require('Assets/img/sso/ge_healthineers_logo.png')} className="" alt=""/>
                                </Tooltip>
                            </Button>
                        </div>
                        <div className={'sso-button'}>
                            <Button onClick={() => window.location.href = "/sso/sydney_uni_login"}>
                                <Tooltip title={t('user.sign_in_with_sydney_university')}>
                                    <img src={require('Assets/img/sso/sydney_uni_logo.png')} className="" alt=""/>
                                </Tooltip>
                            </Button>
                        </div>
                    </div>
                    <div className={'d-flex justify-content-center mt-30 fs-14'}>
                        <span>{t('user.signup.you_dont_have_an_account')} <Link to="/signup">{t('user.register')}</Link></span>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Signin;
