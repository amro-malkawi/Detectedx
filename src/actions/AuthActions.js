/**
 * Auth Actions
 * Auth Action With Google, Facebook, Twitter and Github
 */
import {NotificationManager} from 'react-notifications';
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

/**
 * Redux Action To Sigin User With Email
 */
export const signinUserInEmail = (user, history) => (dispatch) => {
    Apis.login(user.email, user.password).then((result) => {
        dispatch({type: LOGIN_USER});
        localStorage.setItem("user_id", result.userId);
        localStorage.setItem("access_token", result.id);
        dispatch({type: LOGIN_USER_SUCCESS, payload: localStorage.getItem('user_id')});
        history.push('/');
    }).catch(error => {
        dispatch({type: LOGIN_USER_FAILURE});
        NotificationManager.error(error.response.data.error.message);
    });
}

/**
 * Redux Action To Signout User From  Email
 */
export const logoutUserFromEmail = () => (dispatch) => {
    Apis.logout().then(() => {
    }).finally(() => {
        dispatch({type: LOGOUT_USER});
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        NotificationManager.success('User Logout Successfully');
    });
}

/**
 * Redux Action To Signup User
 */
export const signupUserInEmail = (user, history) => (dispatch) => {
    dispatch({type: SIGNUP_USER});
    return new Promise(function (resolve, reject) {
        Apis.singUp(user.email, user.firstName, user.lastName, user.password).then((result) => {
            dispatch({type: SIGNUP_USER_SUCCESS, payload: localStorage.getItem('user_id')});
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