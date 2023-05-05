import React, {useState, useEffect, useRef} from 'react';
import {Button} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReactPlayer from "react-player";
import {useNavigate, useParams} from 'react-router-dom';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CommentInfo from "./component/CommentInfo";
import SideQuestions from "./component/SideQuestions";
import PowerPointViewer from "./component/PowerPointViewer";
import * as Apis from 'Api';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import {NotificationManager} from "react-notifications";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InstructionModal from "Routes/instructions";

function VideoView() {
    const navigate = useNavigate();
    const params = useParams();
    const sideQuestionRef = useRef();
    const playerRef = useRef();
    const playedSeconds = useRef();
    const [testSetId, setTestSetId] = useState(params.test_sets_id);
    const [testCaseId, setTestCaseId] = useState(params.test_cases_id);
    const [attemptId, setAttemptId] = useState(params.attempts_id);
    const [testSetInfo, setTestSetInfo] = useState({});
    const [testCaseInfo, setTestCaseInfo] = useState({});
    const [complete, setComplete] = useState(true);
    const [allowSkip, setAllowSkip] = useState(false);
    const [isVideoEnd, setIsVideoEnd] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isShowInstructionModal, setIsShowInstructionModal] = useState(false);

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
            // setAllowSkip(completeList.attempts.filter((v) => v.complete).length > 0);
            setAllowSkip(true);
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
        if (sideQuestionRef.current && sideQuestionRef.current.handleVideoProgress) {
            sideQuestionRef.current.handleVideoProgress(e.playedSeconds);
        }
        const playSecond = Math.floor(playedSeconds.current);
        const duration = Math.floor(playerRef.current.getDuration());
        if(playSecond % 2 === 0 || playSecond === duration) Apis.attemptsUpdateComment(attemptId, {duration: duration, played: playSecond}).then(() => null);
    }

    const handleVideoSeek = (seekTime) => {
        if (!allowSkip && (seekTime - playedSeconds.current) > 0.1) {
            playerRef.current.seekTo(parseFloat(playedSeconds.current), 'seconds');
        }
    }

    const validateForNext = () => {
        let valid = true;
        if (!allowSkip && testCaseInfo.modalities.modality_type !== 'interactive_video') {
            valid = false;
            NotificationManager.error('You have to watch the video until the end.');
        } else if (!complete) {
            if (['video_lecture', 'presentations', 'interactive_video'].indexOf(testCaseInfo.modalities.modality_type) !== -1) {
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
                navigate('/main/attempt/' + attemptId + '/' + nextStep + '?from=test');  // go to scores tab
            }).catch((e) => {
                console.warn(e.response ? e.response.data.error.message : e.message);
            });
        }
    }

    const handleVideoEnded = () => {
        setAllowSkip(true);
        setIsVideoEnd(true);
        if(testCaseInfo.modalities.modality_type === 'interactive_video') {
            if (sideQuestionRef.current && sideQuestionRef.current.onSubmitAnswer) {
                sideQuestionRef.current.onSubmitAnswer().then(() => {
                    onFinish();
                })
            }
        }
    }

    const renderHeaderNumber = () => {
        return <h1 className={'test-view-header-number'}>{testSetInfo.name}</h1>
    }

    const renderNav = () => {
        return (
            <nav className={'test-view-action-buttons'}>
                {
                    // can not submit "presentations" test because there is no questions. it's for only show
                    testCaseInfo.modalities.modality_type !== 'presentations' &&
                    <Button className='me-10 test-previous-finish' variant="contained" color="primary" onClick={() => onFinish()}>
                        <span className={'test-action-btn-label'}>Submit</span>
                        <CheckCircleOutlineIcon size="small"/>
                    </Button>
                }
                {
                    complete &&
                    <Button className={'ms-20 me-10 test-previous-scores'} variant="contained" color="primary"
                            onClick={() => navigate('/main/attempt/' + attemptId + '/score')}>
                        <span className={'test-action-btn-label'}>Scores</span>
                        <HistoryOutlinedIcon size="small"/>
                    </Button>
                }
                {
                    (!complete && ['LBLT2202', 'LBLT22 04', 'LBLT22 01', 'LBLT22 03'].indexOf(testSetInfo.test_set_code) !== -1) &&
                    <Button className={'ms-20 me-10 test-previous-info'} variant="contained" color="primary" onClick={() => setIsShowInstructionModal(true)}>
                        <span className={'test-action-btn-label'}>LT Pathology Classification</span>
                        <InfoOutlinedIcon size="small"/>
                    </Button>
                }
                <Button variant="contained" color="primary" className={'test-home-btn'} onClick={() => navigate('/main')}>
                    <span className={'test-action-btn-label'}>Home</span>
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
                    playing={playing}
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
                    (testCaseInfo.modalities.modality_type === 'interactive_video' || isVideoEnd) &&
                    <SideQuestions
                        modalityInfo={testCaseInfo.modalities}
                        test_case_id={testCaseId}
                        ref={sideQuestionRef}
                        attempts_id={attemptId}
                        complete={complete}
                        isTruth={false}  // for covid question(truth left panel or answer right panel)
                        isPostTest={false}
                        playerRef={playerRef} // for interactive video
                        onChangePlaying={(v) => setPlaying(v)}  // for interactive video
                        questions={testCaseInfo ? testCaseInfo.questions : null}
                    />
                }
            </div>
            <div className={'rotate-error'}>
                <img src={require('Assets/img/rotate.png')} alt=''/>
            </div>
            <InstructionModal
                isOpen={isShowInstructionModal}
                onClose={() => setIsShowInstructionModal(false)}
                theme={'black'}
                type={testCaseInfo.modalities.instruction_type}
                video={{thumbnail: testCaseInfo.modalities.instruction_video_thumbnail, link: testCaseInfo.modalities.instruction_video}}
            />
        </div>
    )
}

export default VideoView;