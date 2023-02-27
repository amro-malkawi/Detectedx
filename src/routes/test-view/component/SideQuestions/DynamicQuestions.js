import { Box, Typography } from '@material-ui/core';
import { getAttemptImageQuality, setAttemptImageQuality } from 'Api';
import React, { useCallback, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { DynamicQuestion } from './DynamicQuestions/DynamicQuestion';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
    DynamicQuestionControl
} from 'Routes/test-view/component/SideQuestions/DynamicQuestions/DynamicQuestionControl';

export const DynamicQuestions = ({
    sideQuestionsRef,
    testCaseId,
    attemptId,
    isPostTest, // TODO CHECK WORKS - HANDLE IS POST TEST
    questions,
    confidenceQuestion,
    complete
}) => {
    const [truth, setTruth] = useState([]);
    const [answers, setAnswers] = useState({});

    const fetchTruths = useCallback(() => {
        if (!testCaseId) {
            return Promise.reject();
        }

        return getAttemptImageQuality(attemptId, testCaseId, isPostTest).then(result => {
            setAnswers(result.quality_answer);
            setTruth(result.quality_truth)
        }).catch((error) => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }, [testCaseId]);

    useEffect(() => {
        fetchTruths();
    }, [fetchTruths]);

    useEffect(() => {
        // TODO PROPER VALIDATION METHOD
        sideQuestionsRef.current = {
            checkQuestionValidate: () => true
        }
    }, [])

    const saveAnswers = (answers) => {
        setAttemptImageQuality(attemptId, testCaseId, answers, isPostTest).catch((error) => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    };

    const getOnQuestionChangeHandler = (id) => {
        return (value) => {
            if (complete) {
                return;
            }
            const newAnswers = { ...answers };
            newAnswers[id] = value;
            setAnswers(newAnswers);
            saveAnswers(newAnswers);
        };
    };

    const handleChangeConfidenceRating = (value) => {
        if (complete) {
            return;
        }

        const newAnswers = { ...answers };
        newAnswers.rating = value;
        setAnswers(newAnswers);
        saveAnswers(newAnswers);
    };

    return <div className={'quality-question-data'} style={{ width: 300 }}>
        <Box px={1}>
            {questions.map(question => <div key={question.id}>
                <DynamicQuestion
                    question={question}
                    truth={truth[question.id]}
                    answer={answers[question.id]}
                    onChange={getOnQuestionChangeHandler(question.id)}
                />
            </div>)}
        </Box>
        {confidenceQuestion && answers && <Box position="sticky" bottom={0}>
            <Typography variant="h2">{confidenceQuestion.name}</Typography>
            <Box>
                {[1, 2, 3, 4, 5].map((value) => <FormControlLabel
                    key={value}
                    label={value}
                    control={<DynamicQuestionControl
                        checked={answers.rating === value || truth.rating === value}
                        type="radio"
                        isTruth={truth.rating === value}
                        isAnswer={answers.rating === value}
                        onChange={() => handleChangeConfidenceRating(value)}
                    />
                    }
                />)}
            </Box>
        </Box>}
    </div>;
};
