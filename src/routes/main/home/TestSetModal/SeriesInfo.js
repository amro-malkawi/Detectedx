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

function SeriesInfo({data, onClose, onSelect}) {
    const [testSetType, setTestSetType] = useState('');
    const [learningObjectives, setLearningObjectives] = useState(null);
    const [isShowLearningObj, setIsShowLearningObj] = useState(false);
    const [, updateState] = useState();

    useEffect(() => {
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
        type = data.isSeriesSameModality ? type + ' SERIES' : 'SERIES';
        setTestSetType(type);
        try {
            const learningObjStr = data.learning_obj || data.seriesTestSets[0].test_set_learning_obj || data.modalityInfo.modality_learning_obj || null;
            setLearningObjectives(JSON.parse(learningObjStr));
        } catch (e) {
        }
    }, [data]);

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
        const presenterInfo = JSONParseDefault(data.seriesTestSets[0].test_set_presenter_info, null, {});
        if(data.isSeriesSameModality && presenterInfo && Object.keys(presenterInfo).length > 0) {
            return (
                <div className={classnames({'pr-20': !isMobile})}>
                    <div className={'text-white fs-18 my-20'}>
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
                                <div dangerouslySetInnerHTML={{__html: (presenterInfo.presenterDesc || '')}}/>
                            </div>
                        </div>
                        {
                            learningObjectives &&
                            <div className={'w-100 d-flex flex-row justify-content-start mt-20'}>
                                <span className={'text-primary1 fs-14 cursor-pointer'} onClick={() => setIsShowLearningObj(true)}>LEARNING OBJECTIVES</span>
                            </div>
                        }
                    </div>
                </div>
            )
        }

        if (!data.difficulty && !data.description) {
            return null
        }

        return <div className={classnames({ 'pr-20': !isMobile })}>
            <div className={'test-set-item-spec'}>
                <span>DIFFICULTY</span>
                {renderDifficult(data.difficulty)}
            </div>
            <div className={'text-white fs-18 my-20'}>
                <div className={'d-flex flex-column'}>
                    <div className={'d-flex flex-row'}>
                        {data.description &&
                            <div dangerouslySetInnerHTML={{ __html: data.description }}/>
                        }
                    </div>
                </div>
                {learningObjectives &&
                    <div className={'w-100 d-flex flex-row justify-content-start mt-20'}>
                        <span className={'text-primary1 fs-14 cursor-pointer'} onClick={() => setIsShowLearningObj(true)}>LEARNING OBJECTIVES</span>
                    </div>
                }
            </div>
        </div>
    }

    const renderTestSetItem = (item) => {
        return (
            <Button key={item.id} className={'series-test-set'} onClick={() => onSelect(item)}>
                <div className={'d-flex flex-row mb-2'} style={{width: '100%', color: item.modalityInfo.modality_color}}>
                    <div className={'series-test-set-name'}>{item.name}</div>
                    <div className={'fs-14 mt-1'}>{item.test_set_time || 0}MINS CME: {item.test_set_point} {item.test_set_code}</div>
                </div>
                <div className={'series-test-set-desc'}>
                    {(item.test_set_desc || '').replace(/<[^>]+>/g, '')}
                </div>
            </Button>
        )
    }

    const renderRightContent = () => {
        return (
            <div className={classnames({'pl-20': (!isMobile && data.isSeriesSameModality)})}>
                <div className={'text-white'}>
                    <div className={'fs-26 mt-10'}>{data.isSeriesSameModality ? 'Multi-lecture series' : 'Multi-modal series'}</div>
                    <div className={classnames('main-series-list', {'scroll': !isMobile})}>
                        {data.seriesTestSets.map((v) => renderTestSetItem(v))}
                    </div>
                </div>
            </div>
        );
    }

    const renderLearningObj = () => {
        return (
            <div className={classnames('flex-column text-white', !isMobile ? 'test-set-modal-content' : 'test-set-mobile-content')}>
                <div className={'d-flex flex-row align-items-center'}>
                    <div>
                        {
                            !isMobile ?
                                <Button className={'learning-obj-back-btn'} onClick={() => setIsShowLearningObj(false)}><i className="zmdi zmdi-chevron-left fs-20 mr-10"/>BACK</Button> :
                                <i className="zmdi zmdi-chevron-left fs-20 text-primary1 p-2 fs-23" onClick={() => setIsShowLearningObj(false)}/>
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
                            <div className={'test-category'}>{testSetType}</div>
                            {
                                data.is3D &&
                                <div className={'mark-3d'}>
                                    <img src={require('Assets/img/main/icon_3d.svg')} alt={''}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {!isShowLearningObj ?
                    <div className={'test-set-modal-content'}>
                        {renderLeftContent()}
                        {renderRightContent()}
                    </div> :
                    renderLearningObj()
                }
                <div className={'test-set-modal-close-btn'} onClick={onClose}>
                    <i className={'ti ti-close'}/>
                </div>
            </div>
        )
    } else {
        return (
            <div className={'test-set-mobile-modal-content'}>
                <div className={'test-set-mobile-header'} style={{backgroundColor: data.modalityInfo.modality_color || '#4f4bce'}}>
                    {
                        data.modalityInfo.modality_icon_image &&
                        <img src={Apis.apiUploadAddress + data.modalityInfo.modality_icon_image} className={'test-set-mobile-header-img'} alt={''}/>
                    }
                    <div className={'d-flex flex-row test-set-mobile-header-row'}>
                        <div className={'test-set-mobile-header-tags'}>
                            <div className={'test-category'}>{testSetType}</div>
                            {
                                data.is3D &&
                                <div className={'mark-3d'}>
                                    <img src={require('Assets/img/main/icon_3d.svg')} alt={''}/>
                                </div>
                            }
                        </div>
                        <div className={'test-set-mobile-header-close'} onClick={onClose}><i className={'ti-close'} /></div>
                    </div>
                    <div className={'test-set-mobile-header-title fs-23 fw-semi-bold'}>{data.name}</div>
                </div>
                {!isShowLearningObj ?
                    <div className={'test-set-mobile-content'}>
                        {renderLeftContent()}
                        {renderRightContent()}
                    </div> :
                    renderLearningObj()
                }
            </div>
        )
    }
}

export default SeriesInfo;
