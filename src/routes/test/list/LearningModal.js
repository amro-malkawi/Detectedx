import React, {Component} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import CustomDialogTitle from 'Components/Dialog/CustomDialogTitle';

export default class LearningModal extends Component{
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                <div style={{padding: 30}}>
                    <CustomDialogTitle id="alert-dialog-title" onClose={this.props.onClose}>
                        <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <p>Interactive mammogram interpretation to improve breast cancer detection- module M1</p>
                        <div>
                            <span className="fs-17">At the end of this module, the user will be able to</span>
                        </div>
                        <ol>
                            <li>
                                <span className="fs-17 mr-10">Recognise a range of cancer appearances demonstrated in the image learning set and therefore maximise cancer detection;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Be aware of the range of appearances of images without cancer and therefore minimise unnecessary call-backs;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Improve perception and interpretation skills in the reading of digital mammograms;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Demonstrate an awareness of any personal weaknesses when searching for cancers or trying to recognise normal images;</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Assess detailed scores on personal performance levels using 5 internationally recognised metrics;</span>
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
                    {/*<DialogActions>*/}
                    {/*    <div style={{margin: 'auto'}}>*/}
                    {/*        <Button variant="contained" onClick={this.props.onNext} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;<IntlMessages id="test.next"/>&nbsp;&nbsp;</Button>*/}
                    {/*    </div>*/}
                    {/*</DialogActions>*/}
                </div>
            </Dialog>
        )
    }
}