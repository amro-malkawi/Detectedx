import React, {Component} from 'react';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import * as Apis from 'Api';
import {Col, Label, Input} from "reactstrap";
import {
    Radio,
    Checkbox,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    Button,
    Stepper,
    Step,
    StepButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import {NotificationManager} from 'react-notifications';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import ReactSpeedometer from "Components/GaugeChart";
import PostQuestionForm from "./PostQuestionForm";
import IntlMessages from "Util/IntlMessages";

const stepName = {
    mainQuestions: <IntlMessages id="test.questionnaires"/>,
    additionalQuestions: <IntlMessages id="test.additionalQuestions"/>,
    test: <IntlMessages id="test.test"/>,
    score: <IntlMessages id="test.scores"/>,
    answer: <IntlMessages id="test.answers"/>,
    postTest: <IntlMessages id="test.postTest"/>,
    postQuestions: <IntlMessages id="test.evaluationForm"/>,
    postScore: <IntlMessages id="test.results"/>
};

export default class Attempt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attempts_id: this.props.match.params.attempt_id,
            attemptInfo: {},
            mainQuestions: [],
            post_stage: 0,
            isChangeMainQuestions: false,
            additionalQuestions: [],
            isChangeAdditionalQuestions: false,
            postQuestions: [],
            isChangePostQuestions: false,
            percentile: {},
            steps: [],
            stepIndex: 0,
            showConsentModal: false,
            loading: true,
            isDownCert: false,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const that = this;
        let promise0 = new Promise(function (resolve, reject) {
            Apis.attemptsQuestionnaire(that.state.attempts_id).then((resp) => {
                resolve(resp);
            }).catch((e) => {
                reject(e);
            });
        });

        let promise1 = new Promise(function (resolve, reject) {
            Apis.attemptsDetail(that.state.attempts_id).then((resp) => {
                resolve(resp);
            }).catch((e) => {
                reject(e);
            })
        });

        let promise2 = new Promise(function (resolve, reject) {
            Apis.attemptsPercentile(that.state.attempts_id).then((resp) => {
                resolve(resp);
            }).catch((e) => {
                reject(e);
            });
        });

        Promise.all([promise0, promise1, promise2]).then(function (values) {
            const [questionnaires, detail, percentile] = values;
            let steps;
            if (!detail.complete) {
                steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions', 'test'] : ['mainQuestions', 'test'];
            } else {
                if (detail.test_sets.modalities.modality_type === 'image_quality') {
                    steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions'] : ['mainQuestions'];
                } else {
                    steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions', 'test', 'score', 'answer'] : ['mainQuestions', 'test', 'score', 'answer'];
                }
                if (detail.test_sets.has_post) {
                    steps = steps.concat(['postTest', 'postQuestions', 'postScore']);
                }
            }
            const stepIndex = that.props.match.params.step === undefined ? 0 : (steps.indexOf(that.props.match.params.step) > -1 ? steps.indexOf(that.props.match.params.step) : 0);
            that.setState({
                mainQuestions: questionnaires.main,
                additionalQuestions: questionnaires.additional,
                postQuestions: questionnaires.post,
                attemptInfo: detail,
                post_stage: detail.post_stage,
                percentile: percentile,
                steps: steps,
                stepIndex,
                loading: false,
            });
        }).catch((e) => {
            console.warn(e.message);
        })
    }

    onTest() {
        let nextPath = '/test-view/' + this.state.attemptInfo.test_set_id + '/' + this.state.attempts_id + '/';
        if (!this.state.attemptInfo.complete) {
            nextPath += this.state.attemptInfo.current_test_case_id;
        } else {
            nextPath += this.state.attemptInfo.test_sets.test_set_cases[0].test_case_id;
        }
        this.props.history.push(nextPath);
    }

    onPostTest() {
        if (this.state.attemptInfo.complete) {
            let nextPath = '/test-view/' + this.state.attemptInfo.test_set_id + '/' + this.state.attempts_id + '/';
            nextPath += this.state.attemptInfo.test_sets.test_set_post_cases[0].test_case_id;
            this.props.history.push(nextPath + '/post');
        }
    }

    /**
     * Questions operations
     */
    validateQuestions() {
        const questions = this.state[this.state.steps[this.state.stepIndex]];
        let isValidate = true;
        questions.forEach((v, index) => {
            if (v.questionnaire.type === 0) {
                if (v.questionnaire.required && v.answer === '') {
                    isValidate = false;
                    v.error = true;
                }
            } else if (v.questionnaire.type === 1) {
                if (v.questionnaire.required && v.answer.length === 0) {
                    isValidate = false;
                    v.error = true;
                }
            } else if (v.questionnaire.type === 2) {
                if (v.questionnaire.required && v.answer === '') {
                    isValidate = false;
                    v.error = true;
                }
            } else if (v.questionnaire.type === 3) {
                if (v.questionnaire.required && (v.answer === undefined || v.answer.length !== v.questionnaire.questionnaire_options.length)) {
                    isValidate = false;
                    v.error = true;
                }
            }
        });
        this.setState({[this.state.steps[this.state.stepIndex]]: questions});
        return isValidate;
    }

    saveQuestions(questions, questionType) {
        let answers = [];
        const attemptId = this.state.attempts_id;
        questions.forEach((v, index) => {
            let obj = {
                questionnaire_id: v.questionnaire.id
            };
            if (v.questionnaire.type === 0) {
                obj.answer = v.answer;
            } else if (v.questionnaire.type === 1) {
                obj.answer = v.answer.join(',');
            } else if (v.questionnaire.type === 2) {
                obj.answer = v.answer;
            } else if (v.questionnaire.type === 3) {
                obj.answer = v.answer;
            }
            if (v.extra_answer !== undefined) obj.extra_answer = JSON.stringify(v.extra_answer);
            answers.push(obj);
        });
        return new Promise(function (resolve, reject) {
            Apis.attemptsQuestionnaireAnswer(attemptId, answers, questionType).then(resp => {
                resolve(resp);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    onQuestionsNext() {
        let questions, type, isChanged;
        if (this.state.steps[this.state.stepIndex] === 'mainQuestions') {
            type = 'main';
            isChanged = this.state.isChangeMainQuestions;
            questions = this.state.mainQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
            type = 'additional';
            isChanged = this.state.isChangeAdditionalQuestions;
            questions = this.state.additionalQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'postQuestions') {
            type = 'post';
            isChanged = this.state.isChangePostQuestions;
            questions = this.state.postQuestions;
        } else {
            return;
        }
        if (type === 'post') {
            if (this.state.post_stage < 2) {
                const postAnswer = this.postQuestionFormRef.getAnswerData();
                if (!postAnswer) {
                    NotificationManager.error('Please answer about all questions');
                    return;
                }
                Apis.attemptsSavePostAnswer(this.state.attempts_id, JSON.stringify(postAnswer)).then((resp) => {
                    this.setState({post_stage: 2, stepIndex: this.state.stepIndex + 1, postQuestions: postAnswer});
                }).catch((e) => {
                    console.warn(e);
                    NotificationManager.error(e.message);
                }).finally(() => {
                    this.setState({loading: false});
                });
            } else {
                this.setState({stepIndex: this.state.stepIndex + 1});
            }
        } else {
            if (!this.validateQuestions()) return true;
            if (isChanged) {
                this.setState({loading: true});
                this.saveQuestions(questions, type).then((resp) => {
                    if ((this.state.steps[this.state.stepIndex] === 'mainQuestions' && this.state.additionalQuestions.length === 0) ||
                        this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
                        this.setState({showConsentModal: true});
                    } else if (type === 'post') {
                        this.setState({post_stage: 2, stepIndex: this.state.stepIndex + 1});
                    } else {
                        this.setState({stepIndex: this.state.stepIndex + 1});
                    }
                }).catch((e) => {
                    console.warn(e);
                    NotificationManager.error(e.message);
                }).finally(() => {
                    this.setState({loading: false});
                });
            } else {
                if ((this.state.steps[this.state.stepIndex] === 'mainQuestions' && this.state.additionalQuestions.length !== 0) || this.state.attemptInfo.complete) {
                    this.setState({stepIndex: this.state.stepIndex + 1});
                } else {
                    this.setState({showConsentModal: true});
                }
            }
        }
    }

    onAcceptConsent() {
        this.setState({showConsentModal: false, stepIndex: this.state.stepIndex + 1});
    }

    onBack() {
        if (this.state.stepIndex > 0) {
            this.setState({stepIndex: this.state.stepIndex - 1});
        }
    }

    onQuestionChangeAnswer(index, value, checked, isExtra) {
        let questionType, isChangeField;
        if (this.state.steps[this.state.stepIndex] === 'mainQuestions') {
            questionType = 'mainQuestions';
            isChangeField = 'isChangeMainQuestions';
        } else if (this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
            questionType = 'additionalQuestions';
            isChangeField = 'isChangeAdditionalQuestions';
        } else if (this.state.steps[this.state.stepIndex] === 'postQuestions') {
            questionType = 'postQuestions';
            isChangeField = 'isChangePostQuestions';
        } else {
            return;
        }
        let questions = this.state[questionType];
        questions[index].error = false;
        if (questions[index].questionnaire.type === 0) {
            if (isExtra !== undefined && isExtra) {
                questions[index].extra_answer = value;
            } else {
                questions[index].answer = value;
                if (questions[index].questionnaire.has_other_text) questions[index].extra_answer = '';
            }
        } else if (questions[index].questionnaire.type === 1) {
            if (isExtra !== undefined && isExtra) {
                questions[index].extra_answer = value;
            } else {
                if (questions[index].answer === undefined) questions[index].answer = [];
                if (checked) {
                    questions[index].answer.push(value);
                } else {
                    let i = questions[index].answer.indexOf(value);
                    if (i !== -1) questions[index].answer.splice(i, 1);
                }
                // clear extra text
                if (questions[index].questionnaire.has_other_text) {
                    let selectedOptions = questions[index].questionnaire.questionnaire_options.filter(v => questions[index].answer.indexOf(v.id) > -1);
                    if (!selectedOptions.some(v => v.content.toLowerCase() === 'other')) questions[index].extra_answer = '';
                }
            }
        } else if (questions[index].questionnaire.type === 2) {
            questions[index].answer = value;
        } else if (questions[index].questionnaire.type === 3) {
            if (questions[index].answer === undefined) questions[index].answer = [];
            if (questions[index].extra_answer === undefined) questions[index].extra_answer = {};
            if (questions[index].answer.indexOf(value.option) === -1) questions[index].answer.push(value.option);
            questions[index].extra_answer[value.option] = value.subOption;
        }
        this.setState({[questionType]: [...questions], [isChangeField]: true});
    }


    onClickStep = step => () => {
        if (this.state.attemptInfo.complete) {
            if (this.state.attemptInfo.test_sets.has_post) {
                if ((this.state.post_stage === 0 && step <= this.state.steps.indexOf('postTest'))
                    || (this.state.post_stage === 1 && step <= this.state.steps.indexOf('postQuestions'))
                    || (this.state.post_stage === 2 && step <= this.state.steps.indexOf('postScore'))) {
                    this.setState({stepIndex: step});
                }
            } else {
                this.setState({stepIndex: step});
            }
        }
    };

    onGetCertPdf(type) {
        this.setState({isDownCert: true});
        Apis.attemptsCertificatePdf(this.state.attempts_id, type).then((resp) => {
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
            this.setState({isDownCert: false});
        })
    }

    //////////////////// temporary question type /////////////////////
    renderSpecialQuestionnaire1(item, index, isDisable) {
        let options = item.questionnaire.questionnaire_options;
        let itemClass = 'row questionnaire ' + (item.error ? "error" : "");
        let isTextDisable = !options.some(v => v.id === item.answer && v.content.toLowerCase() === 'no');
        return (
            <FormGroup className={itemClass} key={index}>
                <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span
                    className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                <RadioGroup
                    disabled
                    aria-label="position"
                    name="position"
                    value={item.answer}
                    row
                >
                    {
                        options.map((v, i) => {
                            return (
                                <FormControlLabel
                                    disabled={isDisable}
                                    value={v.id.toString()}
                                    control={<Radio/>}
                                    label={v.content}
                                    key={i}
                                    onChange={(event) => this.onQuestionChangeAnswer(index, event.target.value)}
                                />
                            )
                        })
                    }
                </RadioGroup>
                <FormGroup row>
                    <Col sm={3}>
                        <Label style={{fontSize: 14}}>If no, please explain: </Label>
                    </Col>
                    <Col sm={9}>
                        <Input
                            disabled={isDisable || isTextDisable}
                            type="text"
                            name="name"
                            id="other_text"
                            placeholder=""
                            value={item.extra_answer}
                            style={{marginTop: -5}}
                            onChange={(e) => this.onQuestionChangeAnswer(index, e.target.value, false, true)}
                        />
                    </Col>
                </FormGroup>
            </FormGroup>
        )
    }

    renderSpecialQuestionnaire2(item, index, isDisable) {
        let options = item.questionnaire.questionnaire_options;
        let itemClass = 'row questionnaire ' + (item.error ? "error" : "");
        let isTextDisable = !options.some(v => v.id === item.answer && v.content.toLowerCase() === 'yes');
        return (
            <FormGroup className={itemClass} key={index}>
                <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span
                    className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                <RadioGroup
                    disabled
                    aria-label="position"
                    name="position"
                    value={item.answer}
                    row
                >
                    {
                        options.map((v, i) => {
                            if (v.content.toLowerCase() === 'yes') {
                                return (
                                    <FormControlLabel
                                        disabled={isDisable}
                                        value={v.id.toString()}
                                        control={<Radio/>}
                                        label={
                                            <div className={'row'}>
                                                <Col sm={6} style={{paddingRight: 0}}>
                                                    <Label style={{fontSize: 14, marginTop: 9}}>Yes, you can contact me at: </Label>
                                                </Col>
                                                <Col sm={6} style={{paddingLeft: 0, paddingRight: 30}}>
                                                    <Input
                                                        disabled={isDisable || isTextDisable}
                                                        type="text"
                                                        name="name"
                                                        id="other_text"
                                                        placeholder=""
                                                        value={item.extra_answer}
                                                        className={'sm-7'}
                                                        style={{marginTop: 0}}
                                                        onChange={(e) => this.onQuestionChangeAnswer(index, e.target.value, false, true)}
                                                    />
                                                </Col>
                                            </div>
                                        }
                                        key={i}
                                        style={{marginRight: 0}}
                                        onChange={(event) => this.onQuestionChangeAnswer(index, event.target.value)}
                                    />
                                )
                            } else {
                                return (
                                    <FormControlLabel
                                        disabled={isDisable}
                                        value={v.id.toString()}
                                        control={<Radio/>}
                                        label={v.content}
                                        key={i}
                                        onChange={(event) => this.onQuestionChangeAnswer(index, event.target.value)}
                                    />
                                )
                            }
                        })
                    }
                </RadioGroup>
            </FormGroup>
        )
    }

    renderQuestionnaireItem(item, index, isDisable) {
        let commponentDisable = isDisable;
        if (item === undefined) return null;
        let itemClass = 'row questionnaire ' + (item.error ? "error" : "");
        if (item.questionnaire.type === 0) { //single option
            if (item.questionnaire.name.indexOf('Would you be interested in participating in a phone interview to discuss your practice patterns') > -1) {
                return this.renderSpecialQuestionnaire1(item, index, isDisable);
            } else if (item.questionnaire.name.indexOf('The content was objective, current, scientifically sound and free of commercial bias') > -1) {
                return this.renderSpecialQuestionnaire2(item, index, isDisable);
            } else {
                let options = item.questionnaire.questionnaire_options;
                let isOtherTextDisable = !options.some(v => v.id === item.answer && v.content.toLowerCase() === 'other');
                return (
                    <FormGroup className={itemClass} key={index}>
                        <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span
                            className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={item.answer}
                            row
                        >
                            {
                                options.map((v, i) => {
                                    return (
                                        <FormControlLabel
                                            disabled={commponentDisable}
                                            value={v.id.toString()}
                                            control={<Radio/>}
                                            label={v.content}
                                            key={i}
                                            onChange={(event) => this.onQuestionChangeAnswer(index, event.target.value)}
                                        />
                                    )
                                })
                            }
                            {
                                item.questionnaire.has_other_text ?
                                    <div>
                                        <Input
                                            disabled={isOtherTextDisable || commponentDisable}
                                            type="text"
                                            name="name"
                                            id="other_text"
                                            placeholder=""
                                            value={item.extra_answer}
                                            style={{marginTop: 0}}
                                            onChange={(e) => this.onQuestionChangeAnswer(index, e.target.value, false, true)}
                                        />
                                    </div> : null
                            }
                        </RadioGroup>
                    </FormGroup>
                )
            }
        } else if (item.questionnaire.type === 1) {  //multiple option
            let options = item.questionnaire.questionnaire_options;
            let selectOptions = options.filter(v => item.answer.indexOf(v.id) > -1);
            let isOtherTextDisable = !selectOptions.some(v => v.content.toLowerCase() === 'other');
            return (
                <FormGroup className={itemClass} key={index}>
                    <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span
                        className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                    <FormGroup row>
                        {
                            options.map((v, i) => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disabled={commponentDisable}
                                                checked={item.answer.indexOf(v.id.toString()) !== -1}
                                                onChange={(event) => this.onQuestionChangeAnswer(index, v.id.toString(), event.target.checked)}
                                            />
                                        }
                                        label={v.content}
                                        key={i}
                                    />
                                )
                            })
                        }
                        {
                            item.questionnaire.has_other_text ?
                                <div>
                                    <Input
                                        disabled={isOtherTextDisable || commponentDisable}
                                        type="text"
                                        name="name"
                                        id="other_text"
                                        placeholder=""
                                        value={item.extra_answer}
                                        style={{marginTop: 0}}
                                        onChange={(e) => this.onQuestionChangeAnswer(index, e.target.value, false, true)}
                                    />
                                </div> : null
                        }
                    </FormGroup>
                </FormGroup>
            )
        } else if (item.questionnaire.type === 2) {   // text question
            return (
                <FormGroup className={itemClass} key={index}>
                    <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span
                        className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                    <Input
                        disabled={commponentDisable}
                        type="text"
                        name="name"
                        id="name"
                        placeholder=""
                        value={item.answer}
                        onChange={(e) => this.onQuestionChangeAnswer(index, e.target.value)}
                    />
                </FormGroup>
            );
        } else if (item.questionnaire.type === 3) {   // multiple select
            return (
                <FormGroup className={itemClass} key={index}>
                    <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span
                        className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                    {
                        item.questionnaire.questionnaire_options.map((v, i) => {
                            return (
                                <FormGroup className={'ml-10'} key={i}>
                                    <Label style={{fontSize: 14}}>{v.content.option}</Label>
                                    <RadioGroup
                                        disabled
                                        aria-label="position"
                                        name="position"
                                        value={item.extra_answer && item.extra_answer[v.id]}
                                        onChange={(event) => this.onQuestionChangeAnswer(index, {
                                            option: v.id,
                                            subOption: event.target.value
                                        })}
                                        row
                                    >
                                        {
                                            v.content.subOptions.map((vv, ii) => {
                                                return (
                                                    <FormControlLabel
                                                        disabled={commponentDisable}
                                                        value={vv}
                                                        control={<Radio/>}
                                                        label={vv}
                                                        key={ii}
                                                    />
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </FormGroup>
                            )
                        })
                    }
                </FormGroup>
            )
        } else {
            return null;
        }
    }

    renderQuestionnaire() {
        let result = [];
        let questions;
        let isDisable = this.state.attemptInfo.complete;
        if (this.state.steps[this.state.stepIndex] === 'mainQuestions') {
            questions = this.state.mainQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
            questions = this.state.additionalQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'postQuestions') {
            questions = this.state.postQuestions;
            if (this.state.attemptInfo.complete && this.state.post_stage === 1) {
                isDisable = false;
            }
        } else {
            return null;
        }
        for (let i = 0; i < questions.length; i += 2) {
            result.push(
                <div className={'row'} key={i}>
                    <Col sm={6}>
                        {this.renderQuestionnaireItem(questions[i], i, isDisable)}
                    </Col>
                    <Col sm={6}>
                        {this.renderQuestionnaireItem(questions[i + 1], i + 1, isDisable)}
                    </Col>
                </div>
            )
        }
        return result;
    }

    renderStepper() {
        return (
            <div>
                <Stepper alternativeLabel nonLinear activeStep={this.state.stepIndex}>
                    {this.state.steps.map((label, index) => {
                        label = stepName[label];
                        const props = {};
                        const buttonProps = {};
                        let stepCompleted = false;
                        if (!this.state.attemptInfo.complete) {
                            stepCompleted = index < this.state.stepIndex;
                        } else {
                            if (this.state.attemptInfo.test_sets.has_post) {
                                if (this.state.post_stage === 0) {          // post test
                                    stepCompleted = index < this.state.steps.indexOf('postTest');
                                } else if (this.state.post_stage === 1) {   //post question
                                    stepCompleted = index < this.state.steps.indexOf('postQuestions');
                                } else if (this.state.post_stage >= 2) {   //post score
                                    stepCompleted = true;
                                }
                            } else {
                                stepCompleted = true;
                            }
                        }
                        stepCompleted = index === this.state.stepIndex ? false : stepCompleted;
                        return (
                            <Step key={label} {...props}>
                                <StepButton onClick={this.onClickStep(index)}
                                            completed={stepCompleted} {...buttonProps}>
                                    {label}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        );
    }

    renderGaugeChart() {
        let specitifity, sensitivity, roc;
        this.state.attemptInfo.scores.map((v) => {
            if (v.metrics.name.indexOf('Specificity(%)') > -1) {
                specitifity = Number(v.score);
            }
            if (v.metrics.name.indexOf('Sensitivity(%)') > -1) {
                sensitivity = Number(v.score);
            }
            if (v.metrics.name.indexOf('ROC') > -1) {
                roc = Number(v.score);
            }
        });
        return (
            <div>
                <div className={'gauge-color mb-20'}>
                    <div>
                        <span>&#60;25th</span>
                    </div>
                    <div>
                        <span>25th</span>
                    </div>
                    <div>
                        <span>Median</span>
                    </div>
                    <div>
                        <span>75th</span>
                    </div>
                </div>
                {
                    specitifity !== undefined ?
                        <div className={'gauge-chart'}>
                            <ReactSpeedometer
                                fluidWidth
                                maxValue={100}
                                value={specitifity}
                                labelValues={{
                                    0: 0,
                                    25: this.state.percentile.specificity[25],
                                    50: this.state.percentile.specificity[50],
                                    75: this.state.percentile.specificity[75],
                                    100: 100
                                }}
                                segments={4}
                                ringWidth={30}
                                currentValueText="Specificity: ${value}%"
                            />
                        </div> : null
                }
                {
                    sensitivity !== undefined ?
                        <div className={'gauge-chart'}>
                            <ReactSpeedometer
                                fluidWidth
                                maxValue={100}
                                value={sensitivity}
                                labelValues={{
                                    0: 0,
                                    25: this.state.percentile.sensitivity[25],
                                    50: this.state.percentile.sensitivity[50],
                                    75: this.state.percentile.sensitivity[75],
                                    100: 100
                                }}
                                segments={4}
                                ringWidth={30}
                                currentValueText="Sensitivity: ${value}%"
                            />
                        </div> : null
                }
                {
                    roc !== undefined && this.state.percentile.roc ?
                        <div className={'gauge-chart mb-1'}>
                            <ReactSpeedometer
                                fluidWidth
                                maxValue={1}
                                labelValues={{
                                    0: 0,
                                    1: 1,
                                    0.25: this.state.percentile.roc[25],
                                    0.5: this.state.percentile.roc[50],
                                    0.75: this.state.percentile.roc[75]
                                }}
                                value={roc}
                                segments={4}
                                ringWidth={30}
                                currentValueText="ROC: ${value}"
                            />
                        </div> : null
                }
            </div>
        )
    }

    renderStepContent() {
        switch (this.state.steps[this.state.stepIndex]) {
            case 'mainQuestions':
                return (
                    <div>
                        {this.renderQuestionnaire()}
                        <div className={'text-center mt-70'}>
                            {
                                this.state.stepIndex > 0 ?
                                    <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onBack()}><IntlMessages id="test.back"/></Button> : null
                            }
                            <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onQuestionsNext()}><IntlMessages id="test.next"/></Button>
                        </div>
                    </div>
                );
            case 'additionalQuestions':
                return (
                    <div>
                        {this.renderQuestionnaire()}
                        <div className={'text-center mt-70'}>
                            {
                                this.state.stepIndex > 0 ?
                                    <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onBack()}><IntlMessages id="test.back"/></Button> : null
                            }
                            <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onQuestionsNext()}><IntlMessages id="test.next"/></Button>
                        </div>
                    </div>
                );
            case 'test':
                if (!this.state.attemptInfo.complete) {
                    return (
                        <div>
                            <RctCollapsibleCard
                                customClasses="p-20 text-center"
                            >
                                {
                                    this.state.attemptInfo.test_sets.has_post ?
                                        <p className="fs-17"><IntlMessages id="test.attempt.testText1"/></p> : null
                                }

                                <p className="mb-20 fs-17"><IntlMessages id="test.attempt.testText2"/></p>
                                <div className="mb-20 fs-17"><IntlMessages id="test.attempt.testText3"/></div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="text-white"
                                    onClick={() => this.onTest()}
                                >
                                    <IntlMessages id="test.proceedToTest"/>
                                </Button>
                            </RctCollapsibleCard>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <RctCollapsibleCard
                                customClasses="p-20 text-center"
                            >
                                <div className="mb-20 fs-17"><IntlMessages id="test.attempt.testExpiredText"/></div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="text-white"
                                    onClick={() => this.setState({stepIndex: this.state.stepIndex + 1})}
                                >
                                    <IntlMessages id="test.next"/>
                                </Button>
                            </RctCollapsibleCard>
                        </div>
                    )
                }
            case 'score':
                return (
                    <div>
                        <div className={'text-center p-10'}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={this.state.isDownCert}
                                onClick={() => this.onGetCertPdf('normal')}
                            >
                                <SchoolIcon className={'mr-10'}/><IntlMessages id='test.certificate'/>
                            </Button>
                            {this.state.isDownCert &&
                            <div style={{marginTop: -28}}><CircularProgress size={20} style={{color: 'green'}}/></div>}
                        </div>
                        <div className="row">
                            <RctCollapsibleCard
                                customClasses="p-20"
                                colClasses="col-sm-12 col-lg-9"
                                fullBlock
                            >
                                <table className="table table-middle table-hover mb-0">
                                    <thead>
                                    <tr>
                                        <th><IntlMessages id={"test.name"}/></th>
                                        <th><IntlMessages id={"test.value"} /></th>
                                        <th><IntlMessages id={"test.description"}/></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.attemptInfo.scores.map((v, i) => (
                                            <tr key={i}>
                                                <td>{v.metrics.name}</td>
                                                <td>{v.score}</td>
                                                <td className={'fs-13'}>{v.metrics.description}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </RctCollapsibleCard>
                            <RctCollapsibleCard
                                colClasses="col-sm-12 col-lg-3"
                            >
                                {this.renderGaugeChart()}
                            </RctCollapsibleCard>
                        </div>
                    </div>
                );
            case 'answer':
                return (
                    <div>
                        <RctCollapsibleCard
                            customClasses="p-20 text-center"
                        >
                            <div className="mb-20 fs-17"><IntlMessages id={"test.attempt.answerViewText"}/>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                className="text-white"
                                onClick={() => this.onTest()}
                            >
                                <IntlMessages id={"test.viewAnswer"}/>
                            </Button>
                        </RctCollapsibleCard>
                    </div>
                );
            case 'postTest':
                if (this.state.attemptInfo.complete) {
                    return (
                        <div>
                            <RctCollapsibleCard
                                customClasses="p-20 text-center"
                            >
                                <p className="mb-5 fs-17"><IntlMessages id={"test.attempt.postTestText"}/></p>
                                <div className="mb-20 fs-17"><IntlMessages id={"test.attempt.testText3"}/></div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="text-white"
                                    onClick={() => this.onPostTest()}
                                >
                                    {
                                        this.state.post_stage === 0 ?
                                            <IntlMessages id={"test.proceedPostTest"}/> : <IntlMessages id={"test.viewPostTest"}/>
                                    }
                                </Button>
                            </RctCollapsibleCard>
                        </div>
                    );
                } else {
                    return null;
                }
            case 'postQuestions':
                if (this.state.attemptInfo.complete && this.state.post_stage > 0) {
                    return (
                        <div>
                            <PostQuestionForm
                                answer={this.state.postQuestions}
                                onRef={ref => (this.postQuestionFormRef = ref)}
                                complete={this.state.attemptInfo.complete && this.state.post_stage > 1}
                                isCovid={this.state.attemptInfo.test_sets.modalities.modality_type === 'covid'}
                            />
                            {/*{this.renderQuestionnaire()}*/}
                            <div className={'text-center mt-70'}>
                                {
                                    this.state.stepIndex > 0 ?
                                        <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onBack()}><IntlMessages id={"test.back"}/></Button> : null
                                }
                                <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onQuestionsNext()}><IntlMessages id={"test.next"}/></Button>
                            </div>
                        </div>
                    );
                } else {
                    return null;
                }
            case 'postScore':
                if (this.state.attemptInfo.complete && this.state.post_stage >= 2) {
                    const postScore = this.state.attemptInfo.scores_post === undefined || this.state.attemptInfo.scores_post.length === 0 ? 0 : this.state.attemptInfo.scores_post[0].score;
                    return (
                        <RctCollapsibleCard
                            customClasses="p-20 text-center"
                        >
                            <p className="mb-50 fs-17"><IntlMessages id={"test.yourScore"}/> {postScore}%</p>
                            {
                                postScore >= 75 ?
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={'mr-30'}
                                            disabled={this.state.isDownCert}
                                            onClick={() => this.onGetCertPdf('post_physicians')}>
                                            <SchoolIcon className={'mr-10'}/><IntlMessages id={"test.certificatePhysicians"}/>
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={this.state.isDownCert}
                                            onClick={() => this.onGetCertPdf('post_other')}>
                                            <SchoolIcon className={'mr-10'}/><IntlMessages id={"test.certificateNonPhysicians"}/>
                                        </Button>
                                        {
                                            this.state.isDownCert && <div style={{marginTop: -28}}><CircularProgress size={20} style={{color: 'green'}}/></div>
                                        }
                                    </div> : null
                            }
                        </RctCollapsibleCard>
                    );
                } else {
                    return null;
                }
            default:
                return null;
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className={'questionnaire-wrapper mt-30 mb-30'}>
                    <h1>{stepName[this.state.steps[this.state.stepIndex]]}</h1>
                    {this.renderStepper()}
                    {this.renderStepContent()}
                    <Dialog open={this.state.showConsentModal} onClose={() => null} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                        <DialogTitle id="alert-dialog-title">
                            <div className={'text-center fs-23'}><IntlMessages id={"test.consent"}/></div>
                        </DialogTitle>
                        <DialogContent>
                            <span className={'fs-17'}><IntlMessages id={"test.attempt.consent.understand"}/></span>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text1"}/></span>
                            </div>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text2"}/></span>
                            </div>
                            <div className={'fs-17 mt-15'}><IntlMessages id={"test.attempt.consent.consent"}/></div>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text3"}/></span>
                            </div>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10"><IntlMessages id={"test.attempt.consent.text4"}/></span>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => this.onAcceptConsent()} color="primary" className="text-white" autoFocus> <IntlMessages id={"test.agree"}/> </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        } else {
            return (<RctSectionLoader/>);
        }
    }
}