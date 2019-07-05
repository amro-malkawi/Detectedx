import cornerstoneTools from 'cornerstone-tools';

import Toolbar from './toolbar';
import Viewer from './viewer';
import Popup from './popup';
import Mark from './mark';

export default class Dtx {
    static init(test_case_id, attempt_id, rating_scale_id) {
        Mark.test_case_id = test_case_id;
        Mark.attempt_id = attempt_id;
        Mark.rating_scale_id = rating_scale_id;
        this._synchronizer = this.initSynchronizer();
        this._popup = new Popup();
        this._toolbar = new Toolbar(this._synchronizer);
        this._viewers = [];
        for (let element of document.querySelectorAll('#images .image'))
            this._viewers.push(new Viewer(element, this._synchronizer));
    }

    static initSynchronizer() {
        const synchronizer = new cornerstoneTools.Synchronizer(
            'cornerstonetoolsmousewheel',
            cornerstoneTools.panZoomSynchronizer
        );
        synchronizer.enabled = false;
        return synchronizer;
    }

    static enableSynchronize(value) {
        this._synchronizer.enabled = value;
    }

    static get popup() {
        return this._popup;
    }

    static get toolbar() {
        return this._toolbar;
    }

    static get viewers() {
        return this._viewers;
    }

    static get synchronizer() {
        return this._synchronizer;
    }

    static loadMarks() {
        var isLoaded = viewer => viewer.loaded;
        if (this.viewers.every(isLoaded))
            Mark.loadMarks();
    }
}
