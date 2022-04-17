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

function TestSetModal({data, onClose}) {
    const history = useHistory();
    const isLogin = selectors.getIsLogin(null);
    const locale = useSelector((state) => state.settings.locale.locale);
    const videoRef = useRef();
    const [isVideoPlay, setIsVideoPlay] = useState(false);
    const [isFirstPlay, setIsFirstPlay] = useState(true);
    const [, updateState] = useState();

    const onStart = () => {
        if (data.id.indexOf !== undefined && data.id.indexOf('/main/attempt/') === 0) {
            history.push(data.id)
        } else {
            Apis.attemptsAdd(data.id, undefined).then(resp => {
                let path = (['video_lecture', 'presentations'].indexOf(data.modalityInfo.modality_type) === -1 ? '/test-view/' : '/video-view/') + resp.test_set_id + '/' + resp.id + '/' + resp.current_test_case_id;
                history.push(path);
            });
            // if (data.modalityInfo.modality_has_sub_type) {
            //     this.setState({isShowModalType: 'attemptSubTypeModal', selectedTestSetId: testSetId});
            // } else {
            //     this.onCreateAttempt(data.id, null, data.modalityInfo);
            // }
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

    const renderDesc = () => {
        const {modality_desc, instruction_video_thumbnail, instruction_video} = data.modalityInfo;
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
    }


    const renderStartButton = () => {
        const {id, attempts, has_post, test_set_paid, test_set_point, is_test_set_expired, demoTestSet} = data;
        const test_set_id = id;
        let attempt = attempts[0];
        if (!isLogin && !demoTestSet) {
            return (
                <Button className={'test-set-start-btn'} onClick={() => history.push('/signin')}>
                    Login
                </Button>
            )
        } else if ((!isLogin && demoTestSet) || attempt === undefined || attempt.complete) {
            return (
                <Button className={'test-set-start-btn'} onClick={onStart}>
                    Start Assessment
                </Button>
            )
        } else {
            let path;
            if (attempt.progress === '' || attempt.progress === 'test') {
                path = (['video_lecture', 'presentations'].indexOf(data.modalityInfo.modality_type) === -1 ? '/test-view/' : '/video-view/') + attempt.test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            } else {
                path = '/main/attempt/' + attempt.id + '/' + attempt.progress;
            }
            return (
                <Button className={'test-set-start-btn'} onClick={() => history.push(path)}>
                    Continue Assessment
                </Button>
            );
        }
    }


    return (
        <Dialog open={true} maxWidth={'xl'} className={'main-test-set-modal-container'} onClose={onClose}>
            <div className={'main-test-set-modal'}>
                <div className={'test-set-modal-header'} style={{backgroundColor: '#4f4bce'}}>
                    <img src={require('Assets/img/main/temp_bg.png')} className={'test-set-modal-header-img'} alt={''}/>
                    <div className={'d-flex flex-row align-items-end'}>
                        <div className={'test-set-modal-header-title fs-23 fw-semi-bold'}>{data.name}</div>
                        <div className={'test-set-modal-header-tags'}>
                            <div className={'test-category'}>{data.test_set_category}</div>
                            <div className={'mark-3d'}>
                                <img src={require('Assets/img/main/icon_3d.svg')} alt={''}/>
                            </div>
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
                            {renderDesc()}
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
                                            !data.bookedTestSet ? <BookmarkIcon/> : <BookmarkBorderIcon/>
                                        }
                                    </div>
                                </Button>
                            }
                        </div>
                        {
                            (data.modalityInfo.instruction_video && data.modalityInfo.instruction_video !== '') &&
                            <div className={'d-flex flex-column justify-content-center align-items-center'}>
                                <div className={'test-set-modal-video'}>
                                    <ReactPlayer
                                        ref={videoRef}
                                        url={data.modalityInfo.instruction_video}
                                        playing={isVideoPlay}
                                        controls
                                        onPause={() => setIsVideoPlay(false)}
                                        width={'100%'}
                                        height={'100%'}
                                    />
                                    {
                                        (isFirstPlay && data.modalityInfo.instruction_video_thumbnail && data.modalityInfo.instruction_video_thumbnail !== '') &&
                                        <img src={data.modalityInfo.instruction_video_thumbnail} className={'video-thumbnail'} alt={''}/>
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
                        }
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