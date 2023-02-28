import { Box, Typography } from '@material-ui/core';
import { getAttemptImageQuality, setAttemptImageQuality } from 'Api';
import React, { useCallback, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { DynamicQuestion } from './DynamicQuestions/DynamicQuestion';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
    DynamicQuestionControl
} from 'Routes/test-view/component/SideQuestions/DynamicQuestions/DynamicQuestionControl';
import IntlMessages from 'Util/IntlMessages';

export const DynamicQuestions = ({
    sideQuestionsRef,
    testCaseId,
    attemptId,
    isPostTest,
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
        if(confidenceQuestion) {
            sideQuestionsRef.current = {
                checkQuestionValidate: () => {
                    if (!answers.rating) {
                        NotificationManager.error(<IntlMessages id={"testView.selectConfidenceNumber"}/>);
                        return false;
                    }
                    return true;
                }
            }
        } else {
            sideQuestionsRef.current = {
                checkQuestionValidate: () => true
            }
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

    return <div className="dynamic-questions">
        <Box px={1}>
            {questions.map(question => <Box mb={2} key={question.id}>
                <DynamicQuestion
                    question={question}
                    truth={truth[question.id]}
                    answer={answers[question.id]}
                    onChange={getOnQuestionChangeHandler(question.id)}
                />
            </Box>)}
        </Box>
        {confidenceQuestion && answers && <div className="confidence-question">
            <Typography variant="h2">{confidenceQuestion.name}</Typography>
            <div className="confidence-question-options">
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
            </div>
        </div>}
    </div>;
};
