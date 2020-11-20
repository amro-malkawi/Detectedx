/**
 * Test View Actions
 */
import {batch} from 'react-redux'
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

const breastPositions = [['CC', 'L'], ['CC', 'R'], ['MLO', 'L'], ['MLO', 'R']];

const getImageHangingIdList = (images) => {
    let hasAllTestImages = true;
    let hasAllPriorImages = true;
    let had3dImages = true;
    breastPositions.forEach((position) => {
        const testCount = images.filter((image) => {
            try {
                const metaData = JSON.parse(image.metadata);
                return (image.type === 'test' &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if (testCount < 1) hasAllTestImages = false;
        const priorCount = images.filter((image) => {
            try {
                const metaData = JSON.parse(image.metadata);
                return (image.type === 'prior' &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if (priorCount < 1) hasAllPriorImages = false;
    });

    breastPositions.forEach((position) => {
        const positionImages = images.filter((image) => {
            try {
                const metaData = JSON.parse(image.metadata);
                return (image.type === 'test' &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]
                )
            } catch (e) {
                return false;
            }
        });
        if (position[0] === 'MLO') {
            if (positionImages.length < 2) {
                had3dImages = false;
            } else {
                if (positionImages.filter((image) => image.stack_count === 1).length === 0 ||
                    positionImages.filter((image) => image.stack_count > 1).length === 0) {
                    had3dImages = false
                }
            }
        } else if (position[0] === 'CC') {
            if (positionImages.length < 1) had3dImages = false
        } else {
            had3dImages = false
        }
    });

    if (had3dImages) {
        // 3d test set( for GE modality)
        return {
            testSetHangingType: 'breastWith3D',
            testSetHangingIdList: [
                'MLO-R_MLO-L_CC-R_CC-L',
                'CC-R_CC-L',
                'MLO-R_MLO-L',
                'MLO-R-3D_MLO-R_MLO-L_MLO-L-3D',
                'MLO-R-3D_MLO-L-3D'
            ]
        };
    } else if (hasAllTestImages && hasAllPriorImages) {
        // breast with prior images
        return {
            testSetHangingType: 'breastWithPrior',
            testSetHangingIdList: [
                'MLO-R_MLO-L_CC-R_CC-L',
                'CC-R_CC-L',
                'MLO-R_MLO-L',
                'CC-R_MLO-R',
                'CC-L_MLO-L',
                'CC-R_CC-R-P',
                'MLO-R_MLO-R-P',
                'CC-L_CC-L-P',
                'MLO-L_MLO-L-P',
                'CC-R_CC-R-P_MLO-R_MLO-R-P',
                'MLO-L-P_MLO-L_CC-L-P_CC-L'
            ]
        };
    } else if (hasAllTestImages) {
        // breast
        return {
            testSetHangingType: 'breast',
            testSetHangingIdList: [
                'MLO-R_MLO-L_CC-R_CC-L',
                'CC-R_CC-L',
                'MLO-R_MLO-L',
                'CC-R_MLO-R',
                'CC-L_MLO-L',
            ]
        };
    } else {
        // normal
        return {
            testSetHangingType: 'normal',
            testSetHangingIdList: []
        }
    }
}


const getHangingImageOrder = (images, type, defaultImagesNumber, isForce = true) => {
    // if(!hasAllTestImages) {
    //     return [images.filter(image => image.type === 'test').map(v => v.id)];
    // } else {
    //     const typeArray = type.split('_');
    //     const idList = [];
    //     typeArray.forEach((v) => {
    //         const imageObj = images.find((vv) => vv.hangingId === v);
    //         if (imageObj !== undefined) {
    //             idList.push(imageObj.id);
    //         }
    //     });
    //     if (idList.length === 0 && isForce) {
    //         images.forEach((v) => {
    //             if (idList.length < typeArray.length) idList.push(v.id);
    //         });
    //     }
    //     return [idList]  // 1 row x 0 column
    // }

    const typeArray = type.split('_');
    let idList = [];
    typeArray.forEach((v) => {
        const imageObj = images.find((vv) => vv.hangingId === v);
        if (imageObj !== undefined) {
            idList.push(imageObj.id);
        }
    });
    if (idList.length < typeArray.length && isForce) {
        images.forEach((v) => {
            if (idList.length < typeArray.length) idList.push(v.id);
        });
        idList = idList.slice(0, defaultImagesNumber);
    }
    return [idList]  // 1 row x 0 column

};

export const setImageListAction = (list, answer, defaultImagesNumber = 1, complete = false) => (dispatch, getState) => {
    let newList = list.map((v, i) => {
        let imageAnswers = answer[i];
        const markList = [];
        imageAnswers.answers && imageAnswers.answers.forEach((mark) => {
            mark.isTruth = false;
            mark.lesionTypes = mark.answers_lesion_types.map((v) => v.lesion_type_id);
            mark.lesionList = {};
            try {
                mark.lesionList = JSON.parse(mark.answer_lesion_list);
            } catch (e) {

            }
            markList.push(mark);
        });
        imageAnswers.truths && imageAnswers.truths.forEach((mark) => {
            mark.isTruth = true;
            mark.lesionTypes = mark.truths_lesion_types.map((v) => v.lesion_type_id);
            mark.lesionList = {};
            try {
                mark.lesionList = JSON.parse(mark.truth_lesion_list);
            } catch (e) {

            }
            markList.push(mark);
        });
        const shapeList = {};
        imageAnswers.shapes && imageAnswers.shapes.forEach((shape) => {
            try {
                let measurementData = JSON.parse(shape.data);
                if (shapeList[shape.type] === undefined) shapeList[shape.type] = [];
                shapeList[shape.type].push({stack: shape.stack, measurementData});
            } catch (e) {
                console.warn('shape json error', shape.id)
            }
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
    // remove other image when test did not complete
    if (!complete) {
        newList = newList.filter(image => (image.type === 'test' || image.type === 'prior'));
    }

    // check hanging type
    const {testSetHangingType, testSetHangingIdList} = getImageHangingIdList(newList)

    // set image's hangingId
    newList.forEach((image) => {
        try {
            const metaData = JSON.parse(image.metadata);
            breastPositions.forEach((position) => {
                if (metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]) {
                    if(testSetHangingType === 'breast' || testSetHangingType === 'breastWithPrior') {
                        if (image.type === 'test') {
                            image.hangingId = position[0] + '-' + position[1];
                        } else if (image.type === 'prior') {
                            image.hangingId = position[0] + '-' + position[1] + '-P';
                        } else {
                            image.hangingId = '';
                        }
                    } else if(testSetHangingType === 'breastWith3D') {
                        if(image.stack_count === 1) {
                            image.hangingId = position[0] + '-' + position[1];
                        } else {
                            image.hangingId = position[0] + '-' + position[1] + '-3D';
                        }
                    } else {
                        image.hangingId = '';
                    }
                }

            });
        } catch (e) {
            image.hangingId = '';
        }
    });

    const selectedHangingType = getState().testView.selectedHangingType;
    let showImageList;
    const volparaImage = newList.find((v) => v.type === 'volpara');
    let volparaImageId;
    if (volparaImage !== undefined) {
        volparaImageId = volparaImage.id;
        const imageLine1 = getHangingImageOrder(newList.filter(image => (image.type === 'test' || image.type === 'prior')), true, "CC-R_CC-L", defaultImagesNumber, false)[0];
        const imageLine2 = getHangingImageOrder(newList.filter(image => (image.type === 'test' || image.type === 'prior')), true, "MLO-R_MLO-L", defaultImagesNumber, false)[0];
        showImageList = [imageLine1, imageLine2];
    } else {
        showImageList = getHangingImageOrder(newList.filter(image => (image.type === 'test' || image.type === 'prior')), selectedHangingType, defaultImagesNumber, true);
    }
    showImageList = showImageList.filter((v) => v.length !== 0);
    dispatch({
        type: TEST_VIEW_SET_IMAGE_LIST,
        imageList: newList,
        showImageList,
        testSetHangingIdList,
        selectedHangingType: 'MLO-R_MLO-L_CC-R_CC-L',
        defaultImagesNumber,
        volparaImageId
    });
};

export const changeHangingLayout = (type) => (dispatch, getState) => {
    const {imageList, defaultImagesNumber} = getState().testView;
    const list = getHangingImageOrder(imageList, type, defaultImagesNumber, true);
    batch(() => {
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
    });
};

export const dropImage = (id, rowIndex, colIndex) => (dispatch, getState) => {
    if (rowIndex === undefined || colIndex === undefined) return;
    const showImageList = [...getState().testView.showImageList];
    showImageList[rowIndex][colIndex] = id;
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
    if (type !== 'markList' && type !== 'shapeList') return;
    const newList = [...getState().testView.imageList];
    const index = newList.findIndex((v) => v.id === imageId);
    if (index > -1) {
        newList[index].answers[type] = value;
        dispatch({
            type: TEST_VIEW_CHANGE_IMAGE_LIST,
            payload: newList
        });
    }
};

export const setImageQuality = (imageId, value) => (dispatch, getState) => {
    const imageList = [...getState().testView.imageList];
    if (imageId === '') {
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

export const changeImageViewGrid = (rowCount, colCount) => (dispatch, getState) => {
    const oldList = getState().testView.showImageList.flat();
    const list = [];
    let imageIndex = 0;
    for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < colCount; j++) {
            if (imageIndex < oldList.length) {
                row.push(oldList[imageIndex]);
            } else {
                row.push('');
            }
            imageIndex++;
        }
        list.push(row);
    }

    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_RESET_ID,
            payload: Math.random().toString(36).substring(7),
        });
    });
};