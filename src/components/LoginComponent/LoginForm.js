import React, {useState, useEffect} from 'react';
import {Dialog, Button, TextField} from '@material-ui/core';
import AppConfig from "Constants/AppConfig";
import IntlMessages from "Util/IntlMessages";
import {Form, FormGroup, Input} from "reactstrap";
import {useSelector, useDispatch} from 'react-redux';
import {login} from 'Actions';
import PropTypes from 'prop-types';
import * as selectors from "Selectors";
import * as Apis from "Api";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";


const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

const LoginForm = ({open, onFinish}) => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => selectors.getIsLogin(state));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isLogin) {
            onFinish();
        }
    }, []);

    useEffect(() => {
        setErrorMsg('');
    }, [email, password]);

    const onUserLogin = () => {
        if (email !== '' && password !== '') {
            Apis.login(email, password).then((result) => {
                dispatch(login(result.userId, result.userName, result.userEmail, result.id, () => {
                    onFinish();
                }));
            }).catch((e) => {
                setErrorMsg(e.response.data.error.message);
            });
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <div className={'session-inner-wrapper p-40'}>
            <div className="session-body text-center">
                <div className="session-head mb-30">
                    <h1 className="font-weight-bold">{AppConfig.brandName} <IntlMessages id={"user.login"}/></h1>
                </div>
                <div>
                    <FormGroup className="has-wrapper">
                        <TextField
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            label={<IntlMessages id={"user.signup.email"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                        />
                        <span className="has-icon mt-5"><i className="ti-email"/></span>
                    </FormGroup>

                    {/*<FormGroup className="has-wrapper">*/}
                    {/*    <Input*/}
                    {/*        type="mail"*/}
                    {/*        value={email}*/}
                    {/*        name="user-mail"*/}
                    {/*        id="user-mail"*/}
                    {/*        className="has-input input-lg"*/}
                    {/*        placeholder="Enter Email Address"*/}
                    {/*        onChange={(event) => setEmail(event.target.value)}*/}
                    {/*    />*/}
                    {/*    <span className="has-icon"><i className="ti-email"/></span>*/}
                    {/*</FormGroup>*/}
                    <FormGroup className="has-wrapper">
                        <TextField
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            label={<IntlMessages id={"user.signup.password"}/>}
                            className={'mb-10'}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                        />
                        <span className="has-icon mt-5"><i className="ti-lock"/></span>
                    </FormGroup>
                    {/*<FormGroup className="has-wrapper">*/}
                    {/*    <Input*/}
                    {/*        value={password}*/}
                    {/*        type="Password"*/}
                    {/*        name="user-pwd"*/}
                    {/*        id="pwd"*/}
                    {/*        className="has-input input-lg"*/}
                    {/*        placeholder="Password"*/}
                    {/*        onChange={(event) => setPassword(event.target.value)}*/}
                    {/*    />*/}
                    {/*    <span className="has-icon"><i className="ti-lock"/></span>*/}
                    {/*</FormGroup>*/}
                    {
                        errorMsg !== '' &&
                        <div style={{margin: "-17px 10px 20px", textAlign: 'left', color: '#f34949'}}>Invalid username and password</div>
                    }
                    <FormGroup className="mb-15">
                        <Button
                            type={'submit'}
                            color="primary"
                            className="btn-block text-white w-100"
                            variant="contained"
                            size="large"
                            onClick={onUserLogin}
                        >
                            <IntlMessages id={"user.signin"}/>
                        </Button>
                    </FormGroup>
                </div>
            </div>
        </div>
        </ThemeProvider>
    )
};

LoginForm.propTypes = {
    onFinish: PropTypes.func
}

LoginForm.defaultProps = {
    onFinish: () => null
}

export default LoginForm;