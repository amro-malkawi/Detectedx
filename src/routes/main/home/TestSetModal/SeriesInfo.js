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
    const [testSetCategory, setTestSetCategory] = useState('');
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
            const learningObjStr = data.seriesTestSets[0].test_set_learning_obj || data.modalityInfo.modality_learning_obj || null;
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

    const renderTestSetItem = (item) => {
        return (
            <Button key={item.id} className={'series-test-set'} onClick={() => onSelect(item)}>
                <div className={'d-flex flex-row mb-2'} style={{color: data.modalityInfo.modality_color}}>
                    <div className={'fs-16 fw-bold'} style={{flex: 1, marginRight: 10}}>{item.name}</div>
                    <div className={'fs-14 mt-1'}>{item.test_set_time || 0}MINS  CME: {item.test_set_point}  {item.test_set_code}</div>
                </div>
                <div className={'series-test-set-desc'}>
                    {item.test_set_desc}
                </div>
            </Button>
        )
    }

    const renderRightContent = () => {
        const {modality_type} = data.modalityInfo;
        if (['quiz', 'video_lecture', 'presentations'].indexOf(modality_type) !== -1) {
            return (
                <div className={'text-white'}>
                    <div className={'fs-26 mt-30'}>Multi-series lecture</div>
                    <div className={classnames('main-series-list', {'scroll': !isMobile})}>
                        {data.seriesTestSets.map((v) => renderTestSetItem(v))}
                    </div>
                </div>
            );
        } else {
            return null;
        }
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
                            <div className={'test-category'}>{testSetCategory || 'Lecture'}</div>
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
                            <div className={'text-white fs-18 my-20'}>
                                {renderLeftContent()}
                                {
                                    learningObjectives &&
                                    <div className={'w-100 d-flex flex-row justify-content-start mt-20'}>
                                        <span className={'text-primary1 fs-14 cursor-pointer'} onClick={() => setIsShoWLearningObj(true)}>LEARNING OBJECTIVES</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={'pl-20'}>
                            {renderRightContent()}
                        </div>
                    </div> :
                    renderLearningObj()
                }
                <div className={'test-set-modal-close-btn'} onClick={onClose}>
                    <i className={'ti ti-close'}/>
                </div>
            </div>
        )
    } else {
        let type = '';
        if (data.modalityInfo.modality_type === 'quiz') {
            type = 'Quiz';
        } else if (data.modalityInfo.modality_type === 'video_lecture' || data.modalityInfo.modality_type === 'presentations') {
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
                    <div className={'d-flex flex-row'}>
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
                    </div>
                    <div className={'test-set-mobile-header-title fs-23 fw-semi-bold'}>{data.name}</div>
                </div>
                {!isShoWLearningObj ?
                    <div className={'test-set-mobile-content'}>
                        {renderLeftContent()}
                        {
                            learningObjectives &&
                            <div className={'w-100 d-flex flex-row justify-content-end mt-20'}>
                                <span className={'text-primary1 fs-14 cursor-pointer'} onClick={() => setIsShoWLearningObj(true)}>LEARNING OBJECTIVES</span>
                            </div>
                        }
                        {renderRightContent()}
                    </div> :
                    renderLearningObj()
                }
            </div>
        )
    }
}

export default SeriesInfo;