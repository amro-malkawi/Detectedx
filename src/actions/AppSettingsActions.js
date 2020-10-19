/**
 * Redux App Settings Actions
 */
import {
    COLLAPSED_SIDEBAR, DARK_MODE,
    SET_LANGUAGE,
} from './types';

/**
 * Redux Action To Emit Collapse Sidebar
 * @param {*boolean} isCollapsed
 */
export const collapsedSidebarAction = (isCollapsed) => ({
    type: COLLAPSED_SIDEBAR,
    isCollapsed
});

/**
 * Redux Action To Set Language
 */
export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    payload: language
});

/**
 * Change dark mode
 */
export const setDarkMode = (value) => ({
    type: DARK_MODE,
    payload: value
});
