import React, {Component} from 'react'
import {RadioGroup} from "@mui/material";
import {QuestionLabel, QuestionRadio, CheckboxTooltip} from 'Components/SideQuestionComponents';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";


const question = [
    {
        id: 'wbctQ1',
        label: 'Q1: Do you see fractures',
        options: [
            'No fracture or bony injury present',
            'Yes, MARK FRACTURE if present',
        ]
    },
    {
        id: 'wbctQ3',
        label: 'Q2: Scoring of the following features on a five-point scale ranging from 1 (very poor) to 5 (excellent)',
        child: [
            {
                id: 'wbctQ3_C1',
                label: 'visualization of cortical bone structures',
                options: [
                    {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {value: "5", hover: 'excellent'}
                ]
            },
            {
                id: 'wbctQ3_C2',
                label: 'visualization of  trabecular bone structures',
                options: [
                    {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {value: "5", hover: 'excellent'}
                ]
            },
            {
                id: 'wbctQ3_C3',
                label: 'visualization of metaphyseal bone structures',
                options: [
                    {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {value: "5", hover: 'excellent'}
                ]
            },
            {
                id: 'wbctQ3_C4',
                label: 'visualization of joints',
                options: [
                    {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {value: "5", hover: 'excellent'}
                ]
            },
            {
                id: 'wbctQ3_C5',
                label: 'visualization of acute fracture/s (if present)',
                options: [
                    {value: "0", hover: '(N/A)'}, {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {
                        value: "5",
                        hover: 'excellent'
                    }
                ]
            },
            {
                id: 'wbctQ3_C6',
                label: 'visualization of old fracture/s (if present)',
                options: [
                    {value: "0", hover: '(N/A)'}, {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {
                        value: "5",
                        hover: 'excellent'
                    }
                ]
            },
            {
                id: 'wbctQ3_C7',
                label: 'visualization of callus formation or healing fracture/s (if present)',
                options: [
                    {value: "0", hover: '(N/A)'}, {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {
                        value: "5",
                        hover: 'excellent'
                    }
                ]
            },
            {
                id: 'wbctQ3_C8',
                label: 'noise texture (to determine noise interference with image interpretation)',
                options: [
                    {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {value: "5", hover: 'excellent'}
                ]
            },
            {
                id: 'wbctQ3_C9',
                label: 'overall image quality',
                options: [
                    {value: "1", hover: 'very poor'}, {value: "2", hover: 'poor'}, {value: "3", hover: 'acceptable'}, {value: "4", hover: 'very good'}, {value: "5", hover: 'excellent'}
                ]
            },
        ]
    },
    {
        id: 'wbctQ2',
        label: 'Q3: Findings suggestive of: ',
        options: [
            'Rickets',
            'Renal disease',
            'Scurvy',
            'Metabolic disease of premiturity',
            'Osteogensis Imperfecta',
            'Wormian bones',
            'Osteoporosis, including genetic types',
            'Radiological evidence of soft tissue injury',
            'NAI / SPA / inflicted abuse',
        ]
    },
    {
        id: 'wbctQ4',
        label: 'Q4: Confidence this case is suspicious for NAI/SPA',
        options: [
            {value: "0", hover: 'Absolutely confident that this case is NOT suspicious for NAI'},
            {value: "1", hover: 'Very confident that this case is NOT suspicious for NAI'},
            {value: "2", hover: 'Quite confident that this case is NOT suspicious for NAI'},
            {value: "3", hover: 'Quite confident that this case is suspicious for NAI'},
            {value: "4", hover: 'Very confident that this case is suspicious for NAI'},
            {value: "5", hover: 'Absolutely confident that this case is suspicious for NAI'}
        ]
    },
    {
        id: 'wbctQ5',
        label: 'Q5: Confidence that no bony injuries have been missed due to excessive noise',
        options: [
            {value: "0", hover: 'Absolutely confident that I have missed any bony injuries due to excessive noise present in the bony images'},
            {value: "1", hover: 'Very confident that I have missed any bony injuries due to excessive noise present in the bony images'},
            {value: "2", hover: 'Quite confident that I have missed bony injuries due to excessive noise present in the bony images'},
            {value: "3", hover: "Quite confident that I haven't missed any bony injuries due to excessive noise present in the bony images"},
            {value: "4", hover: "Very confident that I haven't missed any bony injuries due to excessive noise present in the bony images"},
            {value: "5", hover: 'Absolutely confident that I havent missed any bony injuries due to excessive noise present in the bony images'}
        ]
    },
]

export default class WBCTQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            truthValue: {},
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
        const answerValue = {...this.state.answerValue};
        if (!this.props.complete) {
            Apis.setAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, 0, answerValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    checkQuestionValidate() {
        return true;
    }

    onChangeQuestion(qId, qChildId, value) {
        const {answerValue} = this.state;
        if (!answerValue[qId]) answerValue[qId] = {};
        if (qChildId && !answerValue[qId][qChildId]) answerValue[qId][qChildId] = {};
        if (!qChildId) {
            answerValue[qId].value = value;
        } else {
            answerValue[qId][qChildId].value = value;
        }
        this.setState({answerValue: {...answerValue}}, () => {
            this.saveChestAnswer();
        });
    }

    onChangeRating(key, rating) {
        this.setState({[key]: rating}, () => {
            this.saveChestAnswer();
        });
    }

    renderQuestion(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] !== undefined ? truthValue[questionObj.id].value : '';
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title mb-2'}>{questionObj.label}</div>
                <RadioGroup
                    className={'ms-4 ' + (questionObj.options.length !== 6 ? 'flex-column' : 'flex-row')}
                    aria-label="position"
                    name="position"
                    value={answerValue[questionObj.id] ? answerValue[questionObj.id].value : ''}
                    onChange={(event) => (disabled ? null : this.onChangeQuestion(questionObj.id, null, event.target.value))}
                    row
                    disabled={disabled}
                >
                    {
                        questionObj.options.map((v) =>
                            !v.hover ?
                                <QuestionLabel
                                    key={v}
                                    value={v}
                                    control={
                                        <QuestionRadio
                                            icon={<span className={'chest-question-radio-icon ' + (qTruth === v ? 'truth-icon' : '')}/>}
                                            checkedIcon={<span className={'chest-question-radio-icon checked ' + (qTruth === v ? 'truth-icon' : '')}/>}
                                            disableRipple
                                        />
                                    }
                                    label={v}
                                    labelPlacement="end"
                                    className='align-items-start'
                                    disabled={disabled}
                                /> :
                                <CheckboxTooltip title={v.hover} key={v.value}>
                                    <QuestionLabel
                                        value={v.value}
                                        control={
                                            <QuestionRadio
                                                icon={<span className={'chest-question-radio-icon ' + (qTruth === v.value ? 'truth-icon' : '')}/>}
                                                checkedIcon={<span className={'chest-question-radio-icon checked ' + (qTruth === v.value ? 'truth-icon' : '')}/>}
                                                disableRipple
                                            />
                                        }
                                        label={v.value}
                                        labelPlacement="end"
                                        className='align-items-start'
                                        disabled={disabled}
                                    />
                                </CheckboxTooltip>
                        )
                    }
                </RadioGroup>
            </div>
        )
    }

    renderQuestion2(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] || {};
        console.log(qTruth, 'qTruth')
        const questionAnswer = answerValue[questionObj.id];
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                {
                    questionObj.child.map((c, i) => (
                        <div className={c.id} key={c.id}>
                            <div className={'mt-2 ms-4 fs-14'}>{c.label}</div>
                            <RadioGroup
                                className={'ms-40'}
                                aria-label="position"
                                name="position"
                                value={(questionAnswer && questionAnswer[c.id]) ? questionAnswer[c.id].value : ''}
                                onChange={(e) => (disabled ? null : this.onChangeQuestion(questionObj.id, c.id, e.target.value))}
                                row
                                disabled={false}
                            >
                                {
                                    c.options.map((v) => (
                                        <CheckboxTooltip title={v.hover} key={v.value}>
                                            <QuestionLabel
                                                value={v.value}
                                                control={
                                                    <QuestionRadio
                                                        icon={<span className={'chest-question-radio-icon ' + ((qTruth[c.id] && qTruth[c.id].value === v.value) ? 'truth-icon' : '')}/>}
                                                        checkedIcon={<span className={'chest-question-radio-icon checked ' + ((qTruth[c.id] && qTruth[c.id].value === v.value) ? 'truth-icon' : '')}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={v.value}
                                                labelPlacement="end"
                                                className='align-items-start mb-0'
                                                disabled={disabled}
                                            />
                                        </CheckboxTooltip>
                                    ))
                                }
                            </RadioGroup>
                        </div>
                    ))
                }
            </div>
        )

    }

    render() {
        const disabled = this.props.complete;
        return (
            <div className={'ps-10 covid-question-container chest-data'}>
                <div>
                    <p className={'covid-question-title ms-3 me-3'}>
                        Questions
                    </p>
                    <div className={'covid-questions'}>
                        {
                            question.map((v, i) => (i !== 1 ? this.renderQuestion(v, disabled) : this.renderQuestion2(v, disabled)))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

