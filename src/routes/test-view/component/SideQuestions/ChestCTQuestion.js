import React, {Component} from 'react'
import {Checkbox, FormControlLabel, RadioGroup, Radio, Tooltip} from "@material-ui/core";
import green from '@material-ui/core/colors/green';
import {withStyles} from '@material-ui/core/styles';
import yellow from "@material-ui/core/colors/yellow";
import red from "@material-ui/core/colors/red";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";


const question = [
    {
        id: 'chestCTQ1',
        label: 'Diffuse well rounded opacities?',
        options: ['Yes', 'No'],
        child: {
            q1Sub1: {
                aOptions: ['P =< 1.5mm', 'Q = 1.5-3mm', 'R => 3-10mm'],
                bOptions: ['NO', 'YES'],
            },
            q1Sub2: {
                aOptions: ['U', 'M', 'L'],
                bOptions: ['R', 'L'],
                cOptions: [
                    {value: '0', hover: 'No definite Abnormality'},
                    {value: '1', hover: 'Mild, definitely present but few in number'},
                    {value: '2', hover: 'Moderate, numerous opacities'},
                    {value: '3', hover: 'Severe, obscuring normal anatomy'},
                ]
            }
        }
    },
    {
        id: 'chestCTQ2',
        label: 'Diffuse irregular and/or linear opacities?',
        options: ['Yes', 'No'],
        child: {
            q2Sub1: {
                aOptions: ['Intra lobular', 'Inter lobular'],
                bOptions: ['NO', 'YES'],
            },
            q2Sub2: {
                aOptions: ['U', 'M', 'L'],
                bOptions: ['R', 'L'],
                cOptions: [
                    {value: '0', hover: 'No definite Abnormality'},
                    {value: '1', hover: 'Mild, definitely present but few in number'},
                    {value: '2', hover: 'Moderate, numerous opacities'},
                    {value: '3', hover: 'Severe, obscuring normal anatomy'},
                ]
            }
        }
    },
    {
        id: 'chestCTQ3',
        label: 'Large Opacities consistent with progressive massive fibrosis?',
        options: ['Yes', 'No'],
        child: {
            q3Sub1: {
                options: [
                    {label: 'A', value: 'A', hover: 'one or more opacities greater than 10 mm but less than 50 mm in diameter'},
                    {label: 'B', value: 'B', hover: 'one or more opacities greater than 50 mm in diameter but not exceeding the upper right zone'},
                    {label: 'C', value: 'C', hover: 'one or more opacities in diameter exceeding the right upper zone'},
                ],
            },
            q3Sub2: {
                aOptions: ['U', 'M', 'L'],
                bOptions: ['R', 'L']
            }
        }
    },
    {
        id: 'chestCTQ4',
        label: 'Ground glass opacity? Grade?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: [
                {value: '0', hover: 'No definite Abnormality'},
                {value: '1', hover: 'Focal'},
                {value: '2', hover: 'Patchy'},
                {value: '3', hover: 'Diffuse'},
            ]
        }
    },
    {
        id: 'chestCTQ5',
        label: 'Honeycombing? Grade?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: [
                {value: '0', hover: 'No definite Abnormality'},
                {value: '1', hover: 'Mild <10mm subpleural'},
                {value: '2', hover: 'Moderate 10mm to 30mm subpleural'},
                {value: '3', hover: 'Severe, > 30mm subpleural'},
            ]
        }
    },
    {
        id: 'chestCTQ6',
        label: 'Emphysema? Grade? ',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: [
                {value: '0', hover: 'No definite Abnormality'},
                {value: '1', hover: 'Mild <15% of one zone'},
                {value: '2', hover: 'Moderate 15 – 30% of one zone'},
                {value: '3', hover: 'Severe >30%'},
            ]
        }
    },
    {
        id: 'chestCTQ7',
        label: 'Mosaic Attenuation?',
        options: ['Yes', 'No']
    },
    {
        id: 'chestCTQ8',
        label: 'Predominant Parenchymal Abnormality?',
        options: ['Yes', 'No'],
        child: [
            {value: 'RO', hover: 'Rounded Opacities'},
            {value: 'IR', hover: 'Irregular Opacities'},
            {value: 'GGO', hover: 'Ground Glass Opacities'},
            {value: 'HC', hover: 'Honeycombing'},
            {value: 'EM', hover: 'Emphysema'},
            {value: 'LO', hover: 'Large Opacities'},
        ]
    },
    {
        id: 'chestCTQ9',
        label: 'CT findings of Pleural Disease?',
        options: ['Yes', 'No'],
        child: ['Plaque', 'Calcification', 'Fluid']
    },
    {
        id: 'chestCTQ12',
        label: 'Lymph nodes?',
        options: ['Yes', 'No'],
        child: ['Englarged > 10mm short axis', 'Lymph Node Calcification']
    },
]

const chestCTConfidence = [
    {value: 0, tooltip: 'No features of occupational lung disease'},
    {value: 1, tooltip: 'Abnormalities very unlikely due to occupational disease'},
    {value: 2, tooltip: 'Abnormalities only remotely related to occupational lung disease'},
    {value: 3, tooltip: 'Abnormalities related to occupational lung disease which are very nonspecific or atypical'},
    {value: 4, tooltip: 'Abnormalities that represent typical changes of occupational lung disease'},
    {value: 5, tooltip: 'Abnormalities which are typical and are highly specific for occupational lung disease'}
]

const chestCTSiConfidence = [
    {value: 0, tooltip: 'No features of silicosis'},
    {value: 1, tooltip: 'Abnormalities very unlikely due to silicosis'},
    {value: 2, tooltip: 'Abnormalities only remotely related to silicosis'},
    {value: 3, tooltip: 'Abnormalities related to silicosis which are very nonspecific or atypical'},
    {value: 4, tooltip: 'Abnormalities that represent typical changes of silicosis'},
    {value: 5, tooltip: 'Abnormalities which are typical and are highly specific for silicosis'}
]

export default class ChestCTQuestion extends Component {
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
            NotificationManager.error(<IntlMessages id={"testView.selectConfidenceNumber"}/>);
            return false;
        } else {
            return true;
        }
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
        this.setState({answerRating: rating}, () => {
            this.saveChestAnswer();
        });
    }

    renderCheckList(values, checkClass, disabled, qId, childQId) {
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
        const qTruth = (truthValue[qId] !== undefined && truthValue[qId][childQId] !== undefined) ? truthValue[qId][childQId] : '';
        return values.map((v, i) => {
            if (!v.hover) {
                return (
                    <QuestionLabel
                        key={i}
                        className={optionClass}
                        value={v.value}
                        control={
                            <QuestionRadio
                                icon={<span className={ iconClass + ' ' + (qTruth === v.value ? 'truth-icon' : '')}/>}
                                checkedIcon={<span className={iconClass + ' checked ' + (qTruth === v.value ? 'truth-icon' : '')}/>}
                                disableRipple
                            />
                        }
                        label={v.label}
                        labelPlacement="end"
                        disabled={disabled}
                    />
                )
            } else {
                return (
                    <CheckboxTooltip title={v.hover} key={i}>
                        <QuestionLabel
                            key={i}
                            className={optionClass}
                            value={v.value}
                            control={
                                <QuestionRadio
                                    icon={<span className={ iconClass + ' ' + (qTruth === v.value ? 'truth-icon' : '')}/>}
                                    checkedIcon={<span className={iconClass + ' checked ' + (qTruth === v.value ? 'truth-icon' : '')}/>}
                                    disableRipple
                                />
                            }
                            label={v.label}
                            labelPlacement="end"
                            disabled={disabled}
                        />
                    </CheckboxTooltip>
                )
            }
        })
    }

    renderCheckGroup(qId, childQId, disabled, aOptions, bOptions, cOptions) {
        const {answerValue, truthValue} = this.state;
        const getTruthIconClass = (childQId, aOption, bOption, value) => {
            if (
                !truthValue[qId] ||
                !truthValue[qId][childQId + aOption + bOption] ||
                truthValue[qId][childQId + aOption + bOption] !== value
            ) return '';
            return ' truth-icon'
        }
        const checkValues = answerValue[qId] || {};
        return (
            <div>
                <div>
                    <div className={'question2-zone-title'} style={{width: 8, marginLeft: 83, fontSize: 12}}>R</div>
                    <div className={'question2-zone-title'} style={{width: 8, marginLeft: 111, fontSize: 12}}>L</div>
                </div>
                <div className={'ml-2'}>
                    {
                        aOptions.map((v, i) =>
                            <div className={'question3-check-line'} key={i}>
                                <div style={{width: 30}}>{v}</div>
                                <RadioGroup
                                    aria-label="position"
                                    name="position"
                                    value={checkValues[childQId + v + 'R'] ? checkValues[childQId + v + 'R'] : ''}
                                    onChange={(event) => (disabled ? null : this.onChangeChildValue(qId, childQId + v + 'R', event.target.value))}
                                    row
                                    disabled={disabled}
                                >
                                    {
                                        cOptions.map((vv) => (
                                            <CheckboxTooltip title={vv.hover} key={vv.value}>
                                            <QuestionLabel
                                                value={v + vv.value}
                                                control={
                                                    <QuestionRadio
                                                        icon={<span className={'chest-question-checkbox-icon' + getTruthIconClass(childQId, v, 'R', v + vv)}/>}
                                                        checkedIcon={<span className={'chest-question-checkbox-icon checked' + getTruthIconClass(childQId, v, 'R', v + vv)}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={vv.value}
                                                style={{marginRight: 5}}
                                                labelPlacement="end"
                                                disabled={disabled}
                                            />
                                            </CheckboxTooltip>
                                        ))
                                    }
                                </RadioGroup>
                                <RadioGroup
                                    aria-label="position"
                                    name="position"
                                    value={checkValues[childQId + v + 'L'] ? checkValues[childQId + v + 'L'] : ''}
                                    onChange={(event) => (disabled ? null : this.onChangeChildValue(qId, childQId + v + 'L', event.target.value))}
                                    row
                                    disabled={disabled}
                                >
                                    {
                                        cOptions.map((vv) => (
                                            <CheckboxTooltip title={vv.hover} key={vv.value}>
                                            <QuestionLabel
                                                value={v + vv.value}
                                                control={
                                                    <QuestionRadio
                                                        icon={<span className={'chest-question-checkbox-icon' + getTruthIconClass(childQId, v, 'L', v + vv)}/>}
                                                        checkedIcon={<span className={'chest-question-checkbox-icon checked' + getTruthIconClass(childQId, v, 'L', v + vv)}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={vv.value}
                                                style={{marginRight: 5}}
                                                labelPlacement="end"
                                                disabled={disabled}
                                            />
                                            </CheckboxTooltip>
                                        ))
                                    }
                                </RadioGroup>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    renderQuestion1Additional(questionObj, disabled) {
        const q1Sub1Obj = questionObj.child.q1Sub1;
        const q1Sub2Obj = questionObj.child.q1Sub2;
        return (
            <div className={'ml-4'}>
                <div>
                    <div style={{marginLeft: 97}}>
                        {
                            q1Sub1Obj.bOptions.map((v) =>
                                <div className={'question2-zone-title'} style={{width: 8, marginLeft: 24}} key={v}>{v}</div>
                            )
                        }
                    </div>
                    {
                        q1Sub1Obj.aOptions.map((v, i) =>
                            <div className={'ml-3'} key={i}>
                                <div className={'question2-zone-title mr-4'} style={{width: 87}}>{v}</div>
                                {
                                    this.renderCheckList(q1Sub1Obj.bOptions.map((vv) => ({label: '', value: v + vv})), 'mb-0', disabled, questionObj.id, 'q1Sub1Values')
                                }
                            </div>
                        )
                    }
                </div>
                <div className={'ml-1'}>
                    <div className={'mt-3'}>Zone Grade/Profusion</div>
                    {
                        this.renderCheckGroup(questionObj.id, 'q1Sub2', disabled, q1Sub2Obj.aOptions, q1Sub2Obj.bOptions, q1Sub2Obj.cOptions)
                    }
                </div>
            </div>
        )
    }

    renderQuestion2Additional(questionObj, disabled) {
        const q2Sub1Obj = questionObj.child.q2Sub1;
        const q2Sub2Obj = questionObj.child.q2Sub2;
        return (
            <div className={'ml-4'}>
                <div>
                    <div style={{marginLeft: 97}}>
                        {
                            q2Sub1Obj.bOptions.map((v) =>
                                <div className={'question2-zone-title'} style={{width: 8, marginLeft: 24}} key={v}>{v}</div>
                            )
                        }
                    </div>
                    {
                        q2Sub1Obj.aOptions.map((v, i) =>
                            <div className={'ml-3'} key={i}>
                                <div className={'question2-zone-title mr-4'} style={{width: 87}}>{v}</div>
                                {
                                    this.renderCheckList(q2Sub1Obj.bOptions.map((vv) => ({label: '', value: v + vv})), 'mb-0', disabled, questionObj.id, 'q2Sub1Values')
                                }
                            </div>
                        )
                    }
                </div>
                <div className={'ml-1'}>
                    <div className={'mt-3'}>Grade</div>
                    {
                        this.renderCheckGroup(questionObj.id, 'q2Sub2', disabled, q2Sub2Obj.aOptions, q2Sub2Obj.bOptions, q2Sub2Obj.cOptions)
                    }
                </div>
            </div>
        )
    }

    renderQuestion3Additional(questionObj, disabled) {
        const q3Sub1Obj = questionObj.child.q3Sub1;
        const q3Sub2Obj = questionObj.child.q3Sub2;
        return (
            <div className={'d-flex flex-row ml-4'}>
                <div className={'col-4 d-flex flex-column'}>
                    <span>Size</span>
                    {
                        this.renderCheckList(q3Sub1Obj.options, 'mt-1 mb-0', disabled, questionObj.id, 'q1Sub1Values')
                    }
                </div>
                <div className={'col-8'}>
                    <div>
                        <div className={'question2-zone-title'} style={{width: 8, marginLeft: 51, fontSize: 12}}>R</div>
                        <div className={'question2-zone-title'} style={{width: 8, marginLeft: 28, fontSize: 12}}>L</div>
                    </div>
                    {
                        q3Sub2Obj.aOptions.map((v, i) =>
                            <div className={'ml-3'} key={i}>
                                <div className={'question2-zone-title mr-4'} style={{width: 10}}>{v}</div>
                                {
                                    this.renderCheckList(q3Sub2Obj.bOptions.map((vv) => ({label: '', value: v + vv})), 'mb-0', disabled, questionObj.id, 'q1Sub2Values')
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    renderQuestion4Additional(questionObj, disabled) {
        const qChildObj = questionObj.child;
        return (
            <div className={'ml-4'}>
                {
                    this.renderCheckGroup(questionObj.id, 'qSub', disabled, qChildObj.aOptions, qChildObj.bOptions, qChildObj.cOptions)
                }
            </div>
        )
    }

    renderQuestion8Additional(questionObj, disabled) {
        const qChildObj = questionObj.child;
        return (
            <div className={'ml-2'}>
                <RadioGroup
                    className={'ml-1 mt-1'}
                    aria-label="position"
                    name="position"
                    value={this.state.answerValue[questionObj.id]['qSubValues'] || ''}
                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'qSubValues', event.target.value)}
                    disabled={false}
                    row
                >
                    {
                        this.renderOptionList(qChildObj.map((v) => ({label: v.value, value: v.value, hover: v.hover})), 'mb-0', disabled, questionObj.id, 'qSubValues')
                    }
                </RadioGroup>
            </div>
        )
    }

    renderQuestion9Additional(questionObj, disabled) {
        const qChildObj = questionObj.child;
        return (
            <div className={'ml-4'}>
                {
                    this.renderCheckList(qChildObj.map((v) => ({label: v, value: v})), 'mb-0', disabled, questionObj.id, 'qSubValues')
                }
            </div>
        )
    }

    renderQuestion10Additional(questionObj, disabled) {
        const qChildObj = questionObj.child;
        return (
            <div className={'ml-4'}>
                <div style={{marginLeft: 63}}>
                    {
                        qChildObj.bOptions.map((v) =>
                            <div className={'question2-zone-title'} style={{width: 8, marginLeft: 26}} key={v}>{v}</div>
                        )
                    }
                </div>
                {
                    qChildObj.aOptions.map((v, i) =>
                        <div className={'ml-3'} key={i}>
                            <div className={'question2-zone-title mr-4'} style={{width: 47}}>{v}</div>
                            {
                                this.renderCheckList(qChildObj.bOptions.map((vv) => ({label: '', value: v + vv})), 'mb-0', disabled, questionObj.id, 'qSubValues')
                            }
                        </div>
                    )
                }
            </div>
        )
    }

    renderQuestion12Additional(questionObj, disabled) {
        const qChildObj = questionObj.child;
        return (
            <div className={'ml-4 d-flex flex-column'}>
                {
                    this.renderCheckList(qChildObj.map((v) => ({label: v, value: v})), 'mb-2', disabled, questionObj.id, 'qSubValues')
                }
            </div>
        )
    }

    renderAdditionalQuestion(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        if ((answerValue[questionObj.id] !== undefined && answerValue[questionObj.id].value !== undefined && answerValue[questionObj.id].value === 'Yes') ||
            (truthValue[questionObj.id] !== undefined && truthValue[questionObj.id].value !== undefined && truthValue[questionObj.id].value === 'Yes')
        ) {
            if (questionObj.id === 'chestCTQ1') {
                return this.renderQuestion1Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ2') {
                return this.renderQuestion2Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ3') {
                return this.renderQuestion3Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ4' || questionObj.id === 'chestCTQ5' || questionObj.id === 'chestCTQ6') {
                return this.renderQuestion4Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ8') {
                return this.renderQuestion8Additional(questionObj, disabled);
            }  else if (questionObj.id === 'chestCTQ9') {
                return this.renderQuestion9Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ10' || questionObj.id === 'chestCTQ11') {
                return this.renderQuestion10Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ12') {
                return this.renderQuestion12Additional(questionObj, disabled);
            }
        }
    }

    renderQuestion(questionObj, index, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] !== undefined ? truthValue[questionObj.id].value : '';
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title'}>
                    <span className={'mr-1'}>{index + 1}.</span>
                    <span>{questionObj.label}</span>
                </div>
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
                        questionObj.options.map((v, i) => {
                            return !v.tooltip ?
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
                                /> :
                                <CheckboxTooltip title={v.tooltip} key={i}>
                                    <QuestionLabel
                                        key={v.value}
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
                                        disabled={disabled}
                                    />
                                </CheckboxTooltip>
                        })
                    }
                </RadioGroup>
                {this.renderAdditionalQuestion(questionObj, disabled)}
            </div>
        )
    }

    render() {
        const {answerRating, truthRating} = this.state;
        const disabled = this.props.complete;
        return (
            <div className={'pl-10 covid-question-container chest-data'}>
                <div>
                    <div className={'covid-questions'}>
                        {
                            question.map((v, i) => this.renderQuestion(v, i, disabled))
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        {
                            this.props.modalityInfo.name !== 'CHESTsi CT' ?
                                <p><IntlMessages id={"testView.chestCTQuestion.ratingTitle"}/></p> :
                                <p>Confidence that the subject has Silicosis</p>
                        }
                        <RadioGroup
                            data-cy="chest-ct-confidence-position"
                            disabled
                            aria-label="position"
                            name="position"
                            value={answerRating !== undefined ? answerRating.toString() : ''}
                            onChange={(event) => this.onChangeRating(event.target.value)}
                            row
                            className={'justify-content-center mt-0'}
                        >
                            {
                                (this.props.modalityInfo.name !== 'CHESTsi CT' ? chestCTConfidence : chestCTSiConfidence).map((v, i) => {   // [0, 1, 2, 3...]
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
