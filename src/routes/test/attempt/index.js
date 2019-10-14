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
    SnackbarContent
} from '@material-ui/core';
import SchoolIcon from '@material-ui/icons/School';
import {NotificationManager} from 'react-notifications';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import ReactSpeedometer from "Components/GaugeChart";

const stepName = {
    mainQuestions: 'Questionnaires',
    additionalQuestions: 'Additional Questions',
    test: 'Test',
    score: 'Scores',
    answer: 'Answer'
};

export default class Attempt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attempts_id: this.props.match.params.attempt_id,
            attemptInfo: {},
            mainQuestions: [],
            isChangeMainQuestions: false,
            additionalQuestions: [],
            isChangeAdditionalQuestions: false,
            percentile: {},
            steps: [],
            stepIndex: this.props.match.params.step === undefined || isNaN(this.props.match.params.step) ? 0 : Number(this.props.match.params.step),
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
                if(detail.test_sets.modalities.image_quality) {
                    steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions'] : ['mainQuestions'];
                } else {
                    steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions', 'test', 'score', 'answer'] : ['mainQuestions', 'test', 'score', 'answer'];
                }
            }
            that.setState({
                mainQuestions: questionnaires.main,
                additionalQuestions: questionnaires.additional,
                attemptInfo: detail,
                percentile: percentile,
                steps: steps,
                loading: false,
            });
        }).catch((e) => {
            console.warn(e.message);
        })
    }

    onTest() {
        let nextPath = '/test-view/' + this.state.attemptInfo.test_set_id + '/' + this.state.attempts_id + '/';
        if(!this.state.attemptInfo.complete) {
            nextPath += this.state.attemptInfo.current_test_case_id;
        } else {
            nextPath += this.state.attemptInfo.test_sets.test_set_cases[0].test_case_id;
        }
        this.props.history.push(nextPath);
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
            }
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

    nextStep() {
        if (this.state.stepIndex === 0) { //mainQuestions
            this.setState({stepIndex: 1});
        } else if (this.state.stepIndex === 1) { //additionalQuestions
            this.goTestView();
        } else {

        }
    }

    onQuestionsNext() {
        if (!this.validateQuestions()) return true;
        let questions, type, isChanged;
        if (this.state.steps[this.state.stepIndex] === 'mainQuestions') {
            type = 'main';
            isChanged = this.state.isChangeMainQuestions;
            questions = this.state.mainQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
            type = 'additional';
            isChanged = this.state.isChangeAdditionalQuestions;
            questions = this.state.additionalQuestions;
        } else {
            return;
        }
        if (isChanged) {
            this.setState({loading: true});
            this.saveQuestions(questions, type).then((resp) => {
                if ((this.state.steps[this.state.stepIndex] === 'mainQuestions' && this.state.additionalQuestions.length === 0) ||
                    this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
                    this.setState({showConsentModal: true});
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

    onAcceptConsent() {
        this.setState({showConsentModal: false, stepIndex: this.state.stepIndex + 1});
    }

    onBack() {
        if (this.state.stepIndex > 0) {
            this.setState({stepIndex: this.state.stepIndex - 1});
        }
    }

    onChangeValue(index, value, checked) {
        let questionType, isChangeField;
        if (this.state.steps[this.state.stepIndex] === 'mainQuestions') {
            questionType = 'mainQuestions';
            isChangeField = 'isChangeMainQuestions';
        } else if (this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
            questionType = 'additionalQuestions';
            isChangeField = 'isChangeAdditionalQuestions';
        } else {
            return;
        }
        let questions = this.state[questionType];
        questions[index].error = false;
        if (questions[index].questionnaire.type === 0) {
            questions[index].answer = value;
        } else if (questions[index].questionnaire.type === 1) {
            if (questions[index].answer === undefined) questions[index].answer = [];
            if (checked) {
                questions[index].answer.push(value);
            } else {
                let i = questions[index].answer.indexOf(value);
                if (i !== -1) questions[index].answer.splice(i, 1);
            }
        } else if (questions[index].questionnaire.type === 2) {
            questions[index].answer = value;
        }
        this.setState({[questionType]: [...questions], [isChangeField]: true});
    }

    onClickStep = step => () => {
        if (this.state.attemptInfo.complete) {
            this.setState({stepIndex: step});
        }
    };

    onGetCertPdf() {
        this.setState({isDownCert: true});
        Apis.attemptsCertificatePdf(this.state.attempts_id).then((resp) => {
        }).catch((e) => {
            NotificationManager.error(e.response.data.error.message);
        }).finally(() => {
            this.setState({isDownCert: false});
        })
    }

    renderQuestionnaireItem(item, index) {
        let commponentDisable = this.state.attemptInfo.complete;
        if (item === undefined) return null;
        let itemClass = 'row questionnaire ' + (item.error ? "error" : "");
        if (item.questionnaire.type === 0) { //single option
            return (
                <FormGroup className={itemClass} key={index}>
                    <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                    <RadioGroup
                        disabled
                        aria-label="position"
                        name="position"
                        value={item.answer}
                        onChange={(event) => this.onChangeValue(index, event.target.value)}
                        row
                    >
                        {
                            item.questionnaire.questionnaire_options.map((v, i) => {
                                return (
                                    <FormControlLabel
                                        disabled={commponentDisable}
                                        value={v.id.toString()}
                                        control={<Radio/>}
                                        label={v.content}
                                        key={i}
                                    />
                                )
                            })
                        }
                    </RadioGroup>
                </FormGroup>
            )
        } else if (item.questionnaire.type === 1) {  //multiple option
            return (
                <FormGroup className={itemClass} key={index}>
                    <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                    <FormGroup row>
                        {
                            item.questionnaire.questionnaire_options.map((v, i) => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disabled={commponentDisable}
                                                checked={item.answer.indexOf(v.id.toString()) !== -1}
                                                onChange={(event) => this.onChangeValue(index, v.id.toString(), event.target.checked)}
                                            />
                                        }
                                        label={v.content}
                                        key={i}
                                    />
                                )
                            })
                        }
                    </FormGroup>
                </FormGroup>
            )
        } else if (item.questionnaire.type === 2) {   // text question
            return (
                <FormGroup className={itemClass} key={index}>
                    <Label style={{marginTop: 6}}>{item.questionnaire.name}&nbsp;<span className="text-danger">{item.questionnaire.required ? '*' : ''}</span></Label>
                    <Input
                        disabled={commponentDisable}
                        type="text"
                        name="name"
                        id="name"
                        placeholder=""
                        value={item.answer}
                        onChange={(e) => this.onChangeValue(index, e.target.value)}
                    />
                </FormGroup>
            );
        } else {
            return null;
        }
    }

    renderQuestionnaire() {
        let result = [];
        let questions;
        if (this.state.stepIndex === 0) {
            questions = this.state.mainQuestions;
        } else if (this.state.stepIndex === 1) {
            questions = this.state.additionalQuestions;
        } else {
            return null;
        }
        for (let i = 0; i < questions.length; i += 2) {
            result.push(
                <div className={'row'} key={i}>
                    <Col sm={6}>
                        {this.renderQuestionnaireItem(questions[i], i)}
                    </Col>
                    <Col sm={6}>
                        {this.renderQuestionnaireItem(questions[i + 1], i + 1)}
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
                        const props = {};
                        const buttonProps = {};
                        return (
                            <Step key={label} {...props}>
                                <StepButton onClick={this.onClickStep(index)} completed={!this.state.attemptInfo.complete && index < this.state.stepIndex} {...buttonProps}>
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
            if(v.metrics.name === 'Specificity(%)') {
                specitifity = Number(v.score);
            }
            if(v.metrics.name === 'Sensitivity(%)') {
                sensitivity = Number(v.score);
            }
            if(v.metrics.name === 'ROC') {
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
                                labelValues={{0: 0, 100: 100, ...this.state.percentile.specificity}}
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
                                labelValues={{0: 0, 100: 100, ...this.state.percentile.sensitivity}}
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
                                labelValues={{0: 0, 1: 1, 0.25: this.state.percentile.roc[25], 0.5: this.state.percentile.roc[50], 0.75: this.state.percentile.roc[75]}}
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
                                    <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onBack()}>Back</Button> : null
                            }
                            <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onQuestionsNext()}>Next</Button>
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
                                    <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onBack()}>Back</Button> : null
                            }
                            <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onQuestionsNext()}>Next</Button>
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
                                <div className="mb-20 fs-17">To proceed to the test click button below</div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="text-white"
                                    onClick={() => this.onTest()}
                                >
                                    Proceed to test
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
                                <div className="mb-20 fs-17">No attempts left or subscription expired. Please contact administrator if you want to try again.</div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="text-white"
                                    onClick={() => this.setState({stepIndex: this.state.stepIndex + 1})}
                                >
                                    Next
                                </Button>
                            </RctCollapsibleCard>
                        </div>
                    )
                }
            case 'score':
                return (
                    <div>
                        <div className={'text-center p-10'}>
                            <Button variant="contained" color="primary" disabled={this.state.isDownCert} onClick={() => this.onGetCertPdf()}><SchoolIcon className={'mr-10'}/>Certificate</Button>
                            {this.state.isDownCert && <div style={{marginTop: -28}}><CircularProgress size={20} style={{color: 'green'}}/></div>}
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
                                        <th>Name</th>
                                        <th>Value</th>
                                        <th>Description</th>
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
                            <div className="mb-20 fs-17">To see your answers and compare with truth click button below</div>
                            <Button
                                variant="contained"
                                color="primary"
                                className="text-white"
                                onClick={() => this.onTest()}
                            >
                                View Answer
                            </Button>
                        </RctCollapsibleCard>
                    </div>
                )
            default:
                return null
        };
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className={'questionnaire-wrapper'}>
                    <h1>{stepName[this.state.steps[this.state.stepIndex]]}</h1>
                    {this.renderStepper()}
                    {this.renderStepContent()}
                    <Dialog open={this.state.showConsentModal} onClose={() => null} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth>
                        <DialogTitle id="alert-dialog-title">
                            <div className={'text-center fs-23'}>Consent</div>
                        </DialogTitle>
                        <DialogContent>
                            <span className={'fs-17'}>I understand that:</span>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10">The results of the screen read test set are de-identified, with test results identified only by Reader Numbers</span>
                            </div>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10">My results may form part of the Quality Assurance Program of my Service or Clinic</span>
                            </div>
                            <div className={'fs-17 mt-15'}>I consent to:</div>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10">My de-identified results to be used to further develop test sets and the educational program</span>
                            </div>
                            <div>
                                <span className="dot badge-secondary mr-10">&nbsp;</span>
                                <span className="fs-14 mr-10">My de-identified results to be used for research which may be published in peer reviewed scientific journals</span>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => this.onAcceptConsent()} color="primary" className="text-white" autoFocus> Agree </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        } else {
            return (<RctSectionLoader/>);
        }
    }
}