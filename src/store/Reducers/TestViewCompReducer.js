import {
    TEST_VIEW_COMP_SET_BREAST_QUALITY
} from '../types';

const INIT_STATE = {
    imageEDBreastQuality: {answer: {}, truth: {}},
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case TEST_VIEW_COMP_SET_BREAST_QUALITY:
            return {...state, imageEDBreastQuality: action.payload};
        default:
            return {...state}
    }
}