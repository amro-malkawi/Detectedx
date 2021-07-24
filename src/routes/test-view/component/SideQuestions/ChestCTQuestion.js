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
        label: '1. Well defined rounded opacities?',
        options: ['Yes', 'No'],
        child: {
            q1Sub1: {
                aOptions: ['P =< 1.5mm', 'Q = 1.3-3mm', 'R => 3-10mm'],
                bOptions: ['NO', 'YES'],
            },
            q1Sub2: {
                aOptions: ['U', 'M', 'L'],
                bOptions: ['R', 'L'],
                cOptions: ['0', '1', '2', '3']
            }
        }
    },
    {
        id: 'chestCTQ2',
        label: '2. Irregular and/or linear opacities?',
        options: ['Yes', 'No'],
        child: {
            q2Sub1: {
                aOptions: ['Intra lobular', 'Inter lobular'],
                bOptions: ['NO', 'YES'],
            },
            q2Sub2: {
                aOptions: ['U', 'M', 'L'],
                bOptions: ['R', 'L'],
                cOptions: ['0', '1', '2', '3']
            }
        }
    },
    {
        id: 'chestCTQ3',
        label: '3. Large opacities?',
        options: ['Yes', 'No'],
        child: {
            q3Sub1: {
                options: ['A', 'B', 'C']
            },
            q3Sub2: {
                aOptions: ['U', 'M', 'L'],
                bOptions: ['R', 'L']
            }
        }
    },
    {
        id: 'chestCTQ4',
        label: '4. Ground glass opacity? Grade?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: ['0', '1', '2', '3']
        }
    },
    {
        id: 'chestCTQ5',
        label: '5. Honeycombing?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: ['0', '1', '2', '3']
        }
    },
    {
        id: 'chestCTQ6',
        label: '6. Emphysema?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: ['0', '1', '2', '3']
        }
    },
    {
        id: 'chestCTQ7',
        label: '7. Mosaic Attenuation?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L'],
            cOptions: ['0', '1', '2', '3']
        }
    },
    {
        id: 'chestCTQ8',
        label: '8. Predominant Parenchymal Abnormality?',
        options: ['RO', 'IR', 'GGO', 'HC', 'EM', 'LO'],
    },
    {
        id: 'chestCTQ9',
        label: '9. CT findings of Pleural Disease?',
        options: ['Yes', 'No'],
        child: ['Plaque', 'Calcification', 'Fluid']
    },
    {
        id: 'chestCTQ10',
        label: '10. Significant solid nodules?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L']
        }
    },
    {
        id: 'chestCTQ11',
        label: '11. Significant subsolid nodules?',
        options: ['Yes', 'No'],
        child: {
            aOptions: ['U', 'M', 'L'],
            bOptions: ['R', 'L']
        }
    },
    {
        id: 'chestCTQ12',
        label: '12. Lymph nodes?',
        options: ['Yes', 'No'],
        child: ['Englarged > 10mm short axis', 'Hiatal Hernia']
    },
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
        return values.map((v, i) => (
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
        ));
    }

    renderCheckGroup(qId, childQId, disabled, aOptions, bOptions, cOptions) {
        const {answerValue, truthValue} = this.state;
        const getTruthIconClass = (childQId, aOption, bOption, value) => {
            if(
                !truthValue[qId] ||
                !truthValue[qId][childQId + aOption + bOption] ||
                truthValue[qId][childQId + aOption + bOption] !== value
            ) return '';
            return ' truth-icon'
        }
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
                                    value={answerValue[qId][childQId + v + 'R'] ? answerValue[qId][childQId + v + 'R'] : ''}
                                    onChange={(event) => (disabled ? null : this.onChangeChildValue(qId, childQId + v + 'R', event.target.value))}
                                    row
                                    disabled={disabled}
                                >
                                    {
                                        cOptions.map((vv) => (
                                            <QuestionLabel
                                                key={vv}
                                                value={v + vv}
                                                control={
                                                    <QuestionRadio
                                                        icon={<span className={'chest-question-checkbox-icon' + getTruthIconClass(childQId, v, 'R', v + vv)}/>}
                                                        checkedIcon={<span className={'chest-question-checkbox-icon checked' + getTruthIconClass(childQId, v, 'R', v + vv)}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={vv}
                                                style={{marginRight: 5}}
                                                labelPlacement="end"
                                                disabled={disabled}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                                <RadioGroup
                                    aria-label="position"
                                    name="position"
                                    value={answerValue[qId][childQId + v + 'L'] ? answerValue[qId][childQId + v + 'L'] : ''}
                                    onChange={(event) => (disabled ? null : this.onChangeChildValue(qId, childQId + v + 'L', event.target.value))}
                                    row
                                    disabled={disabled}
                                >
                                    {
                                        cOptions.map((vv) => (
                                            <QuestionLabel
                                                key={vv}
                                                value={v + vv}
                                                control={
                                                    <QuestionRadio
                                                        icon={<span className={'chest-question-checkbox-icon' + getTruthIconClass(childQId, v, 'L', v + vv)}/>}
                                                        checkedIcon={<span className={'chest-question-checkbox-icon checked' + getTruthIconClass(childQId, v, 'L', v + vv)}/>}
                                                        disableRipple
                                                    />
                                                }
                                                label={vv}
                                                style={{marginRight: 5}}
                                                labelPlacement="end"
                                                disabled={disabled}
                                            />
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
                    <div className={'mt-3'}>Zone Profusion</div>
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
                        this.renderCheckList(q3Sub1Obj.options.map((v) => ({label: v, value: v})), 'mt-1 mb-0', disabled, questionObj.id, 'q1Sub1Values')
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
        if (answerValue[questionObj.id] === undefined) return null;
        if (answerValue[questionObj.id].value !== undefined && answerValue[questionObj.id].value === 'Yes') {
            if (questionObj.id === 'chestCTQ1') {
                return this.renderQuestion1Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ2') {
                return this.renderQuestion2Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ3') {
                return this.renderQuestion3Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ4' || questionObj.id === 'chestCTQ5' || questionObj.id === 'chestCTQ6' || questionObj.id === 'chestCTQ7') {
                return this.renderQuestion4Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ9') {
                return this.renderQuestion9Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ10' || questionObj.id === 'chestCTQ11') {
                return this.renderQuestion10Additional(questionObj, disabled);
            } else if (questionObj.id === 'chestCTQ12') {
                return this.renderQuestion12Additional(questionObj, disabled);
            }
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
        const {answerRating, truthRating} = this.state;
        const disabled = this.props.complete;
        return (
            <div className={'pl-10 covid-question-container chest-data'}>
                <div>
                    <div className={'covid-questions'}>
                        {
                            question.map(v => this.renderQuestion(v, disabled))
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        <p><IntlMessages id={"testView.chestCTQuestion.ratingTitle"}/></p>
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
