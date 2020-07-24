import cornerstone from 'cornerstone-core';

function loadImage(imageId, imageElement) {
    return new Promise(((resolve, reject) => {
        let loadedImage;
        cornerstone.loadAndCacheImage(imageId).then((image) => {
            loadedImage = image;
            return image.pyramid.loadPyramidForWorker();
        }).then((result) => {
            // cornerstone.displayImage(imageElement, loadedImage);
            resolve()
        }).catch(e => {
            reject(e);
        });
    }));
}

export default function MyWorker({imageElement, imageIds}) {
    imageIds.reduce((prevPromise, imageId) => {
        return prevPromise.then(() => loadImage(imageId, imageElement));
    }, Promise.resolve()).then(() => {
        // finish all
    });

    let onmessage = e => { // eslint-disable-line no-unused-vars
        postMessage("finished");
    };
}