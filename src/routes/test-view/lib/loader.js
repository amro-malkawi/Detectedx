import cornerstone from 'cornerstone-core';
import Pyramid from './pyramid/pyramid';
import * as Apis from 'Api';

const imageInfoList = {};

export function setImageInfo(info) {
    imageInfoList[info.id] = info;
}

export function getImageInfo(imageId) {
    return new Promise(((resolve, reject) => {
        if(imageInfoList[imageId]) {
            resolve({...imageInfoList[imageId]});
        } else {
            Apis.imagesUrlTemplate(imageId).then(result => {
                imageInfoList[imageId] = {...result};
                resolve(result);
            }).catch(e => {
                reject(e);
            });
        }
    }));
}

export default function DtxLoader(imageUrl) {
    imageUrl = imageUrl.replace('dtx://', '').split('/');
    let imageId = imageUrl[0];
    let stack = imageUrl[1];
    const promise = new Promise((resolve, reject) => {
        getImageInfo(imageId).then((response) => {
            let data = response;
            data.urlTemplate = data.urlTemplate.replace('[stack]', stack);
            const pyramid = new Pyramid(imageId, data, stack);

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
                sizeInBytes: data.width * data.height * 4,
                pyramid: pyramid
            });
        });
    });

    return {
        promise:  promise,
        cancelFn: undefined
    }
}
