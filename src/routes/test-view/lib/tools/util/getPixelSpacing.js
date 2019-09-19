import cornerstone from 'cornerstone-core';

export default function getPixelSpacing(image) {
    const imagePlane = cornerstone.metaData.get(
        'imagePlaneModule',
        image.imageId
    );

    if (imagePlane) {
        return {
            rowPixelSpacing:
                imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing,
            colPixelSpacing:
                imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing,
        };
    }

    return {
        rowPixelSpacing: image.rowPixelSpacing,
        colPixelSpacing: image.columnPixelSpacing,
    };
}