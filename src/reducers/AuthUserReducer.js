/**
 * Auth User Reducers
 */
import { Cookies } from 'react-cookie';
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE
} from 'Actions/types';

const cookie = new Cookies();

/**
 * initial auth user
 */
const INIT_STATE = {
    user: cookie.get("user_id"),
    userName: cookie.get("user_name"),
    userEmail: cookie.get("user_email"),
    accessToken: cookie.get("access_token"),
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOGIN_USER:
            return { ...state, loading: true };

        case LOGIN_USER_SUCCESS:
            return {
                ...state, loading: false,
                user: action.payload.user,
                userName: action.payload.userName,
                userEmail: action.payload.userEmail,
                accessToken: action.payload.accessToken
            };

        case LOGIN_USER_FAILURE:
            return { ...state, loading: false };

        case LOGOUT_USER:
            return { ...state, user: null };

        case SIGNUP_USER:
            return { ...state, loading: true };

        case SIGNUP_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload };

        case SIGNUP_USER_FAILURE:
            return { ...state, loading: false };

        default: return { ...state };
    }
}
