import React, {Component} from 'react'
import {RadioGroup} from "@mui/material";
import {QuestionLabel, QuestionRadio, QuestionCheckbox, RatingRadio, RatingLabel, CheckboxTooltip, QuestionInput} from 'Components/SideQuestionComponents';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";


const question = [
    {
        id: 'linEDQ1',
        label: 'Choose the line that is visible.',
        options: [
            'Central Venous Catheter',
            'Mitral Valve Replacement',
            'Peripherally Inserted Central Catheter',
            'Nasogastric Tube',
            'Pulmonary Artery Catheters',
            'Intra pleural catheters',
            'Tracheostomy',
            'Automatic Implanted Cardiac Defibrillator',
            'Aortic Valve Replacement',
            'Temporary Pacing Wire',
            'Intra-aortic Balloon Pump',
            'Implanted Venous Port/Central Venous Access Device',
            'Tunnelled Dialysis Catheter',
            'Jejunal Feeding Tube',
            'Dual Lumen Implanted Venous Port'
        ]
    },
]

export default class LinEDQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            answerRating: -1,
            truthValue: {},
            truthRating: -1
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then(resp => {
            this.setState({
                answerValue: resp.chest_answer,
                answerRating: resp.chest_answer_rating,
                truthValue: resp.chest_truth,
                truthRating: resp.chest_truth_rating
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
        const {answerRating} = this.state;
        if (isNaN(answerRating) || Number(answerRating) < 0 || Number(answerRating) > 5) {
            NotificationManager.error("Please select confidence number");
            return false;
        } else {
            return true;
        }
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

    onChangeRating(rating) {
        this.setState({answerRating: rating}, () => {
            this.saveChestAnswer();
        });
    }

    renderQuestion(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] !== undefined ? truthValue[questionObj.id].value : '';
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <RadioGroup
                    className={'ms-4 flex-column'}
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
                            />
                        ))
                    }
                </RadioGroup>
            </div>
        )
    }

    render() {
        const {answerRating, truthRating} = this.state;
        const disabled = this.props.complete;
        return (
            <div className={'ps-10 covid-question-container chest-data'}>
                <div>
                    <p className={'covid-question-title ms-3 me-3'}>
                        Please answer the below questions regarding the line that has been pointed out.
                    </p>
                    <div className={'covid-questions'}>
                        {
                            this.renderQuestion(question[0], disabled)
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        <p>This line is in the correct position:</p>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={answerRating !== undefined ? answerRating.toString() : ''}
                            onChange={(event) => this.onChangeRating(event.target.value)}
                            row
                            className={'justify-content-center mt-0'}
                        >
                            {
                                [
                                    {value: 0, tooltip: 'Absolutely not'}, {value: 1, tooltip: 'Probably not'}, {value: 2, tooltip: 'Possibly not'},
                                    {value: 3, tooltip: 'Possibly yes'}, {value: 4, tooltip: 'Probably yes'}, {value: 5, tooltip: 'Absolutely yes'}
                                ].map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <CheckboxTooltip title={v.tooltip} key={i}>
                                            <RatingLabel
                                                key={i}
                                                value={v.value.toString()}
                                                control={
                                                    <RatingRadio
                                                        icon={<span className={'chest-question-rating-radio-icon ' + (truthRating === v.value ? 'truth-icon' : '')}/>}
                                                        checkedIcon={<span className={'chest-question-rating-radio-icon checked ' + (truthRating === v.value ? 'truth-icon' : '')}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={v.value}
                                                disabled={disabled}
                                            />
                                        </CheckboxTooltip>
                                    )
                                })
                            }
                        </RadioGroup>
                        <span className={'fs-14 mt-0 ms-2'} style={{color: '#b3b3b3'}}>Completely Disagree to Completely Agree</span>
                    </div>
                </div>
            </div>
        )
    }
}

