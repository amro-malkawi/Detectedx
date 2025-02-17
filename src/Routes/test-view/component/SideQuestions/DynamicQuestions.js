import {Box, Button, Tooltip, Typography, FormControlLabel} from '@mui/material';
import { getAttemptImageQuality, getAttemptQuizAnswer, setAttemptImageQuality, submitQuizAnswer } from 'Api';
import React, { useCallback, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { DynamicQuestion } from './DynamicQuestions/DynamicQuestion';
import {
    DynamicQuestionControl
} from 'Routes/test-view/component/SideQuestions/DynamicQuestions/DynamicQuestionControl';
import {withStyles} from "tss-react/mui";

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
                if (!result.value) {
                    // No truth or answer is available
                    return;
                }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testCaseId]);

    useEffect(() => {
        fetchTruths();
    }, [fetchTruths]);

    useEffect(() => {
        if(confidenceQuestion) {
            sideQuestionsRef.current = {
                checkQuestionValidate: () => {
                    if (answers.rating == null) {
                        NotificationManager.error('Please answer the confidence question.');
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers])

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
        } else {
            NotificationManager.error('Please select values for all questions.');
        }
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
                {[0, 1, 2, 3, 4, 5].map((value) =>
                    <CustomTooltip title={confidenceQuestion[`rating_${value}_label`]}>
                        <FormControlLabel
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
                        />
                    </CustomTooltip>)}
            </div>
        </div>}
    </div>;
};

const CustomTooltip = withStyles(Tooltip, (theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
        fontSize: '1rem'
    }
}));