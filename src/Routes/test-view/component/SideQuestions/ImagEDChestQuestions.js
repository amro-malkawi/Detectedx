import React, {Component} from 'react'
import {RadioGroup} from "@mui/material";
import {QuestionLabel, QuestionRadio, QuestionCheckbox, } from 'Components/SideQuestionComponents';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";


const chestQuestion = [
    {
        id: 'imagedChestQ1',
        label: 'Are all relevant anatomic features clearly visible?',
        options: ['No', 'Yes'],
        desc: 'Please highlight any feature below that is displayed in a less than optimal way:',
        child: ['Costophrenic angles', 'Lung Apices', 'Chest lateral borders', 'A maximum of ten posterior ribs', 'Vascular markings of the lungs', '5th-7th anterior ribs'],
        showChildOptions: ['No']
    },
    {
        id: 'imagedChestQ2',
        label: 'Is the lung clearly presented without any obscuring features?',
        options: ['No', 'Yes'],
        desc: 'Please highlight any parameter below that is obscuring the lungs:',
        child: ['The scapulae', 'The chin', 'Arms', 'Patient rotation', 'Patient movement', 'Lordosis', 'Quantum mottle', 'Collimation', 'Exposure factors', 'Scattered radiation'],
        showChildOptions: ['No']
    },
    {
        id: 'imagedChestQ3',
        label: 'Are all important technical requirements adhered to?',
        options: ['No', 'Yes'],
        desc: 'Please highlight any requirement that isn’t adhered to',
        child: ['Side marker not visible or in the wrong location', 'Poor level of collimation', 'Side marker is back to front'],
        showChildOptions: ['No']
    },
    {
        id: 'imagedChestQ4',
        label: 'Should this image be accepted?',
        options: ['No', 'Yes'],
    },
]

const chestLateralQuestion = [
    {
        id: 'imagedChestQ1',
        label: 'Are all relevant anatomic features clearly visible?',
        options: ['No', 'Yes'],
        desc: 'Please highlight any feature below that is displayed in a less than optimal way:',
        child: ['Costophrenic angles', 'Anterior border of chest', 'Posterior border of chest', 'Vascular markings of the lungs', '10 posterior ribs shown above diaphragm (good inspiration)'],
        showChildOptions: ['No']
    },
    {
        id: 'imagedChestQ2',
        label: 'Is the lung clearly presented without any obscuring features?',
        options: ['No', 'Yes'],
        desc: 'Please highlight any parameter below that is obscuring the lungs:',
        child: [
            'The arms overlying the apices', 'Patient laterally leaning from side to side (so anterior ribs/posterio costophrenic angles are not superimposed)',
            'Patient rotation (sternum in profile/ribs not superimposed posteriorly)', 'Patient movement', 'Collimation', 'Exposure factors'],
        showChildOptions: ['No']
    },
    {
        id: 'imagedChestQ3',
        label: 'Are all important technical requirements adhered to?',
        options: ['No', 'Yes'],
        desc: 'Please highlight any requirement that isn’t adhered to',
        child: ['Side marker not visible or in the wrong location', 'Side marker is back to front', 'Poor level of collimation'],
        showChildOptions: ['No']
    },
    {
        id: 'imagedChestQ4',
        label: 'Should this image be accepted?',
        options: ['No', 'Yes'],
    },
]

class ImagEDChestQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answerValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            answerRating: -1,
            truthValue: {}
        }
        if (props.modalityInfo.name.indexOf('Lateral') === -1) {
            // ImagED - Chest Question
            this.question = chestQuestion;
        } else {
            // ImagED - Chest Lateral Question
            this.question = chestLateralQuestion;
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
        if (this.question.every((q) => answerValue[q.id] !== undefined)) {
            return true;
        } else {
            NotificationManager.error("Please select values for all questions.");
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
            } label={v.label} className={'align-items-start'}
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
                <div className={'ms-3'}>
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

    renderQuestion(questionObj, index, disabled) {
        const {answerValue, truthValue} = this.state;
        const qTruth = truthValue[questionObj.id] !== undefined ? truthValue[questionObj.id].value : '';
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title d-flex'}>
                    <span className={'me-1'}>{index}.</span><span style={{flex: 1}}>{questionObj.label}</span>
                </div>
                <RadioGroup
                    className={'ms-4'}
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
        const disabled = this.props.complete;
        return (
            <div className={'ps-10 covid-question-container chest-data'}>
                <div>
                    <div className={'covid-questions'}>
                        {
                            this.question.map((v, i) => this.renderQuestion(v, i + 1, disabled))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

// map state to props
const mapStateToProps = (state) => {
    return {
        modalityInfo: state.testView.modalityInfo
    };
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(ImagEDChestQuestions);

