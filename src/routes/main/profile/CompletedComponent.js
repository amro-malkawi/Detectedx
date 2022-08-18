import React, {useState, useEffect} from 'react';
import {Input} from 'reactstrap';
import {Button} from '@material-ui/core';
import {useHistory, useLocation} from "react-router-dom";
import moment from 'moment';
import * as Apis from "Api";
import QueryString from "query-string";
import {testSetsCompletedPdf} from "Api";

function CompletedComponent() {
    const history = useHistory();
    const location = useLocation();
    const [completeList, setCompleteList] = useState([]);
    const [totalAttempt, setTotalAttempt] = useState(0);
    const [totalPoint, setTotalPoint] = useState(0);
    const [selectedTestSet, setSelectedTestSet] = useState(null);
    const [attemptList, setAttemptList] = useState([]);

    useEffect(() => {
        getData(true);
    }, []);

    useEffect(() => {
        if(selectedTestSet) {
            Apis.attemptsCompletedList(selectedTestSet.id).then(resp => {
                setAttemptList(resp.attempts);
                history.replace(QueryString.stringifyUrl({url: location.pathname, query: {tab: 'completed', id: selectedTestSet.id}}));
            }).catch(e => {

            });

        } else {
            setAttemptList([]);
            history.replace(QueryString.stringifyUrl({url: location.pathname, query: {tab: 'completed'}}));
        }
    }, [selectedTestSet]);

    const getData = (firstLoading) => {
        Apis.testSetRecentlyCompleted().then((resp) => {
            let a = 0, p = 0;
            resp.forEach((v) => {
                a += v.attemptCount;
                p += v.test_set_point;
                if(v.modalityInfo.modality_type === 'quiz') {
                    v.type = 'Quiz';
                } else if (['video_lecture', 'presentations', 'interactive_video'].indexOf(v.modalityInfo.modality_type) !== -1) {
                    v.type = 'LECTURE';
                } else if (v.modalityInfo.modality_type === 'viewer') {
                    v.type = 'IMAGE VIEWER';
                } else {
                    v.type = 'SELF ASSESSMENT MODULE';
                }
            });
            setTotalAttempt(a);
            setTotalPoint(p);
            setCompleteList(resp);
            if(firstLoading) {
                const param = QueryString.parse(location.search);
                if(param.id) {
                    const selectedItem = resp.find((v) => v.id === param.id);
                    if(selectedItem) setSelectedTestSet(selectedItem);
                }
            }
        })
    }

    const onReattempt = () => {
        Apis.attemptsStart(selectedTestSet.id, undefined).then(attempt => {
            let path;
            if (attempt.progress === 'test') {
                path = (['video_lecture', 'presentations', 'interactive_video'].indexOf(attempt.modality_type) === -1 ? '/test-view/' : '/video-view/') + attempt.test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            } else {
                path = '/main/attempt/' + attempt.id + '/' + attempt.progress;
            }
            history.push(path)
        });
    }

    const renderCompletedLine = (v) => {
        const color = v.modalityInfo.modality_color || '#534ed9';
        return (
            <tr style={{backgroundColor: color}} key={v.id}>
                <td>{v.name}</td>
                <td><span style={{color: color}}>{v.type}</span></td>
                <td>BREAST</td>
                <td>{v.test_set_code}</td>
                <td className={'text-center'}>{v.test_set_point}</td>
                <td className={'text-center'}>{v.attemptCount}</td>
                <td>
                    <Button onClick={() => setSelectedTestSet(v)}>
                        <span style={{color: color}}>CONTINUE</span>
                    </Button>
                </td>
            </tr>
        )
    }

    const renderAttemptLine = (v, i) => {
        return(
            <tr key={v.id} style={{backgroundColor: (selectedTestSet.modalityInfo.modality_color || '#534ed9')}}>
                <td className={'text-center'}>{i + 1}</td>
                <td className={'text-center'}>{moment(v.created_at).format('MM/DD/YYYY')}</td>
                <td className={'text-center'}>{moment(v.updated_at).format('MM/DD/YYYY')}</td>
                <td>
                    <Button className={'profile-attempt-view-btn'} onClick={() => history.push('/main/attempt/' + v.id + '/score')}>
                        <img src={require('Assets/img/main/icon_eye.svg')} alt={''} />
                        VIEW
                    </Button>
                </td>
            </tr>
        )
    }

    if(selectedTestSet === null) {
        return (
            <div className={'profile-content flex-column fw-semi-bold'}>
                <div className={'profile-completed-content'}>
                    <div className={'profile-completed-top'}>
                        <div className={'d-flex flex-row align-items-center'}>
                            <div className={'fs-15 text-primary1 mr-40'} style={{paddingTop: 8}}>COMPLETED</div>
                            <Input type={'select'} className={'mt-1'}>
                                <option>FILTER</option>
                                <option>COMPLETED</option>
                            </Input>
                        </div>
                        <div className={'fs-15 text-primary1 cursor-pointer'} onClick={() => Apis.testSetsCompletedPdf()}>
                            EXPORT TO PDF
                        </div>
                    </div>
                    <div className={'profile-completed-table'}>
                        <table>
                            <thead>
                            <tr>
                                <th>NAME</th>
                                <th>TYPE</th>
                                <th>CATEGORY</th>
                                <th>MODULE</th>
                                <th className={'text-center'}>POINTS</th>
                                <th className={'text-center'}>ATTEMPTS</th>
                                <th>REPORT</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                completeList.map((v, i) => renderCompletedLine(v))
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className={'profile-completed-bottom fs-15'}>
                        <div className={'profile-completed-bottom-title'}>
                            <span>TOTAL</span>
                            <div className={'d-flex flex-row mr-50'}>
                                <div className={'mr-40 text-center'} style={{width: 70}}>POINTS</div>
                                <div className={'mr-50 text-center'} style={{width: 70}}>ATTEMPTS</div>
                            </div>
                        </div>
                        <div className={'d-flex flex-row justify-content-end mr-50'}>
                            <div className={'mr-40 text-center'} style={{width: 70}}>{totalPoint}</div>
                            <div className={'mr-50 text-center'} style={{width: 70}}>{totalAttempt}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={'profile-content flex-column fw-semi-bold'}>
                <div className={'profile-completed-content'}>
                    <div className={'profile-completed-top'}>
                        <div className={'d-flex flex-row align-items-center'}>
                            <div className={'d-flex flex-row align-items-center fs-15 text-primary1 mr-40 cursor-pointer'} onClick={() => setSelectedTestSet(null)}>
                                <i className="zmdi zmdi-chevron-left fs-23 mr-2"/>
                                BACK
                            </div>
                            <div className={'d-flex flex-row align-items-end'}>
                                <div className={'fs-23 mr-20'}>{selectedTestSet.name}</div>
                                <div className={'fs-15 mb-1'}>{selectedTestSet.test_set_code}</div>
                            </div>
                        </div>
                        <div>
                            <Button className={'profile-complete-reattempt'} onClick={onReattempt}>REATTEMPT</Button>
                        </div>
                    </div>
                    <div className={'profile-attempt-table'}>
                        <table>
                            <thead>
                            <tr>
                                <th className={'text-center'}>ATTEMPT NUMBER</th>
                                <th className={'text-center'}>START DATE</th>
                                <th className={'text-center'}>END DATE</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                attemptList.map((v, i) => renderAttemptLine(v, i))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default CompletedComponent;