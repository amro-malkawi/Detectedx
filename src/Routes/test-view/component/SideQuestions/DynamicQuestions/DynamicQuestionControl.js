import {
    Checkbox,
    Radio
} from '@mui/material';
import {
    RadioButtonChecked,
    RadioButtonUnchecked,
    CheckBox as CheckBoxChecked,
    CheckBoxOutlineBlank as CheckBoxUnchecked
} from '@mui/icons-material';
import React from 'react';

export const DynamicQuestionControl = ({
    checked,
    onChange,
    type,
    isAnswer,
    isTruth
}) => {
    let color = '#ffffff';
    if (isAnswer && isTruth) {
        color = '#00ff00';
    } else if (isTruth) {
        color = '#ff0000';
    }

    if (type === 'radio') {
        return <Radio
            size="small"
            icon={<RadioButtonUnchecked style={{ color }}/>}
            checkedIcon={<RadioButtonChecked style={{ color }}/>}
            checked={checked}
            onChange={onChange}
        />;
    }

    if (type === 'checkbox') {
        return <Checkbox
            size="small"
            icon={<CheckBoxUnchecked style={{ color }}/>}
            checkedIcon={<CheckBoxChecked style={{ color }}/>}
            checked={checked}
            onChange={onChange}
        />;
    }

    return 'TBI CHECKBOX';
};
