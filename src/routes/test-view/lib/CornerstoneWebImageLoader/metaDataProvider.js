import dataSetCacheManager from './dataSetCacheManager.js';

function getInsensitiveElement(metaData, key) {
    if (metaData[key.toUpperCase()] !== undefined) return metaData[key.toUpperCase()];
    return metaData[key.toLowerCase()];
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


function metaDataProvider(type, imageId) {
    const metaData = dataSetCacheManager.getMetaDataSet(imageId);
    if (!metaData) {
        return;
    }

    if (type === 'imagePlaneModule') {
        const pixelSpacing = metaData['00280030'];
        let columnPixelSpacing = 0.1;
        let rowPixelSpacing = 0.1;
        if (pixelSpacing && pixelSpacing.length === 2) {
            rowPixelSpacing = pixelSpacing[0];
            columnPixelSpacing = pixelSpacing[1];
        }
        return {
            rowPixelSpacing,
            columnPixelSpacing,
        }
    }

    if (type === 'voiLutModule') {
        return {
            // TODO VOT LUT Sequence
            windowCenter: getNumberValues(metaData['00281050']),
            windowWidth: getNumberValues(metaData['00281051']),
        };
    }

    if (type === 'age') {
        const ageStr = getValue(metaData['00101010']);
        if (ageStr === undefined) return 0;
        return Number(ageStr.match(/\d+/)[0]);
    }

    if (type === 'breastPosition') {
        let viewPosition = getValue(metaData['00185101']);

        // for GE modality
        let vPreview = false;
        let seriesDescription = getValue(getInsensitiveElement(metaData, '0008103e'));
        if (seriesDescription !== undefined) {
            if (viewPosition === undefined) {
                if (seriesDescription.indexOf('ROUTINE3D_') === 0 && seriesDescription.lastIndexOf('MLO') === seriesDescription.length - 3) {
                    viewPosition = 'MLO';
                } else if (seriesDescription.indexOf('ROUTINE3D_') === 0 && seriesDescription.lastIndexOf('CC') === seriesDescription.length - 2) {
                    viewPosition = 'CC';
                }
            } else {
                if (seriesDescription.indexOf('V-Preview') !== -1) {
                    vPreview = true;
                }
            }
        }

        const breastPosition = {
            viewPosition: viewPosition ? viewPosition : '',
            imageLaterality: getValue(metaData['00200062']) ? getValue(metaData['00200062']) : '',
        }
        if(vPreview) {
            breastPosition.vPreview = true;
        }
        return breastPosition;
    }

}

export default metaDataProvider;