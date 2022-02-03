import React, {Component} from "react";
import {NotificationManager} from "react-notifications";
import {Button} from '@material-ui/core';
import classNames from 'classnames';
import * as Apis from 'Api';

class QuizQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            isSubmitted: false,
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
        if (!this.state.isSubmitted) NotificationManager.error('Please select answer and submit.');
        return this.state.isSubmitted;
    }

    checkShowSubmitButton() {
        const {questionList, isSubmitted} = this.state;
        if(questionList.length === 0 || isSubmitted) return false;
        let show = true;
        questionList.forEach((v) => {
            if (!v.answerOptionId) show = false;
        });
        return show;
    }

    onSelectAnswer(qIndex, oId) {
        const {questionList} = this.state;
        questionList[qIndex].answerOptionId = oId;
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
        Apis.submitQuizAnswer(this.props.attempts_id, this.props.test_case_id).then((resp) => {
            this.getData();
        }).catch(error => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }

    renderQuestion(question, questionIndex) {
        return (
            <div className={'quiz-question-item'} key={questionIndex}>
                <div className={'quiz-title'}>
                    <div>{question.question} </div>
                </div>
                <div className={'quiz-option-list'}>
                    {
                        question.optionList.map((option, optionIndex) => (
                            <div key={option.id}>
                                <Button
                                    className={classNames('quiz-option', {'selected': option.id === question.answerOptionId}, {'truth': option.id === question.truthOptionId})}
                                    disabled={this.state.isSubmitted}
                                    onClick={() => this.onSelectAnswer(questionIndex, option.id)}
                                >
                                    <div>{option.value}</div>
                                </Button>
                                {
                                    (option.id === question.truthOptionId && question.matchPercent) &&
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
            <div className={'covid-question-container chest-data'}>
                <div className={'d-flex flex-column'}>
                    <div className={'quiz-question-container'}>
                        {this.state.questionList.map((v, i) => this.renderQuestion(v, i))}
                    </div>
                    {
                        this.checkShowSubmitButton() &&
                        <div className={'quiz-submit-btn'}>
                            <Button variant={'contained'} onClick={() => this.onSubmitAnswer()}>Submit</Button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}


export default QuizQuestions;