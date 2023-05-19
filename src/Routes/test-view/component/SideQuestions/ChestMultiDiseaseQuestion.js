import React, {Component} from 'react'
import {RadioGroup} from "@mui/material";
import {QuestionLabel, QuestionRadio, QuestionCheckbox, RatingRadio, RatingLabel, CheckboxTooltip, QuestionInput} from 'Components/SideQuestionComponents';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";


const question = [
    {
        id: 'chestMultiQ1',
        label: '1. Is this a completely normal study?',
        options: ['Yes', 'No']
    },
    {
        id: 'chestMultiQ2',
        label: '2. Which of the following have you identified?',
        child: [
            {
                id: 'q2Sub1',
                label: 'Aortic dissection',
                options: [
                    ['Ascending aorta', 'Descending aorta', 'Both ascending and descending aorta']
                ]
            },
            {
                id: 'q2Sub2',
                label: 'Pleural effusion',
                options: [['Right', 'Left', 'Bilateral'], ['Small', 'Medium', 'Large']]
            },
            {
                id: 'q2Sub3',
                label: 'Pneumonia',
                options: [['Right', 'Left', 'Bilateral'], ['Upper', 'Lower', 'Both']]
            },
            {
                id: 'q2Sub4',
                label: 'Pneumothorax',
                options: [['Right', 'Left', 'Bilateral'], ['Apical', 'Basal', 'Non-zone'], ['Small', 'Medium', 'Large']]
            },
            {
                id: 'q2Sub5',
                label: 'Pulmonary Embolism',
                options: [['Right', 'Left', 'Bilateral'], ['Main artery', 'Lobar artery', 'Segmental artery']]
            },
            {
                id: 'q2Sub6',
                label: 'Rib fracture',
                options: {
                    keys: ['Right', 'Left'],
                    values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                }
            },
            {
                id: 'q2Sub7',
                label: 'Co-existing finding',
            },
        ]
    }
]

const confidence1 = [
    {value: 5, label: 'Critical ', tooltip: ''},
    {value: 4, label: 'Emergent', tooltip: ''},
    {value: 3, label: 'Urgent', tooltip: ''},
    {value: 2, label: 'Lower acuity', tooltip: ''},
    {value: 1, label: 'Routine', tooltip: ''},
]

const confidence2 = [
    {value: 1, label: 'Completely', tooltip: ''},
    {value: 2, label: 'Fairly', tooltip: ''},
    {value: 3, label: 'Somewhat', tooltip: ''},
    {value: 4, label: 'Slightly', tooltip: ''},
    {value: 5, label: 'Not confident ', tooltip: ''}
]

export default class ChestMultiDiseaseQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            chest_rating: -1,
            answerRating2: -1,
            truthValue: {},
            truthRating1: -1,
            truthRating2: -1,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then(resp => {
            this.setState({
                answerValue: resp.chest_answer,
                chest_rating: resp.chest_answer.chest_rating !== undefined ? resp.chest_answer.chest_rating : -1,
                answerRating2: resp.chest_answer.answerRating2 !== undefined ? resp.chest_answer.answerRating2 : -1,
                truthValue: resp.chest_truth,
                truthRating1: resp.chest_truth.truthRating1 !== undefined ? Number(resp.chest_truth.truthRating1) : -1,
                truthRating2: resp.chest_truth.truthRating2 !== undefined ? Number(resp.chest_truth.truthRating2) : -1,
            });
        }).catch(error => {

        });
    }

    saveChestAnswer() {
        const answerValue = {...this.state.answerValue};
        answerValue.chest_rating = this.state.chest_rating;
        answerValue.answerRating2 = this.state.answerRating2;
        if (!this.props.complete) {
            Apis.setAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.state.chest_rating, answerValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    checkQuestionValidate() {
        const {chest_rating, answerRating2} = this.state;
        if (
            isNaN(chest_rating) || Number(chest_rating) < 0 || Number(chest_rating) > 5 ||
            isNaN(answerRating2) || Number(answerRating2) < 0 || Number(answerRating2) > 5
        ) {
            NotificationManager.error("Please select confidence number");
            return false;
        } else {
            return true;
        }
    }


    onChangeQuestion(qId, qChildId, qChildIndex, value) {
        const {answerValue} = this.state;
        if (!answerValue[qId]) answerValue[qId] = {};
        if (!qChildId) {
            answerValue[qId] = value;
        } else if (qChildIndex === null) {
            answerValue[qId][qChildId] = value;
        } else {
            if (!answerValue[qId][qChildId]) answerValue[qId][qChildId] = {};
            answerValue[qId][qChildId][qChildIndex] = value;
        }
        this.setState({answerValue: {...answerValue}}, () => {
            this.saveChestAnswer();
        });
    }

    onChangeQuestionCheck(qId, qChildId, qChildIndex, value) {
        const {answerValue} = this.state;
        if (!answerValue[qId]) answerValue[qId] = {};
        if (!answerValue[qId][qChildId]) answerValue[qId][qChildId] = {};
        if(!answerValue[qId][qChildId][qChildIndex]) answerValue[qId][qChildId][qChildIndex] = [];
        const index = answerValue[qId][qChildId][qChildIndex].indexOf(value);
        if(index !== -1) {
            answerValue[qId][qChildId][qChildIndex].splice(index, 1);
        } else {
            answerValue[qId][qChildId][qChildIndex].push(value);
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
        const qTruth = truthValue[questionObj.id] !== undefined ? truthValue[questionObj.id] : '';
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title mb-2'}>{questionObj.label}</div>
                <RadioGroup
                    className={'ms-4'}
                    aria-label="position"
                    name="position"
                    value={answerValue[questionObj.id] ? answerValue[questionObj.id] : ''}
                    onChange={(event) => (disabled ? null : this.onChangeQuestion(questionObj.id, null, null, event.target.value))}
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

    renderQuestion2(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] || {};
        if(!(answerValue && answerValue['chestMultiQ1'] === 'No') && !(truthValue && truthValue['chestMultiQ1'] === 'No')) return null;
        const questionAnswer = answerValue[questionObj.id];
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                {
                    questionObj.child.map((c, i) => (
                        <div className={c.id} key={c.id}>
                            <QuestionLabel key={i} className={'mt-2 ms-4'} disabled={disabled} control={
                                <QuestionCheckbox
                                    icon={<span className={'chest-question-checkbox-icon ' + (qTruth[c.id] ? 'truth-icon' : '')}/>}
                                    checkedIcon={<span className={'chest-question-checkbox-icon checked ' + (qTruth[c.id] ? 'truth-icon' : '')}/>}
                                    disableRipple
                                    checked={!!(questionAnswer && questionAnswer[c.id])}
                                    onChange={() => this.onChangeQuestion(questionObj.id, c.id, null, (questionAnswer && questionAnswer[c.id]) ? undefined : {})}
                                    name={c.id}
                                />
                            } label={c.label}/>
                            {
                                this.renderQ2Child(questionObj.id, c, disabled)
                            }
                        </div>
                    ))
                }
            </div>
        )
    }

    renderQ2Child(qId, child, disabled) {
        const qTruth = this.state.truthValue[qId] || {};
        const questionAnswer = this.state.answerValue[qId];
        if(!(questionAnswer && questionAnswer[child.id]) && !(qTruth && qTruth[child.id])) return null;
        switch (child.id) {
            case 'q2Sub5':
                return this.renderQ2Child5(qId, child.id, child.options, disabled);
            case 'q2Sub6':
                return this.renderQ2Child6(qId, child.id, child.options, disabled);
            case 'q2Sub7':
                return this.renderQ2Child7(qId, child.id, disabled);
            default:
                return this.renderQ2ChildNormal(qId, child.id, child.options, disabled);
        }
    }

    renderQ2ChildNormal(qId, cId, childOptions, disabled) {
        const qTruth = this.state.truthValue[qId] || {};
        const questionAnswer = this.state.answerValue[qId];
        return childOptions.map((co, i) => (
            <div className={'mb-2'} key={i}>
                <RadioGroup
                    className={'ms-40' + (childOptions.length === 1 ? ' flex-column' : '')}
                    aria-label="position"
                    name="position"
                    value={(questionAnswer && questionAnswer[cId] && questionAnswer[cId][i]) ? questionAnswer[cId][i] : ''}
                    onChange={(e) => this.onChangeQuestion(qId, cId, i, e.target.value)}
                    row
                    disabled={disabled}
                >
                    {
                        co.map((v) => (
                            <QuestionLabel
                                key={v}
                                value={v}
                                control={
                                    <QuestionRadio
                                        icon={<span className={'chest-question-radio-icon ' + ((qTruth[cId] && qTruth[cId][i] === v) ? 'truth-icon' : '')}/>}
                                        checkedIcon={<span className={'chest-question-radio-icon checked ' + ((qTruth[cId] && qTruth[cId][i] === v) ? 'truth-icon' : '')}/>}
                                        disableRipple
                                    />
                                }
                                label={v}
                                labelPlacement="end"
                                className='align-items-start mb-0'
                                disabled={disabled}
                            />
                        ))
                    }
                </RadioGroup>
            </div>
        ));
    }

    renderQ2Child5(qId, cId, childOptions, disabled) {
        const qTruth = this.state.truthValue[qId] || {};
        const questionAnswer = this.state.answerValue[qId];
        return (
            <div className={'mb-2'}>
                <RadioGroup
                    className={'ms-40' + (childOptions.length === 1 ? ' flex-column' : '')}
                    aria-label="position"
                    name="position"
                    value={(questionAnswer && questionAnswer[cId] && questionAnswer[cId][0]) ? questionAnswer[cId][0] : ''}
                    onChange={(e) => this.onChangeQuestion(qId, cId, 0, e.target.value)}
                    row
                    disabled={disabled}
                >
                    {
                        childOptions[0].map((v) => (
                            <QuestionLabel
                                key={v}
                                value={v}
                                control={
                                    <QuestionRadio
                                        icon={<span className={'chest-question-radio-icon ' + ((qTruth[cId] && qTruth[cId][0] === v) ? 'truth-icon' : '')}/>}
                                        checkedIcon={<span className={'chest-question-radio-icon checked ' + ((qTruth[cId] && qTruth[cId][0] === v) ? 'truth-icon' : '')}/>}
                                        disableRipple
                                    />
                                }
                                label={v}
                                labelPlacement="end"
                                className='align-items-start mb-0'
                                disabled={disabled}
                            />
                        ))
                    }
                </RadioGroup>
                <div className={'ms-40'}>
                    {
                        childOptions[1].map((v) => (
                            <QuestionLabel key={v} className={'me-1'} disabled={disabled} control={
                                <QuestionCheckbox
                                    icon={<span className={'chest-question-checkbox-icon ' + ((qTruth[cId] && qTruth[cId][1] && qTruth[cId][1].indexOf(v) !== -1) ? 'truth-icon' : '')}/>}
                                    checkedIcon={<span className={'chest-question-checkbox-icon checked ' + ((qTruth[cId] && qTruth[cId][1] && qTruth[cId][1].indexOf(v) !== -1) ? 'truth-icon' : '')}/>}
                                    disableRipple
                                    checked={(questionAnswer && questionAnswer[cId] && questionAnswer[cId][1]) ? questionAnswer[cId][1].indexOf(v) !== -1 : false}
                                    onChange={() => this.onChangeQuestionCheck(qId, cId, 1, v)}
                                    name={v}
                                />
                            } label={v}/>
                        ))
                    }
                </div>
            </div>
        );
    }

    renderQ2Child6(qId, cId, childOptions, disabled) {
        const qTruth = this.state.truthValue[qId] || {};
        const questionAnswer = this.state.answerValue[qId];
        return childOptions.keys.map((co, i) => (
            <div className={'mb-2'} key={i}>
                <div className={'ms-40'}>{co}</div>
                <div className={'ms-40'}>
                    {
                        childOptions.values.map((v) => (
                            <QuestionLabel className={''} key={v} disabled={disabled} control={
                                <QuestionCheckbox
                                    icon={<span className={'chest-question-checkbox-icon ' + ((qTruth[cId] && qTruth[cId][co] && qTruth[cId][co].indexOf(v) !== -1) ? 'truth-icon' : '')}/>}
                                    checkedIcon={<span className={'chest-question-checkbox-icon checked ' + ((qTruth[cId] && qTruth[cId][co] && qTruth[cId][co].indexOf(v) !== -1) ? 'truth-icon' : '')}/>}
                                    disableRipple
                                    checked={(questionAnswer && questionAnswer[cId] && questionAnswer[cId][co]) ? questionAnswer[cId][co].indexOf(v) !== -1 : false}
                                    onChange={() => this.onChangeQuestionCheck(qId, cId, co, v)}
                                    name={v}
                                />
                            } label={v}/>
                        ))
                    }
                </div>
            </div>
        ));
    }

    renderQ2Child7(qId, cId, disabled) {
        const qTruth = this.state.truthValue[qId] || {};
        const questionAnswer = this.state.answerValue[qId];
        return (
            <div className={'ms-40'}>
                <QuestionInput
                    id="q1OtherText"
                    value={(questionAnswer && questionAnswer[cId] && questionAnswer[cId]['text']) ? questionAnswer[cId]['text'] : ''}
                    onChange={(e) => this.onChangeQuestion(qId, cId, 'text', e.target.value)}
                    disabled={disabled}
                />
                <span className={'text-red ms-1 fs-13'}>{qTruth[cId] && qTruth[cId]['text']}</span>
            </div>
        )
    }

    render() {
        const {chest_rating, truthRating1, answerRating2, truthRating2} = this.state;
        const disabled = this.props.complete;
        return (
            <div className={'ps-10 covid-question-container chest-data'}>
                <div>
                    <p className={'covid-question-title ms-3 me-3'}>
                        Questions
                    </p>
                    <div className={'covid-questions'}>
                        {this.renderQuestion(question[0], disabled)}
                        {this.renderQuestion2(question[1], disabled)}
                    </div>
                    <div className={'covid-confidence'}>
                        <p>How would you classify the urgency of this examination?</p>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={chest_rating !== undefined ? chest_rating.toString() : ''}
                            onChange={(event) => this.onChangeRating('chest_rating', event.target.value)}
                            row
                            className={'justify-content-center mt-0'}
                        >
                            {
                                confidence1.map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <CheckboxTooltip title={v.tooltip} key={i}>
                                            <RatingLabel
                                                key={i}
                                                value={v.value.toString()}
                                                control={
                                                    <RatingRadio
                                                        icon={<span className={'chest-question-rating-radio-icon ' + (truthRating1 === v.value ? 'truth-icon' : '')}/>}
                                                        checkedIcon={<span className={'chest-question-rating-radio-icon checked ' + (truthRating1 === v.value ? 'truth-icon' : '')}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={v.label}
                                                disabled={disabled}
                                            />
                                        </CheckboxTooltip>
                                    )
                                })
                            }
                        </RadioGroup>
                        <p>How confident are you of your assessment?</p>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={answerRating2 !== undefined ? answerRating2.toString() : ''}
                            onChange={(event) => this.onChangeRating('answerRating2', event.target.value)}
                            row
                            className={'justify-content-center mt-0'}
                        >
                            {
                                confidence2.map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <CheckboxTooltip title={v.tooltip} key={i}>
                                            <RatingLabel
                                                key={i}
                                                value={v.value.toString()}
                                                control={
                                                    <RatingRadio
                                                        icon={<span className={'chest-question-rating-radio-icon ' + (truthRating2 === v.value ? 'truth-icon' : '')}/>}
                                                        checkedIcon={<span className={'chest-question-rating-radio-icon checked ' + (truthRating2 === v.value ? 'truth-icon' : '')}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={v.label}
                                                disabled={disabled}
                                            />
                                        </CheckboxTooltip>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>
            </div>
        )
    }
}
