import React from 'react';
import { Dialog, DialogContent } from "@material-ui/core";
import CustomDialogTitle from 'Components/Dialog/CustomDialogTitle';

export default function ({ open, name, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
            <div style={{ padding: 30 }}>
                <CustomDialogTitle id="alert-dialog-title" onClose={onClose}>
                    <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                </CustomDialogTitle>
                <DialogContent>
                    <p className={"fs-17 font-weight-bold"}>{name}</p>
                    <div>
                        <span className="fs-17 font-weight-bold">Overview</span>
                    </div>
                    <div>
                        <span className="fs-17">
                            Women with dense breast tissue “have the ‘perfect storm’ of decreased mammographic
                            sensitivity and increased risk of breast cancer” (Brem RF et al., AJR Am J Roentgenol 2015; 204:234–240).
                            </span>
                    </div>
                    <ol className="ml-20">
                        <li style={{ listStyleType: 'disc' }}>
                            <span className="fs-17">
                                The sensitivity of mammography reduces as the proportion of fibroglandular tissue increases.
                                </span>
                        </li>
                        <li style={{ listStyleType: 'disc' }}>
                            <span className="fs-17">
                                Visual assessments have limitations that cause disagreement among readers:
                                </span>
                            <ol className="ml-40">
                                <li style={{ listStyleType: 'circle' }}>
                                    <span className="fs-17">
                                        Visual assessments are area based. Such assessments do not consider the depth of fat or fibroglandular tissue.
                                        </span>
                                </li>
                                <li style={{ listStyleType: 'circle' }}>
                                    <span className="fs-17">
                                        Visual assessments are subjective.
                                        </span>
                                </li>
                                <li style={{ listStyleType: 'circle' }}>
                                    <span className="fs-17">
                                        Visual assessments rely on “For Presentation” images. Imaging systems, modes (e.g., 2D, 3D, or synthetic 2D),
                                        and processing algorithms all vary the appearance of “For Presentation” images.
                                        </span>
                                </li>
                            </ol>
                        </li>
                        <li style={{ listStyleType: 'disc' }}>
                            <span className="fs-17">
                                Identifying women with extremely dense breast tissue is important to reducing the risk of missing breast cancer at the time of screening.
                                </span>
                        </li>
                        <li style={{ listStyleType: 'disc' }}>
                            <span className="fs-17">
                                Automated volumetric assessments of breast composition performed by Density software are objective, consistent,
                                and repeatable and have been shown to correlate with BI RADS® breast composition categories.
                                </span>
                        </li>
                    </ol>
                    <div className={'fs-17 mt-15 font-weight-bold'}>Target audience</div>
                    <div>
                        <span className={'fs-17'}>
                            This activity is designed for radiologists and other health professionals to assess breast density from mammography x-rays.
                            </span>
                    </div>
                    <div className={'fs-17 mt-15 font-weight-bold'}>Learning Objectives</div>
                    <div>
                        <span className={'fs-17'}>
                            Upon completion of the educational activity, participants should be able to:
                            </span>
                    </div>
                    <div>
                        <span className={'fs-17'}>
                            Upon completion of this activity, participants should be able to
                            </span>
                    </div>
                    <ol className={"ml-40"}>
                        <li>
                            <span className={'fs-17'}>describe and distinguish the four BI-RADS® breast composition categories according to BI‑RADS® 5th Edition guidelines;</span>
                        </li>
                        <li>
                            <span className={'fs-17'}>understand the limitations of visual assessment of breast density;</span>
                        </li>
                        <li>
                            <span className={'fs-17'}>understand the impact of breast volume when assessing breast density;</span>
                        </li>
                        <li>
                            <span className={'fs-17'}>develop a consistent approach to breast density assessment;</span>
                        </li>
                    </ol>

                </DialogContent>
            </div>
        </Dialog>
    )
}