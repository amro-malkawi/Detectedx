import React, {Component} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {Button} from "reactstrap";

export default class LearningCovidModal extends Component {
    renderCovid() {
        return (
            <div className={' instruction-theme-white'} style={{position: 'static'}}>
                <div className={'instruction-container'}>
                    <div className={'instruction-content'}>
                        <p className={'sub-menu-title'}>Instructions</p>
                        <p>
                            Welcome to COVED, a tool aiming to familiarise you with the CT lung appearances typical of COVID-19.
                            You will be asked to look at a number of cases and try to identify appearances where relevant.
                            At the end of this activity, you will have an immediate performance assessment of your abilities to recognise COVID-19 appearances,
                            which is available only to you. You will be given a detailed review comparing your judgements with a panel of expert radiologists.
                        </p>
                        <hr/>
                        <div>
                            <p>
                                You will see 30 cases of Lung CT within this test set, some of these will contain appearances typical of COVID-19, some will not.
                                Your task is to identify on each case if any of the following appearances are present:
                            </p>
                            <ul>
                                <li>Ground glass Opacity;</li>
                                <li>Consolidation;</li>
                                <li>Crazy paving/Mosaic attenuation.</li>
                            </ul>
                        </div>
                        <hr/>
                        <div>
                            <p>
                                If you feel any of these appearances are present, you will be asked if this appearance is:
                            </p>
                            <ul>
                                <li>In the upper, lower section of the chest as defined in the diagram below.</li>
                                <li>On the left side, right side or both</li>
                                <li>In the anterior or posterior halves of the chest</li>
                                <li>Whether the appearances are peripheral, central or both</li>
                            </ul>
                            <img src={require('Assets/img/instruction/img_covid.jpg')} width={'30%'} alt={''} style={{marginLeft: 70}}/>
                        </div>
                        <hr/>
                        <div>
                            <p>
                                Finally, based on your assessment of the case, you will be asked to give a score of 0-5 indicating whether you think this case is COVID-19 positive or not.
                                This scoring will be defined as:
                            </p>
                            <p>0: Absolutely confident that this case is not COVID-19 positive</p>
                            <p>1: Very confident that this case is not COVID-19 positive</p>
                            <p>2: Quite confident that this case is not COVID-19 positive</p>
                            <p>3: Quite confident that this case is COVID-19 positive</p>
                            <p>4: Very confident that this case is COVID-19 positive</p>
                            <p>5: Absolutely confident that this case is COVID-19 positive</p>
                        </div>
                        <hr/>
                        <p className={'sub-menu-title'}>Please note, this scoring is based on your confidence that the appearance of COVID-19 is present, not on the severity of the disease.</p>
                        <p>
                            Immediately after you have finished all cases you will get performance scores based on how your assessment of whether COVID-19 was present compared with the consensus from our expert radiologists.
                            You will then be able to review each case and compare your comments on each cases with those presented by our radiologists.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                <DialogTitle id="alert-dialog-title">
                    <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                </DialogTitle>
                <DialogContent>
                    {this.renderCovid()}
                </DialogContent>
                <DialogActions>
                    <div style={{margin: 'auto'}}>
                        <Button variant="contained" onClick={this.props.onNext} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Next&nbsp;&nbsp;</Button>
                    </div>
                </DialogActions>
            </Dialog>
        )
    }
}