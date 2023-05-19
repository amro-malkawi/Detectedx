import { Box, OutlinedInput, Typography } from '@mui/material';
import React from 'react';

export const DynamicQuestionFreetext = ({
    question,
    truth,
    answer,
    onChange
}) => {
    return <div>
        <h2>{question.name}</h2>
        {truth && <Box>
            <Typography style={{lineHeight: 1}} component="pre" color="error">{truth}</Typography>
            <Box mb={2} />
            <Typography style={{lineHeight: 1}} component="pre" color="inherit">{answer}</Typography>
        </Box>}

        {!truth && <Box display="flex" flexDirection="column">
            <OutlinedInput multiline value={answer} onChange={event => onChange(event.target.value)} />
        </Box>}
    </div>;
};
