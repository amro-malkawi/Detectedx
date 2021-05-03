import dataSetCacheManager from './dataSetCacheManager.js';

function getInsensitiveElement(metaData, key) {
    const upperValue = recursiveFindTags(key.toUpperCase(), metaData)[0];
    const lowerValue = recursiveFindTags(key.toLowerCase(), metaData)[0];
    if (upperValue !== undefined) return upperValue;
    return lowerValue;
}

function getValue(element, index, defaultValue) {
    index = index || 0;
    if (!element) {
        return defaultValue;
    }
    // Value is not present if the attribute has a zero length value
    if (!element.Value) {
        return defaultValue;
    }
    // make sure we have the specified index
    if (element.Value.length <= index) {
        return defaultValue;
    }
    return element.Value[index];
}

function getNumberString(element, index, defaultValue) {
    const value = getValue(element, index, defaultValue);

    if (value === undefined) {
        return;
    }

    return parseFloat(value);
}

function getNumberValue(element, index) {
    const value = getValue(element, index);

    if (value === undefined) {
        return;
    }

    return parseFloat(value);
}

function getNumberValues(element, minimumLength) {
    if (!element) {
        return;
    }
    // Value is not present if the attribute has a zero length value
    if (!element.Value) {
        return;
    }
    // make sure we have the expected length
    if (minimumLength && element.Value.length < minimumLength) {
        return;
    }

    const values = [];

    for (let i = 0; i < element.Value.length; i++) {
        values.push(parseFloat(element.Value[i]));
    }

    return values;
}

function getOverlayPlaneModule(metaData) {
    const overlays = [];

    for (let overlayGroup = 0x00; overlayGroup <= 0x1e; overlayGroup += 0x02) {
        let groupStr = `x60${overlayGroup.toString(16)}`;

        if (groupStr.length === 4) {
            groupStr = `x600${overlayGroup.toString(16)}`;
        }

        const data = getValue(metaData[`${groupStr}3000`]);

        if (!data) {
            continue;
        }

        const pixelData = [];

        for (let i = 0; i < data.length; i++) {
            for (let k = 0; k < 8; k++) {
                const byte_as_int = metaData.Value[data.dataOffset + i];

                pixelData[i * 8 + k] = (byte_as_int >> k) & 0b1; // eslint-disable-line no-bitwise
            }
        }

        overlays.push({
            rows: getNumberValue(metaData[`${groupStr}0010`]),
            columns: getNumberValue(metaData[`${groupStr}0011`]),
            type: getValue(metaData[`${groupStr}0040`]),
            x: getNumberValue(metaData[`${groupStr}0050`], 1) - 1,
            y: getNumberValue(metaData[`${groupStr}0050`], 0) - 1,
            pixelData,
            description: getValue(metaData[`${groupStr}0022`]),
            label: getValue(metaData[`${groupStr}1500`]),
            roiArea: getValue(metaData[`${groupStr}1301`]),
            roiMean: getValue(metaData[`${groupStr}1302`]),
            roiStandardDeviation: getValue(metaData[`${groupStr}1303`]),
        });
    }

    return {
        overlays,
    };
}

function getArrayValue(element) {
    if (!element) {
        return;
    }
    // Value is not present if the attribute has a zero length value
    if (!element.Value) {
        return;
    }
    return element.Value;
}

function findValuesHelper(obj, key, list) {
    if (!obj) return list;
    if (obj instanceof Array) {
        for (let i in obj) {
            list = list.concat(findValuesHelper(obj[i], key, []));
        }
        return list;
    }
    if (obj[key]) list.push(obj[key]);

    if ((typeof obj == "object") && (obj !== null) ){
        let children = Object.keys(obj);
        if (children.length > 0){
            for (let i = 0; i < children.length; i++ ){
                list = list.concat(findValuesHelper(obj[children[i]], key, []));
            }
        }
    }
    return list;
}

function recursiveFindTags(tag, metaDataSet) {
    return findValuesHelper(metaDataSet, tag, []);
}

function metaDataProvider(type, imageId) {
    const metaData = dataSetCacheManager.getMetaDataSet(imageId);
    if (!metaData) {
        return;
    }

    if (type === 'imagePlaneModule') {
        return {
            rowPixelSpacing: getNumberString(recursiveFindTags('00280030', metaData)[0], 0, 0.1),
            columnPixelSpacing: getNumberString(recursiveFindTags('00280030', metaData)[0], 1, 0.1),
        }
    }

    if (type === 'voiLutModule') {
        let wwList = getArrayValue(recursiveFindTags('00281051', metaData)[0]);
        let wlList = getArrayValue(recursiveFindTags('00281050', metaData)[0]);
        if(wwList === undefined || wwList.length === 0) wwList = [255];
        if(wlList === undefined || wlList.length === 0) wlList = [128];
        return {
            windowWidth: wwList,
            windowCenter:wlList
        }
        // return {
        //     // TODO VOT LUT Sequence
        //     windowCenter: getNumberString(recursiveFindTags('00281050', metaData)[0], 0, 128),
        //     windowWidth: getNumberString(recursiveFindTags('00281051', metaData)[0], 0, 255),
        // };
    }

    if (type === 'age') {
        const ageStr = getValue(recursiveFindTags('00101010', metaData)[0]);
        if (ageStr === undefined) return 0;
        return Number(ageStr.match(/\d+/)[0]);
    }

    if (type === 'imagePosition') {
        let viewPosition = getValue(recursiveFindTags('00185101', metaData)[0]);
        let imageLaterality = getValue(recursiveFindTags('00200062', metaData)[0]);
        // for GE modality
        let positionDesc = '';
        let seriesDescription = getValue(getInsensitiveElement(metaData, '0008103e'));
        if (seriesDescription !== undefined) {
            seriesDescription = seriesDescription.toUpperCase();
            if (seriesDescription.indexOf('ROUTINE3D_PLANES_') === 0) {
                positionDesc = 'GE-PLANES';
            } else if (seriesDescription.indexOf('ROUTINE3D_SLABS_') === 0) {
                positionDesc = 'GE-SLABS';
            } else if(seriesDescription.indexOf('V-PREVIEW') !== -1) {
                positionDesc = 'GE-V-PREVIEW';
            }

            if(viewPosition === undefined) {
                if(seriesDescription.lastIndexOf('MLO') === seriesDescription.length - 3) {
                    viewPosition = 'MLO';
                } else if(seriesDescription.lastIndexOf('CC') === seriesDescription.length - 2) {
                    viewPosition = 'CC';
                }
            }

            if(imageLaterality === undefined) {
                if (seriesDescription.lastIndexOf('RMLO') === seriesDescription.length - 4 || seriesDescription.lastIndexOf('RCC') === seriesDescription.length - 3) {
                    imageLaterality = 'R';
                } else if (seriesDescription.lastIndexOf('LMLO') === seriesDescription.length - 4 || seriesDescription.lastIndexOf('LCC') === seriesDescription.length - 3) {
                    imageLaterality = 'L';
                }
            }
        }

        const imagePosition = {
            viewPosition: viewPosition ? viewPosition : '',
            imageLaterality: imageLaterality ? imageLaterality : '',
            positionDesc: positionDesc,
        }
        return imagePosition;
    }

}

export default metaDataProvider;