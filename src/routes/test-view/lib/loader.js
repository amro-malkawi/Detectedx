import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import Pyramid from './pyramid/pyramid';
import * as Apis from 'Api';

export default function DtxLoader(imageUrl) {
    imageUrl = imageUrl.replace('dtx://', '').split('/');
    let imageId = imageUrl[0];
    let stack = imageUrl[1];
    var pyramid = null;

    const promise = new Promise((resolve, reject) => {
        Apis.imagesUrlTemplate(imageId, stack).then((response) => {
            let data = response;
            pyramid = new Pyramid(imageId, data, stack);

            resolve({
                imageId: imageId,
                minPixelValue: 0,
                maxPixelValue: 255,
                slope: 1.0,
                intercept: 0,
                windowCenter: 128,
                windowWidth: 255,
                render: cornerstone.renderWebImage,
                getPixelData: () => { return pyramid.pixelData },
                getImageData: () => { return pyramid.imageData },
                getCanvas: () => { return pyramid.canvas },
                getImage: () => { return pyramid.canvas },
                rows: data.height,
                columns: data.width,
                height: data.height,
                width: data.width,
                color: true,
                rgba: true,
                columnPixelSpacing: data.column_pixel_spacing === undefined || isNaN(data.column_pixel_spacing) ? 0.1 : Number(data.column_pixel_spacing),
                rowPixelSpacing: data.row_pixel_spacing === undefined || isNaN(data.row_pixel_spacing) ? 0.1 : Number(data.row_pixel_spacing),
                invert: false,
                sizeInBytes: data.width * data.height * 4
            });
        });
    });

    return {
        promise:  promise,
        cancelFn: undefined
    }
}
