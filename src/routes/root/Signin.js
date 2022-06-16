import React, {useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import {Input} from "reactstrap";
import {Button, Tooltip, CircularProgress} from "@material-ui/core";
import * as selectors from "Selectors";
import ReactGA from "react-ga4";
import MainLayout from "Components/MainLayout";
import {login} from 'Actions';
import {useDispatch} from "react-redux";
import * as Apis from "Api";

function Signin() {
    const history = useHistory();
    const dispatch = useDispatch();
    const isLogin = selectors.getIsLogin(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isLogin) history.push('/');
    }, []);


    const onKeyPress = (event) => {
        if(event.key === 'Enter') {
            onLogin();
        }
    }

    const onLogin = () => {
        if(email !== '' && password !== '') {
            setLoading(true);
            // const fromUrl = (history.location.state && history.location.state.from) ? history.location.state.from.pathname : '/';
            const fromUrl = '/';
            Apis.login(email, password).then((result) => {
                ReactGA.event('login');
                dispatch(login(result.userId, result.userName, result.userEmail, result.id, history, fromUrl));
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
                    <div className={'signup-title mb-4'}>DetectedX Login</div>
                    <div className={'input-item'}>
                        <span>EMAIL</span>
                        <Input type={'text'} value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={onKeyPress}/>
                    </div>
                    <div className={'input-item'}>
                        <span>PASSWORD</span>
                        <Input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={onKeyPress}/>
                    </div>
                    <div>
                        <Button className={'signup-submit'} disabled={loading} onClick={onLogin}>
                            {
                                !loading ? 'Login' : <CircularProgress size={28}/>
                            }
                        </Button>
                    </div>
                    <div className={'d-flex justify-content-center mt-1'} style={{height: 22}}>
                        {
                            errorMsg !== '' && <span className={'text-red'}>Username or password is not correct!</span>
                        }
                    </div>
                    <div className={'d-flex justify-content-end mt-1 fs-14'}>
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                    <div className={'d-flex align-items-center mt-2'}>
                        <div className={'signin-sso-bar'}/>
                        <span>or</span>
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
                                <Tooltip title={'Sign in with GE Healthcare'}>
                                    <img src={require('Assets/img/sso/ge_healthineers_logo.png')} className="" alt=""/>
                                </Tooltip>
                            </Button>
                        </div>
                    </div>
                    <div className={'d-flex justify-content-center mt-30 fs-14'}>
                        <span>You don't have an account? <Link to="/signup">Register</Link></span>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Signin;