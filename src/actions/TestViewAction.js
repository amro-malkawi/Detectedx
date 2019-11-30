/**
 * Test View Actions
 */
import {
    TEST_VIEW_SET_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_BROWSER
} from 'Actions/types';

export const setImageListAction = (list) => ({
    type: TEST_VIEW_SET_IMAGE_LIST,
    payload: list
});

export const dropImage = (id, index) => (dispatch, getState) => {
    const dropImage = getState().testView.imageList.find((v) => v.id === id);
    const showImageList = [ ...getState().testView.showImageList ];
    showImageList[index] = dropImage;
    console.log(getState().testView.imageList, showImageList)
    return {
        type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
        payload: showImageList
    }
};

export const setShowImageBrowser = (v) => ({
    type: TEST_VIEW_SET_SHOW_IMAGE_BROWSER,
    payload: v
});