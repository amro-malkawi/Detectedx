/**
 * Test View Actions
 */
import {
    TEST_VIEW_SET_IMAGE_LIST,
    TEST_VIEW_CHANGE_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_BROWSER,
} from 'Actions/types';

export const setImageListAction = (list, answer) => (dispatch) => {
    const newList = list.map((v, i) => {
        let imageAnswers = answer[i]
        const markList = [];
        imageAnswers.answers && imageAnswers.answers.forEach((mark) => {
            mark.isTruth = false;
            mark.lesionTypes = mark.answers_lesion_types.map((v) => v.lesion_type_id);
            markList.push(mark);
        });
        imageAnswers.truths && imageAnswers.truths.forEach((mark) => {
            mark.isTruth = true;
            mark.lesionTypes = mark.truths_lesion_types.map((v) => v.lesion_type_id);
            markList.push(mark);
        });
        const shapeList = {};
        imageAnswers.shapes && imageAnswers.shapes.forEach((shape) => {
            let measurementData = JSON.parse(shape.data);
            if (shapeList[shape.type] === undefined) shapeList[shape.type] = [];
            shapeList[shape.type].push({stack: shape.stack, measurementData});
        });
        return {
            ...v,
            answers: {
                markList,
                shapeList
            }
        }
    });
    dispatch({
        type: TEST_VIEW_SET_IMAGE_LIST,
        payload: newList
    });
};

export const dropImage = (id, index) => (dispatch, getState) => {
    const showImageList = [...getState().testView.showImageList];
    showImageList[index] = id;
    dispatch({
        type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
        payload: showImageList
    });
};

export const setShowImageBrowser = (v) => ({
    type: TEST_VIEW_SET_SHOW_IMAGE_BROWSER,
    payload: v
});

export const setImageAnswer = (imageId, type, value) => (dispatch, getState) => {
    if(type !== 'markList' && type !== 'shapeList') return;
    const newList = [...getState().testView.imageList];
    const index = newList.findIndex((v) => v.id === imageId);
    if(index > -1) {
        newList[index].answers[type] = value;
        dispatch({
            type: TEST_VIEW_CHANGE_IMAGE_LIST,
            payload: newList
        })
    }
};