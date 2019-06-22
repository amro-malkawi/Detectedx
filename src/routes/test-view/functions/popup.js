export default class Popup {
    constructor() {
        this.cover = document.getElementById('cover');
        this.form  = this.cover.querySelector('form');
        this.mark  = null;

        // inputs
        this.ratingInput   = this.form.querySelector('select[name=rating]');
        this.defaultRating = this.ratingInput.querySelector('option').value;
        this.lesionTypes   = this.form.querySelectorAll('.lesion-type input');
        
        // mapping from lesion type id to checkbox
        this.lesionTypeIdToInput = {};
        for (let el of this.lesionTypes)
            this.lesionTypeIdToInput[el.dataset.lesionTypeId] = el;

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
        for (let el of this.lesionTypes)
            el.checked = false;

        for (let id of this.mark.lesionTypes)
            this.lesionTypeIdToInput[id].checked = true;

        // set rating
        this.ratingInput.value = mark.rating || this.defaultRating

        // show the cover and popup
        this.cover.style.display = 'block';
    }

    save() {
        // capture lesion types
        this.mark.lesionTypes = [];

        for (let el of this.lesionTypes) {
            if (el.checked) {
                let lesionTypeId = el.dataset.lesionTypeId;
                this.mark.lesionTypes.push(lesionTypeId);
            }
        }

        // capture rating
        this.mark.rating = this.ratingInput.value;

        this.mark.save(this._close.bind(this));
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
