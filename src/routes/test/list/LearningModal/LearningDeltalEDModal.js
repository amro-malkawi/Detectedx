import React from 'react';
import {Dialog, DialogContent} from "@material-ui/core";
import CustomDialogTitle from 'Components/Dialog/CustomDialogTitle';

export default function ({open, onClose, onNext, locale}) {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
            <div style={{padding: 30}}>
                <CustomDialogTitle id="alert-dialog-title" onClose={onClose}>
                    <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                </CustomDialogTitle>
                <DialogContent>
                    <p>Dental radiography and cone beam computed tomography interpretation</p>
                    <div>
                        <span className="fs-17">At the end of this module, the user will be able to:</span>
                    </div>
                    <ol>
                        <li>
                            <span className="fs-17 mr-10">Recognise a range of dental abnormalities demonstrated in the image learning set.</span>
                        </li>
                        <li>
                            <span className="fs-17 mr-10">Improve perception and interpretation skills in the reading of digital periapical radiographs.</span>
                        </li>
                        <li>
                            <span className="fs-17 mr-10">Assess detailed scores on personal performance levels using internationally recognised metrics.</span>
                        </li>
                        <li>
                            <span className="fs-17 mr-10">Demonstrate increased confidence when interpreting radiologic images.</span>
                        </li>
                    </ol>
                    <div className={'fs-17 mt-15'}>disclosures:</div>
                    <div>
                        <span className="dot badge-secondary mr-10">&nbsp;</span>
                        <span className="fs-14 mr-10">Patrick C Brennan is a Professor of Diagnostic Imaging at the University of Sydney and CEO and Co-founder of DetectED-X</span>
                    </div>
                    <div>
                        <span className="dot badge-secondary mr-10">&nbsp;</span>
                        <span className="fs-14 mr-10">Mary T Rickard is a Radiologist, Adjunct Professor at the University of Sydney and Director and Co-founder of DetectED-X</span>
                    </div>
                    <div>
                        <span className="dot badge-secondary mr-10">&nbsp;</span>
                        <span className="fs-14 mr-10">Mo'ayyad E Suleiman is an academic at the University of Sydney and Director and Co-founder of DetectED-X.</span>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}