import {external} from './externalModules.js';
import xhrRequest from './xhrRequest';

/**
 * This object supports loading of DICOM P10 dataset from a uri and caching it so it can be accessed
 * by the caller.  This allows a caller to access the datasets without having to go through cornerstone's
 * image loader mechanism.  One reason a caller may need to do this is to determine the number of frames
 * in a multiframe sop instance so it can create the imageId's correctly.
 */
const imageExt = 'png';

let cacheSizeInBytes = 0;

let loadedDataSets = {};

let loadedMetaDataSets = {};

let promises = {};

// returns true if the wadouri for the specified index has been loaded
function isLoaded(uri) {
    return loadedDataSets[uri] !== undefined;
}

function get(uri) {
    if (!loadedDataSets[uri]) {
        return;
    }

    return {dataSet: loadedDataSets[uri].dataSet};
}

function getMetaDataSetUrl(uri) {
    const basePathMatch = uri.match(/(.*[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}).*/);
    if (basePathMatch === null) return '';
    return basePathMatch[1] + '/meta.json';
}

function getMetaDataSet(uri) {
    return loadedMetaDataSets[getMetaDataSetUrl(uri)];
}

function setMetaDataSet(uri, metaDataSet) {
    if(metaDataSet === undefined) return;
    loadedMetaDataSets[getMetaDataSetUrl(uri)] = metaDataSet;
}

function metaDataRequest(uri) {
    if(getMetaDataSet(uri) !== undefined) return Promise.resolve();
    // download metadata
    const metaDataSetUrl = getMetaDataSetUrl(uri);
    if (metaDataSetUrl === null) return Promise.resolve();
    const metaRequestProgress =  new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', metaDataSetUrl);
        xhr.onload = function () {
            try {
                const metaData = JSON.parse(xhr.response);
                resolve(metaData);
            } catch (e) {
                console.error(e);
                resolve({})
            }
            resolve(null, xhr.response);
        };
        xhr.onerror = function (e) {
            console.error(e);
            resolve({});
        };
        xhr.send();
    });
    // prevent duplicate request
    setMetaDataSet(uri, metaRequestProgress);
    return metaRequestProgress;
}

function loadMetaData(uri) {
    return new Promise((resolve, reject) => {
        metaDataRequest(uri).then((metaData) => {
            setMetaDataSet(uri, metaData);
            resolve();
        }).catch((e) => {
            reject(e);
        })
    });
}

function httpRequest(uri, imageId, url, thumbnail, element, originalWidth, originalHeight) {
    if (promises[uri]) {
        // console.log('returning existing load promise for ' + uri);
        promises[uri].cacheCount++;
        return promises[uri];
    }

    // This uri is not loaded or being loaded, load thumbnail via an xhrRequest
    const loadDICOMPromise = xhrRequest(url, imageId);
    const loadDICOMMetadataPromise = metaDataRequest(uri);


    // handle success and failure of the XHR request load
    const promise = new Promise((resolve, reject) => {
        Promise.all([loadDICOMPromise, loadDICOMMetadataPromise]).then(([dataSet, metaData]) => {
            loadedDataSets[uri] = {
                thumbnail: thumbnail,
                dataSet,
                cacheCount: promise.cacheCount,
            };
            setMetaDataSet(uri, metaData);
            if (thumbnail) {
                loadedDataSets[uri].element = element;
                loadedDataSets[uri].originalWidth = originalWidth;
                loadedDataSets[uri].originalHeight = originalHeight;
            }
            cacheSizeInBytes += dataSet.byteLength;
            resolve({dataSet: loadedDataSets[uri].dataSet});
        }).catch((error) => {
            reject(error);
        }).finally(() => {
            delete promises[uri];
        });
    });
    promise.cacheCount = 1;
    promises[uri] = promise;
    return promise;
}

// loads the dicom dataset from the wadouri sp
function load(uri, imageId, option = {}) {
    const {cornerstone} = external;
    const {type, element, originalWidth, originalHeight} = option;
    if (type === 'thumbnail') {
        if (loadedDataSets[uri]) {
            // console.log('using loaded dataset ' + uri);
            return new Promise(resolve => {
                loadedDataSets[uri].cacheCount++;
                resolve({
                    dataSet: loadedDataSets[uri].dataSet
                });
            });
        }
        const url = (uri.split('.').pop() === imageExt) ? uri : uri + '/0/0_0.' + imageExt;
        return httpRequest(uri, imageId, url, true, element, originalWidth, originalHeight);
    } else if (type === 'prefetch') {
        const url = (uri.split('.').pop() === imageExt) ? uri : uri + '.' + imageExt;
        if (loadedDataSets[uri] === undefined || loadedDataSets[uri].thumbnail) {
            return httpRequest(uri, imageId, url, false);
        } else {
            return new Promise(resolve => {
                resolve({
                    dataSet: loadedDataSets[uri].dataSet
                });
            });
        }
    } else {
        // called loadimage to display
        const url = (uri.split('.').pop() === imageExt) ? uri : uri + '.' + imageExt;
        if (loadedDataSets[uri] === undefined) {
            return httpRequest(uri, imageId, url, false);
        }
        if (loadedDataSets[uri].thumbnail) {
            Promise.all([xhrRequest(url, imageId), metaDataRequest(uri)]).then(([dataSet, metaData]) => {
                const element = loadedDataSets[uri].element;
                loadedDataSets[uri] = {
                    thumbnail: false,
                    dataSet,
                    cacheCount: 0,
                };
                setMetaDataSet(uri, metaData);
                cacheSizeInBytes += dataSet.byteLength;
                if (element !== undefined) {
                    cornerstone.triggerEvent(element, 'cornerstonedatasetscachechanged', {
                        uri,
                        action: 'loaded'
                    });
                }
                cornerstone.triggerEvent(cornerstone.events, 'cornerstonedatasetscachechanged', {
                    uri,
                    action: 'loaded',
                    cacheInfo: getInfo(),
                });

            });
        }
        return new Promise(resolve => {
            loadedDataSets[uri].cacheCount++;
            resolve({
                dataSet: loadedDataSets[uri].dataSet,
                originalWidth: loadedDataSets[uri].originalWidth,
                originalHeight: loadedDataSets[uri].originalHeight
            });
        });

    }
}

// remove the cached/loaded dicom dataset for the specified wadouri to free up memory
function unload(uri) {
    const {cornerstone} = external;

    // console.log('unload for ' + uri);
    if (loadedDataSets[uri]) {
        loadedDataSets[uri].cacheCount--;
        if (loadedDataSets[uri].cacheCount === 0) {
            // console.log('removing loaded dataset for ' + uri);
            cacheSizeInBytes -= loadedDataSets[uri].dataSet.byteLength;
            delete loadedDataSets[uri];

            cornerstone.triggerEvent(cornerstone.events, 'cornerstonedatasetscachechanged', {
                uri,
                action: 'unloaded',
                cacheInfo: getInfo(),
            });
        }
    }
}

export function getInfo() {
    return {
        cacheSizeInBytes,
        numberOfDataSetsCached: Object.keys(loadedDataSets).length,
    };
}

// removes all cached datasets from memory
function purge() {
    if (cacheSizeInBytes > 500 * 1024 * 1024) {
        // max cache size = 500M
        cacheSizeInBytes = 0;
        loadedDataSets = {};
        promises = {};
    }
}

export default {
    isLoaded,
    load,
    unload,
    getInfo,
    purge,
    get,
    getMetaDataSet,
    loadMetaData,
};
