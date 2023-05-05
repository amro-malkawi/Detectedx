import React from 'react';
import { DynamicQuestionMulti } from './DynamicQuestionMulti';
import { DynamicQuestionSingle } from './DynamicQuestionSingle';
import { DynamicQuestionFreetext } from './DynamicQuestionFreetext';

export const DynamicQuestion = ({
    question,
    answer,
    truth,
    onChange
}) => {
    switch (question.type) {
        case 'single':
            return <DynamicQuestionSingle question={question} answer={answer} truth={truth} onChange={onChange}/>;
        case 'multi':
            return <DynamicQuestionMulti question={question} answer={answer} truth={truth} onChange={onChange}/>;
        case 'freetext':
            return <DynamicQuestionFreetext question={question} answer={answer} truth={truth} onChange={onChange}/>;
        default:
            return null;
    }
};
