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
                    <span className={'fs-23'}>Extra Information</span>
                </CustomDialogTitle>
                <DialogContent>
                    <div className={'mb-10'}>
                        <span className="fs-17">
                            Women with dense breast tissue “have the ‘perfect storm’ of decreased mammographic sensitivity and increased risk of breast cancer”
                            (Brem RF et al., AJR Am J Roentgenol 2015; 204:234–240).
                        </span>
                    </div>
                    <div>
                        <span className="dot badge-secondary mr-10">&nbsp;</span>
                        <span className="fs-15 mr-10">The sensitivity of mammography reduces as the proportion of fibroglandular tissue increases. </span>
                    </div>
                    <div className={'ml-30'}>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Visual assessments have limitations that cause disagreement among readers:</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Visual assessments are area based. Such assessments do not consider the depth of fat or fibroglandular tissue.</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Visual assessments are subjective.</span>
                        </div>
                        <div>
                            <span className="dot badge-secondary mr-10">&nbsp;</span>
                            <span className="fs-14 mr-10">Visual assessments rely on “For Presentation” images. Imaging systems, modes (e.g., 2D, 3D, or synthetic 2D),
                                and processing algorithms all vary the appearance of “For Presentation” images.</span>
                        </div>
                    </div>
                    <div>
                        <span className="dot badge-secondary mr-10">&nbsp;</span>
                        <span className="fs-15 mr-10">Identifying women with extremely dense breast tissue is important to reducing the risk of missing breast cancer at the time of screening.</span>
                    </div>
                    <div>
                        <span className="dot badge-secondary mr-10">&nbsp;</span>
                        <span className="fs-15 mr-10">Automated volumetric assessments of breast composition performed by Density software are objective, consistent,
                            and repeatable and have been shown to correlate with BI RADS® breast composition categories.</span>
                    </div>
                </DialogContent>
            </div>
        </DarkerDialog>
    )
}

export default function () {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className={'score-extra'}>
            <p className={'extra-title'}><IntlMessages id="test.attempt.volparaExtraTitle"/></p>
            <p className={'extra-desc'}><IntlMessages id="test.attempt.volparaExtraDesc"/></p>
            <div className={'extra-button-container'}>
                <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => setShowModal(true)}>
                    <IntlMessages id="test.attempt.volparaNext"/>
                </Button>
            </div>
            {
                infoDialog(showModal, () => setShowModal(false))
            }
        </div>
    )
}