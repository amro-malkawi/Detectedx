import arrayBufferToImage from './arrayBufferToImage.js';
import createImage from './createImage.js';
import {loadImage, configure} from './loadImage.js';
import dataSetCacheManager from './dataSetCacheManager.js';
import {external} from './externalModules.js';

const cornerstoneWebImageLoader = {
    arrayBufferToImage,
    createImage,
    loadImage,
    dataSetCacheManager,
    configure,
    external
};

export {
    arrayBufferToImage,
    createImage,
    loadImage,
    dataSetCacheManager,
    configure,
    external
};

export default cornerstoneWebImageLoader;
