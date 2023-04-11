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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';
import SchoolIcon from '@mui/icons-material/School';
import MailIcon from '@mui/icons-material/Mail';
import {NotificationManager} from 'react-notifications';
import QueryString from 'query-string';
import {Scrollbars} from 'react-custom-scrollbars-2';
import PostQuestionForm from "./PostQuestionForm";
import BoxplotChart from "Components/BoxplotChart";
import JSONParseDefault from 'json-parse-default';
import validator from 'validator';
import ExtraInfo from "./ExtraInfo";
import ReattemptQuizModal from "./ReattemptQuizModal";
import VideoLectureScore from './component/VideoLectureScore';
import withRouter from 'Components/WithRouter';
import {connect} from "react-redux";
import _ from "lodash";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const stepName = {
    mainQuestions: "Questionnaires",
    additionalQuestions: 'Additional Questions',
    test: 'Test',
    score: 'Results',
    answer: 'View Answer',
    postTest: 'PostTest',
    postQuestions: 'Evaluation Form',
    postScore: 'Results',
};

class Attempt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attempts_id: this.props.params.attempt_id,
            attemptInfo: {},
            mainQuestions: [],
            post_stage: 0,
            isChangeMainQuestions: false,
            additionalQuestions: [],
            isChangeAdditionalQuestions: false,
            postQuestions: [],
            isChangePostQuestions: false,
            steps: [],
            stepIndex: 0,
            showModalType: '',
            loading: true,
            isDownCert: false,
            isHideScore: false,
            sendEmailModalType: null,
            sendPdfEmail: '',
            reattemptQuizPercent: null
        }
    }

    componentDidMount() {
        this.getData(true);
    }

    componentWillUnmount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.stepIndex !== nextState.stepIndex) {
            Apis.attemptsSetProgress(nextState.attempts_id, nextState.steps[nextState.stepIndex]);
        }
        return true;
    }

    getData(isFirstMount) {
        const that = this;
        Promise.all([
            Apis.attemptsDetail(that.state.attempts_id),
            Apis.attemptsQuestionnaire(that.state.attempts_id),
        ]).then(function ([detail, questionnaires]) {
            const hiddenTabs = JSONParseDefault(detail.test_sets.test_set_hidden_tabs, null, []);
            // check hide scores
            let isHideScore = false;
            const hiddenScoreIndex = hiddenTabs.findIndex((v) => v === 'score');
            if (hiddenScoreIndex !== -1) {
                isHideScore = true;
                hiddenTabs.splice(hiddenScoreIndex, 1);
            }
            let steps;
            const isFinishMainQuestions = questionnaires.main.length === 0 || questionnaires.main.some((v) => v.answer.length !== 0) || (hiddenTabs.indexOf('mainQuestions') !== -1);
            const isFinishAdditionalQuestions = questionnaires.additional.length === 0 || questionnaires.additional.some((v) => v.answer.length !== 0) || (hiddenTabs.indexOf('additionalQuestions') !== -1);
            if (!detail.complete) {
                steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions'] : ['mainQuestions'];
            } else {
                steps = questionnaires.additional.length > 0 ? ['mainQuestions', 'additionalQuestions', 'score', 'answer'] : ['mainQuestions', 'score', 'answer'];
                if (detail.test_sets.has_post) {
                    steps = steps.concat(['postTest', 'postQuestions', 'postScore']);
                }
            }
            steps = steps.filter((v) => (hiddenTabs.indexOf(v) === -1));
            let stepIndex;
            if (isFirstMount) {
                if (that.props.params.step !== undefined && steps.indexOf(that.props.params.step) > -1) {
                    stepIndex = steps.indexOf(that.props.params.step);
                } else if (detail.complete) {
                    stepIndex = steps.indexOf('score')
                } else {
                    stepIndex = 0;
                }
            } else {
                stepIndex = that.state.stepIndex + 1
            }

            // check show quiz reattempt modal
            let reattemptQuizPercent = null;
            if (isFirstMount && detail.complete && steps[stepIndex] === 'score' && ['quiz', 'video_lecture', 'presentations', 'interactive_video'].indexOf(detail.test_sets.modalities.modality_type) !== -1) {
                const percent = detail.scores[0].score === undefined ? 0 : detail.scores[0].score;
                const param = QueryString.parse(that.props.location.search);
                if (param && param.from === 'test' && percent < 75) {
                    reattemptQuizPercent = percent;
                }
            }
            that.setState({
                mainQuestions: questionnaires.main,
                isFinishMainQuestions,
                additionalQuestions: questionnaires.additional,
                isFinishAdditionalQuestions,
                postQuestions: questionnaires.post,
                attemptInfo: detail,
                post_stage: detail.post_stage,
                steps: steps,
                stepIndex,
                loading: false,
                isHideScore,
                reattemptQuizPercent
            });
        }).catch((e) => {
            console.error(e);
        })
    }

    onRestartTest() {
        Apis.attemptsStart(this.state.attemptInfo.test_set_id, undefined).then(resp => {
            let path = (['video_lecture', 'presentations', 'interactive_video'].indexOf(this.state.attemptInfo.test_sets.modalities.modality_type) === -1 ? '/test-view/' : '/video-view/') + resp.test_set_id + '/' + resp.id + '/' + resp.current_test_case_id;
            this.props.navigate(path, {replace: true});
        });
    }

    onTest() {
        let nextPath = '/test-view/' + this.state.attemptInfo.test_set_id + '/' + this.state.attempts_id + '/';
        if (!this.state.attemptInfo.complete) {
            nextPath += this.state.attemptInfo.current_test_case_id;
        } else {
            nextPath += this.state.attemptInfo.test_sets.test_set_cases[0].test_case_id;
        }
        this.props.navigate(nextPath);
    }

    onPostTest() {
        if (this.state.attemptInfo.complete) {
            let nextPath = '/test-view/' + this.state.attemptInfo.test_set_id + '/' + this.state.attempts_id + '/';
            nextPath += this.state.attemptInfo.test_sets.test_set_post_cases[0].test_case_id;
            this.props.navigate(nextPath + '/post');
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
                    NotificationManager.error('You have not completed all fields, please see highlighted fields');
                    return;
                }
                Apis.attemptsSavePostAnswer(this.state.attempts_id, JSON.stringify(postAnswer)).then((resp) => {
                    // if (this.state.attemptInfo.test_sets.modalities.modality_type !== 'volpara') {
                    //     this.setState({post_stage: 2, stepIndex: this.state.stepIndex + 1, postQuestions: postAnswer});
                    // } else {
                    //     this.setState({post_stage: 2, stepIndex: this.state.steps.findIndex((v) => v === 'score'), postQuestions: postAnswer});
                    // }
                    this.setState({
                        post_stage: 2,
                        stepIndex: this.state.steps.findIndex((v) => v === 'score'),
                        postQuestions: postAnswer
                    });
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
            if (!this.validateQuestions()) {
                NotificationManager.error('You have not completed all fields, please see highlighted fields');
                return true;
            }
            if (isChanged) {
                this.setState({loading: true});
                this.saveQuestions(questions, type).then((resp) => {
                    if (!resp.complete) {
                        const updateValue = {
                            stepIndex: this.state.stepIndex + 1
                        };
                        if (type === 'main') {
                            updateValue.isFinishMainQuestions = true;
                            updateValue.isChangeMainQuestions = false;
                            this.setState({isChangeMainQuestions: false});
                        } else if (type === 'additional') {
                            updateValue.isFinishAdditionalQuestions = true;
                            updateValue.isChangeAdditionalQuestions = false;
                            this.setState({isChangeAdditionalQuestions: false});
                        } else if (type === 'post') {
                            updateValue.post_stage = 2;
                            updateValue.isChangePostQuestions = false;
                            this.setState({postQuestions: false});
                        }
                        this.setState(updateValue);
                    } else {
                        this.getData(false)
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
                    this.setState({stepIndex: this.state.stepIndex + 1});
                }
            }
        }
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

    onGetCertPdf(type) {
        this.setState({isDownCert: true});
        Apis.attemptsCertificatePdf(this.state.attempts_id, type, null, this.state.attemptInfo.test_sets.name).then((resp) => {
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
            this.setState({isDownCert: false});
        })

    }

    onScoreDownload() {
        Apis.attemptsScorePdf(this.state.attempts_id, null, this.state.attemptInfo.test_sets.name).then((resp) => {
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
        })
    }

    onSendPdfEmail() {
        let func;
        if (this.state.sendEmailModalType === 'score') {
            func = Apis.attemptsScorePdf(this.state.attempts_id, this.state.sendPdfEmail, this.state.attemptInfo.test_sets.name);
        } else {
            func = Apis.attemptsCertificatePdf(this.state.attempts_id, 'normal', this.state.sendPdfEmail, this.state.attemptInfo.test_sets.name)
        }
        this.setState({sendEmailModalType: null, sendPdfEmail: ''})
        func.then((resp) => {
            NotificationManager.success('The email has been successfully sent.');
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        }).finally(() => {
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
                                                    <Label style={{fontSize: 14, marginTop: 9}}>Yes, you can contact me
                                                        at: </Label>
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
                            className={'ms-30'}
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
                    <FormGroup row className={'ms-30'}>
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
                    <div className={'ms-30 mb-2'} style={{maxWidth: 250}}>
                        <Input
                            disabled={commponentDisable}
                            type={item.questionnaire.questionnaire_comment ? item.questionnaire.questionnaire_comment : 'text'}
                            name="name"
                            id="name"
                            placeholder=""
                            value={item.answer}
                            onChange={(e) => this.onQuestionChangeAnswer(index, e.target.value)}
                        />
                    </div>
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
                                <FormGroup className={'ms-10'} key={i}>
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
        let isDisable = true;
        // let isDisable = this.state.attemptInfo.complete;
        if (this.state.steps[this.state.stepIndex] === 'mainQuestions') {
            questions = this.state.mainQuestions;
            isDisable = this.state.isFinishMainQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'additionalQuestions') {
            questions = this.state.additionalQuestions;
            isDisable = this.state.isFinishAdditionalQuestions;
        } else if (this.state.steps[this.state.stepIndex] === 'postQuestions') {
            questions = this.state.postQuestions;
            if (this.state.attemptInfo.complete && this.state.post_stage === 1) {
                isDisable = false;
            }
        } else {
            return null;
        }

        for (let i = 0; i < questions.length; i++) {
            result.push(
                <div className={'row m-0'} key={i}>
                    <Col sm={12}>
                        {this.renderQuestionnaireItem(questions[i], i, isDisable)}
                    </Col>
                </div>
            )
        }
        return result;
    }

    renderScoreBlock() {
        if (this.state.isHideScore) {
            return (<div className={'mt-70'}/>);
        } else if (this.state.attemptInfo.test_sets.modalities.modality_type === 'volpara') {
            return this.renderVolparaScore();
        } else if (['imaged_chest', 'imaged_mammo'].indexOf(this.state.attemptInfo.test_sets.modalities.modality_type) !== -1) {
            return this.renderImagEDScore();
        } else if (['quiz'].indexOf(this.state.attemptInfo.test_sets.modalities.modality_type) !== -1) {
            return this.renderQuizScore();
        } else if (['video_lecture', 'presentations', 'interactive_video'].indexOf(this.state.attemptInfo.test_sets.modalities.modality_type) !== -1) {
            return this.renderVideoLectureScore();
        } else if(this.state.attemptInfo.test_sets.modalities.name === 'Chest Multi Disease') {
            return this.renderChestMultiDiseaseScore();
        } else {
            return this.renderNormalScore();
        }
    }

    renderCertificationDown() {
        const {attemptInfo} = this.state;
        let disableDown = false;
        if (['quiz', 'video_lecture', 'presentations', 'interactive_video'].indexOf(attemptInfo.test_sets.modalities.modality_type) !== -1) {
            const percent = attemptInfo.scores[0].score === undefined ? 0 : this.state.attemptInfo.scores[0].score;
            if (percent < 75) {
                disableDown = true;
            }
        } else if(this.state.steps.indexOf('answer') === -1) {
            // hide answer block
            disableDown = false;
        } else {
            disableDown = attemptInfo.view_answer_time === null;
        }
        return (
            <div className={'score-extra'}>
                <p className={'extra-title'}>Certificate of Completion</p>
                {
                    disableDown ?
                        <p className={'extra-desc'}>
                            {
                                ['quiz', 'video_lecture', 'presentations', 'interactive_video'].indexOf(attemptInfo.test_sets.modalities.modality_type) !== -1 ?
                                    'The score must be greater than 75% to download the certificate.' :
                                    "You must review your answers before receiving your certificate of completion"
                            }
                        </p> :
                        <p className={'extra-desc'}>Click below to download a certificate of completion</p>
                }
                <div className={'extra-button-container justify-content-start'}>
                    <Button
                        variant="contained"
                        size="small"
                        className={disableDown ? "text-white grey-btn" : "text-white green-btn"}
                        onClick={() => this.onGetCertPdf('normal')}
                        disabled={disableDown}
                    >
                        <SchoolIcon className={'me-1'}/>
                        Certificate of Completion
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        className={disableDown ? "text-white grey-btn ms-10" : "text-white green-btn ms-10"}
                        onClick={() => this.setState({sendEmailModalType: 'certificate', sendPdfEmail: this.props.userEmail})}
                        disabled={disableDown}
                    >
                        <MailIcon className={'me-1'}/>
                        Send via Email
                    </Button>
                </div>
            </div>
        )
    }

    parseNormalScores(scores) {
        let truePositives = 0, falsePositives = 0, trueNegatives = 0, falseNegatives = 0, specitifity = 0, sensitivity, roc;
        const scoresForShow = [];
        scores.forEach((v) => {
            if (v.metrics.name.indexOf('True Positive') > -1) {
                truePositives = Number(v.score);
                return;
            }
            if (v.metrics.name.indexOf('False Positive') > -1) {
                falsePositives = Number(v.score);
                return;
            }
            if (v.metrics.name.indexOf('True Negative') > -1) {
                trueNegatives = Number(v.score);
                return;
            }
            if (v.metrics.name.indexOf('False Negative') > -1) {
                falseNegatives = Number(v.score);
                return;
            }
            scoresForShow.push(v);
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
        return {truePositives, falsePositives, trueNegatives, falseNegatives, specitifity , sensitivity, roc, scoresForShow}
    }

    renderNormalScore() {
        const {truePositives, falsePositives, trueNegatives, falseNegatives, specitifity , sensitivity, roc, scoresForShow} = this.parseNormalScores(this.state.attemptInfo.scores)
        return (
            <div className={'row'}>
                <div className={'col-md-6 score-data-container'}>
                    <div className={'normal-score-data'}>
                        <div className={'score-circle-container'}>
                            <div className={'score-circle'}>
                                <div className={'score-circle-title'}>POSITIVES</div>
                                <div><span className={'text-green'}>True</span><span>{truePositives}</span></div>
                                <div><span className={'text-red'}>False</span><span>{falsePositives}</span></div>
                            </div>
                            <div className={'score-circle'}>
                                <div className={'score-circle-title'}>NEGATIVES</div>
                                <div><span className={'text-green'}>True</span><span>{trueNegatives}</span></div>
                                <div><span className={'text-red'}>False</span><span>{falseNegatives}</span></div>
                            </div>
                        </div>
                        <div className={'score-table'}>
                            {
                                scoresForShow.map((v, i) => (
                                    <div className={'score-row'} key={i}>
                                        <span>{v.metrics.name}</span><span>{v.score}</span></div>
                                ))
                            }
                            {
                                this.renderScoreDownload()
                            }
                        </div>
                    </div>
                </div>
                <div
                    className={'col-md-6 score-chart-container'}
                    style={this.state.attemptInfo.attempt_sub_type === 'screening' ? {marginTop: 26, marginBottom: 40} : {}}
                >
                    <BoxplotChart
                        title={'Sensitivity compared to'}
                        score_type={'Sensitivity'}
                        showUserSelect={true}
                        attempt_id={this.state.attempts_id}
                        value={sensitivity}
                    />
                    <BoxplotChart
                        title={'Specificity compared to'}
                        score_type={'Specificity'}
                        showUserSelect={true}
                        attempt_id={this.state.attempts_id}
                        value={specitifity}
                    />
                    {
                        this.state.attemptInfo.attempt_sub_type !== 'screening' &&
                        <BoxplotChart
                            title={'ROC compared to'}
                            score_type={'ROC'}
                            showUserSelect={true}
                            attempt_id={this.state.attempts_id}
                            value={roc}
                        />
                    }
                </div>
            </div>
        )
    }

    renderChestMultiDiseaseScore() {
        const scores = _.cloneDeep(this.state.attemptInfo.scores);
        scores.sort((a, b) => (a.metric_id > b.metric_id) ? 1 : ((b.metric_id > a.metric_id) ? -1 : 0))
            .sort((a, b) => (a.created_at > b.created_at) ? 1 : ((b.created_at > a.created_at) ? -1 : 0));
        // check dual scores
        if(scores.length % 2 !== 0 || scores[0].metric_id !== scores[scores.length / 2].metric_id) return this.renderNormalScore();


        const {truePositives, falsePositives, trueNegatives, falseNegatives, specitifity , sensitivity, roc, scoresForShow} = this.parseNormalScores(scores.splice(0, scores.length / 2));
        const secondScores = this.parseNormalScores(scores);

        return (
            <div className={'row'}>
                <div className={'col-md-6 score-data-container'}>
                    <div className={'normal-score-data'}>
                        <div className={'score-circle-container'}>
                            <div className={'score-circle'} style={{width: 150, height: 150}}>
                                <div className={'score-circle-title'}>POSITIVES</div>
                                <div><span className={'text-green'}>True</span><span>{truePositives}</span></div>
                                <div><span className={'text-red'}>False</span><span>{falsePositives}</span></div>
                            </div>
                            <div className={'score-circle'} style={{width: 150, height: 150}}>
                                <div className={'score-circle-title'}>NEGATIVES</div>
                                <div><span className={'text-green'}>True</span><span>{trueNegatives}</span></div>
                                <div><span className={'text-red'}>False</span><span>{falseNegatives}</span></div>
                            </div>
                        </div>
                        <div className={'score-table'}>
                            {
                                scoresForShow.map((v, i) => (
                                    <div className={'score-row'} key={i}>
                                        <span>{v.metrics.name}</span><span>{v.score}</span></div>
                                ))
                            }
                        </div>
                    </div>
                    <div className={'normal-score-data mt-30'}>
                        <div className={'score-circle-container'}>
                            <div className={'score-circle'} style={{width: 150, height: 150}}>
                                <div className={'score-circle-title'}>POSITIVES</div>
                                <div><span className={'text-green'}>True</span><span>{secondScores.truePositives}</span></div>
                                <div><span className={'text-red'}>False</span><span>{secondScores.falsePositives}</span></div>
                            </div>
                            <div className={'score-circle'} style={{width: 150, height: 150}}>
                                <div className={'score-circle-title'}>NEGATIVES</div>
                                <div><span className={'text-green'}>True</span><span>{secondScores.trueNegatives}</span></div>
                                <div><span className={'text-red'}>False</span><span>{secondScores.falseNegatives}</span></div>
                            </div>
                        </div>
                        <div className={'score-table'}>
                            {
                                secondScores.scoresForShow.map((v, i) => (
                                    <div className={'score-row'} key={i}>
                                        <span>{v.metrics.name}</span><span>{v.score}</span></div>
                                ))
                            }
                            {
                                this.renderScoreDownload()
                            }
                        </div>
                    </div>
                </div>
                <div
                    className={'col-md-6 score-chart-container'}
                    style={this.state.attemptInfo.attempt_sub_type === 'screening' ? {marginTop: 26, marginBottom: 40} : {}}
                >
                    <BoxplotChart
                        title={'Sensitivity compared to'}
                        score_type={'Sensitivity'}
                        showUserSelect={true}
                        attempt_id={this.state.attempts_id}
                        value={sensitivity}
                    />
                    <BoxplotChart
                        title={'Specificity compared to'}
                        score_type={'Specificity'}
                        showUserSelect={true}
                        attempt_id={this.state.attempts_id}
                        value={specitifity}
                    />
                    {
                        this.state.attemptInfo.attempt_sub_type !== 'screening' &&
                        <BoxplotChart
                            title={'ROC compared to'}
                            score_type={'ROC'}
                            showUserSelect={true}
                            attempt_id={this.state.attempts_id}
                            value={roc}
                        />
                    }
                </div>
            </div>
        )
    }

    renderVolparaScorePostBlock() {
        if (!this.state.attemptInfo.test_sets.has_post) return null;
        if (this.state.post_stage === 0) {
            // go to post test
            if ((this.state.attemptInfo.post_test_remain_count < 0) || (this.state.attemptInfo.post_test_remain_count === 0 && this.state.attemptInfo.post_test_complete)) {
                // faild post test
                return (
                    <div className={'score-extra'}>
                        <p className={'extra-title'}>AMA PRA Category 1 Credit(s)™ To many failed attempts</p>
                        <p className={'extra-desc'}>You did not score over 75% in 3 tries. To reattempt the post test you will have to restart the activity</p>
                        <div className={'extra-button-container'}>
                            <DisableButton variant="contained" size="small" className="text-white grey-btn" disabled>
                                Unavailable
                            </DisableButton>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={'score-extra'}>
                        <p className={'extra-title'}>AMA PRA Category 1 Credit(s)™</p>
                        <p className={'extra-desc'}>
                            Complete {this.state.attemptInfo.test_sets.test_set_post_cases.length} more cases to receive AMA PRA Category 1 Credits and certificate. Click to Start
                        </p>
                        <div className={'extra-button-container'}>
                            <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => this.onPostTest()}>
                                Start
                            </Button>
                        </div>
                    </div>
                )
            }
        } else if (this.state.post_stage === 1) {
            // go to post answer
            return (
                <div className={'score-extra'}>
                    <p className={'extra-title'}>AMA PRA Category 1 Credit(s)™ In Progress</p>
                    <p className={'extra-desc'}>Click below to continue with the post test</p>
                    <div className={'extra-button-container'}>
                        <Button variant="contained" color="primary" size="small" className="text-white"
                                onClick={() => this.setState({stepIndex: this.state.steps.findIndex((v) => v === 'postQuestions')})}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )
        } else if (this.state.post_stage === 2) {
            // download certification
            const postScore = this.state.attemptInfo.scores_post === undefined || this.state.attemptInfo.scores_post.length === 0 ? 0 : this.state.attemptInfo.scores_post[0].score;
            return (
                <div className={'score-extra'}>
                    <p className={'extra-title'}>AMA PRA Category 1 Credit(s)™ Complete</p>
                    <p className={'extra-desc'}>
                        You Scored <span className={'text-primary'}>{postScore}%</span> Click below to download your certificate
                    }}/></p>
                    <div className={'extra-button-container'}>
                        <Button variant="contained" size="small" className="text-white green-btn"
                                onClick={() => this.onGetCertPdf('post_physicians')}>
                            <SchoolIcon className={'me-10'}/>
                            Physicians
                        </Button>
                        <Button variant="contained" size="small" className="text-white green-btn"
                                onClick={() => this.onGetCertPdf('post_other')}>
                            <SchoolIcon className={'me-10'}/>
                            Non Physicians
                        </Button>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    renderVolparaScore() {
        return (
            <div className={'row'}>
                <div className={'col-md-6 score-data-container'}>
                    <div className={'volpara-score-data'}>
                        <div className={'score-title'}>
                            <p>Agreement with Volpara</p>
                            <p>Breast Density Score</p>
                        </div>
                        <p className={'score-value'}>
                            {this.state.attemptInfo.scores[0].score === undefined ? 0 : this.state.attemptInfo.scores[0].score}
                            <span>%</span></p>
                        <p className={'score-desc'}>
                            We find that after 6 months of reading alongside Volpara products, your volumetric reading scores will increase
                        </p>
                        {
                            this.renderScoreDownload()
                        }
                    </div>
                </div>
                <div className={'col-md-6 score-chart-container'}>
                    <BoxplotChart
                        title="Compared to all others"
                        score_type={'volpara_all'}
                        showUserSelect={false}
                        attempt_id={this.state.attempts_id}
                        value={this.state.attemptInfo.scores[0].score === undefined ? 0 : this.state.attemptInfo.scores[0].score}
                    />
                    <BoxplotChart
                        title="Compared to others in your region"
                        score_type={'volpara_region'}
                        showUserSelect={false}
                        attempt_id={this.state.attempts_id}
                        value={this.state.attemptInfo.scores[0].score === undefined ? 0 : this.state.attemptInfo.scores[0].score}
                    />
                </div>
            </div>
        )
    }

    renderImagEDScore() {
        let scoreAverage = 0;
        const scores = this.state.attemptInfo.scores;
        if (scores.length > 0) {
            let scoreSum = 0;
            scores.forEach((v) => {
                scoreSum += v.score
            });
            scoreAverage = (scoreSum / scores.length).toFixed(2);
        }
        return (
            <div className={'row'}>
                <div className={'col-md-6 score-data-container'}>
                    <div className={'image-score-data'}>
                        <div className={'quality-score-title'}>
                            <span>Category</span>
                            <span>Agreement Score</span>
                        </div>
                        {
                            this.state.attemptInfo.scores.map((v, i) => (
                                <div className={'quality-score-row'} key={i}>
                                    <span>{v.metrics.name}</span><span>{v.score}%</span></div>
                            ))
                        }
                        {
                            this.renderScoreDownload()
                        }
                    </div>
                </div>
                <div className={'col-md-6'}>
                    <div className={' score-data-container'}>
                        <div className={'volpara-score-data'}>
                            <div className={'score-title'}>
                                <p>Total Agreement</p>
                            </div>
                            <p className={'score-value'}>
                                {scoreAverage}
                                <span>%</span>
                            </p>
                            <p className={'score-desc'}>
                                This is calculated using percentage agreement
                            </p>
                        </div>
                    </div>
                    <div className={'score-chart-container'}>
                        <BoxplotChart
                            title="Total Agreement"
                            score_type={'imaged_average_percentile'}
                            showUserSelect={false}
                            attempt_id={this.state.attempts_id}
                            value={scoreAverage}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderQuizScore() {
        const percent = this.state.attemptInfo.scores[0].score === undefined ? 0 : this.state.attemptInfo.scores[0].score;
        return (
            <div className={'row'}>
                <div className={'col-md-6 score-data-container'}>
                    <div className={'quiz-score-data'}>
                        <div className="circle-progress">
                            <svg viewBox="0 0 36 36">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path className="circle" stroke-dasharray={`${percent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                        </div>
                        <div className={'quiz-progress-info'}>
                            <span className={'text-white fs-19'}>{percent} %</span>
                            <span className={'text-white fs-23 fw-bold'}>Correct</span>
                        </div>
                    </div>
                    <div className={'score-chart-container mt-4'}>
                        <BoxplotChart
                            title={'Results compared to'}
                            score_type={'Quiz Result'}
                            showUserSelect={true}
                            attempt_id={this.state.attempts_id}
                            value={percent}
                        />
                    </div>
                </div>
                <div className={'col-md-6'}>
                    <Scrollbars
                        style={{height: 480, marginBottom: 1}}
                    >
                        <div className={'bg-gray p-4'} dangerouslySetInnerHTML={{__html: this.state.attemptInfo.test_sets.test_set_discussion}}/>
                    </Scrollbars>
                </div>
            </div>
        )
    }

    renderVideoLectureScore() {
        const percent = this.state.attemptInfo.scores[0].score === undefined ? 0 : this.state.attemptInfo.scores[0].score;
        return (
            <div className={'row'}>
                <div className={'col-md-6 score-data-container'}>
                    <div className={'quiz-score-data'}>
                        <div className="circle-progress">
                            <svg viewBox="0 0 36 36">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path className="circle" stroke-dasharray={`${percent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                        </div>
                        <div className={'quiz-progress-info'}>
                            <span className={'text-white fs-19'}>{percent} %</span>
                            <span className={'text-white fs-23 fw-bold'}>Correct</span>
                        </div>
                    </div>
                    <div className={'score-chart-container mt-4'}>
                        <BoxplotChart
                            title={'Results compared to'}
                            score_type={
                            ['video_lecture', 'interactive_video'].indexOf(this.state.attemptInfo.test_sets.modalities.modality_type) !== -1 ? 'Video Lecture Result' : 'Presentations Result'
                        }
                            showUserSelect={true}
                            attempt_id={this.state.attempts_id}
                            value={percent}
                        />
                    </div>
                </div>
                <div className={'col-md-6'}>
                    <VideoLectureScore
                        attemptId={this.state.attempts_id}
                        testCaseId={this.state.attemptInfo.current_test_case_id}
                    />
                </div>
            </div>
        )
    }

    renderScoreDownload() {
        return (
            <div className={'d-flex flex-row justify-content-center mt-10'}>
                <Button variant="contained" color="primary" size="small" className="text-white me-20" onClick={() => this.onScoreDownload()}>
                    Download Score
                </Button>
                <Button variant="contained" color="primary" size="small" className="text-white" onClick={() => this.setState({sendEmailModalType: 'score', sendPdfEmail: this.props.userEmail})}>
                    Send Via Email
                </Button>
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
                                    <Button variant="contained" color="primary" className="me-10 mb-10 text-white"
                                            onClick={() => this.onBack()}>Back</Button> : null
                            }
                            <Button variant="contained" color="primary" className="me-10 mb-10 text-white"
                                    onClick={() => this.onQuestionsNext()}>Next</Button>
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
                                    <Button variant="contained" color="primary" className="me-10 mb-10 text-white"
                                            onClick={() => this.onBack()}>Back</Button> : null
                            }
                            <Button variant="contained" color="primary" className="me-10 mb-10 text-white"
                                    onClick={() => this.onQuestionsNext()}>Next</Button>
                        </div>
                    </div>
                );
            case 'score':
                return (
                    <div className={'score-container'}>
                        {
                            this.renderScoreBlock()
                        }
                        <div className={'row score-extra-container'}>
                            {this.renderCertificationDown()}
                            {this.renderVolparaScorePostBlock()}
                            {
                                (['quiz', 'video_lecture', 'presentations', 'interactive_video'].indexOf(this.state.attemptInfo.test_sets.modalities.modality_type) === -1 && this.state.steps.indexOf('answer') !== -1) &&
                                <div className={'score-extra'}>
                                    <p className={'extra-title'}>Answers</p>
                                    <p className={'extra-desc'}>
                                        Review your answers alongside our notes of why cases were scored in that way.
                                    </p>
                                    <div className={'extra-button-container'}>
                                        <Button variant="contained" color="primary" size="small" className="text-white"
                                                onClick={() => this.onTest()}>
                                            Answers
                                        </Button>
                                    </div>
                                </div>
                            }
                            {
                                !this.state.isHideScore &&
                                <ExtraInfo
                                    modality_type={this.state.attemptInfo.test_sets.modalities.modality_type}
                                />
                            }
                        </div>
                    </div>
                )
            case 'answer':
                return (
                    <div className="p-20 mt-50 text-center">
                        <div className="mb-20 fs-17">To see your answers and compare with truth click button below
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            className="text-white"
                            onClick={() => this.onTest()}
                        >
                            View Answer
                        </Button>
                    </div>
                );
            case 'postTest':
                if (this.state.attemptInfo.complete) {
                    return (
                        <div className={"p-20 mt-50 text-center"}>
                            <p className="mb-5 fs-17">
                                Statements of credit will be awarded based on participation in the posttest and submission of the activity evaluation form. A passing score of 75% on the posttest is required to receive a statement of credit. Before starting please read the instructions by clicking on “Instructions button” in the top right hand corner of this page.
                            </p>
                            <div className="mb-20 fs-17">To proceed to the test click button below</div>
                            <DisableButton
                                variant="contained"
                                color="primary"
                                className="text-white"
                                onClick={() => this.onPostTest()}
                                disabled={(this.state.attemptInfo.post_test_remain_count < 0) || (this.state.attemptInfo.post_test_remain_count === 0 && this.state.attemptInfo.post_test_complete)}
                            >
                                {
                                    this.state.post_stage === 0 ? "Proceed to post test" : "View to post test"
                                }
                            </DisableButton>
                        </div>
                    );
                } else {
                    return null;
                }
            case 'postQuestions':
                if (this.state.attemptInfo.complete && this.state.post_stage > 0) {
                    const postScore = this.state.attemptInfo.scores_post === undefined || this.state.attemptInfo.scores_post.length === 0 ? 0 : this.state.attemptInfo.scores_post[0].score;
                    return (
                        <div>
                            <div className={'mt-30 ms-20 me-20'}>
                                You Passed! Your score is <span className={'text-primary'}>{postScore}%</span><br/>
                                To receive your AMA PRA Category 1 Credit(s)™ we need you to fill out your details below. This is to facilitate accurate credit recording.
                            </div>
                            <hr className={'mb-0'}/>
                            <PostQuestionForm
                                answer={this.state.postQuestions}
                                onRef={ref => (this.postQuestionFormRef = ref)}
                                complete={this.state.attemptInfo.complete && this.state.post_stage > 1}
                                modalityInfo={this.state.attemptInfo.test_sets.modalities}
                            />
                            <div className={'text-center mt-70'}>
                                {
                                    this.state.stepIndex > 0 ?
                                        <Button variant="contained" color="primary" className="me-10 mb-10 text-white" onClick={() => this.onBack()}>
                                            Back
                                        </Button> : null
                                }
                                <Button variant="contained" color="primary" className="me-10 mb-10 text-white" onClick={() => this.onQuestionsNext()}>
                                    Next
                                </Button>
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
                        <div
                            className="p-20 mt-50 text-center"
                        >
                            <p className="mb-50 fs-17">Your score is {postScore}%</p>
                            {
                                postScore >= 75 ?
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={'me-30'}
                                            disabled={this.state.isDownCert}
                                            onClick={() => this.onGetCertPdf('post_physicians')}>
                                            <SchoolIcon className={'me-10'}/>
                                            Certificate for physicians
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={this.state.isDownCert}
                                            onClick={() => this.onGetCertPdf('post_other')}>
                                            <SchoolIcon className={'me-10'}/>
                                            Certificate for non physicians
                                        </Button>
                                        {
                                            this.state.isDownCert &&
                                            <div style={{marginTop: -28}}><CircularProgress size={20}
                                                                                            style={{color: 'green'}}/>
                                            </div>
                                        }
                                    </div> : null
                            }
                        </div>
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
                <div className={'attempt-container'}>
                    <div className={'attempt-data'}>
                        <div className={'ms-10 mb-20 fs-19'}>{stepName[this.state.steps[this.state.stepIndex]]}</div>
                        {this.renderStepContent()}
                        <ReattemptQuizModal
                            open={this.state.reattemptQuizPercent !== null}
                            score={this.state.reattemptQuizPercent}
                            onClose={() => this.setState({reattemptQuizPercent: null})}
                            onReattempt={() => this.onRestartTest()}
                        />
                        <ThemeProvider theme={darkTheme}>
                            <Dialog open={!!this.state.sendEmailModalType} onClose={() => this.setState({sendEmailModalType: null})} classes={{scrollPaper: {backgroundColor: 'black'}}}>
                                <DialogTitle>
                                    {
                                        this.state.sendEmailModalType === 'score' ? 'Send Score' : 'Send certification'
                                    }
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        You can send score by email. please input the email you want.
                                    </DialogContentText>
                                    <TextField
                                        className={'text-white'}
                                        autoFocus
                                        margin="dense"
                                        id="score_email"
                                        label="Email Address"
                                        type="email"
                                        fullWidth
                                        value={this.state.sendPdfEmail}
                                        onChange={(e) => this.setState({sendPdfEmail: e.target.value})}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" onClick={() => this.setState({sendEmailModalType: null})} color="secondary">
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => this.onSendPdfEmail()}
                                        color="primary"
                                        disabled={!this.state.sendPdfEmail || !validator.isEmail(this.state.sendPdfEmail)}
                                    >
                                        Send
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </ThemeProvider>
                    </div>
                </div>
            )
        } else {
            return (<RctSectionLoader/>);
        }
    }
}

const DisableButton = withStyles(
    Button,
    (theme) => ({
    disabled: {
        backgroundColor: '#3c3c3c !important'
    }
}));

// map state to props
const mapStateToProps = (state) => {
    return {
        userEmail: state.authUser.userEmail
    };
};

export default withRouter(connect(mapStateToProps, {})(Attempt));