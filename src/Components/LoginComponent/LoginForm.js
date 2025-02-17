import React, {useState, useEffect} from 'react';
import {Dialog, Button, TextField} from '@mui/material';
import {Form, FormGroup, Input} from "reactstrap";
import {useSelector, useDispatch} from 'react-redux';
import {login} from 'Store/Actions';
import PropTypes from 'prop-types';
import * as Apis from "Api";
import {createTheme, ThemeProvider} from "@mui/material/styles";


const darkTheme = createTheme({
    palette: {
        mode: "dark"
    }
});

const LoginForm = ({open, onFinish}) => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.authUser.isLogin);
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
                dispatch(login(result.userId, result.userName, result.userEmail, result.id, null, null, () => {
                    onFinish();
                }));
            }).catch((e) => {
                setErrorMsg(e.response.data.error.message);
            });
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={'session-inner-wrapper p-40'} style={{width: 550}}>
                <div className="session-body text-center">
                    <div className="session-head mb-30">
                        <h1 className="font-weight-bold">DetectED-X Login</h1>
                    </div>
                    <div>
                        <FormGroup className="has-wrapper">
                            <TextField
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                label={"Email *"}
                                className={'mb-10'}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                            />
                            <span className="has-icon mt-5"><i className="ti-email"/></span>
                        </FormGroup>

                        <FormGroup className="has-wrapper">
                            <TextField
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                label={"Password *"}
                                className={'mb-10'}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                            />
                            <span className="has-icon mt-5"><i className="ti-lock"/></span>
                        </FormGroup>
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
                                Login
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