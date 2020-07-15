import React, {Component} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {Button} from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import CustomDialogTitle from "Components/Dialog/CustomDialogTitle";

export default class LearningCovidModal extends Component {

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                <div style={{padding: 30}}>
                    <CustomDialogTitle id="alert-dialog-title" onClose={this.props.onClose}>
                        <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                    </CustomDialogTitle>
                    <DialogContent>
                        <div>
                            <span className="fs-17">Upon completion of the educational activity, participants should be able to:</span>
                        </div>
                        <ol>
                            <li>
                                <span className="fs-17 mr-10">Recognize basic appearances of COVID-19 including: GGO, Consolidation and Crazy paving</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10"> Identify where these appearances lie including the position in the lung.</span>
                            </li>
                            <li>
                                <span className="fs-17 mr-10">Assess from these appearances as whether the case is COVID-19 Positive.</span>
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