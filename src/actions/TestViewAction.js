/**
 * Test View Actions
 */
import $ from 'jquery';
import {batch} from 'react-redux'
import {
    TEST_VIEW_SET_IMAGE_LIST,
    TEST_VIEW_CHANGE_IMAGE_LIST,
    TEST_VIEW_SET_SHOW_IMAGE_LIST,
    TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
    TEST_VIEW_SET_SHOW_IMAGE_BROWSER,
    TEST_VIEW_SET_HANGING_TYPE,
    TEST_VIEW_SET_RESET_ID,
    TEST_VIEW_SET_CASE_DENSITY,
    TEST_VIEW_SET_CURRENT_TOOL,
    TEST_VIEW_SET_THICKNESS_TYPE,
    TEST_VIEW_FOCUS_IMAGEVIEWER
} from 'Actions/types';
import {isMobile} from 'react-device-detect';

const breastPositions = [['CC', 'L'], ['CC', 'R'], ['MLO', 'L'], ['MLO', 'R']];

const getImageHangingIdList = (images) => {
    let hasAllTestImages = true;
    let hasAllPriorImages = true;
    let had3dImages = true;
    breastPositions.forEach((position) => {
        const testCount = images.filter((image) => {
            try {
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
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
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
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
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
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
                'MLO-L-P_MLO-L_CC-L-P_CC-L',
                'MLO-R_MLO-L_CC-R_CC-L_MLO-R-P_MLO-L-P_CC-R-P_CC-L-P'
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

const calcInitialZoomLevel = (showImageIds, totalImageObjList, isShowImageBrowser) => {
    if(showImageIds.length === 0 || showImageIds[0].length === 0) return 0;
    const imageObjList = showImageIds[0].map((v) => totalImageObjList.find((vv) => vv.id === v));
    const imageRow = showImageIds.length;
    // calculate for initial position
    try {
        // check all breast image
        if (imageObjList.some((v) => (v.metaData.imageLaterality === undefined || v.metaData.imageLaterality === ''))) {
            return 0;
        }
        // get canvas width, height
        let canvasWidth, canvasHeight;
        const canvasInstance = $('div#images');
        // if (canvasInstance.length === 0) {
        if (true) {
            //did not load
            canvasWidth = $(window).width();
            if(isShowImageBrowser) {
                canvasWidth = canvasWidth - 300;
            }
            canvasHeight = ($(window).height() - 80) / imageRow;
        } else {
            canvasWidth = canvasInstance.width();
            canvasHeight = canvasInstance.height() / imageRow;
        }
        let imgMaxRealWidth = 0;
        let imgMaxRealHeight = 0;
        imageObjList.forEach((img) => {
            try {
                const region = img.real_content_region.split(',');  //left,top,right,bottom
                if((Number(region[2]) - Number(region[0])) > imgMaxRealWidth) imgMaxRealWidth = (Number(region[2]) - Number(region[0]));
                if((Number(region[3]) - Number(region[1])) > imgMaxRealHeight) imgMaxRealHeight = (Number(region[3]) - Number(region[1]));
            } catch (e) {}
        });
        if(imgMaxRealWidth === 0 || imgMaxRealHeight === 0) return 0;
        const widthZoom = Number(((Math.floor(canvasWidth /  imageObjList.length)) / imgMaxRealWidth).toFixed(2));
        const heightZoom = Number((canvasHeight / imgMaxRealHeight).toFixed(2));
        if(widthZoom > heightZoom) return heightZoom;
        return widthZoom;
    } catch (e) {
    }
    return 0;
}

const getHangingImageOrder = (images, type, defaultImagesNumber, isForce = true, currentThicknessType) => {
    const typeArray = type.split('_');
    let idList = [];

    // input image ids
    if (type === 'MLO-R-3D_MLO-R_MLO-L_MLO-L-3D' || type === 'MLO-R-3D_MLO-L-3D') {
        // GE modality 3D hanging
        typeArray.forEach((v) => {
            let typeImage;
            if(v.indexOf('3D') === -1) {
                typeImage = images.find((vv) => vv.hangingId === (v + '-VPREVIEW'));
            } else {
                // select planes or slabs
                typeImage = images.filter((vv) => vv.hangingId === v).find((vv) => vv.metaData.positionDesc === 'GE-' + currentThicknessType);
            }

            if (typeImage !== undefined) {
                idList.push(typeImage.id);
            } else {
                const matchImage = images.find((vv) => vv.hangingId === v);
                if (matchImage !== undefined) idList.push(matchImage.id);
            }

        });
    } else {
        typeArray.forEach((v) => {
            const imageObj = images.find((vv) => vv.hangingId === v);
            if (imageObj !== undefined) {
                idList.push(imageObj.id);
            }
        });
    }

    // check for existing all images
    if (idList.length < typeArray.length && isForce) {
        images.forEach((v) => {
            if (idList.length < typeArray.length && idList.indexOf(v.id) === -1) idList.push(v.id);
        });
        idList = idList.slice(0, defaultImagesNumber);
    }
    if(type === 'MLO-R_MLO-L_CC-R_CC-L_MLO-R-P_MLO-L-P_CC-R-P_CC-L-P') {
        const firstRowIds = idList.splice(0, 4);
        return [firstRowIds, idList];
    } else {
        return [idList]  // 1 row x 0 column
    }

};

export const setImageListAction = (list, answer, toolList = [], defaultImagesNumber = 1, complete = false) => (dispatch, getState) => {
    const {selectedHangingType, currentThicknessType} = getState().testView;
    let isShowImageBrowser = getState().testView.isShowImageBrowser;
    if (list.length < 2 || isMobile) {
        isShowImageBrowser = false;
    } else {
        isShowImageBrowser = true;
    }
    let newList = list.map((v, i) => {
        let imageAnswers = answer.find((vv) => v.id === vv.id);
        const markList = [];
        imageAnswers.answers && imageAnswers.answers.forEach((mark) => {
            mark.isTruth = false;
            mark.lesionList = {};
            try {
                mark.lesionList = JSON.parse(mark.answer_lesion_list);
            } catch (e) {

            }
            markList.push(mark);
        });
        imageAnswers.truths && imageAnswers.truths.forEach((mark) => {
            mark.isTruth = true;
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

    // sort images by image type, postion
    newList.sort((a, b) => {
        return a.type > b.type ? -1 : a.type < b.type ? 1 : 0;
    });

    // check hanging type
    const {testSetHangingType, testSetHangingIdList} = getImageHangingIdList(newList)

    // set image's hangingId
    newList.forEach((image) => {
        try {
            // const metaData = JSON.parse(image.metadata);
            const metaData = image.metaData;
            breastPositions.forEach((position) => {
                if (metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]) {
                    if (testSetHangingType !== 'breastWith3D') {
                        if (image.type === 'test') {
                            image.hangingId = position[0] + '-' + position[1];
                        } else if (image.type === 'prior') {
                            image.hangingId = position[0] + '-' + position[1] + '-P';
                        } else {
                            image.hangingId = '';
                        }
                    } else {
                        if (image.stack_count === 1) {
                            image.hangingId = position[0] + '-' + position[1];
                        } else {
                            image.hangingId = position[0] + '-' + position[1] + '-3D';
                        }
                        if (metaData.positionDesc === 'V-PREVIEW') {
                            image.hangingId += '-VPREVIEW'
                        }
                    }
                }

            });
        } catch (e) {
            image.hangingId = '';
        }
    });

    let showImageList, initialZoomLevel;
    const volparaImage = newList.find((v) => v.type === 'volpara');
    let volparaImageId;
    if (volparaImage !== undefined) {
        volparaImageId = volparaImage.id;
        const imageLine1 = getHangingImageOrder(
            newList.filter(image => (image.type === 'test' || image.type === 'prior')),
            "CC-R_CC-L", defaultImagesNumber,
            false, currentThicknessType)[0];
        const imageLine2 = getHangingImageOrder(
            newList.filter(image => (image.type === 'test' || image.type === 'prior')),
            "MLO-R_MLO-L", defaultImagesNumber,
            false, currentThicknessType)[0];
        showImageList = [imageLine1, imageLine2];
        initialZoomLevel = 0;
    } else {
        showImageList = getHangingImageOrder(
            newList.filter(image => (image.type === 'test' || image.type === 'prior')),
            selectedHangingType, defaultImagesNumber,
            true, currentThicknessType);
        initialZoomLevel = calcInitialZoomLevel(showImageList, newList, isShowImageBrowser);
    }
    showImageList = showImageList.filter((v) => v.length !== 0);
    const thicknessImageCount = newList.filter((v) => v.metaData.positionDesc === 'GE-PLANES' || v.metaData.positionDesc === 'GE-SLABS').length;
    dispatch({
        type: TEST_VIEW_SET_IMAGE_LIST,
        imageList: newList,
        showImageList,
        isShowImageBrowser,
        initialZoomLevel,
        testSetHangingIdList,
        selectedHangingType: 'MLO-R_MLO-L_CC-R_CC-L',
        defaultImagesNumber,
        volparaImageId,
        toolList: toolList,
        currentTool: 'Pan',
        currentThicknessType: thicknessImageCount >= 4 ? 'SLABS' : 'NOTHICKNESS',
    });
};

export const changeHangingLayout = (type) => (dispatch, getState) => {
    const {imageList, defaultImagesNumber, isShowImageBrowser} = getState().testView;
    const list = getHangingImageOrder(imageList, type, defaultImagesNumber, true, getState().testView.currentThicknessType);
    const initialZoomLevel = calcInitialZoomLevel(list, imageList, isShowImageBrowser);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: initialZoomLevel,
        });
        dispatch({
            type: TEST_VIEW_SET_RESET_ID,
            payload: Math.random().toString(36).substring(7),
        });
        dispatch({
            type: TEST_VIEW_SET_HANGING_TYPE,
            payload: type
        });
        dispatch({
            type: TEST_VIEW_FOCUS_IMAGEVIEWER,
            payload: '-1_-1'
        });
    });
};

export const dropImage = (id, rowIndex, colIndex) => (dispatch, getState) => {
    if (rowIndex === undefined || colIndex === undefined) return;
    const showImageList = [...getState().testView.showImageList];
    showImageList[rowIndex][colIndex] = id;
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: showImageList,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: 0,
        });
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

export const setCaseDensity = (value) => (dispatch, getState) => {
    dispatch({
        type: TEST_VIEW_SET_CASE_DENSITY,
        payload: value
    });
};

export const changeCurrentTool = (tool) => (dispatch) => {
    dispatch({
        type: TEST_VIEW_SET_CURRENT_TOOL,
        payload: tool
    });
};

export const changeImageViewGrid = (rowCount, colCount) => (dispatch, getState) => {
    const {imageList, showImageList, isShowImageBrowser} = getState().testView;
    const oldList = showImageList.flat();
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
    const initialZoomLevel = calcInitialZoomLevel(list, imageList, isShowImageBrowser);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: initialZoomLevel,
        });
        dispatch({
            type: TEST_VIEW_SET_RESET_ID,
            payload: Math.random().toString(36).substring(7),
        });
        dispatch({
            type: TEST_VIEW_FOCUS_IMAGEVIEWER,
            payload: '-1_-1',
        });
    });
};

export const changeThicknessType = (thicknessType) => (dispatch, getState) => {
    const {imageList, defaultImagesNumber, selectedHangingType, isShowImageBrowser} = getState().testView;
    const list = getHangingImageOrder(imageList, selectedHangingType, defaultImagesNumber, true, thicknessType);
    const initialZoomLevel = calcInitialZoomLevel(list, imageList, isShowImageBrowser);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: initialZoomLevel,
        });
        dispatch({
            type: TEST_VIEW_SET_RESET_ID,
            payload: Math.random().toString(36).substring(7),
        });
        dispatch({
            type: TEST_VIEW_SET_THICKNESS_TYPE,
            payload: thicknessType
        });
    });
};

export const focusImageViewer = (viewerIndex) =>(dispatch, getState) => {
    dispatch({
        type: TEST_VIEW_FOCUS_IMAGEVIEWER,
        payload: viewerIndex
    });
}