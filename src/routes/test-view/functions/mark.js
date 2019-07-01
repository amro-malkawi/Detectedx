import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import * as Apis from 'Api';
import axios from "axios";

export default class Mark {
    constructor(imageId, data) {
        if (data == undefined)
            throw 'data is required';
        let {x, y, active} = data;

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
        this.lesionTypes = data.answers_lesion_types !== undefined ? data.answers_lesion_types.map((v) => v.lesion_type_id) : [];

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
        if (!this.isNew) {
            cornerstoneTools.addToolState(this.imageElement, 'Marker', this);
        }
    }


    // ----------------------
    // public static
    // ----------------------
    static get test_case_id() {
        if (this._test_case_id == undefined)
            throw 'Mark.test_case_id is required';
        return this._test_case_id;
    }

    static set test_case_id(test_case_id) {
        this._test_case_id = test_case_id;
    }

    static get attempt_id() {
        if (this._attempt_id == undefined)
            throw 'Mark.attempt_id is required';
        return this._attempt_id;
    }

    static set attempt_id(attempt_id) {
        this._attempt_id = attempt_id;
    }

    static get rating_scale_id() {
        if (this._rating_scale_id == undefined)
            throw 'Mark.rating_scale_id is required';
        return this._rating_scale_id;
    }

    static set rating_scale_id(rating_scale_id) {
        this._rating_scale_id = rating_scale_id;
    }

    static loadMarks() {
        Apis.testCasesAnswers(Mark.test_case_id, Mark.attempt_id).then((images) => {
            for (let image of images) {
                let clearElement = Mark._imageElement(image.id);
                if(clearElement !== undefined) cornerstoneTools.clearToolState(clearElement, 'Marker');

                image.answers.forEach(mark => new Mark(image.id, mark));
                if (image.truths) {
                    image.truths.forEach(mark => new Mark(image.id, mark));
                }

                let imageElement = Mark._imageElement(image.id);
                cornerstone.invalidate(imageElement);
            }
        }).catch(e => {
            console.warn(e);
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

        // capture mark data
        let data = {
            x: this.x,
            y: this.y,
            rating: this.rating,
            image_id: this.imageId,
            rating_scale_id: Mark.rating_scale_id,
            attempt_id: Mark.attempt_id,
            test_case_id: Mark.test_case_id,
            answer_lesion_types: [],
        };

        for (let id of this.lesionTypes) {
            data.answer_lesion_types.push(id);
        }

        // run request    create or update
        let act = 'answersAdd';
        if (!this.isNew) {
            act = 'answersUpdate';
            data.id = this.id;
        }

        Apis[act](data).then(response => {
            if (this.isNew)
                this.id = response.id;
        }).catch(e_ => {
            // FIXME: revert to previous state
            alert('An error occurred saving this mark');
        }).finally(() => {
            callback();
        });
    }

    // destroy
    delete(callback) {
        if (this.isNew)
            throw "Cannot delete a mark which hasn't yet been saved";

        Apis.answersDelete(this.id).then((resp) => {
            this._removeFromToolData();
        }).catch(e => {
            alert('An error occurred deleting this mark');
        }).finally(() => {
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
