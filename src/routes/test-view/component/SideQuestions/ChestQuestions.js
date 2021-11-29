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
        id: 'chestQ1',
        label: '1. Image Quality',
        options: ['Acceptable', 'Unacceptable'],
        // child: {
        //     q1Options: [['Overexposed', 'Underexposed', 'Artifacts', 'Improper position', 'Poor contrast'], ['Poor processing', 'Underinflation', 'Mottle', 'Other']]
        // }
    },
    {
        id: 'chestQ2a',
        label: '2A. Classifiable paranchymal abnormality:',
        options: ['Yes', 'No'],
        child: {
            chestQ2b: {
                id: 'chestQ2b',
                label: '2B. Small opacities',
                aOptions: ['p', 'q', 'r', 's', 't', 'u'],
                bOptions: {labels: ['Upper', 'Middle', 'Lower'], values: ['R', 'L']},
                cOptions: [['0/-', '0/0', '0/1'], ['1/0', '1/1', '1/2'], ['2/1', '2/2', '2/3'], ['3/2', '3/3', '3/+']]
            },
            chestQ2c: {
                id: 'chestQ2c',
                label: '2C. Large opacities',
                options: ['0', 'A', 'B', 'C']
            }
        }
    },
    {
        id: 'chestQ3a',
        label: '3A. Any Classifiable pleural abnormalities?',
        options: ['Yes', 'No'],
        child: {
            chestQ3b: {
                id: 'chestQ3b',
                label: '3B. Pleural plaques',
                options: {labels: ['In profile', 'Face on', 'Diaphragm', 'Other site(s)'], values: ['0', 'R', 'L']},
                extendOptions: [['0', 'R'], ['0', 'L'], ['1', '2', '3']],
                widthOptions: [['0', 'R'], ['0', 'L'], ['a', 'b', 'c']],
            },
            chestQ3c: {
                id: 'chestQ3c',
                label: '3C. Costophrenic angle obliteration',
                options: ['0', 'R', 'L'],
                addOptions: {labels: ['In profile', 'Face on'], values: ['0', 'R', 'L']},
                extendOptions: [['0', 'R'], ['0', 'L'], ['1', '2', '3']],
                widthOptions: [['0', 'R'], ['0', 'L'], ['a', 'b', 'c']],
            }
        }
    },
    {
        id: 'chestQ4a',
        label: '4A. Any other abnormalities?',
        options: ['Yes', 'No'],
        child: {
            chestQ4b: {
                id: 'chestQ4b',
                label: '4B. Other symbols (Obligatory)',
                options: [
                    [
                        {value: 'aa', label: 'aa', hover: 'atherosclerotic aorta'},
                        {value: 'at', label: 'at', hover: 'significant apical pleural thickening'},
                        {
                            value: 'ax',
                            label: 'ax',
                            hover: 'coalescence of small opacities - with margins of the small opacities remaining visible,whereas a large opacity demonstrates a homogeneous opaque appearance – may be recorded either in the presence or in the absence of large opacities'
                        },
                        {value: 'bu', label: 'bu', hover: 'bulla(e)'},
                        {value: 'ca', label: 'ca', hover: 'cancer, thoracic malignancies excluding mesothelioma'},
                        {value: 'cg', label: 'cg', hover: 'calcified non-pneumoconiotic nodules (e.g. granuloma) or nodes'},
                    ],
                    [
                        {value: 'cn', label: 'cn', hover: 'calcification in small pneumoconiotic opacities'},
                        {value: 'co', label: 'co', hover: 'abnormality of cardiac size or shape'},
                        {value: 'cp', label: 'cp', hover: 'cor pulmonale'},
                        {value: 'cv', label: 'cv', hover: 'cavity'},
                        {value: 'di', label: 'di', hover: 'marked distortion of an intrathoracic structure'},
                        {value: 'ef', label: 'ef', hover: 'pleural effusion'},
                    ],
                    [
                        {value: 'em', label: 'em', hover: 'emphysema'},
                        {value: 'es', label: 'es', hover: 'eggshell calcification of hilar or mediastinal lymph nodes'},
                        {value: 'fr', label: 'fr', hover: 'fractured rib(s) (acute or healed)'},
                        {value: 'hi', label: 'hi', hover: 'enlargement of non-calcified hilar or mediastinal lymph nodes'},
                        {value: 'ho', label: 'ho', hover: 'honeycomb lung'},
                        {value: 'id', label: 'id', hover: 'ill-defined diaphragm border - should be recorded only if more than one-third of one hemidiaphragm is affected'},
                    ],
                    [
                        {
                            value: 'ih',
                            label: 'ih',
                            hover: 'ill-defined heart border - should be recorded only if the length of the heart border affected, whether on the right or on the left side, is more than one-third of the length of the left heart border'
                        },
                        {value: 'kl', label: 'kl', hover: 'septal (Kerley) lines'},
                        {value: 'me', label: 'me', hover: 'mesothelioma'},
                        {value: 'pa', label: 'pa', hover: 'plate atelectasis'},
                        {value: 'pb', label: 'pb', hover: 'parenchymal bands - significant parenchymal fibrotic stands in continuity with the pleura'},
                        {value: 'pi', label: 'pi', hover: 'pleural thickening of an interlobar fissure'},
                    ],
                    [
                        {value: 'px', label: 'px', hover: 'pneumothorax'},
                        {value: 'ra', label: 'ra', hover: 'rounded atelectasis'},
                        {value: 'rp', label: 'rp', hover: 'rheumatoid pneumoconiosis'},
                        {value: 'tb', label: 'tb', hover: 'tuberculosis'},
                        {value: 'OD', label: 'OD', hover: 'tuberculosis'},
                    ]
                ]
            }
        }
    }
]

export default class ChestQuestions extends Component {
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
        const { answerRating } = this.state;
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
        this.setState({answerRating: rating}, () => {
            this.saveChestAnswer();
        });
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

    renderQuestion1Additional(questionObj, disabled) {
        const {questionAnswer, questionTruth} = this.getAnswerTruth(questionObj.id);

        const truthOtherText = (questionTruth['q1OtherText'] !== undefined) ? questionTruth['q1OtherText'] : '';
        return (
            <div className={'ml-3'}>
                <div className={'chest-question-sub-desc'}>Please mark all boxes that apply</div>
                <div className={'d-flex'}>
                    <div className={'col d-flex flex-column p-0'}>
                        {
                            this.renderCheckList(questionObj.child.q1Options[0].map((v) => ({label: v, value: v})), '', disabled, questionObj.id, 'q1Values')
                        }
                    </div>
                    <div className={'col d-flex flex-column p-0'}>
                        {
                            this.renderCheckList(questionObj.child.q1Options[1].map((v) => ({label: v, value: v})), '', disabled, questionObj.id, 'q1Values')
                        }
                        {
                            (truthOtherText !== undefined && truthOtherText !== '') && <div className={'truth-other-text'}>({truthOtherText})</div>
                        }
                        <QuestionInput
                            id="q1OtherText" placeholder={'please specify'}
                            value={questionAnswer['q1OtherText']}
                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q1OtherText', event.target.value)}
                            disabled={
                                disabled || questionAnswer['q1Values'] === undefined ||
                                questionAnswer['q1Values'].indexOf('Other') === -1
                            }
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderQuestion2Additional(questionObj, disabled) {
        const {questionAnswer, questionTruth} = this.getAnswerTruth(questionObj.id);
        const question2bObj = questionObj.child.chestQ2b;
        const question2cObj = questionObj.child.chestQ2c;
        return (
            <div>
                <div className={'chest-question-title'}>{question2bObj.label}</div>
                <div className={'ml-3'}>
                    <div className={'chest-question-sub-title'}>a. Shape/Size:</div>
                    <div className={'chest-question-sub-desc ml-4'}>(mark one primary and one secondary)</div>
                    <div className={'d-flex'}>
                        <div className={'col d-flex align-items-center flex-column'}>
                            <div className={'fs-14'}>
                                Primary
                            </div>

                            <RadioGroup
                                className={'ml-3 mt-1'}
                                aria-label="position"
                                name="position"
                                value={questionAnswer['q2aPValues'] !== undefined ? questionAnswer['q2aPValues'] : ''}
                                onChange={(event) => this.onChangeChildValue(questionObj.id, 'q2aPValues', event.target.value)}
                                disabled={false}
                                row
                            >
                                {
                                    this.renderOptionList(question2bObj.aOptions, '', disabled, questionObj.id, 'q2aPValues', 'chest-question-checkbox-icon')
                                }
                            </RadioGroup>
                        </div>
                        <div className={'col d-flex align-items-center flex-column'}>
                            <div className={'fs-14'}>
                                Secondary
                            </div>
                            <RadioGroup
                                className={'ml-3 mt-1'}
                                aria-label="position"
                                name="position"
                                value={questionAnswer['q2aSValues'] !== undefined ? questionAnswer['q2aSValues'] : ''}
                                onChange={(event) => this.onChangeChildValue(questionObj.id, 'q2aSValues', event.target.value)}
                                disabled={false}
                                row
                            >
                                {
                                    this.renderOptionList(question2bObj.aOptions, '', disabled, questionObj.id, 'q2aSValues', 'chest-question-checkbox-icon')
                                }
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={'chest-question-sub-title'}>b. Zones</div>
                    <div>
                        <div className={'question2-zone-title'} style={{width: 8, marginLeft: 99}}>R</div>
                        <div className={'question2-zone-title'} style={{width: 8, marginLeft: 26}}>L</div>
                    </div>
                    {
                        question2bObj.bOptions.labels.map((v, i) =>
                            <div className={'ml-4'} key={i}>
                                <div className={'question2-zone-title mr-4'}>{v}</div>
                                {
                                    this.renderCheckList(question2bObj.bOptions.values.map((vv) => ({label: '', value: v + vv})), 'mb-0', disabled, questionObj.id, 'q2bbValues')
                                }
                            </div>
                        )
                    }
                    <div className={'chest-question-sub-title'}>c. Profusion</div>
                    <div>
                        <RadioGroup
                            className={'ml-3 mt-1'}
                            aria-label="position"
                            name="position"
                            value={questionAnswer['q2bcValues'] !== undefined ? questionAnswer['q2bcValues'] : ''}
                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q2bcValues', event.target.value)}
                            disabled={false}
                        >
                            {
                                question2bObj.cOptions.map((optionLine, i) =>
                                    <div key={i}>
                                        {
                                            this.renderOptionList(optionLine, '', disabled, questionObj.id, 'q2bcValues')
                                        }
                                    </div>
                                )
                            }
                        </RadioGroup>
                    </div>
                </div>
                <div className={'chest-question-title'}>{question2cObj.label}</div>
                <div className={'d-flex ml-3'}>
                    <span className={'chest-question-sub-title'} style={{paddingTop: 4}}>Size</span>
                    <RadioGroup
                        className={'ml-3 mt-1'}
                        aria-label="position"
                        name="position"
                        value={questionAnswer['q2cValues'] !== undefined ? questionAnswer['q2cValues'] : ''}
                        onChange={(event) => this.onChangeChildValue(questionObj.id, 'q2cValues', event.target.value)}
                        row
                        disabled={false}
                    >
                        {
                            this.renderOptionList(question2cObj.options, '', disabled, questionObj.id, 'q2cValues')
                        }
                    </RadioGroup>
                </div>
            </div>
        )
    }

    renderQuestion3Additional(questionObj, disabled) {
        const {questionAnswer, questionTruth} = this.getAnswerTruth(questionObj.id);
        const question3bObj = questionObj.child.chestQ3b;
        const question3cObj = questionObj.child.chestQ3c;
        return (
            <div>
                <div className={'chest-question-title'}>{question3bObj.label}<span className={'chest-question-sub-desc ml-2'}>0=None R=Right L=Left</span></div>
                <div className={'chest-question-sub-desc text-center'}>(mark site, calcification, extent, and width)</div>
                <div className={'d-flex'}>
                    <div className={'d-flex flex-column ml-4'}>
                        <div className={'question3-check-title-line'}>
                            <div>Chest wall</div>
                            <div>Site</div>
                            <div>Calcification</div>
                        </div>
                        {
                            question3bObj.options.labels.map((v, i) =>
                                <div className={'question3-check-line'} key={i}>
                                    <div>{v}</div>
                                    <div>
                                        {
                                            this.renderCheckList(
                                                question3bObj.options.values.map((vv) => ({label: vv, value: vv})),
                                                'mb-0 mr-1', disabled, questionObj.id, 'q3bChestSiteValues' + v
                                            )
                                        }
                                    </div>
                                    <div>
                                        {
                                            this.renderCheckList(
                                                question3bObj.options.values.map((vv) => ({label: vv,value: vv})),
                                                'mb-0 mr-1', disabled, questionObj.id, 'q3bChestCalcValues' + v
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={'question3-extent'}>
                    <div>Extent</div>
                    <div>(chest wall ; combined for in-profile and face-on)<br/>
                        up to 1⁄4 of lateral chest wall = 1<br/>
                        1⁄4 to 1⁄2 of lateral chest wall = 2<br/>
                        > 1⁄2 of lateral chest wall = 3
                    </div>
                    <div className={'d-flex'}>
                        <div className={'d-flex flex-column align-items-start ml-40'}>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bExtend11Values'] !== undefined ? questionAnswer['q3bExtend11Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bExtend11Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.extendOptions[0], 'mb-0 mr-1', disabled, questionObj.id, 'q3bExtend11Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bExtend12Values'] !== undefined ? questionAnswer['q3bExtend12Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bExtend12Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.extendOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3bExtend12Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={'d-flex flex-column align-items-start ml-30'}>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bExtend21Values'] !== undefined ? questionAnswer['q3bExtend21Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bExtend21Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.extendOptions[1], 'mb-0 mr-1', disabled, questionObj.id, 'q3bExtend21Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bExtend22Values'] !== undefined ? questionAnswer['q3bExtend22Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bExtend22Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.extendOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3bExtend22Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'question3-extent'}>
                    <div>Width</div>
                    <div>(in profile only, 3 mm minimum width required)<br/>
                        a= 3 to 5 mm<br/>
                        b= 5 to 10 mm<br/>
                        c= > 10 mm
                    </div>
                    <div className={'d-flex'}>
                        <div className={'d-flex flex-column align-items-start ml-40'}>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bWidth11Values'] !== undefined ? questionAnswer['q3bWidth11Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bWidth11Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.widthOptions[0], 'mb-0 mr-1', disabled, questionObj.id, 'q3bWidth11Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bWidth12Values'] !== undefined ? questionAnswer['q3bWidth12Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bWidth12Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.widthOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3bWidth12Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={'d-flex flex-column align-items-start ml-30'}>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bWidth21Values'] !== undefined ? questionAnswer['q3bWidth21Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bWidth21Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.widthOptions[1], 'mb-0 mr-1', disabled, questionObj.id, 'q3bWidth21Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                            <div>
                                <RadioGroup
                                    className={''}
                                    aria-label="position"
                                    name="position"
                                    value={questionAnswer['q3bWidth22Values'] !== undefined ? questionAnswer['q3bWidth22Values'] : ''}
                                    onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3bWidth22Values', event.target.value)}
                                    disabled={false}
                                    row
                                >
                                    {
                                        this.renderOptionList(question3bObj.widthOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3bWidth22Values', 'chest-question-checkbox-icon')
                                    }
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'chest-question-title'}>{question3cObj.label}</div>
                <div className={'chest-question-sub-desc text-center'}>0=None R=Right L=Left<br/>(mark site, calcification, extent, and width)</div>
                <div className={'ml-70'}>
                    {
                        this.renderCheckList(question3cObj.options.map((v) => ({label: v, value: v})), 'mb-0 mr-30', disabled, questionObj.id, 'q3cValues')
                    }
                </div>
                {
                    ( (questionAnswer['q3cValues'] !== undefined &&
                        (questionAnswer['q3cValues'].indexOf('R') !== -1 ||
                            questionAnswer['q3cValues'].indexOf('L') !== -1)) ||
                        (questionTruth['q3cValues'] !== undefined &&
                            (questionTruth['q3cValues'].indexOf('R') !== -1 ||
                                questionTruth['q3cValues'].indexOf('L') !== -1))
                    ) &&
                    <div>
                        <div className={'d-flex'}>
                            <div className={'d-flex flex-column ml-4'}>
                                <div className={'question3-check-title-line'}>
                                    <div>Chest wall</div>
                                    <div>Site</div>
                                    <div>Calcification</div>
                                </div>
                                {
                                    question3cObj.addOptions.labels.map((v, i) =>
                                        <div className={'question3-check-line'} key={i}>
                                            <div>{v}</div>
                                            <div>
                                                {
                                                    this.renderCheckList(
                                                        question3bObj.options.values.map((vv) => ({label: vv,value: vv})),
                                                        'mb-0 mr-1', disabled, questionObj.id, 'q3cChestSiteValues' + v
                                                    )
                                                }
                                            </div>
                                            <div>
                                                {
                                                    this.renderCheckList(question3bObj.options.values.map((vv) => ({label: vv, value: vv })),
                                                        'mb-0 mr-1', disabled, questionObj.id, 'q3cChestCalcValues' + v
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className={'question3-extent'}>
                            <div>Extent</div>
                            <div>(chest wall ; combined for in-profile and face-on)<br/>
                                up to 1⁄4 of lateral chest wall = 1<br/>
                                1⁄4 to 1⁄2 of lateral chest wall = 2<br/>
                                > 1⁄2 of lateral chest wall = 3
                            </div>
                            <div className={'d-flex'}>
                                <div className={'d-flex flex-column align-items-start ml-40'}>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cExtend11Values'] !== undefined ? questionAnswer['q3cExtend11Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cExtend11Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.extendOptions[0], 'mb-0 mr-1', disabled, questionObj.id, 'q3cExtend11Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cExtend12Values'] !== undefined ? questionAnswer['q3cExtend12Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cExtend12Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.extendOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3cExtend12Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className={'d-flex flex-column align-items-start ml-30'}>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cExtend21Values'] !== undefined ? questionAnswer['q3cExtend21Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cExtend21Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.extendOptions[1], 'mb-0 mr-1', disabled, questionObj.id, 'q3cExtend21Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cExtend22Values'] !== undefined ? questionAnswer['q3cExtend22Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cExtend22Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.extendOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3cExtend22Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'question3-extent'}>
                            <div>Width</div>
                            <div>(in profile only, 3 mm minimum width required)<br/>
                                a= 3 to 5 mm<br/>
                                b= 5 to 10 mm<br/>
                                c= > 10 mm
                            </div>
                            <div className={'d-flex'}>
                                <div className={'d-flex flex-column align-items-start ml-40'}>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cWidth11Values'] !== undefined ? questionAnswer['q3cWidth11Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cWidth11Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.widthOptions[0], 'mb-0 mr-1', disabled, questionObj.id, 'q3cWidth11Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cWidth12Values'] !== undefined ? questionAnswer['q3cWidth12Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cWidth12Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.widthOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3cWidth12Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className={'d-flex flex-column align-items-start ml-30'}>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cWidth21Values'] !== undefined ? questionAnswer['q3cWidth21Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cWidth21Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.widthOptions[1], 'mb-0 mr-1', disabled, questionObj.id, 'q3cWidth21Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <RadioGroup
                                            className={''}
                                            aria-label="position"
                                            name="position"
                                            value={questionAnswer['q3cWidth22Values'] !== undefined ? questionAnswer['q3cWidth22Values'] : ''}
                                            onChange={(event) => this.onChangeChildValue(questionObj.id, 'q3cWidth22Values', event.target.value)}
                                            disabled={false}
                                            row
                                        >
                                            {
                                                this.renderOptionList(question3cObj.widthOptions[2], 'mb-0 mr-1', disabled, questionObj.id, 'q3cWidth22Values', 'chest-question-checkbox-icon')
                                            }
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }

    renderQuestion4Additional(questionObj, disabled) {
        const question4bObj = questionObj.child.chestQ4b;
        return (
            <div>
                <div className={'chest-question-title'}>{question4bObj.label}</div>
                <div className={'d-flex justify-content-center'}>
                    {
                        question4bObj.options.map((checkLine, i) =>
                            <div className={'d-flex flex-column'} key={i}>
                                {
                                    this.renderCheckList(checkLine, 'mb-0 mr-2', disabled, questionObj.id, 'q4bValues')
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    renderAdditionalQuestion(questionObj, disabled) {
        const {answerValue, truthValue} = this.state;
        if (answerValue[questionObj.id] === undefined && truthValue[questionObj.id] === undefined) return null;
        const answerExist = answerValue[questionObj.id] !== undefined && answerValue[questionObj.id].value !== undefined;
        const truthExist = truthValue[questionObj.id] !== undefined && truthValue[questionObj.id].value !== undefined;
        if (
            questionObj.id === 'chestQ1' && ((answerExist && answerValue[questionObj.id].value !== 'Acceptable') || (truthExist && truthValue[questionObj.id].value !== 'Acceptable'))
        ) {
            // return this.renderQuestion1Additional(questionObj, disabled);
        } else if (
            questionObj.id === 'chestQ2a' && ((answerExist && answerValue[questionObj.id].value === 'Yes') || (truthExist && truthValue[questionObj.id].value === 'Yes'))
        ) {
            return this.renderQuestion2Additional(questionObj, disabled);
        } else if (
            questionObj.id === 'chestQ3a' && ((answerExist && answerValue[questionObj.id].value === 'Yes') || (truthExist && truthValue[questionObj.id].value === 'Yes'))
        ) {
            return this.renderQuestion3Additional(questionObj, disabled);
        } else if (
            questionObj.id === 'chestQ4a' && ((answerExist && answerValue[questionObj.id].value === 'Yes') || (truthExist && truthValue[questionObj.id].value === 'Yes'))
        ) {
            return this.renderQuestion4Additional(questionObj, disabled);
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

    renderTitle() {
        if (!this.props.complete) {
            return <IntlMessages id={"testView.covidQuestion.doyousee"}/>;
        } else {
            return <IntlMessages id={"testView.covidQuestion.yourJudgement"}/>;
        }
    }

    render() {
        const {answerRating, truthRating} = this.state;
        const disabled = this.props.complete;
        return (
            <div className={'pl-10 covid-question-container chest-data'}>
                <div>
                    <p className={'covid-question-title'}>
                        {
                            this.renderTitle()
                        }
                    </p>
                    <div className={'covid-questions'}>
                        {
                            question.map(v => this.renderQuestion(v, disabled))
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        <p><IntlMessages id={"testView.chestQuestion.ratingTitle"}/></p>
                        <RadioGroup
                            data-cy="chest-confidence-position"
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
                                    {value: 0, tooltip: 'Normal, no abnormality attributable to OLD'},
                                    {value: 1, tooltip: 'Some abnormalities present that maybe associated with OLD, either very nonspecific or equivocal'},
                                    {value: 2, tooltip: 'Nonspecific features of OLD, remains nonspecific even with exposure history'},
                                    {value: 3, tooltip: 'Nonspecific features of OLD, woulfd support diagnosis with appropriate exposure history'},
                                    {value: 4, tooltip: 'Suggestive features of OLD. More specific for OLD, perhaps in top 3 differential'},
                                    {value: 5, tooltip: 'Pathonomic features, OLD main differential even without exposure history'}
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
