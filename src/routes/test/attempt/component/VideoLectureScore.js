import React, {useState, useEffect, useRef} from 'react';
import * as Apis from "Api";
import {NotificationManager} from "react-notifications";

function VideoLectureScore({attemptId, testCaseId}) {
    const [questionList, setQuestionList] = useState([]);

    useEffect(() => {
        Apis.getAttemptQuizAnswer(attemptId, testCaseId, false).then((resp) => {
            setQuestionList(resp);
            console.log(resp, '//////////////////')
        }).catch((error) => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }, []);

    return (
        <div className={'d-flex flex-column bg-gray p-4'} style={{minHeight: 423}}>
            <span className={'fs-19 pb-3 border-bottom'}>Answer</span>
            {
                questionList.map((v) => (
                    <div key={v.id} className={'d-flex flex-column fs-15 border-bottom py-3'}>
                        <span className={''}>{v.question}</span>
                        <span className={'mt-1 pl-2'}>{v.truthOptionId === v.answerOptionId ? 'True' : 'False'}</span>
                    </div>
                ))
            }
            <span></span>
        </div>
    )
}

export default VideoLectureScore;
