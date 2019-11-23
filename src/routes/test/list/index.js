/**
 * News Dashboard
 */

import React, {Component} from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Button} from "reactstrap";
import * as Apis from 'Api';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import StartModal from './StartModal';

export default class list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testSetsList: [],
            selectedId: null,
            isShowModal: false,
        }
    }

    componentDidMount() {
        this.getTestSetsList();
    }

    getTestSetsList() {
        Apis.currentTestSets().then(resp => {
            this.setState({testSetsList: resp});
        }).catch(e => {

        });
    }

    onGoAttempt() {
        this.setState({isShowModal: false});
        if (this.state.selectedId.indexOf !== undefined && this.state.selectedId.indexOf('/app/test/attempt/') === 0) {
            this.props.history.push(this.state.selectedId)
        } else {
            let newData = {
                test_set_id: this.state.selectedId,
            };
            Apis.attemptsAdd(newData).then(resp => {
                // let path = '/test-view/' + test_set_id + '/' + resp.id + '/' + resp.current_test_case_id;
                let path = '/app/test/attempt/' + resp.id;
                this.props.history.push(path);
            });
        }
    }

    onStart(value, isImageQuality) {
        if(isImageQuality) {
            this.setState({
                selectedId: value
            }, () => {
                this.onGoAttempt();
            });
        } else {
            this.setState({
                isShowModal: true,
                selectedId: value
            });
        }
    }

    renderStartButton(test_set_id, attempts, isImageQuality) {
        let attempt = attempts[0];
        if (attempt === undefined) {
            return (<Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, isImageQuality)}>Start</Button>);
        } else if (attempt.complete) {
            return (<Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, isImageQuality)}>Re-Start</Button>);
        } else {
            // let path = '/test-view/' + test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            let path = '/app/test/attempt/' + attempt.id;
            return (<Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(path, isImageQuality)}>Continue</Button>);
        }
    }

    render() {
        return (
            <div className="news-dashboard-wrapper">
                <PageTitleBar title={"Module Sets"} match={this.props.match} enableBreadCrumb={false}/>
                <div className="row">
                    {
                        this.state.testSetsList.map((item, index) => {
                            return (
                                <div className="col-sm-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2" key={index}>
                                    <Card className="rct-block">
                                        <CardBody className="d-flex justify-content-between">
                                            <div>
                                                <p className="fs-14 fw-bold mb-5">{item.test_sets.name}</p>
                                                <span className="fs-12 d-block text-muted">{item.test_sets.modalities.name}</span>
                                            </div>
                                            <div>
                                                {
                                                    item.test_sets.attempts.some((v) => v.complete) ?
                                                        <Button
                                                            className="mr-10 mt-5 mb-5"
                                                            outline color="info" size="sm"
                                                            onClick={() => this.props.history.push('/app/test/complete-list/' + item.test_sets.id)}>
                                                            Scores
                                                        </Button> : null
                                                }
                                                {this.renderStartButton(item.test_sets.id, item.test_sets.attempts, item.test_sets.modalities.image_quality)}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
                <StartModal
                    open={this.state.isShowModal}
                    onClose={() => this.setState({isShowModal: false})}
                    onNext={() => this.onGoAttempt()}
                />
                {/*<Dialog open={this.state.isShowModal} onClose={() => this.setState({isShowModal: false})} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                    <div style={{padding: 30}}>
                        <DialogTitle id="alert-dialog-title">
                            <span className={'fs-23'}>LEARNING OBJECTIVES FOR:</span>
                        </DialogTitle>
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
                        <DialogActions>
                            <div style={{margin: 'auto'}}>
                                <Button variant="contained" onClick={() => this.onGoAttempt()} color="primary" className="text-white" autoFocus>&nbsp;&nbsp;Next&nbsp;&nbsp;</Button>
                            </div>
                        </DialogActions>
                    </div>
                </Dialog>*/}
            </div>
        )
    }
}
