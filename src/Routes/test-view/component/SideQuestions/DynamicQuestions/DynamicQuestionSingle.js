import { Box, FormControlLabel } from '@material-ui/core';
import React from 'react';
import { DynamicQuestionControl } from './DynamicQuestionControl';

export const DynamicQuestionSingle = ({
    question,
    truth,
    answer,
    onChange
}) => {
    return <div>
        <h2>{question.name}</h2>
        <Box className="dynamic-question-content" display="flex" flexDirection="column">
            {question.options.map((option) =>{
                const isTruth = truth === option.id;
                const isAnswer = answer === option.id;


                return <FormControlLabel
                    key={option.id}
                    value={option.id}
                    label={option.name}
                    control={<DynamicQuestionControl type="radio" isAnswer={isAnswer} isTruth={isTruth} />}
                    checked={isTruth || isAnswer}
                    onChange={() => onChange(option.id)}
                />;
            })}
        </Box>
    </div>;
};
