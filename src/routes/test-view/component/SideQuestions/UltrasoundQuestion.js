import React, {Component} from 'react'
import {Col, Input} from 'reactstrap';
import {Checkbox, FormControlLabel, RadioGroup, Radio, Tooltip, InputBase} from "@material-ui/core";
import green from '@material-ui/core/colors/green';
import {fade, withStyles} from '@material-ui/core/styles';
import yellow from "@material-ui/core/colors/yellow";
import red from "@material-ui/core/colors/red";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";

const question = [
    {
        id: 'ultrasoundQ1',
        label: '1. Appearance:',
        child: {
            'Define lesion': {},
            'Mass': {
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
                    options: [['Architectural distortion', 'Duct changes', 'Skin thickening'], ['Vascularity', 'Calcification', 'Simple cyst']]
                }
            },
            'Calcification': {
                label: '1 A. Calcifications',
                rootOptions: ['In a mass', 'Not in a mass', 'Intraductal'],
                'a': {
                    label: 'a. Associated features',
                    options: [['Architectural distortion', 'Duct changes', 'Skin thickening'], ['Vascularity', 'Skin retraction', 'Oedema']]
                }
            },
            'Architectual distortion': {
                label: '1 A. Associated features',
                options: [['Duct changes', 'Skin thickening', 'Skin retraction', 'Oedema'], ['Vascularity', 'Calcification', 'Focal shadowing']]
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
        label: '3. Diagnosis',
        options: [['Scar', 'Fibroadenoma', 'Fat necrosis', 'Mass in or on skin', 'AVM', 'Mondor disease'],
            ['Simple cyst', 'Complex cyst', 'Clustered cysts/ fibrocystic change', 'Postsurgical fluid collection', 'Foreign body (including implants)', 'Intramammary lymph node']]
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
        return;
        if (!this.props.complete) {
            Apis.setAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, this.state.answerValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    getAnswerTruth(qId) {
        let questionAnswer, questionTruth;
        if(this.state.answerValue[qId] === undefined) {
            questionAnswer = {};
        } else {
            questionAnswer = this.state.answerValue[qId];
        }

        if(this.state.truthValue[qId] === undefined) {
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
            // chestQ3a/chestQ3a has to be 0 or R, L
            if( qId === 'chestQ3a' && (childQId === 'q3cValues' || childQId.indexOf('q3bChest') === 0 || childQId.indexOf('q3cChest') === 0)) {
                if(value === '0') {
                    checkValues = [];
                } else {
                    const zeroIndex = checkValues.indexOf('0');
                    if(zeroIndex !== -1) checkValues.splice(zeroIndex, 1);
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
        if(answerValue[qId] === undefined || answerValue[qId].value !== value) {
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

    renderOptionList(values, optionClass = '', disabled, qId, childQId, iconClass='chest-question-radio-icon') {
        const {truthValue} = this.state;
        const qTruth = (truthValue[qId] !== undefined && truthValue[qId][childQId] !== undefined) ? truthValue[qId][childQId] : [];
        return values.map((v, i) =>
            <QuestionLabel
                key={i}
                className={optionClass}
                value={v}
                control={
                    <QuestionRadio
                        icon={<span className={ iconClass + ' ' + (qTruth === v ? 'truth-icon' : '')}/>}
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
        const subChildId = 'Mass';
        const childAnswerObj = this.state.answerValue[qId];
        const childQuestionObj = question.find((v) => v.id === qId).child[subChildId];
        return (
            <div>
                <div className={'ml-1'}>{childQuestionObj.label}</div>
                {/* a */}
                <div className={'ml-3'}>
                    <div>{childQuestionObj['a'].label}</div>
                    <RadioGroup
                        className={'ml-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['a'] ? childAnswerObj['a'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'a', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['a'].options, '', false)
                        }
                    </RadioGroup>
                </div>
                {/* b */}
                <div className={'ml-3'}>
                    <div>{childQuestionObj['b'].label}</div>
                    <RadioGroup
                        className={'ml-3 mt-1 flex-column'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['b'] ? childAnswerObj['b'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'b', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['b'].options, '', disabled)
                        }
                    </RadioGroup>

                    <div className={'ml-50 mr-30 mb-2'}>
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
                </div>
                {/* c */}
                <div className={'ml-3'}>
                    <div>{childQuestionObj['c'].label}</div>
                    <RadioGroup
                        className={'ml-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['c'] ? childAnswerObj['c'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'c', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj['c'].options, '', disabled)
                        }
                    </RadioGroup>
                </div>
                {/* d */}
                <div className={'ml-3'}>
                    <div>{childQuestionObj['d'].label}</div>
                    <RadioGroup
                        className={'ml-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['d'] ? childAnswerObj['d'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'd', e.target.value))}
                        disabled
                        row
                    >
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['d'].options[0], '', disabled)}
                        </div>
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['d'].options[1], '', disabled)}
                        </div>
                    </RadioGroup>
                </div>
                {/* e */}
                <div className={'ml-3'}>
                    <div>{childQuestionObj['e'].label}</div>
                    <RadioGroup
                        className={'ml-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['e'] ? childAnswerObj['e'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'e', e.target.value))}
                        disabled
                        row
                    >
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['e'].options[0], '', disabled)}
                        </div>
                        <div className={'col d-flex flex-column p-0'}>
                            {this.renderOptionList(childQuestionObj['e'].options[1], '', disabled)}
                        </div>
                    </RadioGroup>
                </div>
                {/* f */}
                <div className={'ml-3'}>
                    <div>{childQuestionObj['f'].label}</div>
                    <div className={'d-flex flex-row ml-3 mt-1'}>
                        <div className={'col d-flex flex-column p-0'} style={{flex: 3}}>
                            {this.renderCheckList(childQuestionObj['f'].options[0].map((v) => ({label: v, value: v})), '', disabled, qId, 'f')}
                        </div>
                        <div className={'col d-flex flex-column p-0'} style={{flex: 2}}>
                            {this.renderCheckList(childQuestionObj['f'].options[1].map((v) => ({label: v, value: v})), '', disabled, qId, 'f')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderQuestion1AdditionalCalc(qId, disabled) {
        const subChildId = 'Calcification';
        const childAnswerObj = this.state.answerValue[qId];
        const childQuestionObj = question.find((v) => v.id === qId).child[subChildId];
        return (
            <div>
                <div className={'ml-1'}>{childQuestionObj.label}</div>
                <div className={'ml-3'}>
                    <RadioGroup
                        className={'ml-1 mt-1'}
                        aria-label="position"
                        name="position"
                        value={childAnswerObj['root'] ? childAnswerObj['root'] : ''}
                        onChange={(e) => (disabled ? null : this.onChangeChildValue(qId, 'root', e.target.value))}
                        disabled
                        row
                    >
                        {
                            this.renderOptionList(childQuestionObj.rootOptions, '', disabled)
                        }
                    </RadioGroup>
                    <div>{childQuestionObj['a'].label}</div>
                    <div className={'d-flex flex-row ml-3 mt-1'}>
                        <div className={'col d-flex flex-column p-0'} style={{flex: 3}}>
                            {this.renderCheckList(childQuestionObj['a'].options[0].map((v) => ({label: v, value: v})), '', disabled, qId, 'a')}
                        </div>
                        <div className={'col d-flex flex-column p-0'} style={{flex: 2}}>
                            {this.renderCheckList(childQuestionObj['a'].options[1].map((v) => ({label: v, value: v})), '', disabled, qId, 'a')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderQuestion1AdditionalArch(qId, disabled) {
        const subChildId = 'Architectual distortion';
        const childAnswerObj = this.state.answerValue[qId];
        const childQuestionObj = question.find((v) => v.id === qId).child[subChildId];
        return (
            <div>
                <div className={'ml-1'}>{childQuestionObj.label}</div>
                <div className={'d-flex flex-row ml-3 mt-1'}>
                    <div className={'col d-flex flex-column p-0'}>
                        {this.renderCheckList(childQuestionObj.options[0].map((v) => ({label: v, value: v})), '', disabled, qId, 'root')}
                    </div>
                    <div className={'col d-flex flex-column p-0'}>
                        {this.renderCheckList(childQuestionObj.options[1].map((v) => ({label: v, value: v})), '', disabled, qId, 'root')}
                    </div>
                </div>
            </div>
        )
    }

    renderQuestion1Additional(qId, disabled) {
        const answerObj = this.state.answerValue;
        if(!answerObj[qId] || !answerObj[qId].value || answerObj[qId].value === 'Define lesion') {
            return null;
        } else if (answerObj[qId].value === 'Mass') {
            return this.renderQuestion1AdditionalMass(qId, disabled);
        } else if (answerObj[qId].value === 'Calcification') {
            return this.renderQuestion1AdditionalCalc(qId, disabled);
        } else if (answerObj[qId].value === 'Architectual distortion') {
            return this.renderQuestion1AdditionalArch(qId, disabled);
        }
    }

    renderQuestion1(disabled) {
        const qId = 'ultrasoundQ1';
        const answerObj = this.state.answerValue;
        const questionObj = question.find((v) => v.id === qId);
        return (
            <div className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <div className={'ml-30 mr-30 mt-10 mb-10'}>
                    <Input
                        type="select"
                        className="chest-question-select"
                        value={answerObj[qId] ? answerObj[qId].value : ''}
                        disabled={disabled}
                        onChange={(e) => (disabled ? null : this.onChangeQuestion(qId, e.target.value))}
                    >
                        {
                            Object.keys(questionObj.child).map((v) =>
                                <option value={v} key={v}>{v}</option>
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
        const answerObj = this.state.answerValue;
        const questionObj = question.find((v) => v.id === qId);
        return (
            <div className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <RadioGroup
                    disabled
                    aria-label="position"
                    name="position"
                    value={answerObj[qId] ? answerObj[qId].value : ''}
                    onChange={(e) => (disabled ? null : this.onChangeQuestion(qId, e.target.value))}
                    row
                >
                    <Col sm={4} className={'d-flex flex-column align-items-center'}>
                        <div className={'fs-15'} style={{marginBottom: 16}}>Benign (2)</div>
                        <QuestionLabel
                            value={questionObj.options[0][0]}
                            control={
                                <QuestionRadio
                                    icon={<span className={'chest-question-radio-icon'}/>}
                                    checkedIcon={<span className={'chest-question-radio-icon checked'}/>}
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
                                                icon={<span className={'chest-question-radio-icon'}/>}
                                                checkedIcon={<span className={'chest-question-radio-icon checked'}/>}
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
        const answerObj = this.state.answerValue;
        const questionObj = question.find((v) => v.id === qId);
        return (
            <div className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.label}</div>
                <RadioGroup
                    className={'ml-3'}
                    disabled
                    aria-label="position"
                    name="position"
                    value={answerObj[qId] ? answerObj[qId].value : ''}
                    onChange={(e) => (disabled ? null : this.onChangeQuestion(qId, e.target.value))}
                    row
                >
                    <div className={'col d-flex flex-column p-0'} style={{flex: 2}}>
                        {this.renderOptionList(questionObj.options[0], '', disabled)}
                    </div>
                    <div className={'col d-flex flex-column p-0'} style={{flex: 3}}>
                        {this.renderOptionList(questionObj.options[1], '', disabled)}
                    </div>
                </RadioGroup>
            </div>
        )
    }

    render() {
        const disabled = this.props.complete;
        return (
            <div className={'pl-10 covid-question-container chest-data'}>
                <div>
                    <div className={'covid-questions'}>
                        {this.renderQuestion1(disabled)}
                        {this.renderQuestion2(disabled)}
                        {this.renderQuestion3(disabled)}
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

const QuestionInput = withStyles((theme) => ({
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
            boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
    disabled: {
        cursor: 'not-allowed'
    },
}))(InputBase);

const RatingRadio = withStyles(theme => ({
    root: {
        color: yellow[600],
        '&$checked': {
            color: yellow[500],
        },
        '&$disabled': {
            color: yellow[200],
        },
    },
    checked: {},
    disabled: {
        cursor: 'not-allowed'
    },
}))(Radio);


const RatingLabel = withStyles(theme => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&$disabled': {
            color: yellow[200],
        },
    },
    disabled: {
        cursor: 'not-allowed'
    },
}))(FormControlLabel);

const CheckboxTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);
