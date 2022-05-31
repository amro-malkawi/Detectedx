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
                            <span className={ 'text-lightyellow fw-bold'}>True Positive</span> - The number of positive or abnormal cases you called positive (if the highest rating in the true cancer case is &#62; 2, it is counted as TP)
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>False Positive</span> - The number of negative or normal cases you called positive (If highest rating in the true normal case is &#62; 2, it is counted as a FP)
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>True Negative</span> - The number of negative or normal cases you called negative (If highest rating in the true normal case is &#60; 3, it is counted as a TN)
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>False Negative</span> - The number of positive or abnormal cases you called negative (If highest rating in the true cancer case is &#60; 3, it is counted as a FN)
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>Sensitivity</span> - Ratio of the number of cancer cases you correctly identified versus the overall number of cancer cases
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>Specificity</span> - Ratio of normal case selections you made that correspond to the true normal cases
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>ROC</span> - Acquired by combining case sensitivity, specificity and confidence ratings.
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>Lesion Sensitivity</span> - Ratio of the number of lesions you correctly identified versus the overall number of cancer cases.
                        </li>
                        <li className={'mb-2'}>
                            <span className={ 'text-lightyellow fw-bold'}>JAFROC</span> - Acquired by combining location sensitivity, specificity and confidence ratings
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
                <Button data-cy="test-attempt-definition-button" variant="contained" color="primary" size="small" className="text-white" onClick={() => setShowModal(true)}>
                    <IntlMessages id="test.attempt.definition"/>
                </Button>
            </div>
            {
                infoDialog(showModal, () => setShowModal(false))
            }
        </div>
    )
}