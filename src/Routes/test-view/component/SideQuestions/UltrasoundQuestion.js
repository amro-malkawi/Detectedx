import React, {Component} from 'react'
import {Col, Input} from 'reactstrap';
import {RadioGroup} from "@mui/material";
import {QuestionLabel, QuestionRadio, QuestionCheckbox, CheckboxTooltip} from 'Components/SideQuestionComponents';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";

const question = [
    {
        id: 'ultrasoundQ1',
        label: '1. Appearance:',
        child: {
            'Define findings': {},
            'Normal appearances': {},
            'Mass / mass-like': {
                label: '1 A. Mass description',
                'a': {
                    label: 'a. Shape/Size',
                    options: ['Oval', 'Round', 'Irregular']
                },
                'b': {
                    label: 'b. Margin',
                    options: ['Circumscribed', 'Not circumscribed'],
                    dropList: ['Define', 'Indistinct', 'Angular', 'Microlobulated', 'Spiculated']
                },
                'c': {
                    label: 'c. Orientation',
                    options: ['Parallel', 'Not parallel']
                },
                'd': {
                    label: 'd. Echo pattern',
                    options: [['Anechoic', 'Hyperechoic', 'Hypoechoic'], ['Isoechoic', 'Heterogenous', 'Complex cyst/solid']]
                },
                'e': {
                    label: 'e. Posterior feature',
                    options: [['No features', 'Enhancement'], ['Shadowing', 'Combined pattern']]
                },
                'f': {
                    label: 'f. Associated features',
                    options: ['nil', 'other'],
                    dropList: ['Architectural distortion', 'Duct changes', 'Skin thickening', 'Vascularity', 'Calcification', 'Skin retraction', 'Oedema']
                }
            },
            'Calcification': {
                label: '1 A. Calcifications',
                rootOptions: ['In a mass', 'Not in a mass', 'Intraductal'],
                'a': {
                    label: 'a. Associated features',
                    options: ['nil', 'other'],
                    dropList: ['Architectural distortion', 'Duct changes', 'Vascularity']
                }
            },
            'Architectural distortion': {
                label: '1 A. Associated features',
                rootOptions: ['Unifocal', 'Multifocal'],
                'a': {
                    label: 'a. Associated features',
                    options: ['nil', 'other'],
                    dropList: ['Duct changes', 'Skin thickening', 'Skin retraction', 'Oedema', 'Vascularity', 'Calcification', 'Focal shadowing']
                }
            }
        }
    },
    {
        id: 'ultrasoundQ2',
        label: '2. Score',
        options: [['2'], ['3', '4', '5']]
    },
    {
        id: 'ultrasoundQ3',
        label: '3. Provisional Diagnosis',
        dropList: [
            'Simple cyst', 'Complex cyst', 'Fibrocystic change', 'Fibroadenoma', 'Fat necrosis', 'Post surgical change / scar / fluid collection',
            'Inflammatory change / abscess', 'Mass in/on skin', 'Papilloma', 'Normal-benign lymph node', 'Radial scar / Complex sclerosing lesion', 'Phyllodes ',
            'Invasive carcinoma', 'Suspicious calcifications / DCIS', 'Invasive lobular carcinoma', 'Malignant lymph node', 'Other'
        ]
    }
]

export default class UltrasoundQuestion extends Component {
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
        Apis.getAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then(resp => {
            this.setState({
                answerValue: resp.quality_answer,
                truthValue: resp.quality_truth,
            });
        }).catch(error => {

        });
    }

    saveChestAnswer() {
        if (!this.props.complete) {
            Apis.setAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, this.state.answerValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    getAnswerTruth(qId) {
        let questionAnswer, questionTruth;
        if (this.state.answerValue[qId] === undefined) {
            questionAnswer = {};
        } else {
            questionAnswer = this.state.answerValue[qId];
        }

        if (this.state.truthValue[qId] === undefined) {
            questionTruth = {};
        } else {
            questionTruth = this.state.truthValue[qId];
        }
        return {questionAnswer, questionTruth}
    }

    checkQuestionValidate() {
    }

    onChangeCheck(qId, childQId, value) {
        const {answerValue} = this.state;
        let checkValues = answerValue[qId][childQId];
        if (checkValues === undefined) checkValues = [];
        const valueIndex = checkValues.indexOf(value);
        if (valueIndex === -1) {
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

    onChangeRating(rating) {
    }

    renderCheckList(values, checkClass = '', disabled, qId, childQId) {
        const {answerValue, truthValue} = this.state;
        const qTruths = (truthValue[qId] !== undefined && truthValue[qId][childQId] !== undefined) ? truthValue[qId][childQId] : [];
        let checkValues = (answerValue[qId] !== undefined && answerValue[qId][childQId] !== undefined) ? answerValue[qId][childQId] : [];
        if (checkValues === undefined) checkValues = [];
        return values.map((v, i) => {
            if (!v.hover) {
                return (
                    <QuestionLabel key={i} className={checkClass} disabled={disabled} control={
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
                )
            } else {
                return (
                    <CheckboxTooltip title={v.hover} key={i}>
                        <QuestionLabel className={checkClass} disabled={disabled} control={
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
                    </CheckboxTooltip>
                )
            }
        })
    }

    renderOptionList(values, optionClass = '', disabled, qId, childQId, iconClass = 'chest-question-radio-icon') {
        const {truthValue} = this.state;
        const qTruth = (truthValue[qId] !== undefined && truthValue[qId][childQId] !== undefined) ? truthValue[qId][childQId] : [];
        return values.map((v, i) =>
            <QuestionLabel
                key={i}
                className={optionClass}
                value={v}
                control={
                    <QuestionRadio
                        icon={<span className={iconClass + ' ' + (qTruth === v ? 'truth-icon' : '')}/>}
                        checkedIcon={<span className={iconClass + ' checked ' + (qTruth === v ? 'truth-icon' : '')}/>}
                        disableRipple
                    />
                }
                label={v}
                labelPlacement="end"
                disabled={disabled}
            />
        )
    }

    renderQuestion1AdditionalMass(qId, disabled) {
        const subChildId = 'Mass / mass-like';
        const childAnswerObj = this.state.answerValue[qId];
        const childQuestionObj = question.find((v) => v.id === qId).child[subChildId];
        return (
            <div>
                <div className={'ms-1'}>{childQuestionObj.label}</div>
                {/* a */}
                <div className={'ms-3'}>
                    <div>{childQuestionObj['a'].label}</div>
                    <RadioGroup
                        className={'ms-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['a'] ? childAnswerObj['a'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'a', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['a'].options, '', false, qId, 'a')
                        }
                    </RadioGroup>
                </div>
                {/* b */}
                <div className={'ms-3'}>
                    <div>{childQuestionObj['b'].label}</div>
                    <RadioGroup
                        className={'ms-3 mt-1 flex-column'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['b'] ? childAnswerObj['b'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'b', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['b'].options, '', disabled, qId, 'b')
                        }
                    </RadioGroup>
                    {
                        childAnswerObj['b'] === childQuestionObj['b'].options[1] &&
                        <div className={'ms-50 me-30 mb-2'}>
                            <Input
                                type="select" className="chest-question-select"
                                value={childAnswerObj['b_drop'] ? childAnswerObj['b_drop'] : ''}
                                onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'b_drop', e.target.value))}
                                disabled={disabled}>
                                {
                                    childQuestionObj['b'].dropList.map((v) =>
                                        <option value={v} key={v}>{v}</option>
                                    )
                                }
                            </Input>
                        </div>
                    }
                </div>
                {/* c */}
                <div className={'ms-3'}>
                    <div>{childQuestionObj['c'].label}</div>
                    <RadioGroup
                        className={'ms-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['c'] ? childAnswerObj['c'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'c', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['c'].options, '', disabled, qId, 'c')
                        }
                    </RadioGroup>
                </div>
                {/* d */}
                <div className={'ms-3'}>
                    <div>{childQuestionObj['d'].label}</div>
                    <RadioGroup
                        className={'ms-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['d'] ? childAnswerObj['d'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'd', e.target.value))}
                        disabled
                        row
                    >
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['d'].options[0], '', disabled, qId, 'd')}
                        </div>
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['d'].options[1], '', disabled, qId, 'd')}
                        </div>
                    </RadioGroup>
                </div>
                {/* e */}
                <div className={'ms-3'}>
                    <div>{childQuestionObj['e'].label}</div>
                    <RadioGroup
                        className={'ms-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['e'] ? childAnswerObj['e'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'e', e.target.value))}
                        disabled
                        row
                    >
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['e'].options[0], '', disabled, qId, 'e')}
                        </div>
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['e'].options[1], '', disabled, qId, 'e')}
                        </div>
                    </RadioGroup>
                </div>
                {/* f */}
                <div className={'ms-3'}>
                    <div>{childQuestionObj['f'].label}</div>
                    <RadioGroup
                        className={'ms-3 mt-1 flex-column'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['f'] ? childAnswerObj['f'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'f', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['f'].options, '', disabled, qId, 'f')
                        }
                    </RadioGroup>
                    {
                        childAnswerObj['f'] === childQuestionObj['f'].options[1] &&
                        <div className={'ms-50 me-30 mb-2'}>
                            <Input
                                type="select" className="chest-question-select"
                                value={childAnswerObj['b_drop'] ? childAnswerObj['b_drop'] : ''}
                                onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'b_drop', e.target.value))}
                                disabled={disabled}>
                                {
                                    childQuestionObj['f'].dropList.map((v) =>
                                        <option value={v} key={v}>{v}</option>
                                    )
                                }
                            </Input>
                        </div>
                    }
                </div>
            </div>
        )
    }

    renderQuestion1AdditionalCalc(qId, disabled, subChildId) {
        // const subChildId = 'Calcification';
        const childAnswerObj = this.state.answerValue[qId];
        const childQuestionObj = question.find((v) => v.id === qId).child[subChildId];
        return (
            <div>
                <div className={'ms-1'}>{childQuestionObj.label}</div>
                <div className={'ms-3'}>
                    <RadioGroup
                        className={'ms-1 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['root'] ? childAnswerObj['root'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'root', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj.rootOptions, '', disabled, qId, 'root')
                        }
                    </RadioGroup>

                    <div className={'ms-3'}>
                        <div>{childQuestionObj['a'].label}</div>
                        <RadioGroup
                            className={'ms-3 mt-1 flex-column'}
                            aria-label="position"
                            name="position"
                            value={childAnswerObj['a'] ? childAnswerObj['a'] : ''}
                            onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'a', e.target.value))}
                            disabled
                            row
                        >
                            {
                                this.renderOptionList(childQuestionObj['a'].options, '', disabled, qId, 'a')
                            }
                        </RadioGroup>
                        {
                            childAnswerObj['a'] === childQuestionObj['a'].options[1] &&
                            <div className={'ms-50 me-30 mb-2'}>
                                <Input
                                    type="select" className="chest-question-select"
                                    value={childAnswerObj['b_drop'] ? childAnswerObj['b_drop'] : ''}
                                    onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'b_drop', e.target.value))}
                                    disabled={disabled}>
                                    {
                                        childQuestionObj['a'].dropList.map((v) =>
                                            <option value={v} key={v}>{v}</option>
                                        )
                                    }
                                </Input>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    renderQuestion1Additional(qId, disabled) {
        const answerObj = this.state.answerValue;
        if (!answerObj[qId] || !answerObj[qId].value || answerObj[qId].value === 'Define lesion') {
            return null;
        } else if (answerObj[qId].value === 'Mass / mass-like') {
            return this.renderQuestion1AdditionalMass(qId, disabled);
        } else if (answerObj[qId].value === 'Calcifications' || answerObj[qId].value === 'Architectural distortion') {
            return this.renderQuestion1AdditionalCalc(qId, disabled, answerObj[qId].value);
        }
    }

    renderQuestion1(disabled) {
        const qId = 'ultrasoundQ1';
        const {answerValue, truthValue} = this.state;
        const questionObj = question.find((v) => v.id === qId);
        const qTruth = truthValue[qId] !== undefined ? truthValue[qId].value : '';
        return (
            <div className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <div className={'ms-30 me-30 mt-10 mb-10'}>
                    <Input
                        type="select"
                        className="chest-question-select"
                        value={answerValue[qId] ? answerValue[qId].value : ''}
                        disabled={disabled}
                        onChange={(e) => (disabled ? null : this.onChangeQuestion(qId, e.target.value))}
                    >
                        {
                            Object.keys(questionObj.child).map((v) =>
                                <option value={v} key={v} className={qTruth === v ? {color: 'red'} : {}}>{v}</option>
                            )
                        }
                    </Input>
                </div>
                {
                    this.renderQuestion1Additional(qId, disabled)
                }
            </div>
        )
    }

    renderQuestion2(disabled) {
        const qId = 'ultrasoundQ2';
        const {answerValue, truthValue} = this.state;
        const questionObj = question.find((v) => v.id === qId);
        const qTruth = truthValue[qId] !== undefined ? truthValue[qId].value : '';
        return (
            <div className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <RadioGroup
                    disabled
                    aria-label="position"
                    name="position"
                    value={answerValue[qId] ? answerValue[qId].value : ''}
                    onChange={(e) => (disabled ? null : this.onChangeQuestion(qId, e.target.value))}
                    row
                >
                    <Col sm={4} className={'d-flex flex-column align-items-center'}>
                        <div className={'fs-15'} style={{marginBottom: 16}}>Benign (2)</div>
                        <QuestionLabel
                            value={questionObj.options[0][0]}
                            control={
                                <QuestionRadio
                                    icon={<span className={'chest-question-radio-icon ' + (qTruth === questionObj.options[0][0] ? 'truth-icon' : '')}/>}
                                    checkedIcon={<span className={'chest-question-radio-icon checked ' + (qTruth === questionObj.options[0][0] ? 'truth-icon' : '')}/>}
                                    disableRipple
                                />
                            }
                            label={questionObj.options[0][0]}
                            labelPlacement="end"
                            disabled={disabled}
                        />
                    </Col>
                    <Col sm={8}>
                        <div className={'fs-15'}>Assess (0)</div>
                        <div className={'fs-11'}><i>Please select your level of confidence</i></div>
                        <div className={'d-flex flex-row'}>
                            {
                                questionObj.options[1].map((v) =>
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
                                        disabled={disabled}
                                    />
                                )
                            }
                        </div>
                    </Col>
                </RadioGroup>
            </div>
        )
    }

    renderQuestion3(disabled) {
        const qId = 'ultrasoundQ3';
        const {answerValue, truthValue} = this.state;
        const questionObj = question.find((v) => v.id === qId);
        const qTruth = truthValue[qId] !== undefined ? truthValue[qId].value : '';
        return (
            <div className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <div className={'ms-20 mt-10'}>
                    <Input
                        type="select" className="chest-question-select"
                        value={answerValue[qId] ? answerValue[qId].value : ''}
                        onChange={(e) => (disabled ? null : this.onChangeQuestion(qId, e.target.value))}
                        disabled={disabled}>
                        {
                            questionObj.dropList.map((v) =>
                                <option value={v} key={v}>{v}</option>
                            )
                        }
                    </Input>
                </div>
            </div>
        )
    }

    render() {
        const disabled = this.props.complete;
        return (
            <div className={'ps-10 pe-20 covid-question-container chest-data'}>
                <div className={'covid-questions'}>
                    {this.renderQuestion1(disabled)}
                    {this.renderQuestion2(disabled)}
                    {this.renderQuestion3(disabled)}
                </div>
            </div>
        )
    }
}

