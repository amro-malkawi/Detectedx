import { Box, Button, Typography } from '@material-ui/core';
import { getAttemptImageQuality, getAttemptQuizAnswer, setAttemptImageQuality, submitQuizAnswer } from 'Api';
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
    complete,
    quizMode,
}) => {
    const [truths, setTruths] = useState({});
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    const fetchTruths = useCallback(() => {
        if (!testCaseId) {
            return Promise.reject();
        }

        if(quizMode) {
            return getAttemptQuizAnswer(attemptId, testCaseId, isPostTest).then(result => {
                const answers = Object.fromEntries(
                    result.value.map(item => ([
                        item.question.id,
                        item.answer
                    ]))
                );
                const truths = Object.fromEntries(
                    result.value.map(item => ([
                        item.question.id,
                        {
                            value: item.truth,
                            explanation: item.explanation
                        }
                    ]))
                );
                setAnswers(answers);
                setTruths(truths)
                setIsFinished(result.isFinished);
            }).catch((error) => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }

        return getAttemptImageQuality(attemptId, testCaseId, isPostTest).then(result => {
            setAnswers(result.quality_answer);
            setTruths(result.quality_truth)
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

    const handleClickSubmitQuizAnswer = () => {
        if(Object.values(answers).every(answer => answer != null)) {
            return submitQuizAnswer(attemptId, testCaseId).then(() => {
                fetchTruths();
            });
        }
        NotificationManager.error(<IntlMessages id={"testView.selectImageQuality"}/>);
    }

    return <div className="dynamic-questions">
        <Box px={1}>
            {questions.map(question => {
                const truth = truths[question.id] ? truths[question.id] : {};

                return <Box mb={2} key={question.id}>
                    <DynamicQuestion
                        question={question}
                        truth={truth.value}
                        answer={answers[question.id]}
                        onChange={getOnQuestionChangeHandler(question.id)}
                    />
                    {truth.explanation && <Box mt={1} mb={2} dangerouslySetInnerHTML={{__html: truth.explanation}}></Box>}
                </Box>
            })}
        </Box>
        {quizMode && !isFinished &&
            <Box marginTop="auto" mb={2} className="quiz-submit-btn" onClick={handleClickSubmitQuizAnswer}>
                <Button variant="contained" size="small" fullWidth>Submit answer</Button>
            </Box>
        }
        {confidenceQuestion && answers && <div className="confidence-question">
            <Typography variant="h2">{confidenceQuestion.name}</Typography>
            <div className="confidence-question-options">
                {[1, 2, 3, 4, 5].map((value) => <FormControlLabel
                    key={value}
                    label={value}
                    control={<DynamicQuestionControl
                        checked={answers.rating === value || truths.rating === value}
                        type="radio"
                        isTruth={truths.rating === value}
                        isAnswer={answers.rating === value}
                        onChange={() => handleChangeConfidenceRating(value)}
                    />
                    }
                />)}
            </div>
        </div>}
    </div>;
};
