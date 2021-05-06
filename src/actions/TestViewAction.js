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
const gePositions = [['GE-V-PREVIEW', 'L'], ['GE-V-PREVIEW', 'R'], ['GE-PLANES', 'L'], ['GE-PLANES', 'R'], ['GE-SLABS', 'L'], ['GE-SLABS', 'R']]

const hangingIdList = {
    normalHangings: [],
    breastHangings:[
        'MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R_MLO-L',
        'CC-R_CC-L',
        'CC-R_MLO-R',
        'CC-L_MLO-L',
    ],
    breastOnly3DHangings:[
        'MLO-R-3D_MLO-L-3D_CC-R-3D_CC-L-3D',
        'MLO-R-3D_MLO-L-3D',
        'CC-R-3D_CC-L-3D',
        'CC-R-3D_MLO-R-3D',
        'CC-L-3D_MLO-L-3D',
    ],
    breastPriorHangings: [
        'MLO-R_MLO-L_CC-R_CC-L_MLO-R-P_MLO-L-P_CC-R-P_CC-L-P',
        'MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R_MLO-L',
        'MLO-R_MLO-R-P',
        'MLO-L_MLO-L-P',
        'CC-R_CC-L',
        'CC-R_CC-R-P',
        'CC-L_CC-L-P',
        'CC-R_CC-R-P_MLO-R_MLO-R-P',
        'MLO-L-P_MLO-L_CC-L-P_CC-L'
    ],
    breast3DHangings: [
        'MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R_MLO-L',
        'MLO-R_MLO-R-3D',
        'MLO-L_MLO-L-3D',
        'CC-R_CC-L',
        'CC-R_CC-R-3D',
        'CC-L_CC-L-3D'
    ],
    breastPrior3DHangings: [
        'MLO-R_MLO-L_CC-R_CC-L_MLO-R-P_MLO-L-P_CC-R-P_CC-L-P',
        'MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R_MLO-L',
        'MLO-R_MLO-R-P',
        'MLO-R_MLO-R-3D',
        'MLO-L_MLO-L-P',
        'MLO-L_MLO-L-3D',
        'CC-R_CC-L',
        'CC-R_CC-R-P',
        'CC-R_CC-R-3D',
        'CC-L_CC-L-P',
        'CC-L_CC-L-3D',
    ],
    breastGEHangings: [
        'MLO-R_MLO-L_CC-R_CC-L',
        'CC-R_CC-L',
        'MLO-R_MLO-L',
        'MLO-R-3D-GE_MLO-R-GE_MLO-L-GE_MLO-L-3D-GE',
        'MLO-R-3D-GE_MLO-L-3D-GE'
    ],
    volparaHangings: [
        'VOLPARA_MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R_MLO-L',
        'CC-R_CC-L',
        'CC-R_MLO-R',
        'CC-L_MLO-L',
    ],
}

const getImageHangingType = (images) => {
    let hasAllBreastImages = true;
    let hasAllPriorImages = true;
    let hasAll2DImages = true;
    let hasAll3DImages = true;
    let hasAllGEImages = true;
    let hasVolparaImage = false;

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
        if (testCount < 1) hasAllBreastImages = false;

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

        const twoCount = images.filter((image) => {
            try {
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
                return (image.type === 'test' &&
                    image.stack_count === 1 &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if (twoCount < 1) hasAll2DImages = false;

        const thirdCount = images.filter((image) => {
            try {
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
                return (image.type === 'test' &&
                    image.stack_count > 1 &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if (thirdCount < 1) hasAll3DImages = false;
    });

    gePositions.forEach((position) => {
        const count = images.filter((image) => {
            try {
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
                return (
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf('MLO') > -1 &&
                    metaData.positionDesc !== undefined && metaData.positionDesc === position[0] &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if (count < 1) hasAllGEImages = false;
    })

    if(images.some((image) => image.type === 'volpara')) hasVolparaImage = true;
    if(hasVolparaImage && hasAllBreastImages) {
        return 'volparaHangings'
    } else if(hasAllGEImages && hasAllBreastImages) {
        return 'breastGEHangings';
    } else if(hasAllPriorImages && hasAll3DImages && hasAll2DImages) {
        return 'breastPrior3DHangings';
    } else if(hasAllPriorImages && hasAllBreastImages) {
        return 'breastPriorHangings';
    } else if(hasAll3DImages && hasAll2DImages) {
        return 'breast3DHangings';
    } else if(hasAll3DImages && !hasAll2DImages) {
        return 'breastOnly3DHangings';
    } else if(hasAllBreastImages) {
        return 'breastHangings';
    } else {
        return 'normalHangings';
    }
}

const calcInitialZoomLevel = (showImageIds, totalImageObjList, isShowImageBrowser, testSetHangingType) => {
    let initialZoomLevel = 0;
    let imgMLOMaxRealHeight = 0;
    if(showImageIds.length === 0 || showImageIds[0].length === 0) {
        initialZoomLevel = 0;
    } else {
        const imageObjList = showImageIds[0].map((v) => totalImageObjList.find((vv) => vv.id === v));
        const imageRow = showImageIds.length;
        // calculate for initial position
        try {
            // check all breast image
            if (imageObjList.some((v) => (v.metaData.imageLaterality === undefined || v.metaData.imageLaterality === ''))) {
                initialZoomLevel = 0;
            } else {
                // get canvas width, height
                let canvasWidth, canvasHeight;
                const canvasInstance = $('div#images');
                // if (canvasInstance.length === 0) {
                if (true) {
                    //did not load
                    canvasWidth = $(window).width();
                    if (isShowImageBrowser) {
                        canvasWidth = canvasWidth - 300;
                    }
                    if(testSetHangingType === 'volparaHangings') {
                        canvasWidth = canvasWidth / 2
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
                        img.realContentLeft = Number(region[0]);
                        img.realContentTop = Number(region[1]);
                        img.realContentRight = Number(region[2]);
                        img.realContentBottom = Number(region[3]);
                        if ((Number(region[2]) - Number(region[0])) > imgMaxRealWidth) imgMaxRealWidth = (Number(region[2]) - Number(region[0]));
                        if ((Number(region[3]) - Number(region[1])) > imgMaxRealHeight) {
                            imgMaxRealHeight = (Number(region[3]) - Number(region[1]));
                            if (img.hangingId.indexOf('MLO') !== -1 && imgMLOMaxRealHeight < imgMaxRealHeight) {
                                imgMLOMaxRealHeight = imgMaxRealHeight;
                            }
                        }
                    } catch (e) {
                    }
                });
                if (imgMaxRealWidth === 0 || imgMaxRealHeight === 0) {
                    initialZoomLevel = 0;
                } else {
                    const widthZoom = Number(((Math.floor(canvasWidth / imageObjList.length)) / imgMaxRealWidth).toFixed(2));
                    const heightZoom = Number((canvasHeight / imgMaxRealHeight).toFixed(2));
                    initialZoomLevel = Math.min(widthZoom, heightZoom);
                }
            }
        } catch (e) {
        }
    }
    return {initialZoomLevel, imgMLOMaxRealHeight};
}

const getHangingImageOrder = (images, type, defaultImagesNumber, isForce = true, currentThicknessType) => {
    const typeArray = type.split('_');
    let idList = [];


    typeArray.forEach((v) => {
        let imageObj;
        if(v.indexOf('3D-GE') !== -1) {
            // GE
            imageObj = images.find((vv) => (vv.hangingId === v && vv.metaData.positionDesc === 'GE-' + currentThicknessType));
        } else {
            imageObj = images.find((vv) => vv.hangingId === v);
        }
        if (imageObj !== undefined) {
            idList.push(imageObj.id);
        }
    });
    // input image ids
    // if (type === 'MLO-R-3D_MLO-R_MLO-L_MLO-L-3D' || type === 'MLO-R-3D_MLO-L-3D') {
    //     // GE modality 3D hanging
    //     typeArray.forEach((v) => {
    //         let typeImage;
    //         if(v.indexOf('3D') === -1) {
    //             typeImage = images.find((vv) => vv.hangingId === (v + '-VPREVIEW'));
    //         } else {
    //             // select planes or slabs
    //             typeImage = images.filter((vv) => vv.hangingId === v).find((vv) => vv.metaData.positionDesc === 'GE-' + currentThicknessType);
    //         }
    //
    //         if (typeImage !== undefined) {
    //             idList.push(typeImage.id);
    //         } else {
    //             const matchImage = images.find((vv) => vv.hangingId === v);
    //             if (matchImage !== undefined) idList.push(matchImage.id);
    //         }
    //
    //     });
    // } else {
    //     typeArray.forEach((v) => {
    //         const imageObj = images.find((vv) => vv.hangingId === v);
    //         if (imageObj !== undefined) {
    //             idList.push(imageObj.id);
    //         }
    //     });
    // }

    // check for existing all images
    if (idList.length < typeArray.length && isForce) {
        images.forEach((v) => {
            if (idList.length < typeArray.length && idList.indexOf(v.id) === -1) idList.push(v.id);
        });
        idList = idList.slice(0, defaultImagesNumber);
    }
    if(type === 'MLO-R_MLO-L_CC-R_CC-L_MLO-R-P_MLO-L-P_CC-R-P_CC-L-P') {
        // two line grid
        const firstRowIds = idList.splice(0, 4);
        return [firstRowIds, idList];
    } else if(type === 'VOLPARA_MLO-R_MLO-L_CC-R_CC-L') {
        // volpara image grid
        const firstRowIds = idList.splice(0, 2);
        return [firstRowIds, idList];
    } else {
        return [idList]  // 1 row x 0 column
    }

};

export const setImageListAction = (list, answer, toolList = [], defaultImagesNumber = 1, complete = false) => (dispatch, getState) => {
    const {currentThicknessType} = getState().testView;
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
        imageAnswers.truth_shapes && imageAnswers.truth_shapes.forEach((shape) => {
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
    const testSetHangingType = getImageHangingType(newList);
    const testSetHangingIdList = hangingIdList[testSetHangingType];
    const selectedHangingType = hangingIdList[testSetHangingType].length > 0 ? hangingIdList[testSetHangingType][0] : '';

    // set image's hangingId
    newList.forEach((image) => {
        try {
            // const metaData = JSON.parse(image.metadata);
            const metaData = image.metaData;
            breastPositions.forEach((position) => {
                if (metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]) {

                    if (image.type === 'test') {
                        image.hangingId = position[0] + '-' + position[1];
                        if (image.stack_count > 1) {
                            image.hangingId += '-3D';
                        }
                        if(metaData.positionDesc.indexOf('GE-') === 0) {
                            image.hangingId += '-GE';
                        }
                    } else if (image.type === 'prior') {
                        image.hangingId = position[0] + '-' + position[1] + '-P';
                    } else {
                        image.hangingId = '';
                    }
                }

            });
        } catch (e) {
            image.hangingId = '';
        }
    });

    let showImageList;
    const volparaImage = newList.find((v) => v.type === 'volpara');
    let volparaImageId;
    if (volparaImage !== undefined) {
        volparaImageId = volparaImage.id;
        // const imageLine1 = getHangingImageOrder(
        //     newList.filter(image => (image.type === 'test' || image.type === 'prior')),
        //     "CC-R_CC-L", defaultImagesNumber,
        //     false, currentThicknessType)[0];
        // const imageLine2 = getHangingImageOrder(
        //     newList.filter(image => (image.type === 'test' || image.type === 'prior')),
        //     "MLO-R_MLO-L", defaultImagesNumber,
        //     false, currentThicknessType)[0];
        // showImageList = [imageLine1, imageLine2];

        showImageList = getHangingImageOrder(newList.filter(image => (image.type === 'test' || image.type === 'prior')), selectedHangingType, defaultImagesNumber, false, currentThicknessType);

    } else {
        showImageList = getHangingImageOrder(
            newList.filter(image => (image.type === 'test' || image.type === 'prior')),
            selectedHangingType, defaultImagesNumber,
            true, currentThicknessType);
    }
    const initZoomResult = calcInitialZoomLevel(showImageList, newList, isShowImageBrowser, testSetHangingType);
console.log(testSetHangingType, 'asdfwefasdf')
    showImageList = showImageList.filter((v) => v.length !== 0);
    const thicknessImageCount = newList.filter((v) => v.metaData.positionDesc === 'GE-PLANES' || v.metaData.positionDesc === 'GE-SLABS').length;
    dispatch({
        type: TEST_VIEW_SET_IMAGE_LIST,
        imageList: newList,
        showImageList,
        isShowImageBrowser,
        initialZoomLevel: initZoomResult.initialZoomLevel,
        imgMLOMaxRealHeight: initZoomResult.imgMLOMaxRealHeight,
        testSetHangingType,
        testSetHangingIdList,
        selectedHangingType,
        defaultImagesNumber,
        volparaImageId,
        toolList: toolList,
        currentTool: 'Pan',
        currentThicknessType: thicknessImageCount >= 4 ? 'SLABS' : 'NOTHICKNESS',
    });
};

export const changeHangingLayout = (type) => (dispatch, getState) => {
    const {imageList, defaultImagesNumber, isShowImageBrowser, testSetHangingType, selectedHangingType, testSetHangingIdList} = getState().testView;
    if(type === 'next') {
        if(testSetHangingIdList.length === 0) return;
        const i = testSetHangingIdList.findIndex((v) => v === selectedHangingType);
        if(i !== -1) {
            type = i === testSetHangingIdList.length - 1 ? testSetHangingIdList[0] : testSetHangingIdList[i + 1];
        } else {
            type = '';
        }
    } else if(type === 'reset') {
        type = testSetHangingIdList.length > 0 ? testSetHangingIdList[0] : '';
    }
    const list = getHangingImageOrder(imageList, type, defaultImagesNumber, true, getState().testView.currentThicknessType);
    const { initialZoomLevel, imgMLOMaxRealHeight } = calcInitialZoomLevel(list, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: { initialZoomLevel, imgMLOMaxRealHeight},
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
    const {imageList, showImageList, isShowImageBrowser, testSetHangingType} = getState().testView;
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
    const { initialZoomLevel, imgMLOMaxRealHeight } = calcInitialZoomLevel(list, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: { initialZoomLevel, imgMLOMaxRealHeight },
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
    const {imageList, defaultImagesNumber, selectedHangingType, isShowImageBrowser, testSetHangingType} = getState().testView;
    const list = getHangingImageOrder(imageList, selectedHangingType, defaultImagesNumber, true, thicknessType);
    const { initialZoomLevel, imgMLOMaxRealHeight } = calcInitialZoomLevel(list, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: { initialZoomLevel, imgMLOMaxRealHeight },
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