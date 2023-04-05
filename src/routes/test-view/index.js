import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeHangingLayout, setImageListAction, setShowImageBrowser, setCaseDensity, setModalityInfo, setAttemptInfo} from 'Actions';
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
import cornerstoneWebImageLoader from './lib/CornerstoneWebImageLoader';
import Hammer from 'hammerjs';
import ReactGA from "react-ga4";

import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import LoadingIndicator from "./component/LoadingIndicator";
import ImageViewerContainer from './component/ImageViewerContainer'
import Marker from './lib/tools/MarkerTool';
import viewerSynchronizer from "./lib/viewerSynchronizer";
import InstructionModal from '../instructions';
import SideQuestions from "./component/SideQuestions";
import CovidQuestions from "./component/SideQuestions/CovidQuestions";
import DensityModal from './DensityModal';
import ReattemptPostTestModal from './ReattemptPostTestModal';
import GuestLoginModal from "./GuestLoginModal";
import ImageBrowser from "./component/ImageBrowser";
import CommentInfo from "./component/CommentInfo";
import HangingSelector from './component/HangingSelector';
import MarkerPopup from "./lib/MarkerPopup";
import ShortcutContainer from "./component/TestViewToolList/ShortcutContainer";
import TestViewToolList from './component/TestViewToolList';
import IntlMessages from "Util/IntlMessages";
import * as Apis from 'Api';
import VideoModal from "Routes/instructions/VideoModal";
import * as selectors from "Selectors";

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
            testCaseIndex: 0,
            complete: false,
            isAnswerCancer: undefined,
            isTruthCancer: undefined,
            answerDensity: undefined,
            imageAnswers: [],
            testSetStartVideo: '',
            possibleCloseStartVideo: false,
            isShowPopup: false,
            selectedMarkData: {},
            isShowToolModal: false,
            isShowInstructionModal: false,
            isShowLoadingIndicator: true,
            isShowLoginModal: false,

            possiblePostTestReattempt: false,
            isShowPostTestReattemptModal: false,
            reattemptScore: 0,
            postTestRemainCount: 0,
        };
        this.sideQuestionRef = React.createRef();
        this.covidQuestionRef = React.createRef();
        this.qualityQuestionRef = React.createRef();
        this.chestQuestionRef = React.createRef();
        this.popupCancelHandler = null;
        this.popupDeleteHandler = null;
        this.popupSaveHandler = null;
        this.synchronizer = null;
        this.needLoadImagePathList = [];
        this.startPreloadImageFunc = false;
        this.isMount = false;
        this.initConerstone();
    }

    initConerstone() {
        cornerstoneWebImageLoader.external.cornerstone = cornerstone;
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
        cornerstoneTools.init();
        this.synchronizer = new cornerstoneTools.Synchronizer(
            'cornerstonetoolsmousewheel cornerstonetoolsmousedrag cornerstonenewimage',
            viewerSynchronizer //  cornerstoneTools.panZoomSynchronizer
        );

        cornerstone.events.addEventListener('cornerstoneimageviewthumbnaildone', this.handleImageViewThumbnailDone.bind(this));
        cornerstone.events.addEventListener('cornerstoneimageviewprefetchdone', this.handleImageViewPrefetchDone.bind(this));

    }

    componentDidMount() {
        this.isMount = true;
        this.getData();
        setTimeout(() => {
            this.setState({isShowLoadingIndicator: false});
        }, 10000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.test_case.images !== undefined && this.state.test_case.images !== prevState.test_case.images) {

        }
    }

    componentWillUnmount() {
        this.isMount = false;
        this.props.setImageListAction([], []);
        cornerstoneWebImageLoader.dataSetCacheManager.purge();
    }

    getData() {
        // reset for next case image preloader
        this.imageViewLoadedStatus = [];
        this.startPreloadImageFunc = false;

        this.props.setImageListAction([], []);
        const that = this;
        Promise.all([
            Apis.testCasesViewInfo(that.state.test_cases_id),
            Apis.testSetsCaseList(that.state.test_sets_id, that.state.isPostTest),
            Apis.attemptsDetail(that.state.attempts_id, that.state.test_cases_id),
            Apis.testCasesAnswers(that.state.test_cases_id, that.state.attempts_id, that.state.isPostTest),
            Apis.attemptsStartVideo(that.state.attempts_id),
            Apis.testSetsDetail(that.state.test_sets_id)
        ]).then(function ([testCaseViewInfo, testSetsCases, attemptsDetail, testCasesAnswers, startVideoInfo, testSet]) {
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
            that.synchronizer.enabled = (testCaseViewInfo.images.every((v) => v.stack_count === 1) && ['chest', 'ultrasound'].indexOf(testCaseViewInfo.modalities.modality_type) === -1);

            if(testSet) {
                that.setState({
                    test_set: testSet
                })
            }

            that.props.setModalityInfo(testCaseViewInfo.modalities);
            that.props.setAttemptInfo(attemptsDetail);
            const testCaseIndex = testSetsCases.findIndex((v) => v.test_case_id === that.state.test_cases_id);
            that.setState({
                test_case: testCaseViewInfo,
                test_set_cases: testSetsCases,
                testCaseIndex,
                attemptDetail: attemptsDetail,
                testSetStartVideo: startVideoInfo.link,
                possibleCloseStartVideo: startVideoInfo.possibleClose,
                complete,
                possiblePostTestReattempt,
                isAnswerCancer: complete ? testCasesAnswers.isAnswerCancer : undefined,
                isTruthCancer: complete ? testCasesAnswers.isTruthCancer : undefined,
                answerDensity: complete ? testCasesAnswers.answerDensity : undefined,
                loading: false
            }, () => {
                Marker.modalityRatings = that.state.test_case.ratings;
            });

            // make need images list for loading
            that.needLoadImagePathList = [];
            let needLoadImageList = [];
            needLoadImageList = needLoadImageList.concat(testSetsCases[testCaseIndex].images);
            if (testCaseIndex + 1 < testSetsCases.length) {
                needLoadImageList = needLoadImageList.concat(testSetsCases[testCaseIndex + 1].images);
            }
            if (!complete) {
                needLoadImageList = needLoadImageList.filter(image => (['test', 'prior', 'cesm', 'ultrasound'].indexOf(image.type) !== -1));
            }
            needLoadImageList.forEach((v) => {
                for (let i = 0; i < v.stack_count; i++) {
                    that.needLoadImagePathList.push(testCaseViewInfo.image_url_base + v.id + '/' + i);
                }
            });

            // load images metadata
            Promise.all(testCaseViewInfo.images.map((v) => cornerstoneWebImageLoader.dataSetCacheManager.loadMetaData(v.image_url_path))).then(() => {
                testCaseViewInfo.images.forEach((v) => {
                    v.metaData = cornerstone.metaData.get(
                        'imagePosition',
                        v.image_url_path
                    );
                })
                const isShowImageBrowser = (window.innerWidth < 2560 && testCaseViewInfo.images.length >= 2 && ['chest', 'imaged_mammo'].indexOf(testCaseViewInfo.modalities.modality_type) === -1);
                that.props.setImageListAction(
                    testCaseViewInfo.images,
                    testCasesAnswers.images,
                    testCaseViewInfo.modalities.tools === null ? [] : testCaseViewInfo.modalities.tools.split(','),
                    testCaseViewInfo.modalities.number_of_slides,
                    complete,
                    isShowImageBrowser,
                    testCaseViewInfo.test_case_grid_info
                );
                if (testCaseViewInfo.modalities.modality_type === 'volpara') {
                    that.props.setCaseDensity(testCasesAnswers.answerDensity === undefined ? -1 : Number(testCasesAnswers.answerDensity));
                }
            });
            document.title = attemptsDetail.test_sets.name + (attemptsDetail.test_sets.test_set_code ? ` (${attemptsDetail.test_sets.test_set_code})` : '');
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    handleImageViewThumbnailDone(e) {
        if (this.imageViewThumbnailDoneStatus === undefined) this.imageViewThumbnailDoneStatus = [];
        this.imageViewThumbnailDoneStatus.push(e.detail.imageViewImageId);
        let showImageLength = 0;
        this.props.showImageList.forEach((v) => showImageLength += v.length);
        if (this.imageViewThumbnailDoneStatus.length === showImageLength) {
            //load finished all current image thumbnails
            console.log('all image thumbnail loaded');
            if (this.state.isShowLoadingIndicator) {
                this.setState({isShowLoadingIndicator: false});
            }
        }
    }

    handleImageViewPrefetchDone(e) {
        // all images preloaded
        if (this.needLoadImagePathList.length === 0) return;
        if (this.imageViewLoadedStatus === undefined) this.imageViewLoadedStatus = [];
        this.imageViewLoadedStatus.push(e.detail.imageViewImageId);
        this.needLoadImagePathList = this.needLoadImagePathList.filter((imgPath) =>
            this.imageViewLoadedStatus.every((imgId) => imgPath.indexOf(imgId) === -1)
        );
        let loadAllImageView = true;
        this.props.showImageList.forEach((imgRow) => {
            imgRow.forEach((imgId) => {
                if (this.imageViewLoadedStatus.indexOf(imgId) === -1) loadAllImageView = false;
            })
        });
        if (!this.startPreloadImageFunc && loadAllImageView) {
            this.startPreloadImageFunc = true;
            this.startPreloadImages();
        }
    }

    async startPreloadImages() {
        while (this.needLoadImagePathList.length > 0 && this.isMount) {
            const tempImagePaths = this.needLoadImagePathList.splice(0, 17);
            await Promise.all(tempImagePaths.map((path) => cornerstone.loadImage(path, {type: 'prefetch'})));
        }
    }

    validateForNext() {
        let valid = true;
        if (!this.state.complete) {
            if (['covid', 'chest', 'imaged_chest', 'imaged_mammo', 'chest_ct', 'quiz'].indexOf(this.state.test_case.modalities.modality_type) !== -1) {
                if (this.sideQuestionRef.current && this.sideQuestionRef.current.checkQuestionValidate) {
                    valid = this.sideQuestionRef.current.checkQuestionValidate();
                } else {
                    console.error('can not find question validation function');
                    valid = false;
                }
            } else if (
                this.state.test_case.modalities.modality_type === 'normal' &&
                this.sideQuestionRef.current &&
                this.sideQuestionRef.current.checkQuestionValidate
            ) {
                valid = this.sideQuestionRef.current.checkQuestionValidate();
            }
        }
        return valid;
    }

    onNext() {
        if (!this.state.complete && this.state.test_case.modalities.modality_type === 'volpara') {
            this.onSendCaseDensity();
        } else if (this.validateForNext()) {
            this.onMove(1);
        }
    }

    onFinish() {
        if (!this.state.complete && this.state.test_case.modalities.modality_type === 'volpara') {
            this.onSendCaseDensity();
        } else if (this.validateForNext()) {
            this.onComplete();
        }
    }

    onViewerReset() {
        Apis.attemptsViewerReset(this.state.attempts_id).then((nextStep) => {
            this.props.history.replace('/main/home');
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    onMove(step) { // previous -1, next 1
        this.onSeek(this.state.testCaseIndex + step);
    }

    onSeek(number) {
        let next_test_case_id = this.state.test_set_cases[number].test_case_id;
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
        ReactGA.event('level_end', {
            level_name: this.state.attemptDetail.test_sets.name,
            success: true
        });
        if (!this.props.isLogin) {
            this.setState({isShowLoginModal: true});
        } else {
            this.setState({loading: true}, () => {
                if (!this.state.isPostTest) {
                    Apis.attemptsFinishTest(this.state.attempts_id, window.screen.width, window.screen.height).then((nextStep) => {
                        this.props.history.push('/main/attempt/' + this.state.attempts_id + '/' + nextStep + '?from=test');  // go to scores tab
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
                            this.props.history.push('/main/attempt/' + this.state.attempts_id + '/postQuestions');  // go to scores tab
                        }
                    }).catch(e => {
                        console.warn(e.response ? e.response.data.error.message : e.message);
                        this.setState({loading: false})
                    });
                }
            });
        }
    }

    onPostTestReviewAnswer() {
        this.setState({
            isShowPostTestReattemptModal: false,
            loading: true
        });
        if (this.state.postTestRemainCount > 0) {
            this.onSeek(0)
        } else {
            this.props.history.push('/main/home');
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

    onShowDensityModal() {
        if (this.state.complete) return;
        this.setState({isShowDensityModal: true});
    }

    onSetDensity(density) {
        if (density === -1) return;
        this.setState({isShowDensityModal: false});
        this.props.setCaseDensity(density);
        setTimeout(() => this.onNext(), 100);
    }

    onSendCaseDensity() {
        if (this.props.caseDensity === -1) {
            NotificationManager.error(<IntlMessages id={"testView.selectDensity"}/>);
        } else {
            const test_case_length = this.state.test_set_cases.length;
            Apis.attemptsDensity(this.state.attempts_id, this.state.test_cases_id, this.props.caseDensity).then((resp) => {
                if (this.state.testCaseIndex + 1 === test_case_length) {
                    this.onComplete();
                } else {
                    this.onMove(1);
                }
            });
        }
    }

    handleShowPopup(markData, cancelCallback, deleteCallback, saveCallback) {
        this.popupCancelHandler = cancelCallback;
        this.popupDeleteHandler = deleteCallback;
        this.popupSaveHandler = saveCallback;
        this.setState({isShowPopup: true, selectedMarkData: markData});

    }

    renderHeaderNumber() {
        const marginLeft = (window.innerWidth > 2000 && window.screen.width < window.outerWidth) ? 350 : 0;
        return (
            <h1 className={'test-view-header-number'} style={{marginLeft: marginLeft}}>
                <Input data-cy="test-case-selector" disabled={this.state.test_case.modalities.force_flow} type="select" value={this.state.testCaseIndex} onChange={(e) => this.onSeek(e.target.value)}>
                    {
                        this.state.test_set_cases.map((v, i) =>
                            <option value={i} key={i}>{i + 1}</option>
                        )
                    }
                </Input>
                <span>&nbsp;&nbsp;/ {this.state.test_set_cases.length}</span>
                {
                    ['chest', 'chest_ct'].indexOf(this.state.test_case.modalities.modality_type) === -1 &&
                    <span className={'test-case-name'}>&nbsp;&nbsp;( {this.state.test_case.name} )</span>
                }
            </h1>
        )
    }

    renderNav() {
        let test_case_length = this.state.test_set_cases.length;
        return (
            <nav className={'test-view-action-buttons'}>
                {
                    this.state.testCaseIndex > 0 && (this.state.complete || !this.state.test_case.modalities.force_flow) ?
                        <Button className='test-previous-btn' variant="contained" color="primary" onClick={() => this.onMove(-1)}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.previous"}/></span>
                            <SkipPreviousOutlinedIcon size="small"/>
                        </Button> : null
                }
                {
                    (this.state.test_case.modalities.modality_type === 'viewer' || this.state.complete || this.state.testCaseIndex + 1 !== test_case_length) ? null :
                        <Button className='mr-10 test-previous-finish' variant="contained" color="primary" onClick={() => this.onFinish()}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.submit"}/></span>
                            <CheckCircleOutlineIcon size="small"/>
                        </Button>
                }
                {
                    this.state.testCaseIndex + 1 < test_case_length ?
                        <Button className='mr-10 test-previous-next' variant="contained" color="primary" onClick={() => this.onNext()}>
                            <span className={'test-action-btn-label'}><IntlMessages id={"testView.next"}/></span>
                            <SkipNextOutlinedIcon size="small"/>
                        </Button> : null
                }
                {
                    this.state.test_case.modalities.modality_type === 'viewer' &&
                    <Button className='mr-10 test-previous-finish' variant="contained" color="primary" onClick={() => this.onViewerReset()}>
                        <span className={'test-action-btn-label'}><IntlMessages id={"testView.finish"}/></span>
                        <CheckCircleOutlineIcon size="small"/>
                    </Button>
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
                            onClick={() => this.props.history.push('/main/attempt/' + this.state.attempts_id + '/score')}>
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
                <Button variant="contained" color="primary" className={'test-home-btn'} onClick={() => this.props.history.push('/main/home')}>
                    <span className={'test-action-btn-label'}><IntlMessages id={"testView.home"}/></span>
                    <HomeOutlinedIcon size="small"/>
                </Button>
            </nav>
        );
    }

    renderTestResult() {
        const {isAnswerCancer, isTruthCancer, test_set} = this.state;
        if (isAnswerCancer === undefined || isTruthCancer === undefined) {
            return null;
        } else if (['volpara', 'imaged_mammo', 'imaged_chest', 'quiz'].indexOf(this.state.test_case.modalities.modality_type) !== -1) {
            return null;
        } else {
            // let isCorrect = isAnswerCancer === isTruthCancer;
            // let resultStr = (isCorrect ? 'Correct: ' : 'Wrong: ') + (isTruthCancer ? "Cancer Case" : "Normal Case");
            let resultStr;
            if (this.state.test_case.modalities.modality_type === 'covid') {
                resultStr = isTruthCancer ? <IntlMessages id={"testView.truth.covidSign"}/> : <IntlMessages id={"testView.truth.nonCovidSign"}/>
            } else if (['chest', 'chest_ct'].indexOf(this.state.test_case.modalities.modality_type) !== -1) {
                if (this.state.test_case.modalities.name !== 'LinED') {
                    resultStr = isTruthCancer ? <IntlMessages id={"testView.truth.abnormalChest"}/> : <IntlMessages id={"testView.truth.normalChest"}/>
                } else {
                    resultStr = isTruthCancer ? 'Incorrect Position' : 'Correct Position';
                }
            } else if (test_set.confidence_question) {
                resultStr = isTruthCancer ? <IntlMessages id={"testView.truth.abnormalChest"}/> : <IntlMessages id={"testView.truth.normalCase"}/>
            } else {
                resultStr = isTruthCancer ? <IntlMessages id={"testView.truth.cancerCase"}/> : <IntlMessages id={"testView.truth.normalCase"}/>
            }
            return (
                <div style={{display: 'inline-block'}}>
                    <div className={isTruthCancer ? 'correct-result wrong' : 'correct-result correct'}>
                        <span>{resultStr}</span>
                    </div>
                </div>
            );
        }
    }

    renderCaseDensity() {
        if (this.state.test_case.modalities.modality_type === 'volpara') {
            if (!this.state.complete) {
                const imageDensity = Number(this.props.caseDensity);
                return (
                    <div className={'truth-quality'} onClick={() => this.onShowDensityModal()}>
                        {
                            imageDensity === -1 ?
                                <div className={'quality-icon quality-none-icon'}/> :
                                <div className={'density-icon'}>{['a', 'b', 'c', 'd'][imageDensity]}</div>
                        }
                        <span data-cy="density-icon" className={'quality-text'}><IntlMessages id={"testView.density"}/></span>
                    </div>
                )
            } else {
                if (this.state.answerDensity === undefined) {
                    return null;
                } else {
                    return (
                        <div className={'truth-quality'}>
                            <div className={'density-score ' + (this.state.isTruthCancer ? 'correct' : 'wrong')}>
                                <span><IntlMessages id={"testView.youScored"}/>: {['a', 'b', 'c', 'd'][this.state.answerDensity]}</span>
                            </div>
                        </div>
                    );
                }
            }
        } else {
            return null;
        }
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
                <TestViewToolList
                    complete={this.state.complete}
                    isShowToolModal={this.state.isShowToolModal}
                    onClickShowToolModal={() => this.setState({isShowToolModal: true})}
                    onClose={() => this.setState({isShowToolModal: false})}
                />
                <div className="tool">
                    <AntSwitch
                        data-cy="synchronizer-switch"
                        defaultChecked={this.synchronizer.enabled}
                        onChange={(e) => (this.synchronizer.enabled = e.target.checked)}
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
                    <ShortcutContainer className={'viewer-content'} complete={this.state.complete}>
                        <div id="toolbar">
                            {this.renderToolBar()}
                            {this.renderCaseDensity()}
                            {this.renderHeaderNumber()}
                            {this.renderNav()}
                        </div>
                        <div className={'test-content'}>
                            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                                <ImageBrowser/>
                                {
                                    this.state.test_case.modalities.modality_type !== 'covid' &&
                                    <CommentInfo
                                        test_case_id={this.state.test_cases_id}
                                        attempts_id={this.state.attempts_id}
                                        modality_type={this.state.test_case.modalities.modality_type}
                                        modality_name={this.state.test_case.modalities.name}
                                        complete={this.state.complete}
                                        isPostTest={this.state.isPostTest}
                                    />
                                }
                                {
                                    this.state.complete && this.state.test_case.modalities.modality_type === 'covid' &&
                                    <CovidQuestions
                                        attempts_id={this.state.attempts_id}
                                        test_case_id={this.state.test_cases_id}
                                        complete={true}
                                        isTruth={true}
                                        isPostTest={this.state.isPostTest}
                                    />
                                }
                                <ImageViewerContainer
                                    attemptId={this.state.attempts_id}
                                    synchronizer={this.synchronizer}
                                    radius={this.state.test_case.modalities.circle_size}
                                    complete={this.state.complete}
                                    onShowPopup={this.handleShowPopup.bind(this)}
                                />
                                <SideQuestions
                                    modalityInfo={this.state.test_case.modalities}
                                    ref={this.sideQuestionRef}
                                    attempts_id={this.state.attempts_id}
                                    test_case_id={this.state.test_cases_id}
                                    complete={this.state.complete}
                                    isTruth={false}  // for covid question(truth left panel or answer right panel)
                                    isPostTest={this.state.isPostTest}
                                    questions={this.state.test_case.questions}
                                    confidenceQuestion={this.state.test_set ? this.state.test_set.confidence_question : null}
                                />
                            </DndProvider>
                        </div>
                    </ShortcutContainer>
                    {this.state.isShowLoadingIndicator && <LoadingIndicator type={"test-view"}/>}
                    <div className={'rotate-error'}>
                        <img src={require('Assets/img/rotate.png')} alt=''/>
                    </div>
                    <Dialog open={this.state.isShowToolModal} onClose={() => this.setState({isShowToolModal: false})} classes={{paper: 'test-view-toolbar-modal'}}>
                        <div className={'test-view-toolbar tooltip-toolbar-overlay'}>
                            <TestViewToolList
                                complete={this.state.complete}
                                isShowToolModal={this.state.isShowToolModal}
                                onClickShowToolModal={() => this.setState({isShowToolModal: true})}
                                onClose={() => this.setState({isShowToolModal: false})}
                            />
                        </div>
                    </Dialog>
                    {
                        !this.state.isShowPopup ? null :
                            <MarkerPopup
                                attempts_id={this.state.attempts_id}
                                test_cases_id={this.state.test_cases_id}
                                // ultrasound modality does not have lesion in test
                                lesion_list={this.state.test_case.modalities.modality_type !== 'ultrasound' ? this.state.test_case.modalities.lesion_list : '[]'}
                                isPostTest={this.state.isPostTest}
                                markData={this.state.selectedMarkData}
                                ratings={this.state.test_case.ratings}
                                complete={this.state.complete}
                                popupCancelHandler={this.popupCancelHandler}
                                popupDeleteHandler={this.popupDeleteHandler}
                                popupSaveHandler={this.popupSaveHandler}
                                onClose={() => this.setState({isShowPopup: false})}
                            />
                    }
                    <VideoModal
                        open={this.state.testSetStartVideo !== ''}
                        onClose={() => this.setState({testSetStartVideo: ''})}
                        possibleClose={this.state.possibleCloseStartVideo}
                        link={this.state.testSetStartVideo}
                    />
                    <InstructionModal
                        isOpen={this.state.isShowInstructionModal}
                        onClose={() => this.setState({isShowInstructionModal: false})}
                        theme={'black'}
                        type={this.state.test_case.modalities.instruction_type}
                        video={{thumbnail: this.state.test_case.modalities.instruction_video_thumbnail, link: this.state.test_case.modalities.instruction_video}}
                    />
                    <DensityModal
                        isOpen={this.state.isShowDensityModal}
                        toggle={() => this.setState({isShowDensityModal: false})}
                        confirm={(density) => this.onSetDensity(density)}
                    />
                    <ReattemptPostTestModal
                        open={this.state.isShowPostTestReattemptModal}
                        score={this.state.reattemptScore}
                        remainCount={this.state.postTestRemainCount}
                        onPostTestAgain={() => this.onPostTestReviewAnswer()}
                    />
                    <GuestLoginModal
                        open={this.state.isShowLoginModal}
                        attemptId={this.state.attempts_id}
                        onClose={() => this.setState({isShowLoginModal: false})}
                        onComplete={this.onComplete.bind(this)}
                    />
                </div>
            );
        } else {
            return (<RctSectionLoader style={{backgroundColor: 'black'}}/>);
        }
    }
}

// map state to props
const mapStateToProps = (state) => ({
    imageList: state.testView.imageList,
    showImageList: state.testView.showImageList,
    isShowImageBrowser: state.testView.isShowImageBrowser,
    caseDensity: state.testView.caseDensity,
    isLogin: selectors.getIsLogin(state),
});

export default withRouter(connect(mapStateToProps, {
    setImageListAction,
    setShowImageBrowser,
    changeHangingLayout,
    setCaseDensity,
    setModalityInfo,
    setAttemptInfo,
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
