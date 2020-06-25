/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import {NotificationManager} from 'react-notifications';
import {Cookies} from 'react-cookie';
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE
} from 'Actions/types';
import * as Apis from 'Api';

const cookie = new Cookies();

/**
 * Redux Action To Sigin User With Email
 */
export const signinUserInEmail = (user, history) => (dispatch) => {
    Apis.login(user.email, user.password).then((result) => {
        dispatch({type: LOGIN_USER});
        if (Apis.apiHost.indexOf(':') !== -1) {
            cookie.set('user_id', result.userId, {path: '/'});
            cookie.set('user_name', result.userName, {path: '/'});
            cookie.set('user_email', result.userEmail, {path: '/'});
            cookie.set('access_token', result.id, {path: '/'});
        }
        dispatch({
            type: LOGIN_USER_SUCCESS, payload: {
                user: result.userId,
                userName: result.userName,
                userEmail: result.userEmail,
                accessToken: result.id,
            }
        });
        history.push('/');
    }).catch(error => {
        dispatch({type: LOGIN_USER_FAILURE});
        NotificationManager.error(error.response ? error.response.data.error.message : error.message);
    });
}

/**
 * Redux Action To Signout User From  Email
 */
export const logoutUserFromEmail = () => (dispatch) => {
    Apis.logout().then(() => {
    }).finally(() => {
        if (Apis.apiHost.indexOf(':') !== -1) {
            cookie.remove('user_id', {path: '/'});
            cookie.remove('access_token', {path: '/'});
        }
        dispatch({type: LOGOUT_USER});
        NotificationManager.success('User Logout Successfully');
    });
}

/**
 * Redux Action To Signup User
 */
export const signupUserInEmail = (userData, history) => (dispatch) => {
    dispatch({type: SIGNUP_USER});
    return new Promise(function (resolve, reject) {
        Apis.singUp(userData).then((result) => {
            dispatch({type: SIGNUP_USER_SUCCESS, payload: cookie.get("user_id")});
            history.push('/signin');
            resolve(result);
            // NotificationManager.success('Account Created Successfully!');
        }).catch(error => {
            dispatch({type: SIGNUP_USER_FAILURE});
            reject(error);
            // NotificationManager.error(error.response.data.error.message);
        });
    });
}