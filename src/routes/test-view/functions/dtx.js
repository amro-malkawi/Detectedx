import cornerstoneTools from 'cornerstone-tools';
import panZoomSynchronizer from './panZoomSynchronizer';
import Toolbar from './toolbar';
import Viewer from './viewer';
import Popup from './popup';
import Mark from './mark';

export default class Dtx {
    static init(viewComponent, test_case_id, attempt_id, lesions, imageAnswers) {
        Mark.test_case_id = test_case_id;
        Mark.attempt_id = attempt_id;
        Popup.viewComponent = viewComponent;
        this._synchronizer = this.initSynchronizer();
        this._popup = new Popup();
        this._toolbar = new Toolbar(this._synchronizer);
        this._viewers = [];
        this._lesions = lesions;
        this._imageAnswers = imageAnswers;
        for (let element of document.querySelectorAll('#images .image'))
            this._viewers.push(new Viewer(element, this._synchronizer));
        this._synchronizer.enabled = true;
    }

    static initSynchronizer() {
        const synchronizer = new cornerstoneTools.Synchronizer(
            'cornerstonetoolsmousewheel cornerstonetoolsmousedrag',
            panZoomSynchronizer //  cornerstoneTools.panZoomSynchronizer
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

    static get lesions() {
        if (this._lesions == undefined)
            throw 'Marker.lesions is required';
        return this._lesions;
    }

    static loadMarks() {
        var isLoaded = viewer => viewer.loaded;
        if (this.viewers.every(isLoaded))
            Mark.loadMarks(this._imageAnswers);
    }
}
