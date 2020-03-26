/**
 * News Dashboard
 */

import React, {Component} from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Button} from "reactstrap";
import * as Apis from 'Api';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import StartModal from './StartModal';
import LearningModal from "./LearningModal";
import LearningCovidModal from "./LearningCovidModal";

export default class list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testSetsList: [],
            selectedId: null,
            isShowModalType: '',
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
        this.setState({isShowModalType: ''});
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

    onStart(value, modality_type, has_post) {
        if(modality_type === 'image_quality') {
            this.setState({
                selectedId: value
            }, () => {
                this.onGoAttempt();
            });
        } else if (modality_type === 'covid') {
            this.setState({
                isShowModalType: 'covid',
                selectedId: value
            });
        } else {
            this.setState({
                isShowModalType: has_post ? 'has_post' : 'normal',
                selectedId: value
            });
        }
    }

    renderStartButton(test_set_id, attempts, modality_type, has_post) {
        let attempt = attempts[0];
        if (attempt === undefined) {
            return (<Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, modality_type, has_post)}>Start</Button>);
        } else if (attempt.complete) {
            return (<Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, modality_type, has_post)}>Re-Start</Button>);
        } else {
            // let path = '/test-view/' + test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            let path = '/app/test/attempt/' + attempt.id;
            return (<Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(path, modality_type, has_post)}>Continue</Button>);
        }
    }

    render() {
        return (
            <div className="news-dashboard-wrapper mt-30 mb-20">
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
                                                {this.renderStartButton(item.test_sets.id, item.test_sets.attempts, item.test_sets.modalities.modality_type, item.test_sets.has_post)}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
                <StartModal
                    open={this.state.isShowModalType === 'has_post'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={() => this.onGoAttempt()}
                />
                <LearningModal
                    open={this.state.isShowModalType === 'normal'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={this.onGoAttempt.bind(this)}
                />
                <LearningCovidModal
                    open={this.state.isShowModalType === 'covid'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={this.onGoAttempt.bind(this)}
                />
            </div>
        )
    }
}
