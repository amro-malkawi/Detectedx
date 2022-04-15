import React, {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';
import {useDispatch} from "react-redux";
import { setUserCompletedCount } from 'Actions';
import TestSetItem from "./TestSetItem";
import TestSetModal from './TestSetModal';
import * as Apis from 'Api';

function Home() {
    const dispatch = useDispatch();
    const [modalityList, setModalityList] = useState([]);
    const [testSetList, setTestSetList] = useState([]);
    const [selectedModalityIdList, setSelectedModalityIdList] = useState([]);
    const [selectedTestSet, setSelectedTestSet] = useState(null);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);
    const [samCount, setSamCount] = useState(0);
    const [lectureCount, setLectureCount] = useState(0);
    const [quizCount, setQuizCount] = useState(0);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Apis.currentTestSets().then((resp) => {
            const modalities = [], testSets = [];
            let inProgress = 0, saved = 0, sam = 0, lecture = 0, quiz = 0, completed = 0;
            resp.forEach((m) => {
                modalities.push(m.modality_info);
                m.test_sets.forEach((t) => {
                    testSets.push({...t, modalityInfo: m.modality_info});
                    if(t.attempts.some((a) => !a.complete)) inProgress++;
                    if(t.attempts.some((a) => a.complete)) completed++;
                    if(m.modality_info.modality_type === 'quiz') {
                        quiz++;
                    } else if(m.modality_info.modality_type === 'video_lecture') {
                        lecture++;
                    }  else if(m.modality_info.modality_type === 'presentations') {

                    } else {
                        sam++;
                    }
                });
            });

            setSelectedModalityIdList(modalities.length > 0 ? [modalities[0].id] : []);
            setModalityList(modalities);
            setTestSetList(testSets);
            setInProgressCount(inProgress);
            setSavedCount(saved);
            setSamCount(sam);
            setLectureCount(lecture);
            setQuizCount(quiz);
            dispatch(setUserCompletedCount(completed));
        });
    }

    const onSelectModality = (id) => {
        const i = selectedModalityIdList.indexOf(id);
        if(i === -1) {
            setSelectedModalityIdList([...selectedModalityIdList, id]);
        } else {
            selectedModalityIdList.splice(i, 1);
            setSelectedModalityIdList([...selectedModalityIdList]);
        }
    }

    const renderModalityItem = (modalityInfo, index) => {
        const selected = selectedModalityIdList.indexOf(modalityInfo.id) !== -1;
        return (
            <Button key={modalityInfo.id} className={classNames('modality-name-item', {active: selected})} onClick={() => onSelectModality(modalityInfo.id)}>
                <i className={classNames('zmdi fs-23', (selected ? 'zmdi-check' : 'zmdi-close'))}/>
                <span className={classNames({'fs-18': modalityInfo.name.length < 20}, {'fs-16': modalityInfo.name.length >= 20})}>{modalityInfo.name}</span>
            </Button>
        )
    }

    return (
        <div className={'main-home d-flex flex-row'}>
            <div className={'main-home-side'}>
                <div className={'mb-30'}>
                    <span className={'fs-23'}>Categories</span>
                </div>

                <Scrollbars
                    className="main-modalities"
                    autoHide
                    autoHideDuration={100}
                >
                    <div>
                        {
                            modalityList.map((v, i) => renderModalityItem(v, i))
                        }
                    </div>
                </Scrollbars>
            </div>
            <div className={'test-set-content'}>
                <div className={'d-flex flex-row fs-23 mb-30'}>
                    <span className={'mr-50 cursor-pointer'}>In Progress ({inProgressCount})</span>
                    <span className={'mr-50 cursor-pointer'}>Saved ({savedCount})</span>
                    <span className={'mr-50 cursor-pointer'}>Self Assessment Modules ({samCount})</span>
                    <span className={'mr-50 cursor-pointer'}>Lectures ({lectureCount})</span>
                    <span className={'mr-50 cursor-pointer'}>Quizzes ({quizCount})</span>
                </div>
                <Scrollbars
                    className="test-set-items-container"
                    autoHide
                    autoHideDuration={100}
                >
                    <div className={'test-set-items'}>
                        {
                            modalityList.length > 0 &&
                            testSetList.filter((v) => selectedModalityIdList.indexOf(v.modality_id) !== -1)
                                .map((v) => <TestSetItem key={v.id} data={v} onClick={() => setSelectedTestSet(v)}/>)
                        }
                    </div>
                </Scrollbars>
            </div>
            {
                selectedTestSet && <TestSetModal data={selectedTestSet} onClose={() => setSelectedTestSet(null)}/>
            }
        </div>
    )
}

export default Home;