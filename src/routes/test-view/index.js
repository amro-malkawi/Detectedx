import React, {Component} from 'react'
import {Col, FormGroup, Label} from "reactstrap";
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import yellow from '@material-ui/core/colors/yellow';
import chroma from 'chroma-js';
import * as Apis from 'Api';

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';
import Loader from './lib/loader';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import {NotificationManager} from "react-notifications";

import Switch from "@material-ui/core/Switch";
import {withStyles} from '@material-ui/core/styles';

import ImageViewer from './lib/ImageViewer'
import Marker from './lib/tools/MarkerTool';
import panZoomSynchronizer from "./lib/panZoomSynchronizer";
import viewerSynchronizer from "./lib/viewerSynchronizer";
import InstructionModal from './InstructionModal';
import QualityModal from './QualityModal';
import ConfirmQualityModal from './ConfirmQualityModal';

export default class TestView extends Component {

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
            selectedRating: '2',
            lesionsValue: [],
            selectedLesions: [],
            isAnswerCancer: undefined,
            isTruthCancer: undefined,
            imageAnswers: [],
            currentTool: 'Pan',
            isShowPopup: false,
            isShowPopupDelete: true,
            selectedMarkData: {},
            isShowInstructionModal: false,
            isShowQualityModal: false,
            isShowConfirmQualityModal: false,
        };

        this.popupCancelHandler = null;
        this.popupDeleteHandler = null;
        this.popupSaveHandler = null;
        this.viewers = [];
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

    getData() {
        const that = this;
        let promise0 = new Promise(function (resolve, reject) {
            Apis.testCasesViewInfo(that.state.test_cases_id).then((data) => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise1 = new Promise(function (resolve, reject) {
            if(!that.state.isPostTest) {
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
        let promise2 = new Promise(function (resolve, reject) {
            Apis.attemptsDetail(that.state.attempts_id, that.state.test_cases_id).then(data => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise3 = new Promise(function (resolve, reject) {
            Apis.testCasesAnswers(that.state.test_cases_id, that.state.attempts_id).then((imageAnswers) => {
                resolve(imageAnswers);
            }).catch(e => {
                reject(e);
            })
        });

        Promise.all([promise0, promise1, promise2, promise3]).then(function (values) {
            const [testCaseViewInfo, testSetsCases, attemptsDetail, testCasesAnswers] = values;
            let complete = false;
            if(!attemptsDetail.test_sets.has_post) {
                complete = attemptsDetail.complete;
            } else {
                if(that.state.isPostTest) {
                    if(!attemptsDetail.complete) {
                        throw Error('can not test');
                    } else {
                        if(attemptsDetail.post_stage === 0) {
                            complete = false;
                        } else {
                            complete = true;
                        }
                    }
                }
            }

            that.setState({
                test_case: testCaseViewInfo,
                test_set_cases: testSetsCases,
                attemptDetail: attemptsDetail,
                complete,
                imageAnswers: testCasesAnswers.images,
                isAnswerCancer: complete ? testCasesAnswers.isAnswerCancer : undefined,
                isTruthCancer: complete ? testCasesAnswers.isTruthCancer : undefined,
                loading: false
            }, () => {
                Marker.lesions = that.state.test_case.modalities.lesion_types;
                ImageViewer.adjustSlideSize();
            });
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.test_case.images !== undefined && this.state.test_case.images !== prevState.test_case.images) {

        }
    }

    onNext() {
       if(!this.state.complete && this.state.test_case.modalities.image_quality && this.state.attemptDetail.stage === 1) {
            this.setState({isShowQualityModal: true});
       } else if (!this.state.complete && this.state.test_case.modalities.image_quality && this.state.attemptDetail.stage === 2) {
           this.setState({isShowConfirmQualityModal: true});
       } else {
           this.onMove(1);
       }
    }

    onFinish() {
        if(!this.state.complete && this.state.test_case.modalities.image_quality && this.state.attemptDetail.stage === 1) {
            this.setState({isShowQualityModal: true});
        } else if (!this.state.complete && this.state.test_case.modalities.image_quality && this.state.attemptDetail.stage === 2) {
            this.setState({isShowConfirmQualityModal: true});
        } else {
            this.onComplete();
        }
    }

    onMove(seek) { // previous -1, next 1
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let next_test_case_id = this.state.test_set_cases[test_case_index + seek];
        this.setState({loading: true}, () => {
            let url = '/test-view/' + this.state.test_sets_id + '/' + this.state.attempts_id + '/' + next_test_case_id;
            Apis.attemptsMoveTestCase(this.state.attempts_id, next_test_case_id).then((resp) => {
                this.setState({test_cases_id: next_test_case_id}, () => {
                    this.getData();
                    this.props.history.replace(url);
                });
            }).catch((e) => {
                NotificationManager.error('Can not move case');
                this.setState({loading: false})
            }).finally(() => {
                // this.setState({loading: false})
            });
        });
    }

    onComplete() {
        this.setState({loading: true}, () => {
            if(!this.state.isPostTest) {
                Apis.attemptsComplete(this.state.attempts_id).then((resp) => {
                    if (!resp.complete && resp.stage === 2) {
                        let nextPath = '/test-view/' + this.state.test_sets_id + '/' + this.state.attempts_id + '/' + this.state.test_set_cases[0];
                        this.setState({test_cases_id: this.state.test_set_cases[0]}, () => {
                            this.getData();
                            this.props.history.replace(nextPath);
                        });
                    } else if (resp.complete) {
                        if (this.state.test_case.modalities.image_quality) {
                            NotificationManager.success('Test was finished. Thank you at the end');
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

    onSetQuality(quality) {
        if(quality === -1) return;
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let test_case_length = this.state.test_set_cases.length;
        this.setState({isShowQualityModal: false});
        Apis.attemptsQuality(this.state.attempts_id, this.state.test_cases_id, quality).then((resp) => {
            if(test_case_index + 1 === test_case_length) {
                this.onComplete();
            } else {
                this.onMove(1);
            }
        });
    }

    onConfirmImageQuality(isAgree, msg) {
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let test_case_length = this.state.test_set_cases.length;
        this.setState({isShowConfirmQualityModal: false});
        Apis.attemptsConfirmQuality(this.state.attempts_id, this.state.test_cases_id, this.state.test_case.quality, isAgree, msg).then((resp) => {
            if(test_case_index + 1 === test_case_length) {
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

    handleShowPopup(markData, cancelCallback, deleteCallback, saveCallback) {
        let isShowDeleteButton = true;
        if (markData.isNew) {
            isShowDeleteButton = false;
        }

        let lesionsValue = [];
        let lesions = markData.lesionTypes.map(v => v.toString());
        this.state.test_case.modalities.lesion_types.forEach(v => {
            if (lesions.indexOf(v.id.toString()) !== -1) {
                lesionsValue.push({value: v.id, label: v.name});
            }
        });
        let rating = markData.rating || '2';
        if (rating === '2') {
            this.setState({selectedLesions: []});
        }
        this.setState({isShowPopup: true, selectedMarkData: markData, isShowPopupDelete: isShowDeleteButton, selectedLesions: lesionsValue, selectedRating: rating.toString()});
        this.popupCancelHandler = cancelCallback;
        this.popupDeleteHandler = deleteCallback;
        this.popupSaveHandler = saveCallback;
    }

    handleClosePopup(type) {
        if (type === 'save' && this.state.selectedRating !== '2' && (this.state.selectedLesions === null || this.state.selectedLesions.length === 0)) {
            NotificationManager.error('Please select lesion type');
            return;
        }
        this.setState({isShowPopup: false});
        switch (type) {
            case 'cancel':
            case 'ok':
                this.popupCancelHandler();
                break;
            case 'delete':
                if (!confirm('Are you sure you want to delete this mark?')) break;
                this.popupDeleteHandler(this.state.selectedMarkData.id);
                break;
            case 'save':
                let data = {
                    id: this.state.selectedMarkData.id,
                    x: this.state.selectedMarkData.handles.end.x,
                    y: this.state.selectedMarkData.handles.end.y,
                    attempt_id: this.state.attempts_id,
                    test_case_id: this.state.test_cases_id,
                    rating: this.state.selectedRating,
                    answer_lesion_types: this.state.selectedLesions.map((v) => v.value.toString()),
                    isNew: this.state.selectedMarkData.isNew,
                };
                this.popupSaveHandler(data);
                break;
        }
    }

    setSelectedRating(value) {
        if (value === '2') {
            this.setState({selectedLesions: []});
        }
        this.setState({selectedRating: value});
    }

    onChangeRating(event) {
        this.setSelectedRating(event.target.value);
    }

    setSelectedLesions(lesions) {
        let lesionsValue = [];
        lesions = lesions.map(v => v.toString());
        this.state.test_case.modalities.lesion_types.forEach(v => {
            if (lesions.indexOf(v.id.toString()) !== -1) {
                lesionsValue.push({value: v.id, label: v.name});
            }
        });
        this.setState({selectedLesions: lesionsValue});
    }

    onChangeLesions(value) {
        this.setState({selectedLesions: value})
    }

    renderNav() {
        let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
        let test_case_length = this.state.test_set_cases.length;
        return (
            <nav>
                {
                    test_case_index > 0 && (this.state.complete || !this.state.test_case.modalities.force_flow) ?
                        <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onMove(-1)}> Previous</Button> : null
                }
                {
                    this.state.complete || test_case_index + 1 !== test_case_length ?
                        null : <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onFinish()}> Finish</Button>
                }
                {
                    test_case_index + 1 < test_case_length ?
                        <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onNext(1)}> Next</Button> : null
                }
                {
                    this.state.complete ?
                        null : <Button className={'ml-20 mr-10'} variant="contained" color="primary" onClick={() => this.setState({isShowInstructionModal: true})}>Instructions</Button>
                }
                <Button variant="contained" color="primary" onClick={() => this.props.history.push('/app/test/list')}>Home</Button>
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
            let resultStr = isTruthCancer ? "Cancer Case" : "Normal Case";
            return (
                <div style={{display: 'inline-block'}}>
                    <div className={isTruthCancer ? 'correct-result wrong' : 'correct-result correct'}>
                        <span style={{color: 'white'}}>{resultStr}</span>
                    </div>
                </div>
            );
        }
    }

    renderImageViewer() {
        this.viewers = [];
        return this.state.test_case.images.map((item, index) => {
            this.viewers.push(React.createRef());
            return (
                <ImageViewer
                    imageInfo={item}
                    attemptId={this.state.attempts_id}
                    viewerRef={this.viewers[this.viewers.length - 1]}
                    currentTool={this.state.currentTool}
                    synchronizer={this.synchronizer}
                    index={index}
                    answers={this.state.imageAnswers[index]}
                    radius={this.state.test_case.modalities.circle_size}
                    onShowPopup={this.handleShowPopup.bind(this)}
                    stackCount={item.stack_count}
                    complete={this.state.complete}
                    stage={this.state.attemptDetail.stage}
                    width={100 / this.state.test_case.images.length}
                    tools={this.state.test_case.modalities.tools === null ? [] : this.state.test_case.modalities.tools.split(',')}
                    brightness={this.state.test_case.modalities.brightness}
                    contrast={this.state.test_case.modalities.contrast}
                    zoom={this.state.test_case.modalities.zoom}
                    key={index}
                />
            )
        });
    }

    renderTruthImageQuality() {
        if (!this.state.complete && this.state.test_case.modalities.image_quality && this.state.attemptDetail.stage === 2) {
            let quality = ['Inadequate', 'Moderate', 'Good', 'Perfect'][Number(this.state.test_case.quality)];
            return (
                <div className={'truth-quality'}>
                    <div className={'quality-icon ' + quality.toLowerCase() + '-icon'}/>
                    <span className={'quality-text'}>{quality}</span>
                </div>
            );
        } else {
            return null;
        }
    }

    renderTools() {
        let tools = this.state.test_case.modalities.tools;
        tools = tools === null ? [] : tools.split(',');
        return (
            <div id="tools">
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
                            <p>Pan</p>
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
                            <p>Zoom</p>
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
                            <p>Window</p>
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
                            <p>Length</p>
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
                            <p>Angle</p>
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
                            <p>Ellipse</p>
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
                            <p>Rectangle</p>
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
                            <p>Arrow</p>
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
                            <p>Freehand</p>
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
                            <p>Eraser</p>
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
                            <p>Mark</p>
                        </div> : null
                }
                <div className="tool">
                    <AntSwitch
                        defaultChecked
                        onChange={(e) => this.onChangeSynchonize(e)}
                        value="checkedB"
                    />
                    <p>&nbsp;Sync</p>
                </div>
                {this.renderTestResult()}
                {this.renderTruthImageQuality()}
            </div>
        )
    }

    render() {
        if (!this.state.loading) {
            let disabled = this.state.complete ? {'disabled': 'disabled'} : {};
            let test_case_index = this.state.test_set_cases.indexOf(this.state.test_cases_id);
            let lesions = this.state.test_case.modalities.lesion_types.map((v, i) => {
                return {label: v.name, value: v.id}
            });
            return (
                <div className="viewer">
                    <div id="toolbar">
                        {this.renderTools()}

                        <h1>
                            {this.state.attemptDetail.stage !== 1 ? <span className={'stage'}>Stage{this.state.attemptDetail.stage}</span> : null}
                            {test_case_index + 1} / {this.state.test_set_cases.length}&nbsp;&nbsp;( {this.state.test_case.name} )
                        </h1>

                        {this.renderNav()}
                    </div>
                    <div id="images"> {/*className={'cursor-' + this.state.currentTool}>*/}
                        {this.renderImageViewer()}
                    </div>
                    {
                        this.state.isShowPopup ?
                            <div id="cover" ref={this.myRef}>
                                <div id="mark-details">
                                    <form>
                                        <FormGroup className={'mb-5'} row>
                                            <Label sm={3} style={{marginTop: 6}}>Rating:</Label>
                                            <Col sm={9}>
                                                <RadioGroup
                                                    disabled
                                                    aria-label="position"
                                                    name="position"
                                                    value={this.state.selectedRating}
                                                    onChange={this.onChangeRating.bind(this)}
                                                    row
                                                >
                                                    {
                                                        this.state.test_case.ratings.map((v, i) => {   // [0, 1, 2, 3...]
                                                            return (
                                                                <CustomFormControlLabel
                                                                    disabled={this.state.complete}
                                                                    value={v.toString()}
                                                                    control={<CustomRadio/>}
                                                                    label={v}
                                                                    key={i}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </RadioGroup>
                                            </Col>
                                        </FormGroup>
                                        <Label>Lesions:</Label>
                                        <Select
                                            isDisabled={this.state.complete || this.state.selectedRating === '2'}
                                            placeholder={this.state.complete || this.state.selectedRating === '2' ? 'Can not select lesion type' : 'Select lesion type'}
                                            isMulti
                                            name="lesions"
                                            options={lesions}
                                            value={this.state.selectedLesions}
                                            styles={selectStyles}
                                            onChange={this.onChangeLesions.bind(this)}
                                        />

                                        <div className="actions">
                                            <div className="left">
                                                <Button variant="contained" className="text-black bg-white cancel" disabled={this.state.complete}
                                                        onClick={() => this.handleClosePopup('cancel')}>Cancel</Button>
                                            </div>
                                            {
                                                this.state.complete ?
                                                    <div className="right">
                                                        <Button variant="contained" className="ok" onClick={() => this.handleClosePopup('ok')}>&nbsp;&nbsp;Ok&nbsp;&nbsp;</Button>
                                                    </div> :
                                                    <div className="right">
                                                        {
                                                            this.state.isShowPopupDelete ?
                                                                <Button variant="contained" className="mr-15 delete" onClick={() => this.handleClosePopup('delete')}>Delete</Button> : null
                                                        }
                                                        <Button variant="contained" className="save" onClick={() => this.handleClosePopup('save')}>Save</Button>
                                                    </div>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div> : null
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
                        quality={ ['Inadequate', 'Moderate', 'Good', 'Perfect'][Number(this.state.test_case.quality)]}
                        confirm={(isAgree, msg) => this.onConfirmImageQuality(isAgree, msg)}
                    />

                </div>
            );
        } else {
            return (<RctSectionLoader style={{backgroundColor: 'black'}}/>);
        }
    }
}


const AntSwitch = withStyles(theme => ({
    root: {
        width: 27,
        height: 16,
        padding: 0,
        margin: 0,
    },
    switchBase: {
        color: '#7da5c7',
        marginTop: -23,
        marginLeft: -14,
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    checked: {
        transform: 'translateX(15px)',
        opacity: 1,
        border: 'none',
    },
    bar: {
        borderRadius: 7.5,
        width: 28,
        height: 16,
        marginTop: -15,
        marginLeft: -11.5,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    icon: {
        width: 16,
        height: 16,
    },
    iconChecked: {
        boxShadow: theme.shadows[1],
    },
}))(Switch);

const CustomRadio = withStyles(theme => ({
    root: {
        color: yellow[600],
        '&$checked': {
            color: yellow[500],
        },
        '&$disabled': {
            color: yellow[200],
        },
    },
    checked: {},
    disabled: {},
}))(Radio);

const CustomFormControlLabel = withStyles(theme => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&$disabled': {
            color: yellow[200],
        },
    },
    disabled: {},
}))(FormControlLabel);

const selectStyles = {
    control: styles => ({...styles, backgroundColor: 'black'}),
    menu: styles => ({...styles, backgroundColor: 'black', borderColor: 'red', borderWidth: 10}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? 'yellow'
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : 'yellow',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? 'yellow' : color.alpha(0.3).css()),
            },
        };
    },
    multiValue: (styles, {data}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
    }),
    multiValueRemove: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
        ':hover': {
            backgroundColor: 'yellow',
            color: 'black',
        },
    }),
};