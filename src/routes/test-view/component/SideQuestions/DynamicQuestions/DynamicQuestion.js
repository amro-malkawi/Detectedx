import React from 'react';
import { DynamicQuestionMulti } from './DynamicQuestionMulti';
import { DynamicQuestionSingle } from './DynamicQuestionSingle';

export const DynamicQuestion = ({
    question,
    answer,
    truth,
    onChange
}) => {
    if (question.type === 'single') {
        return <DynamicQuestionSingle question={question} answer={answer} truth={truth} onChange={onChange}/>;
    } else if (question.type === 'multi') {
        return <DynamicQuestionMulti question={question} answer={answer} truth={truth} onChange={onChange}/>;
    }

    return null;
};
