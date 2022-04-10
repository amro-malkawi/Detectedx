import React, {Component} from 'react'
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
        id: 'wbctQ1',
        label: 'Q1: Do you see fractures',
        options: [
            'No fracture or bony injury present',
            'Yes, MARK FRACTURE if present',
        ]
    },
    {
        id: 'wbctQ2',
        label: 'Q2: Findings suggestive of: ',
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
]

export default class WBCTQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            answerRating1: -1,
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
                answerRating1: resp.chest_answer.answerRating1 !== undefined ? resp.chest_answer.answerRating1 : -1,
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
        answerValue.answerRating1 = this.state.answerRating1;
        answerValue.answerRating2 = this.state.answerRating2;
        if (!this.props.complete) {
            Apis.setAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.state.answerRating1, answerValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    checkQuestionValidate() {
        const {answerRating1, answerRating2} = this.state;
        if (
            isNaN(answerRating1) || Number(answerRating1) < 0 || Number(answerRating1) > 5 ||
            isNaN(answerRating2) || Number(answerRating2) < 0 || Number(answerRating2) > 5
        ) {
            NotificationManager.error(<IntlMessages id={"testView.selectConfidenceNumber"}/>);
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
                    className={'ml-4 flex-column'}
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
        const {answerRating1, truthRating1, answerRating2, truthRating2} = this.state;
        console.log(truthRating1, '-----')
        const disabled = this.props.complete;
        return (
            <div className={'pl-10 covid-question-container chest-data'}>
                <div>
                    <p className={'covid-question-title ml-3 mr-3'}>
                        Questions
                    </p>
                    <div className={'covid-questions'}>
                        {
                            question.map((v) => this.renderQuestion(v, disabled))
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        <p>How confident this case is suspicious <br />for NAI</p>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={answerRating1 !== undefined ? answerRating1.toString() : ''}
                            onChange={(event) => this.onChangeRating('answerRating1', event.target.value)}
                            row
                            className={'justify-content-center mt-0'}
                        >
                            {
                                [
                                    {value: 0, tooltip: 'Absolutely confident that this case is NOT suspicious for NAI'}, {value: 1, tooltip: 'Very confident that this case is NOT suspicious for NAI'}, {value: 2, tooltip: 'Quite confident that this case is NOT suspicious for NAI'},
                                    {value: 3, tooltip: 'Quite confident that this case is suspicious for NAI'}, {value: 4, tooltip: 'Very confident that this case is suspicious for NAI'}, {value: 5, tooltip: 'Absolutely confident that this case is suspicious for NAI'}
                                ].map((v, i) => {   // [0, 1, 2, 3...]
                                    console.log(v.value, truthRating1, truthRating1 === v.value, '//////////')
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
                                                label={v.value}
                                                disabled={disabled}
                                            />
                                        </CheckboxTooltip>
                                    )
                                })
                            }
                        </RadioGroup>
                        <p>How confident are you that may have missed any bony injuries due to excessive noise in the bony images</p>
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
                                [
                                    {value: 0, tooltip: 'Absolutely confident that there is NOT excessive noise present in the bony images'}, {value: 1, tooltip: 'Very confident that there is NOT excessive noise present in the bony images'}, {value: 2, tooltip: 'Quite confident that there is NOT excessive noise present in the bony images'},
                                    {value: 3, tooltip: 'Quite confident that there IS excessive noise present in the bony images'}, {value: 4, tooltip: 'Very confident that there IS excessive noise present in the bony images'}, {value: 5, tooltip: 'Absolutely confident that there IS excessive noise present in the bony images'}
                                ].map((v, i) => {   // [0, 1, 2, 3...]
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
