import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

/**
 * Propogate scrolling actions from the source element to the target element.
 * @export
 * @public
 * @method
 * @name stackScrollSynchronizer
 *
 * @param {Object} synchronizer - The Synchronizer instance that attaches this
 * handler to an event
 * @param {HTMLElement} sourceElement - The source element for the scroll event
 * @param {HTMLElement} targetElement - The target element
 * @param {Object} eventData - The data object from the triggering event
 * @returns {void}
 */
export default function(synchronizer, sourceElement, targetElement, eventData) {
    // If the target and source are the same, stop
    if (sourceElement === targetElement) {
        return;
    }
    panZoomSync(synchronizer, sourceElement, targetElement, eventData);
    stackScrollSync(synchronizer, sourceElement, targetElement, eventData);
}

function panZoomSync(synchronizer, sourceElement, targetElement, eventData) {    // panZoomSynchronizer
    // Get the source and target viewports
    const sourceViewport = cornerstone.getViewport(sourceElement);
    const targetViewport = cornerstone.getViewport(targetElement);
    // Do nothing if the scale and translation are the same
    if (
        targetViewport.scale === sourceViewport.scale &&
        targetViewport.translation.x === sourceViewport.translation.x &&
        targetViewport.translation.y === sourceViewport.translation.y
    ) {
        return;
    }

    // Scale and/or translation are different, sync them
    const targetIndex = targetElement.parentElement.dataset.index.split('_')[1];
    const sourceIndex = sourceElement.parentElement.dataset.index.split('_')[1];
    const targetHangingId = targetElement.parentElement.dataset.hangingId;
    const sourceHangingId = sourceElement.parentElement.dataset.hangingId;
    const targetRatio = getTargetRatio(sourceElement, targetElement);
    if (
        targetHangingId !== undefined && sourceHangingId !== undefined &&
        targetHangingId.split('-')[1] !== undefined && sourceHangingId.split('-') !== undefined) {
        if (targetHangingId.split('-')[1] !== sourceHangingId.split('-')[1]) {
            targetViewport.translation.x = -sourceViewport.translation.x / targetRatio
        } else {
            targetViewport.translation.x = sourceViewport.translation.x / targetRatio
        }
    } else {
        if (!isNaN(targetIndex) && !isNaN(sourceIndex) && !!((Number(targetIndex) - Number(sourceIndex)) % 2)) {
            targetViewport.translation.x = -sourceViewport.translation.x / targetRatio
        } else {
            targetViewport.translation.x = sourceViewport.translation.x / targetRatio
        }
    }

    targetViewport.translation.y = sourceViewport.translation.y

    if (sourceHangingId.includes('GE')) {
        targetViewport.scale = sourceViewport.scale
    } else {
        targetViewport.scale = sourceViewport.scale * targetRatio
    }

    synchronizer.setViewport(targetElement, targetViewport);
}

function getTargetRatio(sourceElement, targetElement) {
    const sourceImage = cornerstone.getImage(sourceElement)
    const targetImage = cornerstone.getImage(targetElement)
    return (sourceImage.width / targetImage.width).toFixed(2)
}
function stackScrollSync(synchronizer, sourceElement, targetElement, eventData) {    // stackScrollSynchronizer
    // If there is no event, or direction is 0, stop

    // if (!eventData || !eventData.direction) {
    //     return;
    // }

    // Scale and/or translation are different, sync them
    const targetIndex = targetElement.parentElement.dataset.index.split('_')[1];
    const sourceIndex = sourceElement.parentElement.dataset.index.split('_')[1];
    const targetHangingId = targetElement.parentElement.dataset.hangingId;
    const sourceHangingId = sourceElement.parentElement.dataset.hangingId;
    if(
        targetHangingId !== undefined && sourceHangingId !== undefined &&
        targetHangingId.split('-')[1] !== undefined && sourceHangingId.split('-') !== undefined) {
        if (targetHangingId.split('-')[1] !== sourceHangingId.split('-')[1]){
            return;
        }
    } else {
        if (isNaN(targetIndex) || isNaN(sourceIndex) || !!((Number(targetIndex) - Number(sourceIndex)) % 2)) {
            return;
        }
    }
    if(cornerstoneTools.getToolState(sourceElement, 'stack') === undefined || cornerstoneTools.getToolState(targetElement, 'stack') === undefined) {
        return;
    }
    // Get the stack of the source viewport
    const sourceStackData = cornerstoneTools.getToolState(sourceElement, 'stack').data[0];

    // Get the stack of the target viewport
    const stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
    const stackData = stackToolDataSource.data[0];

    // Get the new index for the stack
    let newImageIdIndex = sourceStackData.currentImageIdIndex;

    // Ensure the index does not exceed the bounds of the stack
    newImageIdIndex = Math.min(Math.max(0, newImageIdIndex), stackData.imageIds.length - 1);

    // If the index has not changed, stop here
    if (stackData.currentImageIdIndex === newImageIdIndex) {
        return;
    }

    const startLoadingHandler = cornerstoneTools.loadHandlerManager.getStartLoadHandler(
        targetElement
    );
    const endLoadingHandler = cornerstoneTools.loadHandlerManager.getEndLoadHandler(targetElement);
    const errorLoadingHandler = cornerstoneTools.loadHandlerManager.getErrorLoadingHandler(
        targetElement
    );

    stackData.currentImageIdIndex = newImageIdIndex;
    const newImageId = stackData.imageIds[newImageIdIndex];

    if (startLoadingHandler) {
        startLoadingHandler(targetElement);
    }

    let loader;

    if (stackData.preventCache === true) {
        loader = cornerstone.loadImage(newImageId);
    } else {
        loader = cornerstone.loadAndCacheImage(newImageId);
    }

    loader.then(
        function(image) {
            const viewport = cornerstone.getViewport(targetElement);

            if (stackData.currentImageIdIndex !== newImageIdIndex) {
                return;
            }

            synchronizer.displayImage(targetElement, image, viewport);
            if (endLoadingHandler) {
                endLoadingHandler(targetElement, image);
            }
        },
        function(error) {
            const imageId = stackData.imageIds[newImageIdIndex];

            if (errorLoadingHandler) {
                errorLoadingHandler(targetElement, imageId, error);
            }
        }
    );
}