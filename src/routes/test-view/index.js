import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeHangingLayout, setImageListAction, setShowImageBrowser, setImageQuality} from 'Actions';
import {Button, Switch} from '@material-ui/core';
import {Input} from "reactstrap";
import {withStyles} from '@material-ui/core/styles';
import {NotificationManager} from "react-notifications";
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';
import Loader from './lib/loader';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

import ImageViewerContainer from './component/ImageViewerContainer'
import ImageViewer from './component/ImageViewer'
import Marker from './lib/tools/MarkerTool';
import viewerSynchronizer from "./lib/viewerSynchronizer";
import InstructionModal from './InstructionModal';
import CovidQuestions from "Routes/test-view/component/CovidQuestions";
import QualityModal from './QualityModal';
import ConfirmQualityModal from './ConfirmQualityModal';
import ImageBrowser from "./component/ImageBrowser";
import CommentInfo from "./component/CommentInfo";
import HangingSelector from './component/HangingSelector';
import MarkerPopup from "./lib/markerPopup";
import * as Apis from 'Api';
import IntlMessages from "Util/IntlMessages";

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
            isShowInstructionModal: false,
            isShowQualityModal: false,
            imageIdForQuality: '',
            isShowConfirmQualityModal: false,
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
            if (!attemptsDetail.test_sets.has_post) {
                complete = attemptsDetail.complete;
            } else {
                if (that.state.isPostTest) {
                    if (!attemptsDetail.complete) {
                        throw Error('can not test');
                    } else {
                        complete = attemptsDetail.post_stage !== 0;
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
                isAnswerCancer: complete ? testCasesAnswers.isAnswerCancer : undefined,
                isTruthCancer: complete ? testCasesAnswers.isTruthCancer : undefined,
                loading: false
            }, () => {
                Marker.lesions = that.state.test_case.modalities.lesion_types;
                ImageViewer.adjustSlideSize();
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
        } else if (!this.state.complete && this.state.test_case.modalities.modality_type === 'covid'){
            const covidRating = this.covidQuestionRef.current.state.selectedRating;
            if( isNaN(covidRating) || Number(covidRating) < 0 || Number(covidRating) > 5) {
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
                Apis.attemptsComplete(this.state.attempts_id, window.screen.width, window.screen.height).then((resp) => {
                    if (!resp.complete && resp.stage === 2) {
                        let nextPath = '/test-view/' + this.state.test_sets_id + '/' + this.state.attempts_id + '/' + this.state.test_set_cases[0];
                        this.setState({test_cases_id: this.state.test_set_cases[0]}, () => {
                            this.getData();
                            this.props.history.replace(nextPath);
                        });
                    } else if (resp.complete) {
                        if (this.state.test_case.modalities.modality_type === 'image_quality') {
                            NotificationManager.success(<IntlMessages id={"testView.testFinishMessage"}/>);
                            this.props.history.push('/app/test/complete-list/' + this.state.test_sets_id);  // go to scores tab
                        } else {
                            this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/score');  // go to scores tab
                        }
                    }
                }).catch((e) => {
                    console.warn(e.response ? e.response.data.error.message : e.message);
                });
            } else {
                Apis.attemptsPostTestComplete(this.state.attempts_id).then(resp => {
                    this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/postQuestions');  // go to scores tab
                }).catch(e => {
                    console.warn(e.response ? e.response.data.error.message : e.message);
                })
            }
        });
    }

    onShowImageQualityModal(imageId) {
        if(this.state.attemptDetail.stage === 2) return;
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
        if(quality.full === -1) {
            NotificationManager.error(<IntlMessages id={"testView.selectImageQuality"}/>);
        } else if(quality.image.some((v) => v.quality === -1)) {
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
        this.setState({currentTool: tool});
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
            <h1 style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                {this.state.attemptDetail.stage !== 1 ? <span className={'stage'}><IntlMessages id={"testView.stage"}/>{this.state.attemptDetail.stage}</span> : null}
                <Input disabled={this.state.test_case.modalities.force_flow} type="select" value={test_case_index} onChange={(e) => this.onSeek(e.target.value)}
                       style={{width: 80, backgroundColor: 'black', color: 'white', borderColor: 'grey'}}>
                    {
                        this.state.test_set_cases.map((v, i) =>
                            <option value={i} key={i}>{i + 1}</option>
                        )
                    }
                </Input>
                {/*{test_case_index + 1}*/}
                &nbsp;&nbsp;/ {this.state.test_set_cases.length}&nbsp;&nbsp;( {this.state.test_case.name} )
            </h1>
        )
    }

    renderNav() {
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let test_case_length = this.state.test_set_cases.length;
        return (
            <nav>
                {
                    test_case_index > 0 && (this.state.complete || !this.state.test_case.modalities.force_flow) ?
                        <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onMove(-1)}> <IntlMessages id={"testView.previous"}/></Button> : null
                }
                {
                    this.state.complete || test_case_index + 1 !== test_case_length ?
                        null : <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onFinish()}> <IntlMessages id={"testView.finish"}/></Button>
                }
                {
                    test_case_index + 1 < test_case_length ?
                        <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onNext(1)}> <IntlMessages id={"testView.next"}/></Button> : null
                }
                {
                    this.state.complete ?
                        null : <Button className={'ml-20 mr-10'} variant="contained" color="primary" onClick={() => this.setState({isShowInstructionModal: true})}><IntlMessages id={"testView.instructions"}/></Button>
                }
                {
                    this.state.complete ?
                        <Button className={'ml-20 mr-10'} variant="contained" color="primary" onClick={() => this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/score')}><IntlMessages id={"testView.scores"}/></Button> : null
                }
                <Button variant="contained" color="primary" onClick={() => this.props.history.push('/app/test/list')}><IntlMessages id={"testView.home"}/></Button>
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
        if(this.state.test_case.modalities.modality_type === 'image_quality') {
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
            <div id="tools">
                <div className={"tool option"} onClick={() => this.props.setShowImageBrowser(!this.props.isShowImageBrowser)}>
                    <div className={'series-icon ' + (this.props.isShowImageBrowser ? 'active' : '')}>
                        <svg name="th-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13" width="1em" height="1em" fill="currentColor"><title>TH Large</title>
                            <path d="M0 0h7v6H0zm8 0h7v6H8zM0 7h7v6H0zm8 0h7v6H8z"/>
                        </svg>
                    </div>
                    <p><IntlMessages id={"testView.tool.series"}/></p>
                </div>
                {
                    tools.indexOf('Pan') !== -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Pan' ? ' active' : '')} data-tool="Pan" onClick={() => this.onChangeCurrentTool('Pan')}>
                            <svg id="icon-tools-pan" viewBox="0 0 18 18">
                                <title>Pan</title>
                                <g id="icon-tools-pan-group" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path id="icon-tools-pan-line-v" d="M9,1 L9,17"/>
                                    <path id="icon-tools-pan-line-h" d="M1,9 L17,9"/>
                                    <polyline id="icon-tools-pan-caret-t" points="7 3 9 1 11 3"/>
                                    <polyline id="icon-tools-pan-caret-r" points="15 11 17 9 15 7"/>
                                    <polyline id="icon-tools-pan-caret-b" points="11 15 9 17 7 15"/>
                                    <polyline id="icon-tools-pan-caret-l" points="3 7 1 9 3 11"/>
                                </g>
                            </svg>
                            <p><IntlMessages id={"testView.tool.pan"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Zoom') !== -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Zoom' ? ' active' : '')} data-tool="Zoom" data-synchronize="true"
                             onClick={() => this.onChangeCurrentTool('Zoom')}>
                            <svg id="icon-tools-zoom" viewBox="0 0 17 17">
                                <title>Zoom</title>
                                <g id="icon-tools-zoom-group" fill="none" strokeWidth="2" strokeLinecap="round">
                                    <path id="icon-tools-zoom-path" d="m11.5,11.5 4.5,4.5"/>
                                    <circle id="icon-tools-zoom-circle" cx="7" cy="7" r="6"/>
                                </g>
                            </svg>
                            <p><IntlMessages id={"testView.tool.zoom"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Wwwc') !== -1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Wwwc' ? ' active' : '')} data-tool="Wwwc" onClick={() => this.onChangeCurrentTool('Wwwc')}>
                            <svg id="icon-tools-levels" viewBox="0 0 18 18">
                                <title>Window</title>
                                <g id="icon-tools-levels-group">
                                    <path id="icon-tools-levels-path" d="M14.5,3.5 a1 1 0 0 1 -11,11 Z" stroke="none" opacity="0.8"/>
                                    <circle id="icon-tools-levels-circle" cx="9" cy="9" r="8" fill="none" strokeWidth="2"/>
                                </g>
                            </svg>
                            <p><IntlMessages id={"testView.tool.window"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Length') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Length' ? ' active' : '')} data-tool="Length" onClick={() => this.onChangeCurrentTool('Length')}>
                            <svg name="measure-temp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" fill="none">
                                <title>Length</title>
                                <g strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="6.5" cy="6.5" r="6" fill="transparent"/>
                                    <path d="M6.5 3v7M3 6.5h7"/>
                                    <path d="M22.5 6L6 22.5" strokeWidth="3" strokeDasharray="0.6666,5"/>
                                </g>
                            </svg>
                            <p><IntlMessages id={"testView.tool.length"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Angle') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Angle' ? ' active' : '')} data-tool="Angle" onClick={() => this.onChangeCurrentTool('Angle')}>
                            <svg name="angle-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" width="1em" height="1em" fill="currentColor">
                                <title>Angle</title>
                                <path
                                    d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.angle"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('EllipticalRoi') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'EllipticalRoi' ? ' active' : '')} data-tool="EllipticalRoi"
                             onClick={() => this.onChangeCurrentTool('EllipticalRoi')}>
                            <svg name="circle-o" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                                <title>Circle</title>
                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.ellipse"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('RectangleRoi') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'RectangleRoi' ? ' active' : '')} data-tool="RectangleRoi" onClick={() => this.onChangeCurrentTool('RectangleRoi')}>
                            <svg name="square-o" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
                                <title>Rectangle</title>
                                <path
                                    d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.rectangle"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('ArrowAnnotate') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'ArrowAnnotate' ? ' active' : '')} data-tool="ArrowAnnotate"
                             onClick={() => this.onChangeCurrentTool('ArrowAnnotate')}>
                            <svg name="measure-non-target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" fill="none" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <title>Arrow annotate</title>
                                <circle cx="6.5" cy="6.5" r="6" fill="transparent"/>
                                <path d="M6.5 3v7M3 6.5h7"/>
                                <path d="M23 7L8 22m-1-5v6h6" strokeWidth="2"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.arrow"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('FreehandMouse') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'FreehandMouse' ? ' active' : '')} data-tool="FreehandMouse"
                             onClick={() => this.onChangeCurrentTool('FreehandMouse')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <title>Freehand</title>
                                <path
                                    d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.freehand"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Eraser') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Eraser' ? ' active' : '')} data-tool="Eraser" onClick={() => this.onChangeCurrentTool('Eraser')}>
                            <svg name="eraser" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1792" width="1em" height="1em" fill="currentColor">
                                <title>Eraser</title>
                                <path fill="ACTIVE_COLOR"
                                      d="M960 384l336 384H528L192 384h768zm1013 1077q15-34 9.5-71.5T1952 1324L1056 300q-38-44-96-44H192q-38 0-69.5 20.5T75 331q-15 34-9.5 71.5T96 468l896 1024q38 44 96 44h768q38 0 69.5-20.5t47.5-54.5z"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.erase"}/></p>
                        </div> : null
                }
                {
                    tools.indexOf('Marker') !== -1 && !this.state.complete && this.state.attemptDetail.stage === 1 ?
                        <div className={"tool option" + (this.state.currentTool === 'Marker' ? ' active' : '')} data-tool="Marker" onClick={() => this.onChangeCurrentTool('Marker')}>
                            <svg id="icon-tools-elliptical-roi" viewBox="0 0 24 28">
                                <title>Marker</title>
                                <path
                                    d="M12 5.5c-4.688 0-8.5 3.813-8.5 8.5s3.813 8.5 8.5 8.5 8.5-3.813 8.5-8.5-3.813-8.5-8.5-8.5zM24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12v0c6.625 0 12 5.375 12 12z"/>
                            </svg>
                            <p><IntlMessages id={"testView.tool.mark"}/></p>
                        </div> : null
                }
                <div className={"tool option"} onClick={() => this.onResetView()}>
                    <svg name="reset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="1em" height="1em" fill="currentColor">
                        <path d="M24 14c0 6.609-5.391 12-12 12a11.972 11.972 0 0 1-9.234-4.328.52.52 0 0 1 .031-.672l2.141-2.156a.599.599 0 0 1 .391-.141.51.51 0 0 1 .359.187A7.91 7.91 0 0 0 12 21.999c4.406 0 8-3.594 8-8s-3.594-8-8-8A7.952 7.952 0 0 0 6.563 8.14l2.141 2.156a.964.964 0 0 1 .219 1.078 1.002 1.002 0 0 1-.922.625h-7c-.547 0-1-.453-1-1v-7c0-.406.25-.766.625-.922a.964.964 0 0 1 1.078.219l2.031 2.016c2.203-2.078 5.187-3.313 8.266-3.313 6.609 0 12 5.391 12 12z"/>
                    </svg>
                    <p><IntlMessages id={"testView.tool.reset"}/></p>
                </div>
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
                    <div id="toolbar">
                        {this.renderTools()}
                        {this.renderTruthImageQuality()}
                        {this.renderHeaderNumber()}
                        {this.renderNav()}
                    </div>
                    <div className={'test-content'}>
                        <DndProvider backend={HTML5Backend}>
                            <ImageBrowser/>
                            {
                                this.state.complete &&
                                <CommentInfo
                                    test_case_id={this.state.test_cases_id}
                                    attempts_id={this.state.attempts_id}
                                    isCovid={this.state.test_case.modalities.modality_type === 'covid'}
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
                        toggle={() => this.setState({isShowInstructionModal: false})}
                        theme={'black'}
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