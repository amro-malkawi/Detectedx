/**
 * Test View Reducers
 */
import {
    TEST_VIEW_SET_IMAGE_LIST,
    TEST_VIEW_CHANGE_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_BROWSER,
    TEST_VIEW_SET_HANGING_TYPE,
    TEST_VIEW_SET_RESET_ID,
    TEST_VIEW_SET_CASE_DENSITY,
    TEST_VIEW_SET_CURRENT_TOOL,
    TEST_VIEW_SET_THICKNESS_TYPE,
    TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
    TEST_VIEW_FULL_IMAGEVIEWER,
    TEST_VIEW_MODALITY_INFO,
    TEST_VIEW_ATTEMPT_INFO, TEST_VIEW_FOCUS_VIEWER_INDEX
} from '../types';

const INIT_STATE = {
    attemptId: '',
    imageList: [],
    caseDensity: -1,
    showImageList: [[]],
    initialZoomLevel: 0,
    isShowImageBrowser: true,
    testSetHangingType: 'normal',
    testSetHangingIdList: [],
    selectedHangingType: 'MLO-R_MLO-L_CC-R_CC-L',
    defaultImagesNumber: 1,
    volparaImageId: undefined,
    resetId: '',
    toolList: [],
    currentTool: 'Pan',
    currentThicknessType: 'NOTHICKNESS',
    fullImageViewerIndex: '-1_-1',
    modalityInfo: {},
    attemptInfo: {},
    focusImageViewerIndex: null,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case TEST_VIEW_SET_IMAGE_LIST:
            return {
                ...state,
                imageList: action.imageList,
                showImageList: action.showImageList,
                isShowImageBrowser: action.isShowImageBrowser,
                initialZoomLevel: action.initialZoomLevel,
                testSetHangingType: action.testSetHangingType,
                testSetHangingIdList: action.testSetHangingIdList,
                selectedHangingType: action.selectedHangingType,
                defaultImagesNumber: action.defaultImagesNumber,
                volparaImageId: action.volparaImageId,
                caseDensity: -1,
                toolList: action.toolList,
                currentTool: action.currentTool,
                currentThicknessType: action.currentThicknessType,
                fullImageViewerIndex: '-1_-1',
                focusImageViewerIndex: null,
            };
        case TEST_VIEW_CHANGE_IMAGE_LIST:
            return { ...state, imageList: action.payload};
        case TEST_VIEW_SET_SHOW_IMAGE_LIST:
            return { ...state, showImageList: action.payload };
        case TEST_VIEW_SET_INITIAL_ZOOM_LEVEL:
            return { ...state, initialZoomLevel: action.payload.initialZoomLevel};
        case TEST_VIEW_SET_SHOW_IMAGE_BROWSER:
            return { ...state, isShowImageBrowser: action.payload };
        case TEST_VIEW_SET_HANGING_TYPE:
            return { ...state, selectedHangingType: action.payload };
        case TEST_VIEW_SET_RESET_ID:
            return {...state, resetId: action.payload};
        case TEST_VIEW_SET_CASE_DENSITY:
            return {...state, caseDensity: action.payload};
        case TEST_VIEW_SET_CURRENT_TOOL:
            return {...state, currentTool: action.payload}
        case TEST_VIEW_SET_THICKNESS_TYPE:
            return {...state, currentThicknessType: action.payload}
        case TEST_VIEW_FULL_IMAGEVIEWER:
            return {...state, fullImageViewerIndex: action.payload}
        case TEST_VIEW_MODALITY_INFO:
            return {...state, modalityInfo: action.payload}
        case TEST_VIEW_ATTEMPT_INFO:
            return {...state, attemptInfo: action.payload}
        case TEST_VIEW_FOCUS_VIEWER_INDEX:
            return {...state, focusImageViewerIndex: action.payload}
        default:
            return {...state}
    }
}