import {
    Box,
    FormControlLabel
} from '@material-ui/core';
import React, { useCallback } from 'react';
import { DynamicQuestionControl } from './DynamicQuestionControl';

export const DynamicQuestionMulti = ({
    question,
    truth,
    answer,
    onChange
}) => {
    const handleChange = useCallback((value) => {
        if (Array.isArray(answer)) {
            const index = answer.indexOf(value);
            if (index === -1) {
                onChange([...answer, value]);
            } else {
                const newTruth = [...answer];
                newTruth.splice(index, 1);
                onChange(newTruth);
            }
        } else {
            onChange([value]);
        }
    }, [onChange, answer]);

    return <div>
        <h2>{question.name}</h2>
        <Box display="flex" flexDirection="column">
            {question.options.map((option) => {
                const isTruth = Array.isArray(truth) && truth.includes(option.id);
                const isAnswer = Array.isArray(answer) && answer.includes(option.id);

                return <FormControlLabel
                    key={option.id}
                    value={option.id}
                    label={option.name}
                    control={<DynamicQuestionControl type="checkbox" isAnswer={isAnswer} isTruth={isTruth}/>}
                    checked={isTruth || isAnswer}
                    onChange={() => handleChange(option.id)}
                />;
            })}
        </Box>
    </div>;
};
