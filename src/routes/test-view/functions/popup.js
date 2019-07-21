import {NotificationManager} from "react-notifications";

export default class Popup {
    constructor() {
        this.cover = document.getElementById('cover');
        this.form  = this.cover.querySelector('form');
        this.mark  = null;

        // inputs
        this.defaultRating = '2';

        // buttons
        this.cancelButton = this.form.querySelector('.cancel');
        this.deleteButton = this.form.querySelector('.delete');
        this.saveButton   = this.form.querySelector('.save');
        this.okButton     = this.form.querySelector('.ok');

        if (this.cancelButton){
            this.cancelButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.cancel();
            });
        }

        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.delete();
            });
        }

        if (this.saveButton) {
            this.saveButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.save();
            });
        }

        if (this.okButton) {
            this.okButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.ok();
            });
        }
    }

    static get viewComponent() {
        if (this._viewComponent == undefined)
            throw 'Image View is required';
        return this._viewComponent;
    }

    static set viewComponent(viewComponent) {
        this._viewComponent = viewComponent;
    }


    // ----------------------
    // button handlers
    // ----------------------
    show(mark) {
        this.mark = mark;

        if (this.deleteButton) {
            if (mark.isNew)
                this.deleteButton.style.display = 'none';
            else
                this.deleteButton.style.display = 'inline-block';
        }

        // set lesion types
        /*for (let el of this.lesionTypes)
            el.checked = false;

        for (let id of this.mark.lesionTypes)
            this.lesionTypeIdToInput[id].checked = true;*/
        Popup.viewComponent.setSelectedLesions(this.mark.lesionTypes);

        // set rating
        // this.ratingInput.value = mark.rating || this.defaultRating
        Popup.viewComponent.setSelectedRating(mark.rating || this.defaultRating);

        // show the cover and popup
        this.cover.style.display = 'block';
    }

    save() {
        // capture lesion types
        this.mark.lesionTypes = Popup.viewComponent.state.selectedLesions.map((v) => v.value.toString());

        // capture rating
        this.mark.rating = Popup.viewComponent.state.selectedRating;
        this.mark._redraw();
        if(this.mark.rating !== '2' && this.mark.lesionTypes.length === 0) {
            NotificationManager.error('Please select lesion type');
        } else {
            this.mark.save(this._close.bind(this));
        }
    }

    delete() {
        if (!confirm('Are you sure you want to delete this mark?'))
            return;

        this.mark.delete(this._close.bind(this));
    }

    cancel() {
        this.mark.revert();
        this._close();
    }

    ok() {
        this._close();
    }


    // ----------------------
    // private interface
    // ----------------------
    _close() {
        this.cover.style.display = 'none';
        this.mark = null;
    }
}
