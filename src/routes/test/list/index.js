/**
 * News Dashboard
 */

import React, {Component} from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Button} from "reactstrap";
import * as Apis from 'Api';
import USStartModal from './USStartModal';
import USCovidStartModal from './USCovidStartModal';
import LearningModal from "./LearningModal";
import LearningCovidModal from "./LearningCovidModal";
import VideoModal from "./VideoModal";
import IntlMessages from "Util/IntlMessages";

export default class list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testSetsList: [],
            instructionVideos: [
                {
                    title: 'CovED',
                    thumbnail: 'https://static.detectedx.com/instruction_video/covid/thumbnail.png',
                    video: 'https://static.detectedx.com/instruction_video/covid/video.mp4'
                },
                {
                    title: 'Mammography',
                    thumbnail: 'https://static.detectedx.com/instruction_video/mammography/thumbnail.png',
                    video: 'https://static.detectedx.com/instruction_video/mammography/video.mp4'
                }
            ],
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
        if (modality_type === 'image_quality') {
            this.setState({
                selectedId: value
            }, () => {
                this.onGoAttempt();
            });
        } else if (modality_type === 'covid') {
            this.setState({
                isShowModalType: has_post ? 'has_post_covid' : 'covid',
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
            return (<Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, modality_type, has_post)}>
                <IntlMessages id="test.start"/>
            </Button>);
        } else if (attempt.complete) {
            return (<Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, modality_type, has_post)}>
                <IntlMessages id="test.reStart"/>
            </Button>);
        } else {
            // let path = '/test-view/' + test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            if (attempt.progress === '') {
                const path = '/app/test/attempt/' + attempt.id;
                return (
                    <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(path, modality_type, has_post)}>
                        <IntlMessages id="test.continue"/>
                    </Button>
                );
            } else {
                const path = '/app/test/attempt/' + attempt.id + '/' + attempt.progress;
                return (
                    <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.props.history.push(path)}>
                        <IntlMessages id="test.continue"/>
                    </Button>
                );
            }
        }
    }

    renderInstructionVideo(video, index) {
        return (
            <div className={'instruction-video'} key={index} onClick={() => this.setState({isShowModalType: 'video', selectedVideoLink: video.video})}>
                <img src={video.thumbnail} alt=''/>
                <p>{video.title}</p>
                <i className="zmdi zmdi-play-circle-outline"/>
            </div>
        );
    }

    render() {
        return (
            <div className="news-dashboard-wrapper mt-30 mb-20">
                <div className={'row align-items-start'}>
                    <div className="col-sm-12 col-md-8">
                        <PageTitleBar title={<IntlMessages id="test.moduleSets"/>} match={this.props.match} enableBreadCrumb={false}/>
                        {
                            this.state.testSetsList.map((item, index) => {
                                return (
                                    <div className="col-sm-12 col-md-12 col-lg-10 offset-lg-1" key={index}>
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
                                                                <IntlMessages id="test.scores"/>
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
                    <div className={'col-sm-12 col-md-4'}>
                        <PageTitleBar title={<IntlMessages id="test.instructionVideos"/>} match={this.props.match} enableBreadCrumb={false}/>
                        {
                            this.state.instructionVideos.map((video, index) => this.renderInstructionVideo(video, index))
                        }
                    </div>
                </div>
                <USStartModal
                    open={this.state.isShowModalType === 'has_post'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={() => this.onGoAttempt()}
                />
                <USCovidStartModal
                    open={this.state.isShowModalType === 'has_post_covid'}
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
                <VideoModal
                    open={this.state.isShowModalType === 'video'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    link={this.state.selectedVideoLink}
                />
            </div>
        )
    }
}
