import {styled} from "@mui/material/styles";
import {Checkbox, FormControlLabel, Radio} from "@mui/material";
import {withStyles} from 'tss-react/mui';
import {yellow} from "@mui/material/colors";
import chroma from "chroma-js";

export const GreenCheckbox = styled(Checkbox)(({ theme }) => ({
    color: '#B2B2B2',
    margin: 0,
    padding: 3,
    '&.Mui-checked': {
        color: '#54a9fb',
    },
}));

export const MarkerFormControlLabel = withStyles(FormControlLabel, (theme) => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&$disabled': {
            color: yellow[200],
        },
        '&.green-label': {
            color: '#2eff2e'
        },
        '&.red-label': {
            color: 'red'
        }
    },
    disabled: {},
}));

export const MarkerRadio = withStyles(Radio, (theme) => ({
    root: {
        color: yellow[600],
        '&$checked': {
            color: yellow[500],
        },
        '&$disabled': {
            color: yellow[200],
        },
        '&.green-icon': {
            color: '#2eff2e'
        },
        '&.red-icon': {
            color: 'red'
        }
    },
    checked: {},
    disabled: {},
}));


export const markerSelectStyles = {
    container: (styles, {data}) => {
        return {
            ...styles,
            marginBottom: 7,
        };
    },
    control: styles => ({...styles, backgroundColor: 'black'}),
    menu: styles => ({...styles, backgroundColor: 'black', borderColor: 'red', borderWidth: 10}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? 'yellow'
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : 'yellow',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? 'yellow' : color.alpha(0.3).css()),
            },
        };
    },
    singleValue: (styles, {data}) => {
        return {
            ...styles,
            color: 'yellow',
        };
    },
    multiValue: (styles, {data}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
    }),
    multiValueRemove: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
        ':hover': {
            backgroundColor: 'yellow',
            color: 'black',
        },
    }),
};