import cornerstone from 'cornerstone-core';
import cornerstoneTools from "cornerstone-tools";

const getMaxSimultaneousRequests = cornerstoneTools.import('util/getMaxSimultaneousRequests');
const requestPool = {
    interaction: [],
    thumbnail: [],
    prefetch: [],
};

const numRequests = {
    interaction: 0,
    thumbnail: 0,
    prefetch: 0,
};

let maxNumRequests = {
    interaction: 6,
    thumbnail: 6,
    prefetch: 5,
};

let awake = false;
const grabDelay = 20;

function addRequest(
    element,
    imageId,
    type,
    preventCache,
    doneCallback,
    failCallback,
    addToBeginning
) {
    if (!requestPool.hasOwnProperty(type)) {
        throw new Error(
            'Request type must be one of interaction, thumbnail, or prefetch'
        );
    }

    if (!element || !imageId) {
        return;
    }

    // Describe the request
    const requestDetails = {
        type,
        imageId,
        preventCache,
        doneCallback,
        failCallback,
    };

    // If this imageId is in the cache, resolve it immediately
    const imageLoadObject = cornerstone.imageCache.getImageLoadObject(
        imageId
    );

    if (imageLoadObject) {
        imageLoadObject.promise.then(
            function (image) {
                doneCallback(image);
            },
            function (error) {
                failCallback(error);
            }
        );

        return;
    }

    if (addToBeginning) {
        // Add it to the beginning of the stack
        requestPool[type].unshift(requestDetails);
    } else {
        // Add it to the end of the stack
        requestPool[type].push(requestDetails);
    }

    // Wake up
    awake = true;
}

function addArrayRequest(
    element,
    imageIds,
    type,
    preventCache,
    doneCallback,
    failCallback
) {
    if (!requestPool.hasOwnProperty(type)) {
        throw new Error(
            'Request type must be one of interaction, thumbnail, or prefetch'
        );
    }

    if (!element || !imageIds) {
        return;
    }

    const requestDetailList = [];
    imageIds.forEach((imageId) => {
        const imageLoadObject = cornerstone.imageCache.getImageLoadObject(
            imageId
        );
        if (imageLoadObject) {
            // If this imageId is in the cache, resolve it immediately
            imageLoadObject.promise.then(
                function (image) {
                    doneCallback(image);
                },
                function (error) {
                    failCallback(error);
                }
            );
        } else {
            requestDetailList.push({
                type,
                imageId,
                preventCache,
                doneCallback,
                failCallback,
            })
        }
    });

    // merge new and previous pool
    const nowPoolList = [...requestPool[type]];
    const newPoolList = [];
    // const numReg = new RegExp(/\/([\d]+)\.png$/);
    const numReg = new RegExp(/\/([\d]+)$/);
    while (nowPoolList.length > 0 || requestDetailList.length > 0) {
        if(nowPoolList.length === 0) {
            newPoolList.push(requestDetailList.splice(0, 1)[0])
        } else if(requestDetailList.length === 0) {
            newPoolList.push(nowPoolList.splice(0, 1)[0])
        } else {
            const matchResult1 = nowPoolList[0].imageId.match(numReg);
            const matchResult2 = requestDetailList[0].imageId.match(numReg);
            if (matchResult1 !== null && matchResult2 !== null && matchResult1[1] !== undefined &&
                matchResult2[1] !== undefined && Number(matchResult1[1]) > Number(matchResult2[1])) {
                newPoolList.push(requestDetailList.splice(0, 1)[0])
            }
            newPoolList.push(nowPoolList.splice(0, 1)[0])
        }
    }
    requestPool[type] = newPoolList;

    // Wake up
    awake = true;
}

function clearRequestStack(type) {
    // Console.log('clearRequestStack');
    if (!requestPool.hasOwnProperty(type)) {
        throw new Error(
            'Request type must be one of interaction, thumbnail, or prefetch'
        );
    }

    requestPool[type] = [];
}

function startAgain() {
    if (!awake) {
        return;
    }

    setTimeout(function () {
        startGrabbing();
    }, grabDelay);
}

function sendRequest(requestDetails) {
    // Increment the number of current requests of this type
    const type = requestDetails.type;

    numRequests[type]++;

    awake = true;
    const imageId = requestDetails.imageId;
    const doneCallback = requestDetails.doneCallback;
    const failCallback = requestDetails.failCallback;

    // Check if we already have this image promise in the cache
    const imageLoadObject = cornerstone.imageCache.getImageLoadObject(imageId);

    if (imageLoadObject) {
        // If we do, remove from list (when resolved, as we could have
        // Pending prefetch requests) and stop processing this iteration
        imageLoadObject.promise.then(
            function (image) {
                numRequests[type]--;
                // Console.log(numRequests);

                doneCallback(image);
                startAgain();
            },
            function (error) {
                numRequests[type]--;
                // Console.log(numRequests);
                failCallback(error);
                startAgain();
            }
        );

        return;
    }

    function requestTypeToLoadPriority(requestDetails) {
        if (requestDetails.type === 'prefetch') {
            return -5;
        } else if (requestDetails.type === 'interactive') {
            return 0;
        } else if (requestDetails.type === 'thumbnail') {
            return 5;
        }
    }

    const priority = requestTypeToLoadPriority(requestDetails);

    let loader;

    if (requestDetails.preventCache === true) {
        loader = cornerstone.loadImage(imageId, {
            priority,
            type: requestDetails.type,
        });
    } else {
        loader = cornerstone.loadAndCacheImage(imageId, {
            priority,
            type: requestDetails.type,
        });
    }

    // Load and cache the image
    loader.then(
        function (image) {
            numRequests[type]--;
            // Console.log(numRequests);
            doneCallback(image);
            startAgain();
        },
        function (error) {
            numRequests[type]--;
            // Console.log(numRequests);
            failCallback(error);
            startAgain();
        }
    );
}

function startGrabbing() {
    // Begin by grabbing X images
    // const maxSimultaneousRequests = getMaxSimultaneousRequests();
    const maxSimultaneousRequests = 17;

    maxNumRequests = {
        interaction: Math.max(maxSimultaneousRequests, 1),
        thumbnail: Math.max(maxSimultaneousRequests - 2, 1),
        prefetch: Math.max(maxSimultaneousRequests - 1, 1),
    };

    const currentRequests =
        numRequests.interaction + numRequests.thumbnail + numRequests.prefetch;
    const requestsToSend = maxSimultaneousRequests - currentRequests;

    for (let i = 0; i < requestsToSend; i++) {
        const requestDetails = getNextRequest();

        if (requestDetails) {
            sendRequest(requestDetails);
        }
    }
}

function getNextRequest() {
    if (
        requestPool.interaction.length &&
        numRequests.interaction < maxNumRequests.interaction
    ) {
        return requestPool.interaction.shift();
    }

    if (
        requestPool.thumbnail.length &&
        numRequests.thumbnail < maxNumRequests.thumbnail
    ) {
        return requestPool.thumbnail.shift();
    }

    if (
        requestPool.prefetch.length &&
        numRequests.prefetch < maxNumRequests.prefetch
    ) {
        return requestPool.prefetch.shift();
    }

    if (
        !requestPool.interaction.length &&
        !requestPool.thumbnail.length &&
        !requestPool.prefetch.length
    ) {
        awake = false;
    }

    return false;
}

function getRequestPool() {
    return requestPool;
}

export default {
    addRequest,
    addArrayRequest,
    clearRequestStack,
    startGrabbing,
    getRequestPool,
};