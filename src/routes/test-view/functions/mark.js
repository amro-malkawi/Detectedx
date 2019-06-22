import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import axios from "axios";

export default class Mark {
    constructor(data) {
        if (data == undefined)
            throw 'data is required';
        let {x, y, imageId, active} = data;

        // cornerstone tool data
        this.visible = true;
        this.active = active;
        this.invalidated = true;
        this.handles = {
            end: {
                x,
                y,
                active,
                highlight: active
            }
        }

        // detected x db data
        this.id = data.id;
        this.isTruth = !!data.isTruth;
        this.rating = data.rating;
        this.lesionTypes = data.lesionTypes || [];

        // since the rating and lesion type values are used
        // to set the values of inputs (which are strings)
        // convert these values to strings if present
        if (this.rating != undefined)
            this.rating = String(this.rating);

        if (this.lesionTypes.length > 0)
            this.lesionTypes = this.lesionTypes.map(id => String(id));

        // helper data
        this.imageId = imageId;
        this.originalX = undefined;
        this.originalY = undefined;

        // when loading existing marks, the object
        // adds itself to the marker tool's data
        if (!this.isNew)
            cornerstoneTools.addToolState(this.imageElement, 'Marker', this);
    }


    // ----------------------
    // public static
    // ----------------------
    static get urlPrefix() {
        if (this._urlPrefix == undefined)
            throw 'Mark.urlPrefix is required';
        return this._urlPrefix;
    }

    static set urlPrefix(prefix) {
        this._urlPrefix = prefix;
    }

    static loadMarks() {
        axios.get(Mark.urlPrefix).then((response) => {
            response = response.data;
            if (!response || !response.success) {
                alert('An error occurred loading the marks for this test case');
                return;
            }

            for (let image of response.images) {
                image.answers.forEach(mark => new Mark(mark));

                if (image.truths) {
                    image.truths.forEach(mark => new Mark(mark));
                }

                let imageElement = Mark._imageElement(image.id);
                cornerstone.invalidate(imageElement);
            }
        })
        .catch(e => {
            alert('An error occurred loading the marks for this test case');
        })
    }


    // ----------------------
    // private static
    // ----------------------
    static _imageElement(id) {
        return document.querySelector(`#image${id} .dicom`);
    }


    // ----------------------
    // public properties
    // ----------------------
    get imageElement() {
        return Mark._imageElement(this.imageId);
    }

    get isNew() {
        return this.id == undefined;
    }

    get handle() {
        return this.handles.end;
    }

    get x() {
        return this.handle.x;
    }

    get y() {
        return this.handle.y;
    }


    // ----------------------
    // public interface
    // ----------------------
    // prepare for the handle to be moved by storing the mark's
    // original x and y position (so they can be reset if needed)
    prepareForMove() {
        this.originalX = this.handles.end.x;
        this.originalY = this.handles.end.y;
    }

    // create or update
    save(callback) {
        // create or update URL and method
        let url = Mark.urlPrefix;
        let method = 'POST';

        if (!this.isNew) {
            url += '/' + this.id;
            method = 'PUT';
        }

        // capture mark data
        let data = {
            x: this.x,
            y: this.y,
            rating: this.rating,
            image_id: this.imageId
        }

        for (let id of this.lesionTypes)
            data[`lesion_types[${id}]`] = 'on';

        // run request    post or put
        axios.post(url, data).then((response) => response.data).then(response => {
            if (response && response.success) {
                if (this.isNew)
                    this.id = response.id;
            } else {
                // FIXME: revert to previous state
                alert('An error occurred saving this mark');
            }
        })
        .catch(e_ => {
            // FIXME: revert to previous state
            alert('An error occurred saving this mark');
        })
        .finally(() => {
            callback();
        });
    }

    // destroy
    delete(callback) {
        if (this.isNew)
            throw "Cannot delete a mark which hasn't yet been saved";
        axios.delete(Mark.urlPrefix + '/' + this.id).then((response) => response.data).then(response => {
            if (response && response.success)
                this._removeFromToolData();
            else
                alert('An error occurred deleting this mark');
        })
        .catch(e => {
            alert('An error occurred deleting this mark');
        })
        .finally(() => {
            callback();
        });
    }

    // revert the mark to its previous state, or if the mark is
    // new, revert the state of the mark's image's toolData
    // by removing the mark
    revert() {
        if (this.isNew)
            this._removeFromToolData();
        else
            this._revertPosition();
    }


    // ----------------------
    // private
    // ----------------------
    // invalidate the mark and redraw its image
    _redraw() {
        this.invalidated = true;
        cornerstone.invalidate(this.imageElement);
    }

    _revertPosition() {
        this.handles.end.x = this.originalX;
        this.handles.end.y = this.originalY;
        this.originalX = undefined;
        this.originalY = undefined;
        this._redraw();
    }

    _removeFromToolData() {
        let toolData = cornerstoneTools.getToolState(this.imageElement, 'Marker');

        // when the mark is new and hasn't been saved, it will be the
        // last (newest) mark in the tool's data
        if (this.isNew)
            toolData.data.pop();

        // otherwise filter the tool's data to remove the mark by id
        else
            toolData.data = toolData.data.filter(mark => mark.id != this.id);

        this._redraw();
    }
}
