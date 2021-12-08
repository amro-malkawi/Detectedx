/**
 * Test View Actions
 */
import cornerstone from 'cornerstone-core';
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
    TEST_VIEW_FOCUS_IMAGEVIEWER,
    TEST_VIEW_MODALITY_INFO,
    TEST_VIEW_ATTEMPT_INFO
} from 'Actions/types';
import {isMobile} from 'react-device-detect';

const breastPositions = [['CC', 'L'], ['CC', 'R'], ['MLO', 'L'], ['MLO', 'R']];
const geTypes = ['GE-PLANES', 'GE-SLABS', 'GE-V-PREVIEW'];
const gePositions = [['GE-V-PREVIEW', 'L'], ['GE-V-PREVIEW', 'R'], ['GE-PLANES', 'L'], ['GE-PLANES', 'R'], ['GE-SLABS', 'L'], ['GE-SLABS', 'R']];

const hangingIdList = {
    normalHangings: [],
    breastHangings: [
        'MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R_MLO-L',
        'CC-R_CC-L',
        'CC-R_MLO-R',
        'CC-L_MLO-L',
    ],
    breastOnly3DHangings: [
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
    breastCESMHangings: [
        'MLO-R_MLO-L_CC-R_CC-L',
        'MLO-R-CESM_MLO-L-CESM_CC-R-CESM_CC-L-CESM',
        'MLO-R_MLO-L_CC-R_CC-L_MLO-R-CESM_MLO-L-CESM_CC-R-CESM_CC-L-CESM',
        'MLO-R_MLO-R-CESM',
        'MLO-L_MLO-L-CESM',
        'CC-R_CC-R-CESM',
        'CC-L_CC-L-CESM',
        'CC-R_CC-R-CESM_MLO-R_MLO-R-CESM',
        'MLO-L-CESM_MLO-L_CC-L-CESM_CC-L'
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
    breastGE3DHangings: [
        'MLO-R-3D-GE_MLO-L-3D-GE_CC-R-3D-GE_CC-L-3D-GE',
        'MLO-R-GE_MLO-L-GE_CC-R-GE_CC-L-GE',
        'CC-R-3D-GE_CC-R-GE_CC-L-GE_CC-L-3D-GE',
        'MLO-R-3D-GE_MLO-R-GE_MLO-L-GE_MLO-L-3D-GE',
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
    chestHangings: [],
}

const getImageHangingType = (images) => {
    // check Breast hangings
    let hasAllBreastImages = true;
    let hasAllPriorImages = true;
    let hasAllCESMImages = true;
    let hasAll2DImages = true;
    let hasAll3DImages = true;
    let hasAllGE3DImages = true;
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

        const cesmCount = images.filter((image) => {
            try {
                // const metaData = JSON.parse(image.metadata);
                const metaData = image.metaData;
                return (image.type === 'cesm' &&
                    metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1])
            } catch (e) {
                return false;
            }
        }).length;
        if (cesmCount < 1) hasAllCESMImages = false;

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

    geTypes.forEach((geType) => {
        breastPositions.forEach((position) => {
            const geBreastImageCount = images.filter((image) => {
                try {
                    const metaData = image.metaData;
                    return (
                        image.type === 'test' &&
                        metaData.positionDesc === geType &&
                        metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                        metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]
                    )
                } catch (e) {
                    return false;
                }
            }).length;
            if (geBreastImageCount < 1) hasAllGE3DImages = false;
        });
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

    if (images.some((image) => image.type === 'volpara')) hasVolparaImage = true;
    if (hasVolparaImage && hasAllBreastImages) {
        return 'volparaHangings'
    } else if (hasAllGE3DImages) {
        return 'breastGE3DHangings';
    } else if (hasAllGEImages && hasAllBreastImages) {
        return 'breastGEHangings';
    } else if (hasAllPriorImages && hasAll3DImages && hasAll2DImages) {
        return 'breastPrior3DHangings';
    } else if (hasAllPriorImages && hasAllBreastImages) {
        return 'breastPriorHangings';
    } else if (hasAllCESMImages && hasAllBreastImages) {
        return 'breastCESMHangings';
    } else if (hasAll3DImages && hasAll2DImages) {
        return 'breast3DHangings';
    } else if (hasAll3DImages && !hasAll2DImages) {
        return 'breastOnly3DHangings';
    } else if (hasAllBreastImages) {
        return 'breastHangings';
    }

    // check chest hangings
    // check exist chest main image
    const isExistCaseImage = images.some((image) => {
        const chestProfusion = cornerstone.metaData.get('chestProfusion', image.id)
        return chestProfusion === 'Case';
    });
    if (isExistCaseImage) {
        let isChestHanging = false;
        images.forEach((image) => {
            const chestProfusion = cornerstone.metaData.get('chestProfusion', image.id)
            if (chestProfusion) {
                // reset chest hanging list
                if (!isChestHanging) {
                    hangingIdList.chestHangings = [];
                    isChestHanging = true;
                }
                hangingIdList.chestHangings.push(chestProfusion !== 'Case' ? 'Case_' + chestProfusion : chestProfusion);
            }
        });
        if (isChestHanging) return 'chestHangings';
    }

    // no hangings
    return 'normalHangings';
}

const calcInitialZoomLevel = (showImageIds, totalImageObjList, isShowImageBrowser, testSetHangingType) => {
    let initialZoomLevel = []; // 0
    let imgMLOMaxRealHeight = 0;
    if (showImageIds.length === 0 || showImageIds[0].length === 0) {
        initialZoomLevel = [];
    } else {
        const imageObjList = showImageIds[0].map((v) => totalImageObjList.find((vv) => vv.id === v));
        const imageRow = showImageIds.length;
        // calculate for initial position
        try {
            // check all breast image
            if (imageObjList.every((v) => (v.metaData.imageLaterality === undefined || v.metaData.imageLaterality === ''))) {
                initialZoomLevel = [];
            } else {
                // get canvas width, height
                let canvasWidth, canvasHeight;
                const canvasInstance = $('div#images');
                if (canvasInstance.length === 0 || canvasInstance.width() === 0) {
                // if (true) {
                    //did not load
                    canvasWidth = $(window).width();
                    if (isShowImageBrowser) {
                        canvasWidth = canvasWidth - 300;
                    }
                    if (testSetHangingType === 'volparaHangings' || totalImageObjList.some((v) => v.type === 'volpara')) {
                        canvasWidth = canvasWidth / 2
                    }
                    canvasHeight = $(window).height() - 80;
                } else {
                    canvasWidth = canvasInstance.width();
                    canvasHeight = canvasInstance.height();
                }
                canvasWidth = Math.floor(canvasWidth / imageObjList.length);
                canvasHeight = Math.floor(canvasInstance.height() / imageRow);

                let imgMinShowHeight = 0;  // CC or other image min height
                let imgMinMLOShowHeight = 0; // MLO image min height
                imageObjList.forEach((img) => {
                    const region = img.real_content_region.split(',');  //left,top,right,bottom
                    img.realContentLeft = Number(region[0]);
                    img.realContentTop = Number(region[1]);
                    img.realContentRight = Number(region[2]);
                    img.realContentBottom = Number(region[3]);
                    img.realHeight = Math.abs(img.realContentBottom - img.realContentTop);
                    img.realWidth = Math.abs(img.realContentRight - img.realContentLeft);
                    const zoomLevel = Math.min(canvasHeight / img.realHeight, canvasWidth / img.realWidth);
                    if (img.hangingId && img.hangingId.indexOf('MLO') !== -1) {
                        if(imgMinMLOShowHeight === 0 || img.realHeight * zoomLevel < imgMinMLOShowHeight) imgMinMLOShowHeight = img.realHeight * zoomLevel;
                    } else {
                        if(imgMinShowHeight === 0 || img.realHeight * zoomLevel < imgMinShowHeight) imgMinShowHeight = img.realHeight * zoomLevel;
                    }
                });

                imageObjList.forEach((img) => {
                    if (img.hangingId && img.hangingId.indexOf('MLO') !== -1) {
                        if(imgMinMLOShowHeight !== 0) {
                            initialZoomLevel.push({
                                zoom_image_id: img.id,
                                zoom_level: Math.floor((imgMinMLOShowHeight / img.realHeight) * 100) / 100,
                                zoom_real_height: imgMinMLOShowHeight
                            });
                        }
                    } else {
                        if(imgMinShowHeight !== 0) {
                            initialZoomLevel.push({
                                zoom_image_id: img.id,
                                zoom_level: Math.floor((imgMinShowHeight / img.realHeight) * 100) / 100,
                                zoom_real_height: imgMinShowHeight
                            });
                        }
                    }
                });


                // let imgMaxRealWidth = 0;
                // let imgMaxRealHeight = 0;
                // imageObjList.forEach((img) => {
                //     try {
                //         const region = img.real_content_region.split(',');  //left,top,right,bottom
                //         img.realContentLeft = Number(region[0]);
                //         img.realContentTop = Number(region[1]);
                //         img.realContentRight = Number(region[2]);
                //         img.realContentBottom = Number(region[3]);
                //         if ((Number(region[2]) - Number(region[0])) > imgMaxRealWidth) imgMaxRealWidth = (Number(region[2]) - Number(region[0]));
                //         if ((Number(region[3]) - Number(region[1])) > imgMaxRealHeight) {
                //             imgMaxRealHeight = (Number(region[3]) - Number(region[1]));
                //             if (img.hangingId && img.hangingId.indexOf('MLO') !== -1 && imgMLOMaxRealHeight < imgMaxRealHeight) {
                //                 imgMLOMaxRealHeight = imgMaxRealHeight;
                //             }
                //         }
                //         if (imgMaxRealWidth === 0 || imgMaxRealHeight === 0) {
                //             initialZoomLevel = [];
                //         } else {
                //             const widthZoom = Number((canvasWidth / imgMaxRealWidth).toFixed(2));
                //             const heightZoom = Number((canvasHeight / imgMaxRealHeight).toFixed(2));
                //             const calculatedZoomValue = Math.min(widthZoom, heightZoom);
                //             const zoomResult = {
                //                 zoom_image_id: img.id,
                //                 zoom_level: calculatedZoomValue,
                //                 zoom_real_height: imgMLOMaxRealHeight
                //             }
                //             initialZoomLevel.push(zoomResult)
                //         }
                //     } catch (e) {
                //     }
                // });
            }
        } catch (e) {
            console.log('zoom level error', e)
        }
    }
    return { initialZoomLevel};
}

const getHangingImageOrder = (images, type, defaultImagesNumber, isForce = true, currentThicknessType) => {
    const typeArray = type.split('_');
    let idList = [];

    typeArray.forEach((v) => {
        let imageObj;
        if (v.indexOf('3D-GE') !== -1) {
            // GE
            imageObj = images.find((vv) => (vv.hangingId === v && vv.metaData.positionDesc === 'GE-' + currentThicknessType));
        } else {
            imageObj = images.find((vv) => vv.hangingId === v);
        }
        if (imageObj !== undefined) {
            idList.push(imageObj.id);
        }
    });

    // check for existing all images
    if(type === '') {
        idList = images.map(v => v.id).slice(0, defaultImagesNumber);
    } else if (idList.length < typeArray.length && isForce) {
        images.forEach((v) => {
            if (idList.length < typeArray.length && idList.indexOf(v.id) === -1) idList.push(v.id);
        });
        idList = idList.slice(0, defaultImagesNumber);
    }
    if (type === 'VOLPARA_MLO-R_MLO-L_CC-R_CC-L') {
        // volpara image grid
        const firstRowIds = idList.splice(0, 2);
        return [firstRowIds, idList];
    } else if (typeArray.length > 4) {
        // two line grid
        const firstRowIds = idList.splice(0, 4);
        return [firstRowIds, idList];
    } else {
        return [idList]  // 1 row x 0 column
    }

};

export const setImageListAction = (list, answer, toolList = [], defaultImagesNumber = 1, complete = false, isShowImageBrowser = true) => (dispatch, getState) => {
    if (isMobile) {
        isShowImageBrowser = false;
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
        newList = newList.filter(image => (['test', 'prior', 'cesm', 'ultrasound'].indexOf(image.type) !== -1));
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
            // breast image hanging id
            const metaData = image.metaData;
            breastPositions.forEach((position) => {
                if (metaData.viewPosition !== undefined && metaData.viewPosition.toUpperCase().indexOf(position[0]) > -1 &&
                    metaData.imageLaterality !== undefined && metaData.imageLaterality === position[1]) {
                    if (image.type === 'test') {
                        image.hangingId = position[0] + '-' + position[1];
                        if (image.stack_count > 1) {
                            image.hangingId += '-3D';
                        }
                        if (metaData.positionDesc.indexOf('GE-') === 0) {
                            image.hangingId += '-GE';
                        }
                    } else if (image.type === 'prior') {
                        image.hangingId = position[0] + '-' + position[1] + '-P';
                    } else if (image.type === 'cesm') {
                        image.hangingId = position[0] + '-' + position[1] + '-CESM';
                    } else {
                        image.hangingId = '';
                    }
                }
            });

            // check chest hanging
            const chestProfusion = cornerstone.metaData.get('chestProfusion', image.id)
            if (chestProfusion) {
                image.hangingId = chestProfusion;
            }

            // check ultrasound hanging
            if(image.type === 'ultrasound') {
                image.hangingId = 'ULTRASOUND';
            }

        } catch (e) {
            image.hangingId = '';
        }
    });

    let showImageList;
    const currentThicknessType = (newList.filter((v) => v.metaData.positionDesc === 'GE-PLANES' || v.metaData.positionDesc === 'GE-SLABS').length >= 4) ?  'SLABS' : 'NOTHICKNESS';
    const volparaImage = newList.find((v) => v.type === 'volpara');
    let volparaImageId;
    if (volparaImage !== undefined) {
        // show volpara image when test was completed
        volparaImageId = volparaImage.id;
        showImageList = getHangingImageOrder(
            newList.filter(image => (['test', 'prior', 'cesm', 'ultrasound'].indexOf(image.type) !== -1)),
            selectedHangingType, defaultImagesNumber, false, currentThicknessType
        );
    } else if (newList.filter((v) => v.type === 'ultrasound').length > 0) {
        // for Ultrasound modality
        const uImageIds = newList.filter((v) => v.type === 'ultrasound').map((v) => v.id);
        if(!complete) {
            // while test, hanging is 4 x ultrasound image.
            if(uImageIds.length >= 4) {
                showImageList = [uImageIds.splice(0, 2), uImageIds.splice(0, 2)];
            } else {
                showImageList = [uImageIds];
            }
        } else {
            // when complete, show 2 x ultrasound + 2 x breast image
            showImageList = [uImageIds.splice(0, 2)];
            const bImageIds = newList.filter((v) => v.type !== 'ultrasound').map((v) => v.id);
            if(bImageIds.length > 0) {
                showImageList.push(bImageIds.splice(0, 2));
            }
        }
    } else {
        showImageList = getHangingImageOrder(
            newList.filter(image => (['test', 'prior', 'cesm', 'ultrasound'].indexOf(image.type) !== -1)),
            selectedHangingType, defaultImagesNumber,
            true, currentThicknessType
        );
    }
    const initZoomResult = calcInitialZoomLevel(showImageList, newList, isShowImageBrowser, testSetHangingType);
    showImageList = showImageList.filter((v) => v.length !== 0);
    dispatch({
        type: TEST_VIEW_SET_IMAGE_LIST,
        imageList: newList,
        showImageList,
        isShowImageBrowser,
        initialZoomLevel: initZoomResult.initialZoomLevel,
        testSetHangingType,
        testSetHangingIdList,
        selectedHangingType,
        defaultImagesNumber,
        volparaImageId,
        toolList: toolList,
        currentTool: 'Pan',
        currentThicknessType,
    });
};

export const changeHangingLayout = (type) => (dispatch, getState) => {
    const {imageList, defaultImagesNumber, isShowImageBrowser, testSetHangingType, selectedHangingType, testSetHangingIdList} = getState().testView;
    if (type === 'next') {
        if (testSetHangingIdList.length === 0) return;
        const i = testSetHangingIdList.findIndex((v) => v === selectedHangingType);
        if (i !== -1) {
            type = i === testSetHangingIdList.length - 1 ? testSetHangingIdList[0] : testSetHangingIdList[i + 1];
        } else {
            type = '';
        }
    } else if (type === 'reset') {
        type = testSetHangingIdList.length > 0 ? testSetHangingIdList[0] : '';
    }
    const list = getHangingImageOrder(imageList, type, defaultImagesNumber, true, getState().testView.currentThicknessType);
    const {initialZoomLevel} = calcInitialZoomLevel(list, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: {initialZoomLevel},
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
    const { imageList, isShowImageBrowser, testSetHangingType } = getState().testView;
    if (rowIndex === undefined || colIndex === undefined) return;
    const showImageList = [...getState().testView.showImageList];
    showImageList[rowIndex][colIndex] = id;
    const { initialZoomLevel } = calcInitialZoomLevel(showImageList, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: showImageList,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: { initialZoomLevel },
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

export const changeCurrentTool = (tool) => (dispatch, getState) => {
    const toolList = getState().testView.toolList;
    if(toolList.indexOf(tool) !== -1) {
        dispatch({
            type: TEST_VIEW_SET_CURRENT_TOOL,
            payload: tool
        });
    }
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
    const {initialZoomLevel} = calcInitialZoomLevel(list, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: {initialZoomLevel},
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
    const {initialZoomLevel} = calcInitialZoomLevel(list, imageList, isShowImageBrowser, testSetHangingType);
    batch(() => {
        dispatch({
            type: TEST_VIEW_SET_SHOW_IMAGE_LIST,
            payload: list,
        });
        dispatch({
            type: TEST_VIEW_SET_INITIAL_ZOOM_LEVEL,
            payload: {initialZoomLevel},
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

export const focusImageViewer = (viewerIndex) => (dispatch, getState) => {
    dispatch({
        type: TEST_VIEW_FOCUS_IMAGEVIEWER,
        payload: viewerIndex
    });
}

export const setModalityInfo = (modalityInfo) => (dispatch) => {
    dispatch({
        type: TEST_VIEW_MODALITY_INFO,
        payload: modalityInfo
    })
}

export const setAttemptInfo = (data) => (dispatch) => {
    const attemptInfo = {
        attempt_sub_type: data.attempt_sub_type
    }
    dispatch({
        type: TEST_VIEW_ATTEMPT_INFO,
        payload: attemptInfo
    })
}