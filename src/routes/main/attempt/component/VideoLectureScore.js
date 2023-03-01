import React, {useState, useEffect} from 'react';
import * as Apis from "Api";
import {NotificationManager} from "react-notifications";

function VideoLectureScore({attemptId, testCaseId}) {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        Apis.getAttemptQuizAnswer(attemptId, testCaseId, false).then((resp) => {
            setAnswers(resp);
        }).catch((error) => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }, []);

    if(answers.usingCustomQuestions) {
        return <div className={'d-flex flex-column bg-gray p-4'} style={{ minHeight: 423 }}>
            <span className={'fs-19 pb-3 border-bottom'}>Answer</span>
            {
                answers.value.map((answer) => (
                    <div key={answer.question.id} className={'d-flex flex-column fs-15 border-bottom py-3'}>
                        <div dangerouslySetInnerHTML={{ __html: answer.question.name }}/>
                        <span className={'mt-1 pl-2'}>
                            {answer.isAnswerCorrect === true && 'True'}
                            {answer.isAnswerCorrect === false && 'False'}
                            {answer.isAnswerCorrect === null && 'Not scored'}
                        </span>
                    </div>
                ))
            }
            <span></span>
        </div>
    }

    return (
        <div className={'d-flex flex-column bg-gray p-4'} style={{minHeight: 423}}>
            <span className={'fs-19 pb-3 border-bottom'}>Answer</span>
            {
                answers.map((v) => (
                    <div key={v.id} className={'d-flex flex-column fs-15 border-bottom py-3'}>
                        <div dangerouslySetInnerHTML={{__html: v.question}}/>
                        <span className={'mt-1 pl-2'}>{v.truthOptionId === v.answerOptionId ? 'True' : 'False'}</span>
                    </div>
                ))
            }
            <span></span>
        </div>
    )
}

export default VideoLectureScore;
