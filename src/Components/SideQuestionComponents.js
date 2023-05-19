import {Checkbox, FormControlLabel, Radio, Tooltip, InputBase} from "@mui/material";
import {withStyles} from 'tss-react/mui';
import { alpha } from '@mui/material/styles'
import green from "@mui/material/colors/green";
import red from "@mui/material/colors/red";
import yellow from "@mui/material/colors/yellow";

export const QuestionLabel = withStyles(FormControlLabel, (theme) => ({
    root: {
        marginLeft: 0,
    },
    label: {
        color: '#b3b3b3',
        fontSize: 13,
        '&$disabled': {
            color: '#b3b3b3',
        },
    },
    disabled: {
        cursor: 'not-allowed'
    },
}));

export const QuestionRadio = withStyles(Radio, (theme) => ({
    root: {
        color: green[600],
        padding: 2,
        '&$checked': {
            color: red[500],
        },
        '&$disabled': {
            color: green[200],
        },
    },
    checked: {},
    disabled: {
        cursor: 'not-allowed'
    },
}));

export const QuestionCheckbox = withStyles(Checkbox, (theme) => ({
    root: {
        color: green[600],
        padding: 2,
        '&.Mui-checked': {
            color: green[500],
        },
        '&.Mui-disabled': {
            color: green[200],
        },
    },
    checked: {},
    disabled: {
        cursor: 'not-allowed'
    },
}));

export const RatingRadio = withStyles(Radio, (theme) => ({
    root: {
        color: yellow[600],
        '&.Mui-checked': {
            color: yellow[500],
        },
        '&.Mui-disabled': {
            color: yellow[200],
        },
    },
    checked: {},
    disabled: {
        cursor: 'not-allowed'
    },
}));


export const RatingLabel = withStyles(FormControlLabel, (theme) => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&.Mui-disabled': {
            color: yellow[200],
        },
    },
    disabled: {
        cursor: 'not-allowed'
    },
}));

export const CheckboxTooltip = withStyles(Tooltip, (theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

export const QuestionInput = withStyles(InputBase, (theme) => ({
    root: {
        'label + &': {
            marginTop: 0,
        },
    },
    input: {
        width: 100,
        color: 'white',
        borderRadius: 2,
        position: 'relative',
        backgroundColor: 'transparent',
        border: '1px solid #ced4da',
        fontSize: 12,
        padding: '2px 7px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
    disabled: {
        cursor: 'not-allowed'
    },
}));