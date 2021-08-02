import React, {Component} from 'react'
import {Checkbox, FormControlLabel, RadioGroup, Radio, Tooltip, InputBase} from "@material-ui/core";
import green from '@material-ui/core/colors/green';
import {fade, withStyles} from '@material-ui/core/styles';
import yellow from "@material-ui/core/colors/yellow";
import red from "@material-ui/core/colors/red";
import {Input} from "reactstrap";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";


const question = [
    {
        id: 'imagedChestQ1',
        label: '1. Are all relevant anatomic features clearly visible?',
        options: ['1', '2', '3'],
        desc: 'Please highlight any feature below that is displayed in a less than optimal way:',
        child: ['Costophrenic angles', 'Lung Apices', 'Chest lateral borders', 'A maximum of ten posterior ribs', 'Vascular markings of the lungs', '5th-7th anterior ribs'],
        showChildOptions: ['1', '2']
    },
    {
        id: 'imagedChestQ2',
        label: '2. Are the lungs unobscured?',
        options: ['1', '2', '3'],
        desc: 'Please highlight any parameter below that is obscuring the lungs:',
        child: ['The scapulae', 'The chin', 'Arms', 'Patient rotation', 'Patient movement', 'Quantum mottle', 'Collimation', 'Exposure factors', 'Scattered radiation'],
        showChildOptions: ['1', '2']
    },
    {
        id: 'imagedChestQ3',
        label: '3. Are all important technical requirements adhered to?',
        options: ['1', '2', '3'],
        desc: 'Please highlight any requirement that isn’t adhered to',
        child: ['Side marker not visible or in the wrong location', 'Poor level of collimation'],
        showChildOptions: ['1', '2']
    },
    {
        id: 'imagedChestQ4',
        label: '4: Should this image be accepted?',
        options: ['No', 'Yes'],
    },
]

const questionTooltip = {
    "1": 'No',
    '2': 'Partially',
    '3': 'Yes'
}

export default class ImagEDChestQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            answerRating: -1,
            truthValue: {}
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then(resp => {
            this.setState({
                answerValue: resp.chest_answer,
                truthValue: resp.chest_truth,
            });
        }).catch(error => {

        });
    }

    saveChestAnswer() {
        if (!this.props.complete) {
            Apis.setAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.state.answerRating, this.state.answerValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    checkQuestionValidate() {
        const {answerValue} = this.state;
        if (question.every((q) => answerValue[q.id] !== undefined)) {
            return true;
        } else {
            NotificationManager.error(<IntlMessages id={"testView.selectImageQuality"}/>);
            return false;
        }
    }

    onChangeCheck(qId, childQId, value) {
        const {answerValue} = this.state;
        let checkValues = answerValue[qId][childQId];
        if (checkValues === undefined) checkValues = [];
        const valueIndex = checkValues.indexOf(value);
        if (valueIndex === -1) {
            // chestQ3a/chestQ3a has to be 0 or R, L
            if (qId === 'chestQ3a' && (childQId === 'q3cValues' || childQId.indexOf('q3bChest') === 0 || childQId.indexOf('q3cChest') === 0)) {
                if (value === '0') {
                    checkValues = [];
                } else {
                    const zeroIndex = checkValues.indexOf('0');
                    if (zeroIndex !== -1) checkValues.splice(zeroIndex, 1);
                }
            }

            checkValues.push(value);
        } else {
            checkValues.splice(valueIndex, 1);
        }
        answerValue[qId][childQId] = checkValues;
        this.setState({answerValue: {...answerValue}}, () => {
            this.saveChestAnswer();
        });
    }

    onChangeChildValue(qId, childQId, value) {
        const {answerValue} = this.state;
        answerValue[qId][childQId] = value;
        this.setState({answerValue: {...answerValue}}, () => {
            this.saveChestAnswer();
        });
    }

    onChangeQuestion(qId, value) {
        const {answerValue} = this.state;
        if (answerValue[qId] === undefined || answerValue[qId].value !== value) {
            answerValue[qId] = {};
        }
        answerValue[qId].value = value;
        this.setState({answerValue: {...answerValue}}, () => {
            this.saveChestAnswer();
        });
    }

    renderCheckList(values, disabled, qId, childQId) {
        const {answerValue, truthValue} = this.state;
        const qTruths = (truthValue[qId] !== undefined && truthValue[qId][childQId] !== undefined) ? truthValue[qId][childQId] : [];
        let checkValues = (answerValue[qId] !== undefined && answerValue[qId][childQId] !== undefined) ? answerValue[qId][childQId] : [];
        if (checkValues === undefined) checkValues = [];
        return values.map((v, i) => (
            <QuestionLabel key={i} disabled={disabled} control={
                <QuestionCheckbox
                    icon={<span className={'chest-question-checkbox-icon ' + (qTruths.indexOf(v.value) !== -1 ? 'truth-icon' : '')}/>}
                    checkedIcon={<span className={'chest-question-checkbox-icon checked ' + (qTruths.indexOf(v.value) !== -1 ? 'truth-icon' : '')}/>}
                    disableRipple
                    checked={checkValues.indexOf(v.value) !== -1}
                    onChange={() => this.onChangeCheck(qId, childQId, v.value)}
                    name={childQId}
                />
            } label={v.label}
            />
        ));
    }

    renderAdditionalQuestion(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        if (answerValue[questionObj.id] === undefined && truthValue[questionObj.id] === undefined) return null;
        const answerExist = answerValue[questionObj.id] !== undefined && answerValue[questionObj.id].value !== undefined;
        const truthExist = truthValue[questionObj.id] !== undefined && truthValue[questionObj.id].value !== undefined;

        if (
            questionObj.showChildOptions && (
                (answerExist && questionObj.showChildOptions.indexOf(answerValue[questionObj.id].value) !== -1) ||
                (truthExist && questionObj.showChildOptions.indexOf(truthValue[questionObj.id].value) !== -1)
            )
        ) {
            return (
                <div className={'ml-3'}>
                    <div className={'chest-question-sub-desc'}>{questionObj.desc}</div>
                    <div className={'d-flex flex-column'}>
                        {
                            this.renderCheckList(questionObj.child.map((v) => ({label: v, value: v})), disabled, questionObj.id, 'childValue')
                        }
                    </div>
                </div>
            )
        }
    }

    renderQuestion(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] !== undefined ? truthValue[questionObj.id].value : '';
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <RadioGroup
                    className={'ml-4'}
                    aria-label="position"
                    name="position"
                    value={answerValue[questionObj.id] ? answerValue[questionObj.id].value : ''}
                    onChange={(event) => (disabled ? null : this.onChangeQuestion(questionObj.id, event.target.value))}
                    row
                    disabled={disabled}
                >
                    {
                        questionObj.options.map((v) => (
                            <QuestionLabel
                                key={v}
                                value={v}
                                control={
                                    questionTooltip[v] ?
                                        <Tooltip title={questionTooltip[v]} placement="bottom">
                                            <QuestionRadio
                                                icon={<span className={'chest-question-radio-icon ' + (qTruth === v ? 'truth-icon' : '')}/>}
                                                checkedIcon={<span className={'chest-question-radio-icon checked ' + (qTruth === v ? 'truth-icon' : '')}/>}
                                                disableRipple
                                            />
                                        </Tooltip> :
                                        <QuestionRadio
                                            icon={<span className={'chest-question-radio-icon ' + (qTruth === v ? 'truth-icon' : '')}/>}
                                            checkedIcon={<span className={'chest-question-radio-icon checked ' + (qTruth === v ? 'truth-icon' : '')}/>}
                                            disableRipple
                                        />
                                }
                                label={v}
                                labelPlacement="end"
                                disabled={disabled}
                            />
                        ))
                    }
                </RadioGroup>
                {this.renderAdditionalQuestion(questionObj, disabled)}
            </div>
        )
    }

    render() {
        const disabled = this.props.complete;
        return (
            <div className={'pl-10 covid-question-container chest-data'}>
                <div>
                    <div className={'covid-questions'}>
                        {
                            question.map(v => this.renderQuestion(v, disabled))
                        }
                    </div>
                </div>
            </div>
        )
    }
}


const QuestionLabel = withStyles(theme => ({
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
}))(FormControlLabel);

const QuestionRadio = withStyles(theme => ({
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
}))(Radio);

const QuestionCheckbox = withStyles(theme => ({
    root: {
        color: green[600],
        padding: 2,
        '&$checked': {
            color: green[500],
        },
        '&$disabled': {
            color: green[200],
        },
    },
    checked: {},
    disabled: {
        cursor: 'not-allowed'
    },
}))(Checkbox);
