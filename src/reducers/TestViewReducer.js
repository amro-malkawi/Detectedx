/**
 * Test View Reducers
 */
import update from 'immutability-helper';
import {
    TEST_VIEW_SET_IMAGE_LIST,
    TEST_VIEW_CHANGE_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_BROWSER
} from 'Actions/types';

const INIT_STATE = {
    attemptId: '',
    imageList: [],
    showImageList: [],
    isShowImageBrowser: true,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case TEST_VIEW_SET_IMAGE_LIST:
            return { ...state, imageList: action.payload, showImageList: action.payload.map(v => v.id)};
        case TEST_VIEW_CHANGE_IMAGE_LIST:
            return { ...state, imageList: action.payload};
        case TEST_VIEW_SET_SHOW_IMAGE_LIST:
            return { ...state, showImageList: action.payload };
        case TEST_VIEW_SET_SHOW_IMAGE_BROWSER:
            return { ...state, isShowImageBrowser: action.payload };
        default:
            return {...state}
    }
}