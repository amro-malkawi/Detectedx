import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Button, Dialog} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReactPlayer from "react-player";
import JSONParseDefault from "json-parse-default";
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from "react-notifications";
import * as Apis from "Api";
import * as selectors from "Selectors";
import {attemptsStart} from "Api";

function TestSetModal({data, onClose}) {
    const history = useHistory();
    const isLogin = selectors.getIsLogin(null);
    const locale = useSelector((state) => state.settings.locale.locale);
    const videoRef = useRef();
    const [isVideoPlay, setIsVideoPlay] = useState(false);
    const [isFirstPlay, setIsFirstPlay] = useState(true);
    const [testSetCategory, setTestSetCategory] = useState('');
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
    }, [data]);

    const onStart = () => {
        if (data.id.indexOf !== undefined && data.id.indexOf('/main/attempt/') === 0) {
            history.push(data.id)
        } else {
            Apis.attemptsStart(data.id, undefined).then(attempt => {
                let path;
                if (attempt.progress === 'test') {
                    path = (['video_lecture', 'presentations'].indexOf(attempt.modality_type) === -1 ? '/test-view/' : '/video-view/') + attempt.test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
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
        if (['quiz', 'video_lecture', 'presentations'].indexOf(modality_type) === -1) {
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
            return <div dangerouslySetInnerHTML={{__html: descText}}/>
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
                    <div className={'fs-19 mt-10'}>{presenterInfo.presenterDesc}</div>
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
                <Button className={'test-set-start-btn'} onClick={onStart}>
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
        if (['quiz', 'video_lecture', 'presentations'].indexOf(modality_type) !== -1) {
            const title = {quiz: 'Quiz', video_lecture: 'Lecture', presentations: 'Presentations'}[modality_type] + ' Overview';
            return (
                <div className={'text-white'}>
                    <div className={'fs-26 mt-30'}>{title}</div>
                    <div className={'fs-19 mt-10'}>{data.test_set_desc}</div>
                </div>
            );
        } else if (instruction_video && instruction_video !== '') {
            return (
                <div className={'d-flex flex-column justify-content-center align-items-center'}>
                    <div className={'test-set-modal-video'}>
                        <ReactPlayer
                            ref={videoRef}
                            url={instruction_video}
                            playing={isVideoPlay}
                            controls
                            onPause={() => setIsVideoPlay(false)}
                            width={'100%'}
                            height={'100%'}
                        />
                        {
                            (isFirstPlay && instruction_video_thumbnail && instruction_video_thumbnail !== '') &&
                            <img src={instruction_video_thumbnail} className={'video-thumbnail'} alt={''}/>
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


    return (
        <Dialog open={true} maxWidth={'xl'} className={'main-test-set-modal-container'} onClose={onClose}>
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
                <div className={'test-set-modal-content'}>
                    <div className={'pr-20'}>
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
                    </div>
                </div>
                <div className={'test-set-modal-close-btn'} onClick={onClose}>
                    <i className={'ti ti-close'}/>
                </div>
            </div>
        </Dialog>
    )
}

export default TestSetModal;