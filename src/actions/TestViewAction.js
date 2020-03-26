/**
 * Test View Actions
 */
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

const getHangingImageOrder = (images, type) => {
    const typeArray = type.split('_');
    const idList = [];
    typeArray.forEach((v) => {
        const imageObj = images.find((vv) => vv.hangingId === v);
        if(imageObj !== undefined) {
            idList.push(imageObj.id);
        }
    });
    if(idList.length === 0) {
        images.forEach((v) => {
            if(idList.length < typeArray.length) idList.push(v.id);
        });
    }
    return idList
};

export const setImageListAction = (list, answer, complete) => (dispatch, getState) => {
    let newList = list.map((v, i) => {
        let imageAnswers = answer[i];
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
            imageQuality: -1,
            answers: {
                markList,
                shapeList
            }
        }
    });
    const breastPositions = [['CC', 'L'], ['CC', 'R'], ['MLO', 'L'], ['MLO', 'R']];
    let hasAllTestImages = true;
    let hasAllPriorImages = true;
    // remove other image when test did not complete
    if(!complete) {
        newList = newList.filter(image => (image.type === 'test' || image.type === 'prior'));
    }
    newList.forEach((image) => {
        const metaData = JSON.parse(image.metadata);
        breastPositions.forEach((position) => {
            if(metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]){
                if(image.type === 'test') {
                    image.hangingId = position[0] + '-' + position[1]
                } else if(image.type === 'prior') {
                    image.hangingId = position[0] + '-' + position[1] + '-P';
                } else {
                    image.hangingId = '';
                }
            }

        });
    });
    breastPositions.forEach((position) => {
        const testCount = newList.filter((image) => {
            try {
                const metaData = JSON.parse(image.metadata);
                return (image.type === 'test' &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            }catch (e) {
                return false;
            }
        }).length;
        if(testCount !== 1) hasAllTestImages = false;
        const priorCount = newList.filter((image) => {
            try {
                const metaData = JSON.parse(image.metadata);
                return (image.type === 'prior' &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if(priorCount !== 1) hasAllPriorImages = false;
    });
    let showImageList;
    const currentHangingType = getState().testView.hangingType;
    if(hasAllTestImages) {
        showImageList = getHangingImageOrder(newList, currentHangingType);
    } else {
        showImageList = newList.map(v => v.id);
    }

    dispatch({
        type: TEST_VIEW_SET_IMAGE_LIST,
        imageList: newList,
        showImageList,
        hasAllTestImages,
        hasAllPriorImages,
    });
};

export const changeHangingLayout = (type) => (dispatch, getState) => {
    const list = getHangingImageOrder(getState().testView.imageList, type);
    dispatch({
        type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
        payload: list,
    });
    dispatch({
        type: TEST_VIEW_SET_RESET_ID,
        payload: Math.random().toString(36).substring(7),
    });
    dispatch({
        type: TEST_VIEW_SET_HANGING_TYPE,
        payload: type
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
        });
    }
};

export const setImageQuality = (imageId, value) => (dispatch, getState) => {
    const imageList = [...getState().testView.imageList];
    if(imageId === '') {
        dispatch({
            type: TEST_VIEW_SET_FULL_IMAGE_QUALITY,
            payload: value
        });
    } else {
        const index = imageList.findIndex((v) => v.id === imageId);
        dispatch({
            type: TEST_VIEW_SET_INDIVIDUAL_IMAGE_QUALITY,
            payload: {
                index,
                value
            }
        });
    }

};