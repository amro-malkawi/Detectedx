// redux actions for test view component
import {batch} from 'react-redux';
import {
    TEST_VIEW_COMP_SET_BREAST_QUALITY
} from '../types';

export const setImageEDBreastQuality = (quality) => (dispatch, getState) => {
    dispatch({
        type: TEST_VIEW_COMP_SET_BREAST_QUALITY,
        payload: quality,
    });
}
