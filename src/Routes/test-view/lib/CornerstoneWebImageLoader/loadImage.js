import arrayBufferToImage from './arrayBufferToImage.js';
import createImage from './createImage.js';
import dataSetCacheManager from './dataSetCacheManager.js';

function parseImageId(imageId) {
    // build a url by parsing out the url scheme from the imageId
    const firstColonIndex = imageId.indexOf(':');
    return {
        scheme: imageId.substr(0, firstColonIndex),
        url: imageId,
    };
}

// add a decache callback function to clear out our dataSetCacheManager
function addDecache(imageLoadObject, imageId) {
    imageLoadObject.decache = function () {
        // console.log('decache');
        const parsedImageId = parseImageId(imageId);

        dataSetCacheManager.unload(parsedImageId.url);
    };
}

function loadImageFromPromise(
    dataSetPromise,
    imageId,
    sharedCacheKey,
    callbacks
) {
    const start = new Date().getTime();
    const imageLoadObject = {
        cancelFn: undefined,
    };
    imageLoadObject.promise = new Promise((resolve, reject) => {
        const loadEnd = new Date().getTime();
        let dataSet;
        dataSetPromise.then(({dataSet, originalWidth, originalHeight}) => {
            return arrayBufferToImage(dataSet, originalWidth, originalHeight);
        }).then((pixelData) => {
            const imagePromise = createImage(
                imageId,
                pixelData,
            );
            addDecache(imageLoadObject, imageId);
            return imagePromise;
        }).then((image) => {
            // image.data = dataSet;
            image.sharedCacheKey = sharedCacheKey;
            const end = new Date().getTime();
            image.loadTimeInMS = loadEnd - start;
            image.totalTimeInMS = end - start;
            if (
                callbacks !== undefined &&
                callbacks.imageDoneCallback !== undefined
            ) {
                callbacks.imageDoneCallback(image);
            }
            resolve(image);
        }).catch((error) => {
            reject({error, dataSet});
        });
    });
    return imageLoadObject;
}

function loadImageFromDataSet(
    dataSet,
    imageId,
    sharedCacheKey,
) {
    const start = new Date().getTime();
    const promise = new Promise((resolve, reject) => {
        const loadEnd = new Date().getTime();
        arrayBufferToImage(dataSet).then((pixelData) => {
            return createImage(imageId, pixelData);
        }).then((image) => {
            // image.data = dataSet;
            image.sharedCacheKey = sharedCacheKey;
            const end = new Date().getTime();

            image.loadTimeInMS = loadEnd - start;
            image.totalTimeInMS = end - start;
            resolve(image);
        }).catch((error) => {
            reject({
                error,
                dataSet,
            });
        });
    });

    return {
        promise,
        cancelFn: undefined,
    };
}

export function loadImage(imageId, option) {
    const parsedImageId = parseImageId(imageId);
    // if the dataset for this url is already loaded, use it
    // if (dataSetCacheManager.isLoaded(parsedImageId.url)) {
    //     const dataSet = dataSetCacheManager.get(parsedImageId.url).dataSet;
    //
    //     return loadImageFromDataSet(
    //         dataSet,
    //         imageId,
    //         parsedImageId.url,
    //     );
    // }

    // load the dataSet via the dataSetCacheManager
    const dataSetPromise = dataSetCacheManager.load(
        parsedImageId.url,
        imageId,
        option
    );

    return loadImageFromPromise(
        dataSetPromise,
        imageId,
        parsedImageId.url
    );
}

let options = {
  // callback allowing customization of the xhr (e.g. adding custom auth headers, cors, etc)
  beforeSend (/* xhr */) {}
};
export function configure (opts) {
  options = opts;
}
