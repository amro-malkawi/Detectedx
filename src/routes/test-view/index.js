import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeHangingLayout, setImageListAction, setShowImageBrowser, setImageQuality} from 'Actions';
import {Button, Switch, Dialog} from '@material-ui/core';
import SkipPreviousOutlinedIcon from '@material-ui/icons/SkipPreviousOutlined';
import SkipNextOutlinedIcon from '@material-ui/icons/SkipNextOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import CachedIcon from '@material-ui/icons/Cached';
import {Input} from "reactstrap";
import {withStyles} from '@material-ui/core/styles';
import {NotificationManager} from "react-notifications";
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import {isMobile} from 'react-device-detect';

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';
import Loader from './lib/loader';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

import ImageViewerContainer from './component/ImageViewerContainer'
import Marker from './lib/tools/MarkerTool';
import viewerSynchronizer from "./lib/viewerSynchronizer";
import InstructionModal from '../instructions';
import CovidQuestions from "Routes/test-view/component/CovidQuestions";
import QualityModal from './QualityModal';
import ConfirmQualityModal from './ConfirmQualityModal';
import ReattemptPostTestModal from './ReattemptPostTestModal';
import CornerstoneToolIcon from "./component/CornerstoneToolIcon";
import ImageBrowser from "./component/ImageBrowser";
import CommentInfo from "./component/CommentInfo";
import HangingSelector from './component/HangingSelector';
import GridToolButton from './lib/GridToolButton';
import MarkerPopup from "./lib/markerPopup";
import IntlMessages from "Util/IntlMessages";
import * as Apis from 'Api';

class TestView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            test_cases_id: this.props.match.params.test_cases_id,
            test_sets_id: this.props.match.params.test_sets_id,
            attempts_id: this.props.match.params.attempts_id,
            isPostTest: this.props.match.params.is_post_test === 'post',
            loading: true,
            attemptDetail: {},
            test_case: {},
            test_set_cases: [],
            complete: false,
            isAnswerCancer: undefined,
            isTruthCancer: undefined,
            imageAnswers: [],
            currentTool: 'Pan',
            isShowPopup: false,
            selectedMarkData: {},
            isShowToolModal: false,
            isShowInstructionModal: false,
            isShowQualityModal: false,
            imageIdForQuality: '',
            isShowConfirmQualityModal: false,

            possiblePostTestReattempt: false,
            isShowPostTestReattemptModal: false,
            reattemptScore: 0,
            postTestRemainCount: 0,
        };
        this.covidQuestionRef = React.createRef();
        this.popupCancelHandler = null;
        this.popupDeleteHandler = null;
        this.popupSaveHandler = null;
        this.synchronizer = null;
        this.initConerstone();
    }

    initConerstone() {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
        cornerstoneTools.init();
        cornerstone.registerImageLoader('dtx', Loader);
        this.synchronizer = new cornerstoneTools.Synchronizer(
            'cornerstonetoolsmousewheel cornerstonetoolsmousedrag cornerstonenewimage',
            viewerSynchronizer //  cornerstoneTools.panZoomSynchronizer
        );
        this.synchronizer.enabled = true;
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.test_case.images !== undefined && this.state.test_case.images !== prevState.test_case.images) {

        }
    }

    componentWillUnmount() {
        this.props.setImageListAction([], []);
    }

    getData() {
        this.props.setImageListAction([], []);
        const that = this;
        let promise1 = new Promise(function (resolve, reject) {
            if (!that.state.isPostTest) {
                Apis.testSetsCases(that.state.test_sets_id).then((data) => {
                    data = data.map((v) => v.test_case_id);
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            } else {
                Apis.postTestSetsCases(that.state.test_sets_id).then((data) => {
                    data = data.map((v) => v.test_case_id);
                    resolve(data);
                }).catch(e => {
                    reject(e);
                });
            }
        });

        Promise.all([
            Apis.testCasesViewInfo(that.state.test_cases_id),
            promise1,
            Apis.attemptsDetail(that.state.attempts_id, that.state.test_cases_id),
            Apis.testCasesAnswers(that.state.test_cases_id, that.state.attempts_id, that.state.isPostTest)
        ]).then(function ([testCaseViewInfo, testSetsCases, attemptsDetail, testCasesAnswers]) {
            let complete = false;
            let possiblePostTestReattempt = false;
            if (!attemptsDetail.test_sets.has_post) {
                complete = attemptsDetail.complete;
            } else {
                if (that.state.isPostTest) {
                    if (!attemptsDetail.complete) {
                        throw new Error('can not test');
                    } else if ((attemptsDetail.post_test_remain_count < 0) || (attemptsDetail.post_test_remain_count === 0 && attemptsDetail.post_test_complete)) {
                        throw new Error("You will have to restart the test");
                    } else {
                        complete = (attemptsDetail.post_stage >= 0 && attemptsDetail.post_test_complete);
                        possiblePostTestReattempt = (attemptsDetail.post_stage === 0 && attemptsDetail.post_test_complete);
                    }
                } else {
                    complete = attemptsDetail.complete;
                }
            }

            that.setState({
                test_case: testCaseViewInfo,
                test_set_cases: testSetsCases,
                attemptDetail: attemptsDetail,
                complete,
                possiblePostTestReattempt,
                isAnswerCancer: complete ? testCasesAnswers.isAnswerCancer : undefined,
                isTruthCancer: complete ? testCasesAnswers.isTruthCancer : undefined,
                currentTool: 'Pan',
                loading: false
            }, () => {
                Marker.lesions = that.state.test_case.modalities.lesion_types;
                Marker.modalityRatings = that.state.test_case.ratings;
                // ImageViewer.adjustSlideSize();
            });
            // that.props.setImageListAction(testCaseViewInfo.images.map((v, i) => ({...v, answers: testCasesAnswers.images[i]})));
            that.props.setImageListAction(testCaseViewInfo.images, testCasesAnswers.images, complete);
        }).catch((e) => {
            console.debug(e);
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    onNext() {
        if (!this.state.complete && this.state.test_case.modalities.modality_type === 'image_quality' && this.state.attemptDetail.stage === 1) {
            // this.setState({isShowQualityModal: true});
            this.onSendQuality();
        } else if (!this.state.complete && this.state.test_case.modalities.modality_type === 'image_quality' && this.state.attemptDetail.stage === 2) {
            this.setState({isShowConfirmQualityModal: true});
        } else if (!this.state.complete && this.state.test_case.modalities.modality_type === 'covid') {
            const covidRating = this.covidQuestionRef.current.state.selectedRating;
            if (isNaN(covidRating) || Number(covidRating) < 0 || Number(covidRating) > 5) {
                NotificationManager.error(<IntlMessages id={"testView.selectConfidenceNumber"}/>);
            } else {
                this.onMove(1);
            }
        } else {
            this.onMove(1);
        }
    }

    onFinish() {
        if (!this.state.complete && this.state.test_case.modalities.modality_type === 'image_quality' && this.state.attemptDetail.stage === 1) {
            this.onSendQuality();
        } else if (!this.state.complete && this.state.test_case.modalities.modality_type === 'image_quality' && this.state.attemptDetail.stage === 2) {
            this.setState({isShowConfirmQualityModal: true});
        } else {
            this.onComplete();
        }
    }

    onMove(step) { // previous -1, next 1
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        this.onSeek(test_case_index + step);
    }

    onSeek(number) {
        let next_test_case_id = this.state.test_set_cases[number];
        this.setState({loading: true}, () => {
            let url = '/test-view/' + this.state.test_sets_id + '/' + this.state.attempts_id + '/' + next_test_case_id;
            if (this.state.isPostTest) {
                url += '/post'
            }
            Apis.attemptsMoveTestCase(this.state.attempts_id, next_test_case_id).then((resp) => {
                this.setState({test_cases_id: next_test_case_id}, () => {
                    this.getData();
                    this.props.history.replace(url);
                });
            }).catch((e) => {
                NotificationManager.error(<IntlMessages id={"testView.cantMoveCase"}/>);
                this.setState({loading: false})
            }).finally(() => {
                // this.setState({loading: false})
            });
        });
    }

    onComplete() {
        this.setState({loading: true}, () => {
            if (!this.state.isPostTest) {
                Apis.attemptsFinishTest(this.state.attempts_id, window.screen.width, window.screen.height).then((resp) => {
                    if (resp.stage === 2) {
                        let nextPath = '/test-view/' + this.state.test_sets_id + '/' + this.state.attempts_id + '/' + this.state.test_set_cases[0];
                        this.setState({test_cases_id: this.state.test_set_cases[0]}, () => {
                            this.getData();
                            this.props.history.replace(nextPath);
                        });
                    } else {
                        if (this.state.test_case.modalities.modality_type === 'image_quality') {
                            NotificationManager.success(<IntlMessages id={"testView.testFinishMessage"}/>);
                            this.props.history.push('/app/test/complete-list/' + this.state.test_sets_id);  // go to scores tab
                        } else {
                            this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/mainQuestions');  // go to scores tab
                            // this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/score');  // go to scores tab
                        }
                    }
                }).catch((e) => {
                    console.warn(e.response ? e.response.data.error.message : e.message);
                });
            } else {
                Apis.attemptsPostTestFinish(this.state.attempts_id).then(resp => {
                    if (resp.score < 75) {
                        this.setState({
                            isShowPostTestReattemptModal: true,
                            reattemptScore: resp.score,
                            postTestRemainCount: resp.post_test_remain_count,
                            loading: false
                        });
                    } else {
                        this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/postQuestions');  // go to scores tab
                    }
                }).catch(e => {
                    console.warn(e.response ? e.response.data.error.message : e.message);
                    this.setState({loading: false})
                });
            }
        });
    }

    onPostTestReviewAnswer() {
        this.setState({
            isShowPostTestReattemptModal: false,
            loading: true
        });
        if (this.state.postTestRemainCount > 0) {
            this.onSeek(0)
        } else {
            this.props.history.push('/app/test/list');
        }
    }

    onPostTestReattempt() {
        this.setState({loading: true});
        Apis.attemptsPostTestReattempt(this.state.attempts_id).then((result) => {
            this.onSeek(0)
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
            this.setState({loading: false});
        });
    }

    onShowImageQualityModal(imageId) {
        if (this.state.attemptDetail.stage === 2) return;
        this.setState({isShowQualityModal: true, imageIdForQuality: imageId});
    }

    onSetQuality(quality) {
        if (quality === -1) return;
        this.setState({isShowQualityModal: false});
        this.props.setImageQuality(this.state.imageIdForQuality, quality);
    }

    onSendQuality() {
        const quality = {
            full: this.props.imageQuality,
            image: this.props.imageList.map((v) => ({id: v.id, quality: v.imageQuality}))
        };
        if (quality.full === -1) {
            NotificationManager.error(<IntlMessages id={"testView.selectImageQuality"}/>);
        } else if (quality.image.some((v) => v.quality === -1)) {
            NotificationManager.error(<IntlMessages id={"testView.selectEveryImageQuality"}/>);
        } else {
            const test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
            const test_case_length = this.state.test_set_cases.length;
            Apis.attemptsQuality(this.state.attempts_id, this.state.test_cases_id, quality).then((resp) => {
                if (test_case_index + 1 === test_case_length) {
                    this.onComplete();
                } else {
                    this.onMove(1);
                }
            });
        }
    }

    onConfirmImageQuality(isAgree, msg) {
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let test_case_length = this.state.test_set_cases.length;
        this.setState({isShowConfirmQualityModal: false});
        Apis.attemptsConfirmQuality(this.state.attempts_id, this.state.test_cases_id, this.state.test_case.quality, isAgree, msg).then((resp) => {
            if (test_case_index + 1 === test_case_length) {
                this.onComplete();
            } else {
                this.onMove(1);
            }
        });
    }

    onChangeSynchonize(e) {
        this.synchronizer.enabled = e.target.checked;
    }

    onChangeCurrentTool(tool) {
        this.setState({currentTool: tool, isShowToolModal: false});
    }

    onResetView() {
        this.props.changeHangingLayout('CC-R_CC-L_MLO-R_MLO-L');
    }

    handleShowPopup(markData, cancelCallback, deleteCallback, saveCallback) {
        this.popupCancelHandler = cancelCallback;
        this.popupDeleteHandler = deleteCallback;
        this.popupSaveHandler = saveCallback;
        this.setState({isShowPopup: true, selectedMarkData: markData});

    }

    renderHeaderNumber() {
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        return (
            <h1 className={'test-view-header-number'}>
                {this.state.attemptDetail.stage !== 1 ? <span className={'stage'}><IntlMessages id={"testView.stage"}/>{this.state.attemptDetail.stage}</span> : null}
                <Input disabled={this.state.test_case.modalities.force_flow} type="select" value={test_case_index} onChange={(e) => this.onSeek(e.target.value)}>
                    {
                        this.state.test_set_cases.map((v, i) =>
                            <option value={i} key={i}>{i + 1}</option>
                        )
                    }
                </Input>
                <span>&nbsp;&nbsp;/ {this.state.test_set_cases.length}</span>
                <span className={'test-case-name'}>&nbsp;&nbsp;( {this.state.test_case.name} )</span>
            </h1>
        )
    }

    renderNav() {
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let test_case_length = this.state.test_set_cases.length;
        return (
            <nav className={'test-view-action-buttons'}>
                {
                    test_case_index > 0 && (this.state.complete || !this.state.test_case.modalities.force_flow) ?
                        <Button className='test-previous-btn' variant="contained" color="primary" onClick={() => this.onMove(-1)}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.previous"}/></span>
                            <SkipPreviousOutlinedIcon size="small"/>
                        </Button> : null
                }
                {
                    (this.state.complete || test_case_index + 1 !== test_case_length) ? null :
                        <Button className='mr-10 test-previous-finish' variant="contained" color="primary" onClick={() => this.onFinish()}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.submit"}/></span>
                            <CheckCircleOutlineIcon size="small"/>
                        </Button>
                }
                {
                    test_case_index + 1 < test_case_length ?
                        <Button className='mr-10 test-previous-next' variant="contained" color="primary" onClick={() => this.onNext(1)}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.next"}/></span>
                            <SkipNextOutlinedIcon size="small"/>
                        </Button> : null
                }
                {
                    (!this.state.complete && !this.state.possiblePostTestReattempt) &&
                    <Button className={'ml-20 mr-10 test-previous-info'} variant="contained" color="primary" onClick={() => this.setState({isShowInstructionModal: true})}>
                        <span className={'test-action-btn-label'}><IntlMessages id={"testView.instructions"}/></span>
                        <InfoOutlinedIcon size="small"/>
                    </Button>
                }
                {
                    (this.state.complete && !this.state.possiblePostTestReattempt) &&
                        <Button className={'ml-20 mr-10 test-previous-scores'} variant="contained" color="primary"
                                onClick={() => this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/score')}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.scores"}/></span>
                            <HistoryOutlinedIcon size="small"/>
                        </Button>
                }
                {
                    this.state.possiblePostTestReattempt ?
                        <Button className={'ml-20 mr-10 test-previous-scores'} variant="contained" color="primary" onClick={() => this.onPostTestReattempt()}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.viewer.reattempt"}/></span>
                            <CachedIcon size="small"/>
                        </Button> : null
                }
                <Button variant="contained" color="primary" className={'test-home-btn'} onClick={() => this.props.history.push('/app/test/list')}>
                    <span className={'test-action-btn-label'}><IntlMessages id={"testView.home"}/></span>
                    <HomeOutlinedIcon size="small"/>
                </Button>
            </nav>
        );
    }

    renderTestResult() {
        const {isAnswerCancer, isTruthCancer} = this.state;
        if (isAnswerCancer === undefined || isTruthCancer === undefined) {
            return null;
        } else {
            // let isCorrect = isAnswerCancer === isTruthCancer;
            // let resultStr = (isCorrect ? 'Correct: ' : 'Wrong: ') + (isTruthCancer ? "Cancer Case" : "Normal Case");
            let resultStr = this.state.test_case.modalities.modality_type !== 'covid' ?
                (isTruthCancer ? <IntlMessages id={"testView.truth.cancerCase"}/> : <IntlMessages id={"testView.truth.normalCase"}/>) :
                (isTruthCancer ? <IntlMessages id={"testView.truth.covidSign"}/> : <IntlMessages id={"testView.truth.nonCovidSign"}/>);
            return (
                <div style={{display: 'inline-block'}}>
                    <div className={isTruthCancer ? 'correct-result wrong' : 'correct-result correct'}>
                        <span>{resultStr}</span>
                    </div>
                </div>
            );
        }
    }

    renderTruthImageQuality() {
        if (this.state.test_case.modalities.modality_type === 'image_quality') {
            const imageQuality = Number(this.state.attemptDetail.stage === 1 ? this.props.imageQuality : this.state.test_case.quality);
            if (imageQuality === -1) {
                return (
                    <div className={'truth-quality'} onClick={() => this.onShowImageQualityModal('')}>
                        <div className={'quality-icon quality-none-icon'}/>
                        <span className={'quality-text'}><IntlMessages id={"testView.quality"}/></span>
                    </div>
                )
            } else {
                let qualityIcon = [
                    'inadequate-icon',
                    'moderate-icon',
                    'good-icon',
                    'perfect-icon'
                ][imageQuality];

                let quality = [
                    <IntlMessages id={"testView.quality.inadequate"}/>,
                    <IntlMessages id={"testView.quality.moderate"}/>,
                    <IntlMessages id={"testView.quality.good"}/>,
                    <IntlMessages id={"testView.quality.perfect"}/>
                ][imageQuality];
                return (
                    <div className={'truth-quality'} onClick={() => this.onShowImageQualityModal('')}>
                        <div className={'quality-icon ' + qualityIcon}/>
                        <span className={'quality-text'}>{quality}</span>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    renderTools() {
        let tools = this.state.test_case.modalities.tools;
        tools = tools === null ? [] : tools.split(',');
        return (
            <div className={'tool-container'}>
                <div className={"tool option more-icon"} onClick={() => this.setState({isShowToolModal: true})}>
                    {<CornerstoneToolIcon name={this.state.currentTool}/>}
                    <p><IntlMessages id={"testView.tool.moreTools"}/>{this.state.isShowToolModal ? '▲' : '▼'}</p>
                </div>
                {
                    tools.indexOf('Pan') !== -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Pan' ? ' active' : '')} data-tool="Pan" onClick={() => this.onChangeCurrentTool('Pan')}>
                            {<CornerstoneToolIcon name={'Pan'}/>}
                            <p><IntlMessages id={"testView.tool.pan"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Zoom') !== -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Zoom' ? ' active' : '')} data-tool="Zoom" data-synchronize="true"
                             onClick={() => this.onChangeCurrentTool('Zoom')}>
                            {<CornerstoneToolIcon name={'Zoom'}/>}
                            <p><IntlMessages id={"testView.tool.zoom"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Wwwc') !== -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Wwwc' ? ' active' : '')} data-tool="Wwwc" onClick={() => this.onChangeCurrentTool('Wwwc')}>
                            {<CornerstoneToolIcon name={'Wwwc'}/>}
                            <p><IntlMessages id={"testView.tool.window"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Magnify') === -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Magnify' ? ' active' : '')} data-tool="Magnify" onClick={() => this.onChangeCurrentTool('Magnify')}>
                            {<CornerstoneToolIcon name={'Magnify'}/>}
                            <p><IntlMessages id={"testView.tool.magnify"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Length') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Length' ? ' active' : '')} data-tool="Length" onClick={() => this.onChangeCurrentTool('Length')}>
                            {<CornerstoneToolIcon name={'Length'}/>}
                            <p><IntlMessages id={"testView.tool.length"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Angle') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Angle' ? ' active' : '')} data-tool="Angle" onClick={() => this.onChangeCurrentTool('Angle')}>
                            {<CornerstoneToolIcon name={'Angle'}/>}
                            <p><IntlMessages id={"testView.tool.angle"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('EllipticalRoi') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'EllipticalRoi' ? ' active' : '')} data-tool="EllipticalRoi"
                             onClick={() => this.onChangeCurrentTool('EllipticalRoi')}>
                            {<CornerstoneToolIcon name={'EllipticalRoi'}/>}
                            <p><IntlMessages id={"testView.tool.ellipse"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('RectangleRoi') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'RectangleRoi' ? ' active' : '')} data-tool="RectangleRoi" onClick={() => this.onChangeCurrentTool('RectangleRoi')}>
                            {<CornerstoneToolIcon name={'RectangleRoi'}/>}
                            <p><IntlMessages id={"testView.tool.rectangle"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('ArrowAnnotate') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'ArrowAnnotate' ? ' active' : '')} data-tool="ArrowAnnotate"
                             onClick={() => this.onChangeCurrentTool('ArrowAnnotate')}>
                            {<CornerstoneToolIcon name={'ArrowAnnotate'}/>}
                            <p><IntlMessages id={"testView.tool.arrow"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('FreehandMouse') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'FreehandMouse' ? ' active' : '')} data-tool="FreehandMouse"
                             onClick={() => this.onChangeCurrentTool('FreehandMouse')}>
                            {<CornerstoneToolIcon name={'FreehandMouse'}/>}
                            <p><IntlMessages id={"testView.tool.freehand"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Eraser') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Eraser' ? ' active' : '')} data-tool="Eraser" onClick={() => this.onChangeCurrentTool('Eraser')}>
                            {<CornerstoneToolIcon name={'Eraser'}/>}
                            <p><IntlMessages id={"testView.tool.erase"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Marker') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Marker' ? ' active' : '')} data-tool="Marker" onClick={() => this.onChangeCurrentTool('Marker')}>
                            {<CornerstoneToolIcon name={'Marker'}/>}
                            <p><IntlMessages id={"testView.tool.mark"}/></p>
                        </div> : null
                }
                <div className={"tool option"} onClick={() => this.onResetView()}>
                    {<CornerstoneToolIcon name={'Reset'}/>}
                    <p><IntlMessages id={"testView.tool.reset"}/></p>
                </div>
                {
                    tools.indexOf('Grid') !== -1 && <GridToolButton />
                }
            </div>
        )
    }

    renderToolBar() {
        return (
            <div className="test-view-toolbar">
                <div className={"tool option"} onClick={() => this.props.setShowImageBrowser(!this.props.isShowImageBrowser)}>
                    <div className={'series-icon ' + (this.props.isShowImageBrowser ? 'active' : '')}>
                        <svg name="th-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13" width="1em" height="1em" fill="currentColor"><title>TH Large</title>
                            <path d="M0 0h7v6H0zm8 0h7v6H8zM0 7h7v6H0zm8 0h7v6H8z"/>
                        </svg>
                    </div>
                    <p><IntlMessages id={"testView.tool.series"}/></p>
                </div>
                {this.renderTools()}
                <div className="tool">
                    <AntSwitch
                        defaultChecked
                        onChange={(e) => this.onChangeSynchonize(e)}
                        value="checkedB"
                    />
                    <p>&nbsp;<IntlMessages id={"testView.tool.sync"}/></p>
                </div>
                <HangingSelector/>
                {this.renderTestResult()}
            </div>
        )
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="viewer">
                    <div className={'viewer-content'}>
                        <div id="toolbar">
                            {this.renderToolBar()}
                            {this.renderTruthImageQuality()}
                            {this.renderHeaderNumber()}
                            {this.renderNav()}
                        </div>
                        <div className={'test-content'}>
                            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                                <ImageBrowser/>
                                {
                                    (this.state.complete && this.state.test_case.modalities.modality_type !== 'covid') &&
                                    <CommentInfo
                                        test_case_id={this.state.test_cases_id}
                                        attempts_id={this.state.attempts_id}
                                        isCovid={false}
                                    />
                                }
                                {
                                    this.state.complete && this.state.test_case.modalities.modality_type === 'covid' &&
                                    <CovidQuestions
                                        ref={this.covidQuestionRef}
                                        attempts_id={this.state.attempts_id}
                                        test_case_id={this.state.test_cases_id}
                                        complete={true}
                                        isTruth={true}
                                        isPostTest={this.state.isPostTest}
                                    />
                                }
                                <ImageViewerContainer
                                    attemptId={this.state.attempts_id}
                                    currentTool={this.state.currentTool}
                                    synchronizer={this.synchronizer}
                                    radius={this.state.test_case.modalities.circle_size}
                                    complete={this.state.complete}
                                    stage={this.state.attemptDetail.stage}
                                    width={100 / this.state.test_case.images.length}
                                    tools={this.state.test_case.modalities.tools === null ? [] : this.state.test_case.modalities.tools.split(',')}
                                    brightness={this.state.test_case.modalities.brightness}
                                    contrast={this.state.test_case.modalities.contrast}
                                    zoom={this.state.test_case.modalities.zoom}
                                    onShowPopup={this.handleShowPopup.bind(this)}
                                    onShowQualityModal={(!this.state.complete && this.state.test_case.modalities.modality_type === 'image_quality' && this.state.attemptDetail.stage === 1) ? this.onShowImageQualityModal.bind(this) : null}
                                    isShowQuality={this.state.test_case.modalities.modality_type === 'image_quality'}
                                />
                                {
                                    this.state.test_case.modalities.modality_type === 'covid' &&
                                    <CovidQuestions
                                        ref={this.covidQuestionRef}
                                        attempts_id={this.state.attempts_id}
                                        test_case_id={this.state.test_cases_id}
                                        complete={this.state.complete}
                                        isTruth={false}
                                        isPostTest={this.state.isPostTest}
                                    />
                                }
                            </DndProvider>
                        </div>
                    </div>
                    <div className={'rotate-error'}>
                        <img src={require('Assets/img/rotate.png')} alt=''/>
                    </div>
                    <Dialog open={this.state.isShowToolModal} onClose={() => this.setState({isShowToolModal: false})} classes={{paper: 'test-view-toolbar-modal'}}>
                        <div className={'test-view-toolbar tooltip-toolbar-overlay'}>
                            {this.renderTools()}
                        </div>
                    </Dialog>
                    {
                        this.state.isShowPopup ?
                            <MarkerPopup
                                attempts_id={this.state.attempts_id}
                                test_cases_id={this.state.test_cases_id}
                                lesion_types={this.state.test_case.modalities.lesion_types}
                                lesion_list={this.state.test_case.modalities.lesion_list}
                                isPostTest={this.state.isPostTest}
                                markData={this.state.selectedMarkData}
                                ratings={this.state.test_case.ratings}
                                complete={this.state.complete}
                                popupCancelHandler={this.popupCancelHandler}
                                popupDeleteHandler={this.popupDeleteHandler}
                                popupSaveHandler={this.popupSaveHandler}
                                onClose={() => this.setState({isShowPopup: false})}
                            /> : null
                    }
                    <InstructionModal
                        isOpen={this.state.isShowInstructionModal}
                        onClose={() => this.setState({isShowInstructionModal: false})}
                        theme={'black'}
                        type={this.state.test_case.modalities.instruction_type}
                        video={{thumbnail: this.state.test_case.modalities.instruction_video_thumbnail, link: this.state.test_case.modalities.instruction_video}}
                    />
                    <QualityModal
                        isOpen={this.state.isShowQualityModal}
                        toggle={() => this.setState({isShowQualityModal: false})}
                        confirm={(quality) => this.onSetQuality(quality)}
                    />
                    <ConfirmQualityModal
                        isOpen={this.state.isShowConfirmQualityModal}
                        toggle={() => this.setState({isShowConfirmQualityModal: false})}
                        quality={
                            [
                                <IntlMessages id={"testView.quality.inadequate"}/>,
                                <IntlMessages id={"testView.quality.moderate"}/>,
                                <IntlMessages id={"testView.quality.good"}/>,
                                <IntlMessages id={"testView.quality.perfect"}/>
                            ][Number(this.state.test_case.quality)]}
                        confirm={(isAgree, msg) => this.onConfirmImageQuality(isAgree, msg)}
                    />
                    <ReattemptPostTestModal
                        open={this.state.isShowPostTestReattemptModal}
                        score={this.state.reattemptScore}
                        remainCount={this.state.postTestRemainCount}
                        onPostTestAgain={() => this.onPostTestReviewAnswer()}
                    />
                </div>
            );
        } else {
            return (<RctSectionLoader style={{backgroundColor: 'black'}}/>);
        }
    }
}

// map state to props
const mapStateToProps = (state) => {
    return {
        imageList: state.testView.imageList,
        isShowImageBrowser: state.testView.isShowImageBrowser,
        imageQuality: state.testView.imageQuality,
    };
};

export default withRouter(connect(mapStateToProps, {
    setImageListAction,
    setShowImageBrowser,
    changeHangingLayout,
    setImageQuality,
})(TestView));

const AntSwitch = withStyles(theme => ({
    root: {
        width: 30,
        height: 18,
        marginBottom: 8,
        marginLeft: 5,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 14,
        height: 14,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 18 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);