import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import Pyramid from './pyramid/pyramid';
import * as Apis from 'Api';

export default function DtxLoader(imageUrl) {
    let imageId = imageUrl.replace('dtx://', '');
    var pyramid = null;

    const promise = new Promise((resolve, reject) => {
        Apis.imagesUrlTemplate(imageId).then((response) => {
            let data = response;
            pyramid = new Pyramid(imageId, data);

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
                columnPixelSpacing: undefined,
                rowPixelSpacing: undefined,
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
