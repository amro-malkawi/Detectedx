/**
 * Test View Reducers
 */
import update from 'immutability-helper';
import {
    TEST_VIEW_SET_IMAGE_LIST,
    TEST_VIEW_CHANGE_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_BROWSER,
    TEST_VIEW_SET_HANGING_TYPE,
    TEST_VIEW_SET_RESET_ID,
    TEST_VIEW_SET_FULL_IMAGE_QUALITY,
    TEST_VIEW_SET_INDIVIDUAL_IMAGE_QUALITY,
} from 'Actions/types';

const INIT_STATE = {
    attemptId: '',
    imageList: [],
    imageQuality: -1,
    showImageList: [],
    isShowImageBrowser: false,
    hasAllTestImages: false,
    hasAllPriorImages: false,
    hangingType: 'CC-R_CC-L_MLO-R_MLO-L',
    resetId: '',
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case TEST_VIEW_SET_IMAGE_LIST:
            return {
                ...state,
                imageList: action.imageList,
                showImageList: action.showImageList,
                hasAllTestImages: action.hasAllTestImages,
                hasAllPriorImages: action.hasAllPriorImages,
                imageQuality: -1
            };
        case TEST_VIEW_CHANGE_IMAGE_LIST:
            return { ...state, imageList: action.payload};
        case TEST_VIEW_SET_SHOW_IMAGE_LIST:
            return { ...state, showImageList: action.payload };
        case TEST_VIEW_SET_SHOW_IMAGE_BROWSER:
            return { ...state, isShowImageBrowser: action.payload };
        case TEST_VIEW_SET_HANGING_TYPE:
            return { ...state, hangingType: action.payload };
        case TEST_VIEW_SET_RESET_ID:
            return {...state, resetId: action.payload};
        case TEST_VIEW_SET_FULL_IMAGE_QUALITY:
            return {...state, imageQuality: action.payload};
        case TEST_VIEW_SET_INDIVIDUAL_IMAGE_QUALITY:
            return update(state, {
                imageList: {
                    [action.payload.index]: {
                        imageQuality: {
                            $set: action.payload.value
                        }
                    }
                }
            });
        default:
            return {...state}
    }
}