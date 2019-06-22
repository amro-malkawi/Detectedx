import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import Loader from './loader';
import Dtx from './dtx';

cornerstoneTools.init();
cornerstone.registerImageLoader('dtx', Loader);

window.initDtx = function(urlPrefix) {
    Dtx.init(urlPrefix);
}
