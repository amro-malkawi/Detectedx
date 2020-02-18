import { createSelector } from 'reselect';
import { Cookies } from 'react-cookie';

const cookie = new Cookies();

export const getIsLogin = (state) => (cookie.get("access_token") !== undefined);
export const getUser = (state) => cookie.get("user_id");
export const getUserName = (state) => cookie.get("user_name");
export const getUserEmail = (state) => cookie.get("user_email");
export const getAccessToken = (state) =>cookie.get("access_token");