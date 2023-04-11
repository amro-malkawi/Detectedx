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
    SIGNUP_USER_FAILURE,
    USER_COMPLETED_COUNT,
    USER_COMPLETED_POINT,
} from '../types';
import * as Apis from 'Api';

const cookie = new Cookies();

/**
 * Redux Action To Sigin User With Email
 */
export const login = (userId, userName, userEmail, accessToken, navigate, fromUrl, callback) => (dispatch, getState) => {
    if (Apis.apiHost.indexOf(':') !== -1) {
        cookie.set('user_id', userId, {path: '/'});
        cookie.set('user_name', userName, {path: '/'});
        cookie.set('user_email', userEmail, {path: '/'});
        cookie.set('access_token', accessToken, {path: '/'});
        cookie.set('completed_count', accessToken, {path: '/'});
        cookie.set('completed_point', accessToken, {path: '/'});
    }
    dispatch({
        type: LOGIN_USER_SUCCESS, payload: {
            user: userId,
            userName: userName,
            userEmail: userEmail,
            accessToken: accessToken,
        }
    });
    if(navigate && fromUrl) navigate(fromUrl);
    if(callback) callback();
}

/**
 * Redux Action To Signout User From  Email
 */
export const logoutUserFromEmail = () => (dispatch) => {
    Apis.logout().then(() => {
    }).finally(() => {
        if (Apis.apiHost.indexOf(':') !== -1) {
            cookie.remove('user_id', {path: '/'});
            cookie.remove('user_email', {path: '/'});
            cookie.remove('user_name', {path: '/'});
            cookie.remove('access_token', {path: '/'});
        }
        dispatch({type: LOGOUT_USER});
        NotificationManager.success('User Logout Successfully');
    });
}

/**
 * Redux Action To Signup User
 */

export const setUserCompletedCount = (count) => (dispatch) => {
    dispatch({type: USER_COMPLETED_COUNT, payload: count});
}

export const setUserCompletedPoint = (point) => (dispatch) => {
    dispatch({type: USER_COMPLETED_POINT, payload: point});
}