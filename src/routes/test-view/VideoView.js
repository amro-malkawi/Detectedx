import React, {useState, useEffect, useRef} from 'react';
import {Button} from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ReactPlayer from "react-player";
import {useHistory} from 'react-router-dom';
import IntlMessages from "Util/IntlMessages";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";
import CommentInfo from "./component/CommentInfo";
import SideQuestions from "./component/SideQuestions";
import PowerPointViewer from "./component/PowerPointViewer";
import * as Apis from 'Api';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import {NotificationManager} from "react-notifications";

function VideoView(props) {
    const history = useHistory();
    const sideQuestionRef = useRef();
    const playerRef = useRef();
    const playedSeconds = useRef();
    const [testSetId, setTestSetId] = useState(props.match.params.test_sets_id);
    const [testCaseId, setTestCaseId] = useState(props.match.params.test_cases_id);
    const [attemptId, setAttemptId] = useState(props.match.params.attempts_id);
    const [testSetInfo, setTestSetInfo] = useState({});
    const [testCaseInfo, setTestCaseInfo] = useState({});
    const [complete, setComplete] = useState(true);
    const [allowSkip, setAllowSkip] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Promise.all([
            Apis.testCasesViewInfo(testCaseId),
            Apis.attemptsDetail(attemptId, testCaseId),
            Apis.attemptsCompletedList(testSetId)
        ]).then(([testCaseViewInfo, attemptsDetail, completeList]) => {
            setTestSetInfo(attemptsDetail.test_sets);
            setTestCaseInfo(testCaseViewInfo);
            setComplete(attemptsDetail.complete);
            setAllowSkip(completeList.attempts.filter((v) => v.complete).length > 0);
            setLoading(false);

            const fileExt = attemptsDetail.test_sets.test_set_discussion.split('.').pop();
            if (fileExt === 'ppt' || fileExt === 'pptx') {
                setAllowSkip(true);
            }
        });
    }

    const handleVideoProgress = (e) => {
        if (!allowSkip && (e.playedSeconds - playedSeconds.current) > 2) {
            playerRef.current.seekTo(parseFloat(playedSeconds.current), 'seconds');
        } else {
            playedSeconds.current = e.playedSeconds;
        }
    }

    const handleVideoSeek = (seekTime) => {
        if (!allowSkip && (seekTime - playedSeconds.current) > 0.1) {
            playerRef.current.seekTo(parseFloat(playedSeconds.current), 'seconds');
        }
    }

    const validateForNext = () => {
        let valid = true;
        if (!allowSkip) {
            valid = false;
            NotificationManager.error('You have to watch the video until the end.');
        } else if (!complete) {
            if (['video_lecture', 'presentations'].indexOf(testCaseInfo.modalities.modality_type) !== -1) {
                if (sideQuestionRef.current && sideQuestionRef.current.checkQuestionValidate) {
                    valid = sideQuestionRef.current.checkQuestionValidate();
                } else {
                    console.error('can not find question validation function');
                    valid = false;
                }
            }
        }
        return valid;
    }

    const onFinish = () => {
        if (validateForNext()) {
            Apis.attemptsFinishTest(attemptId, window.screen.width, window.screen.height).then((nextStep) => {
                history.push('/app/test/attempt/' + attemptId + '/' + nextStep + '?from=test');  // go to scores tab
            }).catch((e) => {
                console.warn(e.response ? e.response.data.error.message : e.message);
            });
        }
    }

    const handleVideoEnded = () => {
        setAllowSkip(true);

    }

    const renderHeaderNumber = () => {
        return <h1 className={'test-view-header-number'}>{testSetInfo.name}</h1>
    }

    const renderNav = () => {
        return (
            <nav className={'test-view-action-buttons'}>
                <Button className='mr-10 test-previous-finish' variant="contained" color="primary" onClick={() => onFinish()}>
                    <span className={'test-action-btn-label'}><IntlMessages id={"testView.submit"}/></span>
                    <CheckCircleOutlineIcon size="small"/>
                </Button>
                {
                    complete &&
                    <Button className={'ml-20 mr-10 test-previous-scores'} variant="contained" color="primary"
                            onClick={() => history.push('/app/test/attempt/' + attemptId + '/score')}>
                        <span className={'test-action-btn-label'}><IntlMessages id={"testView.scores"}/></span>
                        <HistoryOutlinedIcon size="small"/>
                    </Button>
                }
                <Button variant="contained" color="primary" className={'test-home-btn'} onClick={() => history.push('/app/test/list')}>
                    <span className={'test-action-btn-label'}><IntlMessages id={"testView.home"}/></span>
                    <HomeOutlinedIcon size="small"/>
                </Button>
            </nav>
        );
    }

    const renderTestContent = () => {
        const fileExt = testSetInfo.test_set_discussion.split('.').pop();
        if (fileExt === 'ppt' || fileExt === 'pptx') {
            return (
                <PowerPointViewer
                    filePath={testSetInfo.test_set_discussion}
                    allowSkip={allowSkip}
                    onEnded={() => handleVideoEnded()}
                />
            )
        } else {
            return (
                <ReactPlayer
                    ref={playerRef}
                    url={testSetInfo.test_set_discussion}
                    playing
                    controls
                    width={'100%'}
                    height={'100%'}
                    config={{
                        file: {
                            attributes: {
                                disablePictureInPicture: true,
                                controlsList: 'nodownload noplaybackrate',
                                onContextMenu: e => e.preventDefault()
                            }
                        }
                    }}
                    onProgress={(e) => handleVideoProgress(e)}
                    onSeek={(time) => handleVideoSeek(time)}
                    onEnded={() => handleVideoEnded()}
                />
            )
        }
    }

    if (loading) {
        return (<RctSectionLoader style={{backgroundColor: 'black'}}/>);
    }
    return (
        <div className="viewer">
            <div id="toolbar">
                {renderHeaderNumber()}
                {renderNav()}
                <div className={'test-view-header-admintxt'}>ADMIN MODE</div>
            </div>
            <div className={'test-content'}>
                {
                    testCaseInfo.modalities.modality_type !== 'covid' &&
                    <CommentInfo
                        test_case_id={testCaseId}
                        attempts_id={attemptId}
                        modality_type={testCaseInfo.modalities.modality_type}
                        modality_name={testCaseInfo.modalities.name}
                        complete={complete}
                        isPostTest={false}
                    />
                }
                <div className={'image-container'}>
                    <div className={'video-container'}>
                        {renderTestContent()}
                    </div>
                </div>
                {
                    allowSkip &&
                    <SideQuestions
                        modalityInfo={testCaseInfo.modalities}
                        test_case_id={testCaseId}
                        ref={sideQuestionRef}
                        attempts_id={attemptId}
                        complete={complete}
                        isTruth={false}  // for covid question(truth left panel or answer right panel)
                        isPostTest={false}
                    />
                }
            </div>
            <div className={'rotate-error'}>
                <img src={require('Assets/img/rotate.png')} alt=''/>
            </div>

        </div>
    )
}

export default VideoView;