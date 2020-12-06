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
    TEST_VIEW_SET_CURRENT_TOOL,
} from 'Actions/types';

const INIT_STATE = {
    attemptId: '',
    imageList: [],
    imageQuality: -1,
    showImageList: [[]],
    isShowImageBrowser: false,
    testSetHangingIdList: [],
    selectedHangingType: 'MLO-R_MLO-L_CC-R_CC-L',
    defaultImagesNumber: 1,
    volparaImageId: undefined,
    resetId: '',
    toolList: [],
    currentTool: 'Pan',
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case TEST_VIEW_SET_IMAGE_LIST:
            return {
                ...state,
                imageList: action.imageList,
                showImageList: action.showImageList,
                testSetHangingIdList: action.testSetHangingIdList,
                selectedHangingType: action.selectedHangingType,
                defaultImagesNumber: action.defaultImagesNumber,
                volparaImageId: action.volparaImageId,
                imageQuality: -1,
                toolList: action.toolList,
                currentTool: action.currentTool
            };
        case TEST_VIEW_CHANGE_IMAGE_LIST:
            return { ...state, imageList: action.payload};
        case TEST_VIEW_SET_SHOW_IMAGE_LIST:
            return { ...state, showImageList: action.payload };
        case TEST_VIEW_SET_SHOW_IMAGE_BROWSER:
            return { ...state, isShowImageBrowser: action.payload };
        case TEST_VIEW_SET_HANGING_TYPE:
            return { ...state, selectedHangingType: action.payload };
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
        case TEST_VIEW_SET_CURRENT_TOOL:
            return {...state, currentTool: action.payload}
        default:
            return {...state}
    }
}