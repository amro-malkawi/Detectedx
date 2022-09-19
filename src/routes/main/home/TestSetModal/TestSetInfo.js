import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Button, Dialog, Tooltip} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReactPlayer from "react-player";
import JSONParseDefault from "json-parse-default";
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import {isMobile} from 'react-device-detect';
import ReactGA from "react-ga4";
import * as Apis from "Api";
import * as selectors from "Selectors";
import classnames from "classnames";

function TestSetInfo({data, onClose, onBackSeries}) {
    const history = useHistory();
    const isLogin = selectors.getIsLogin(null);
    const locale = useSelector((state) => state.settings.locale.locale);
    const videoRef = useRef();
    const [isVideoPlay, setIsVideoPlay] = useState(false);
    const [isFirstPlay, setIsFirstPlay] = useState(true);
    const [testSetCategory, setTestSetCategory] = useState('');
    const [isShowSubTypeModal, setIsShowSubTypeModal] = useState(false);
    const [learningObjectives, setLearningObjectives] = useState(null);
    const [isShoWLearningObj, setIsShoWLearningObj] = useState(false);
    const [, updateState] = useState();

    useEffect(() => {
        try {
            const categoryList = data.test_set_category ? data.test_set_category.split(',')[0].split(' > ') : [];
            if (categoryList.length >= 2) {
                categoryList.splice(0, 1);
                setTestSetCategory(categoryList.join(' '));
            }
        } catch (e) {
        }
        try {
            const learningObjStr = data.test_set_learning_obj || data.modalityInfo.modality_learning_obj || null;
            setLearningObjectives(JSON.parse(learningObjStr));
        } catch (e) {
        }
    }, [data]);

    const onStart = (subType) => {
        ReactGA.event('level_start', {
            level_name: data.name
        });
        if (data.id.indexOf !== undefined && data.id.indexOf('/main/attempt/') === 0) {
            history.push(data.id)
        } else {
            Apis.attemptsStart(data.id, subType).then(attempt => {
                let path;
                if (attempt.progress === 'test') {
                    path = (['video_lecture', 'presentations', 'interactive_video'].indexOf(attempt.modality_type) === -1 ? '/test-view/' : '/video-view/') + attempt.test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
                } else {
                    path = '/main/attempt/' + attempt.id + '/' + attempt.progress;
                }
                history.push(path)
            });
        }
    }

    const onSave = () => {
        const promise = !data.bookedTestSet ? Apis.bookTestSet(data.id) : Apis.bookTestSetCancel(data.id);
        promise.then((result) => {
            NotificationManager.success(!data.bookedTestSet ? 'Test set was saved' : 'Test set was removed');
            if (!data.bookedTestSet) {
                data.bookedTestSet = true;
                data.filterKeys.push('saved');
            } else {
                data.bookedTestSet = false;
                const i = data.filterKeys.findIndex((v) => v === 'saved');
                if (i !== -1) data.filterKeys.splice(i, 1);
            }
            updateState({});
        }).catch((e) => {
            console.error(e);
        })
    }

    const renderDifficult = (difficult) => {
        if (!difficult) {
            return (<div className={'test-set-difficult'}>
                <div/>
                <div/>
                <div/>
            </div>)
        } else if (difficult === 1) {
            return (<div className={'test-set-difficult'}>
                <div className={'active'}/>
                <div/>
                <div/>
            </div>)
        } else if (difficult === 2) {
            return (<div className={'test-set-difficult'}>
                <div className={'active'}/>
                <div className={'active'}/>
                <div/>
            </div>)
        } else {
            return (<div className={'test-set-difficult'}>
                <div className={'active'}/>
                <div className={'active'}/>
                <div className={'active'}/>
            </div>)
        }
    }

    const renderLeftContent = () => {
        const {modality_type, modality_desc} = data.modalityInfo;
        if (['quiz', 'video_lecture', 'presentations', 'interactive_video'].indexOf(modality_type) === -1) {
            const modalityDesc = JSONParseDefault(modality_desc === null ? {} : modality_desc, null, modality_desc);
            let descText = '';
            if (typeof modalityDesc !== 'object') {
                // if desc is not JSON type, will be shown this text
                descText = modality_desc;
            } else if (modalityDesc[locale] !== undefined) {
                descText = modalityDesc[locale];
            } else if (modalityDesc['en'] !== undefined) {
                descText = modalityDesc['en'];
            }
            return <div dangerouslySetInnerHTML={{__html: (data.test_set_desc || descText)}}/>
        } else {
            const presenterInfo = JSONParseDefault(data.test_set_presenter_info, null, {});
            if (!presenterInfo) return;
            return (
                <div className={'d-flex flex-column'}>
                    <div className={'d-flex flex-row'}>
                        {
                            presenterInfo.presenterPhoto && presenterInfo.presenterPhoto.length > 0 &&
                            <img src={Apis.apiUploadAddress + presenterInfo.presenterPhoto} alt={''} className={'presenter-photo'}/>
                        }
                        <div className={'mt-2 ml-30 d-flex flex-column'}>
                            <div className={'fs-14 mb-3'}>{presenterInfo.presenterName}</div>
                            <img src={Apis.apiUploadAddress + presenterInfo.presenterLogo} alt={''} className={'presenter-logo'}/>
                        </div>
                    </div>
                    <div className={'fs-26 mt-30'}>Speaker</div>
                    <div className={classnames('fs-19 mt-10', {'presenter-info': !isMobile})} style={{textAlign: 'justify'}}>
                        <div>
                            {presenterInfo.presenterDesc}
                        </div>
                    </div>
                </div>
            )
        }
    }


    const renderStartButton = () => {
        const {attempts, needSubscribe} = data;
        let attempt = attempts[0];
        if (needSubscribe) {
            return (
                <React.Fragment>
                    <Button className={'test-set-start-btn'} onClick={() => history.push('/plan')}>
                        Subscribe To Access
                    </Button>
                    <span></span>
                </React.Fragment>
            )
        } else if (attempt === undefined || attempt.complete) {
            return (
                <Button className={'test-set-start-btn'} onClick={data.modalityInfo.modality_has_sub_type ? () => setIsShowSubTypeModal(true) : () => onStart()}>
                    Start Module
                </Button>
            )
        } else {
            return (
                <Button className={'test-set-start-btn'} onClick={onStart}>
                    Continue Module
                </Button>
            );
        }
    }

    const renderRightContent = () => {
        const {modality_type, instruction_video, instruction_video_thumbnail} = data.modalityInfo;
        const {test_set_inst_video, test_set_inst_video_thumbnail} = data;
        if (['quiz', 'video_lecture', 'presentations', 'interactive_video'].indexOf(modality_type) !== -1) {
            const title = {quiz: 'Quiz', video_lecture: 'Lecture', presentations: 'Presentations', interactive_video: 'Interactive Video'}[modality_type] + ' Overview';
            return (
                <div className={'text-white'}>
                    <div className={'fs-26 mt-30'}>{title}</div>
                    <div className={'fs-19 mt-10'}>{data.test_set_desc}</div>
                </div>
            );
        } else if (test_set_inst_video || instruction_video) {
            return (
                <div className={'d-flex flex-column justify-content-center align-items-center'}>
                    <div className={'test-set-modal-video'}>
                        <ReactPlayer
                            ref={videoRef}
                            url={test_set_inst_video || instruction_video}
                            playing={isVideoPlay}
                            controls
                            onPause={() => setIsVideoPlay(false)}
                            width={'100%'}
                            height={'100%'}
                        />
                        {
                            (isFirstPlay && (test_set_inst_video_thumbnail || instruction_video_thumbnail)) &&
                            <img src={test_set_inst_video_thumbnail || instruction_video_thumbnail} className={'video-thumbnail'} alt={''}/>
                        }
                        {
                            !isVideoPlay &&
                            <Button className={'play-btn'} onClick={() => {
                                setIsVideoPlay(true);
                                setIsFirstPlay(false)
                            }}>
                                <PlayArrowIcon/>
                            </Button>
                        }
                    </div>
                    <span className={'text-white fs-14'}>INSTRUCTION VIDEO</span>
                </div>
            )
        } else {
            return null;
        }
    }

    const renderSubTypeModal = () => {
        if (!isShowSubTypeModal) return null;
        return (
            <Dialog open={true} maxWidth={'xl'} className={'main-test-subtype-modal'} onClose={() => setIsShowSubTypeModal(false)}>
                <span className={'fs-19'}>What type of test would you like?</span>
                <div className={'d-flex flex-row justify-content-between mt-20 mx-20'}>
                    <Tooltip
                        title={
                            <div className={'fs-13'}>
                                <div className={'fs-14 fw-bold'}>Allows you to assign either:</div>
                                <div className={'ml-2 mt-1'}>• BIRADS assessment category</div>
                                <div className={'ml-2 mt-1'}>• 3-Probably benign, 4-Suspicious<br/>&nbsp;&nbsp; or 5-Highly suspicious</div>
                                <div className={'ml-2 mt-1'}>• Abnormality appearances</div>
                                <div className={'ml-2 mt-1'}>• BIRADS assessment category</div>
                                <div className={'ml-2 mt-1'}>• 2-benign</div>
                                <div className={'ml-2 mt-1'}>• Next case (1-Normal)</div>
                            </div>
                        }
                        placement="bottom"
                    >
                        <Button onClick={() => onStart()}>Diagnostic</Button>
                    </Tooltip>
                    <Tooltip
                        title={
                            <div className={'fs-13'}>
                                <div className={'fs-14 fw-bold'}>Allows you to choose either:</div>
                                <div className={'ml-2 mt-1'}>• Recall (BIRADS 0)</div>
                                <div className={'ml-2 mt-1'}>• Next case (Normal)</div>
                            </div>}
                        placement="bottom"
                    >
                        <Button onClick={() => onStart('screening')}>Screening</Button>
                    </Tooltip>
                </div>
            </Dialog>
        )
    }

    const renderLearningObj = () => {
        return (
            <div className={classnames('flex-column text-white', !isMobile ? 'test-set-modal-content' : 'test-set-mobile-content')}>
                <div className={'d-flex flex-row align-items-center'}>
                    <div>
                        {
                            !isMobile ?
                                <Button className={'learning-obj-back-btn'} onClick={() => setIsShoWLearningObj(false)}><i className="zmdi zmdi-chevron-left fs-20 mr-10"/>BACK</Button> :
                                <i className="zmdi zmdi-chevron-left fs-20 text-primary1 p-2 fs-23" onClick={() => setIsShoWLearningObj(false)}/>
                        }
                    </div>
                    <div className={'flex-fill text-center fs-26 fw-bold pr-40'} style={{flex: 1}}>Learning Objectives</div>
                </div>
                <div className={'mt-20 mb-40 fs-19'}>At the end of this module, the user will be able to:</div>
                <div className={'fs-19'} style={{whiteSpace: 'pre-line'}}>
                    {learningObjectives.learningObj}
                </div>
                <div className={'mt-40 fs-13'}>
                    disclosures:
                </div>
                <div className={'fs-13 fw-light'} style={{whiteSpace: 'pre-line'}}>
                    {learningObjectives.disclosure}
                </div>
            </div>
        )
    }

    const renderBackSeries = () => {
        if(onBackSeries) {
            return (
                <Button className={'px-0 my-2'} onClick={onBackSeries}>
                    <span className={'text-primary1 fs-18 ff-Poppins'}><i className="zmdi zmdi-arrow-left"/> Back to series</span>
                </Button>
            )
        } else {
            return null;
        }
    }

    if (!isMobile) {
        return (
            <div className={'main-test-set-modal'}>
                <div className={'test-set-modal-header'} style={{backgroundColor: data.modalityInfo.modality_color || '#4f4bce'}}>
                    {
                        data.modalityInfo.modality_icon_image &&
                        <img src={Apis.apiUploadAddress + data.modalityInfo.modality_icon_image} className={'test-set-modal-header-img'} alt={''}/>
                    }
                    <div className={'d-flex flex-row align-items-end'}>
                        <div className={'test-set-modal-header-title fs-23 fw-semi-bold'}>{data.name}</div>
                        <div className={'test-set-modal-header-tags'}>
                            <div className={'test-category'}>{testSetCategory}</div>
                            {
                                data.is3D &&
                                <div className={'mark-3d'}>
                                    <img src={require('Assets/img/main/icon_3d.svg')} alt={''}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {!isShoWLearningObj ?
                    <div className={'test-set-modal-content'}>
                        <div className={'pr-20'}>
                            {renderBackSeries()}
                            <div className={'test-set-item-spec'}>
                                <span>DIFFICULTY</span>
                                {
                                    renderDifficult(data.difficulty)
                                }
                                <span className={'mr-20'}>{data.test_set_time || 0}MINS</span>
                                <span className={'mr-20'}>CME: {data.test_set_point}</span>
                                <span className={''}>{data.test_set_code}</span>
                            </div>
                            <div className={'text-white fs-18 my-20'}>
                                {renderLeftContent()}
                            </div>
                        </div>
                        <div className={'pl-20'}>
                            <div className={'d-flex flex-row align-items-center'}>
                                {
                                    renderStartButton()
                                }
                                {
                                    isLogin &&
                                    <Button>
                                        <div className={'test-set-save-btn'} onClick={onSave}>
                                            <span>{!data.bookedTestSet ? 'Save' : 'Remove'}</span>
                                            {
                                                data.bookedTestSet ? <BookmarkIcon/> : <BookmarkBorderIcon/>
                                            }
                                        </div>
                                    </Button>
                                }
                            </div>
                            {renderRightContent()}
                            {
                                learningObjectives &&
                                <div className={'w-100 d-flex flex-row justify-content-end mt-20'}>
                                    <span className={'text-primary1 fs-14 cursor-pointer'} onClick={() => setIsShoWLearningObj(true)}>LEARNING OBJECTIVES</span>
                                </div>
                            }
                        </div>
                    </div> :
                    renderLearningObj()
                }
                <div className={'test-set-modal-close-btn'} onClick={onClose}>
                    <i className={'ti ti-close'}/>
                </div>
                {renderSubTypeModal()}
            </div>
        )
    } else {
        let type = '';
        if (data.modalityInfo.modality_type === 'quiz') {
            type = 'Quiz';
        } else if (['video_lecture', 'presentations', 'interactive_video'].indexOf(data.modalityInfo.modality_type) !== -1) {
            type = 'LECTURE';
        } else if (data.modalityInfo.modality_type === 'viewer') {
            type = 'IMAGE VIEWER';
        } else {
            type = 'SELF ASSESSMENT MODULE';
        }
        return (
            <div className={'test-set-mobile-modal-content'}>
                <div className={'test-set-mobile-header'} style={{backgroundColor: data.modalityInfo.modality_color || '#4f4bce'}}>
                    {
                        data.modalityInfo.modality_icon_image &&
                        <img src={Apis.apiUploadAddress + data.modalityInfo.modality_icon_image} className={'test-set-mobile-header-img'} alt={''}/>
                    }
                    <div className={'d-flex flex-row test-set-mobile-header-row'}>
                        <div className={'test-set-mobile-header-tags'}>
                            <div className={'test-category'}>{testSetCategory}</div>
                            {
                                data.is3D &&
                                <div className={'mark-3d'}>
                                    <img src={require('Assets/img/main/icon_3d.svg')} alt={''}/>
                                </div>
                            }
                        </div>
                        <div className={'fs-14'}>{type}</div>
                        <div className={'test-set-mobile-header-close'} onClick={onClose}><i className={'ti-close'} /></div>
                    </div>
                    <div className={'test-set-mobile-header-title fs-23 fw-semi-bold'}>{data.name}</div>
                </div>
                {!isShoWLearningObj ?
                    <div className={'test-set-mobile-content'}>
                        {renderBackSeries()}
                        <div className={'test-set-item-spec'}>
                            <span>DIFFICULTY</span>
                            {
                                renderDifficult(data.difficulty)
                            }
                            <span className={'mr-10'}>{data.test_set_time || 0}MINS</span>
                            <span className={'mr-20'}>CME: {data.test_set_point}</span>
                            <span className={''}>{data.test_set_code}</span>
                        </div>
                        {renderLeftContent()}
                        <div className={'d-flex flex-row align-items-center'}>
                            {
                                renderStartButton()
                            }
                            {
                                isLogin &&
                                <Button>
                                    <div className={'test-set-save-btn'} onClick={onSave}>
                                        <span>{!data.bookedTestSet ? 'Save' : 'Remove'}</span>
                                        {
                                            data.bookedTestSet ? <BookmarkIcon/> : <BookmarkBorderIcon/>
                                        }
                                    </div>
                                </Button>
                            }
                        </div>
                        {renderRightContent()}
                        {
                            learningObjectives &&
                            <div className={'w-100 d-flex flex-row justify-content-end mt-20'}>
                                <span className={'text-primary1 fs-14 cursor-pointer'} onClick={() => setIsShoWLearningObj(true)}>LEARNING OBJECTIVES</span>
                            </div>
                        }
                    </div> :
                    renderLearningObj()
                }
                {renderSubTypeModal()}
            </div>
        )
    }
}

export default TestSetInfo;