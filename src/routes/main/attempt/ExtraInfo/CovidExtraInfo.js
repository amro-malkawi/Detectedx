import React, {useState} from 'react';
import {Button, DialogContent} from "@material-ui/core";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";
import DarkerDialog from "Components/Dialog/DarkerDialog";
import IntlMessages from "Util/IntlMessages";

const infoDialog = function (open, onClose) {
    return (
        <DarkerDialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
            <div style={{padding: 30}}>
                <CustomDialogTitle id="alert-dialog-title" onClose={onClose}>
                    <span className={'fs-23'}>Definitions</span>
                </CustomDialogTitle>
                <DialogContent>
                    <ul>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>True Positive for COVID-19</span>  - The number of cases that you and the expert observers gave a score of three or above.
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>False Positive for COVID-19</span> - The number of cases that you gave a score of three or above, when the expert observers gave a score below 3.
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>True Negative for COVID-19</span> - The number of cases you and the expert observers gave a score of below 3.
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>False Negative for COVID-19</span> - The number of cases that you gave a score of below 3 when the expert observers gave a score of 3 or above.
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>Specificity(%) for COVID-19</span> - Ratio of NON COVID-19 case selections you made that correspond to the true NON COVID-19 cases (range 0-100).
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>Sensitivity(%) for COVID-19</span> - Ratio of the number of Cases with COVID-19 SIGNS you correctly identified versus the overall number of true Cases with COVID-19 SIGNS (range 0-100).
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>ROC for COVID-19</span> - Acquired by combining case sensitivity, specificity and confidence ratings for COVID-19 (range 0-1).
                        </li>
                    </ul>
                </DialogContent>
            </div>
        </DarkerDialog>
    )
}

export default function () {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={'score-extra'}>
            <p className={'extra-title'}><IntlMessages id="test.attempt.scoreDefinitions"/></p>
            <p className={'extra-desc'}><IntlMessages id="test.attempt.scoreDefinitionsDesc"/></p>
            <div className={'extra-button-container'}>
                <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => setShowModal(true)}>
                    <IntlMessages id="test.attempt.definition"/>
                </Button>
            </div>
            {
                infoDialog(showModal, () => setShowModal(false))
            }
        </div>
    )
}