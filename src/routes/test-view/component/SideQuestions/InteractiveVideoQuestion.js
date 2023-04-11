import React, {Component} from "react";
import {NotificationManager} from "react-notifications";
import {Button, Dialog, DialogTitle} from '@mui/material';
import classNames from 'classnames';
import * as Apis from 'Api';

class QuizQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            isSubmitted: false,
            showQuestionModal: false,
            matchQuestions: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptQuizAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then((resp) => {
            const isSubmitted = resp.some((v) => v.truthOptionId);
            this.setState({questionList: resp, isSubmitted});
        }).catch((error) => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }

    checkQuestionValidate() {
        return true;
        // if (!this.state.isSubmitted) NotificationManager.error('Please select answer and submit.');
        // return this.state.isSubmitted;
    }

    checkShowSubmitButton() {
        const {questionList, isSubmitted} = this.state;
        if (questionList.length === 0 || isSubmitted) return false;
        let show = true;
        questionList.forEach((v) => {
            if (!v.answerOptionId) show = false;
        });
        return show;
    }

    onSelectAnswer(qId, oId) {
        const {questionList} = this.state;
        const index = questionList.findIndex((v) => v.id === qId);
        questionList[index].answerOptionId = oId;
        this.setState({questionList: [...questionList]});
        const answerObj = {};
        questionList.forEach((v) => {
            if (v.answerOptionId) answerObj[v.id] = v.answerOptionId;
        });
        Apis.setAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, answerObj, this.props.isPostTest).then(resp => {
        }).catch(error => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }

    onSubmitAnswer() {
        return new Promise((resolve, reject) => {
            Apis.submitQuizAnswer(this.props.attempts_id, this.props.test_case_id).then((resp) => {
                this.getData();
                resolve();
            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
                reject(error);
            });
        })
    }

    handleVideoProgress(time) {
        const playTime = Math.floor(time);
        const matchQuestions = this.state.questionList.filter((v) => (v.time === playTime && !v.answerOptionId));
        if (matchQuestions.length > 0) {
            this.props.onChangePlaying(false);
            this.setState({matchQuestions, showQuestionModal: true});
        }
    }

    onCloseQuestionModal() {
        if(this.state.matchQuestions.some((v) => !v.answerOptionId)) {
            NotificationManager.error('Please select answer');
        } else {
            this.setState({matchQuestions: [], showQuestionModal: false});
            this.props.onChangePlaying(true);
        }
    }

    renderQuestion(question, questionIndex) {
        return (
            <div className={'quiz-question-item'} key={questionIndex}>
                <div className={'quiz-title'}>
                    {/*<div>{question.question} </div>*/}
                    <div dangerouslySetInnerHTML={{__html: question.question}}/>
                </div>
                <div className={'quiz-option-list'}>
                    {
                        question.optionList.map((option, optionIndex) => (
                            <div key={option.id}>
                                <Button
                                    className={classNames('quiz-option', {'selected': option.id === question.answerOptionId}, {'truth': option.id === question.truthOptionId})}
                                    disabled={this.state.isSubmitted}
                                    onClick={() => this.onSelectAnswer(question.id, option.id)}
                                >
                                    <div dangerouslySetInnerHTML={{__html: option.value}}/>
                                </Button>
                                {
                                    (option.id === question.truthOptionId && question.matchPercent !== undefined) &&
                                    <div className={'quiz-percent'}>{question.matchPercent}% of users chose this answer</div>
                                }
                            </div>
                        ))
                    }
                </div>
                {
                    question.questionExplain &&
                    <div className={'quiz-explain'}>
                        <div dangerouslySetInnerHTML={{__html: question.questionExplain}}/>
                    </div>
                }
            </div>
        )
    }

    render() {
        return (
            <div>
                <Dialog open={!!this.state.showQuestionModal} maxWidth={'lg'} className={'interactive-video-dialog'} onClose={() => this.setState({showQuestionModal: false})}>
                    <div>
                        {this.state.matchQuestions.map((v, i) => this.renderQuestion(v, i))}
                        <div className={'d-flex flex-row my-2 mt-4'}>
                            <Button variant={"contained"} color={'secondary'} className={'col'} onClick={() => this.onCloseQuestionModal()}>
                                Continue
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}


export default QuizQuestions;