import dataSetCacheManager from './dataSetCacheManager.js';


function metaDataProvider(type, imageId) {
    const metaDataSet = dataSetCacheManager.getMetaDataSet(imageId);
    if (!metaDataSet) {
        return;
    }

    if (type === 'imagePlaneModule') {
        const pixelSpacing = metaDataSet['00280030'];
        let columnPixelSpacing = 0.1;
        let rowPixelSpacing = 0.1;
        if (pixelSpacing && pixelSpacing.length === 2) {
            rowPixelSpacing = pixelSpacing[0];
            columnPixelSpacing = pixelSpacing[1];
        }
        return {
            rowPixelSpacing,
            columnPixelSpacing,
        }
    }
}

export default metaDataProvider;