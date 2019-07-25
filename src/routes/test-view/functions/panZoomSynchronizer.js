import cornerstone from 'cornerstone-core';

/**
 * Synchronize the target zoom and pan to match the source
 * @export
 * @public
 * @method
 * @name panZoomSynchronizer
 *
 * @param {Object} synchronizer - The Synchronizer instance that attaches this
 * handler to an event
 * @param {HTMLElement} sourceElement - The source element for the zoom and pan values
 * @param {HTMLElement} targetElement - The target element
 * @returns {void}
 */
export default function(synchronizer, sourceElement, targetElement) {
    // Ignore the case where the source and target are the same enabled element
    if (targetElement === sourceElement) {
        return;
    }

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
    let targetIndex = targetElement.parentElement.dataset.index;
    let sourceIndex = sourceElement.parentElement.dataset.index;
    if(!isNaN(targetIndex) && !isNaN(sourceIndex) && !!((Number(targetIndex) - Number(sourceIndex)) % 2)) {
        targetViewport.translation.x = -sourceViewport.translation.x;
    } else {
        targetViewport.translation.x = sourceViewport.translation.x;
    }
    targetViewport.translation.y = sourceViewport.translation.y;
    targetViewport.scale = sourceViewport.scale;
    synchronizer.setViewport(targetElement, targetViewport);
}