import React, {Component} from "react";
import {NotificationManager} from "react-notifications";
import {Button} from '@material-ui/core';
import classNames from 'classnames';
import {setImageEDBreastQuality} from "Actions";
import {connect} from "react-redux";
import * as Apis from 'Api';

class ImagEDMammoQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptQuizAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then((resp) => {
            this.setState({questionList: resp});
        }).catch((error) => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }

    saveQualityAnswer() {
        Apis.setAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, this.state.selectedValue, this.props.isPostTest).then(resp => {

        }).catch(error => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
    }

    checkQuestionValidate() {
        const {questionList} = this.state;
        let valid = true;
        questionList.forEach((v) => {
            if (!v.answerOptionId) valid = false;
        });
        if (!valid) NotificationManager.error('Please select answer of questions.');
        return valid;
    }

    onSelectAnswer(qIndex, oId) {
        const {questionList} = this.state;
        questionList[qIndex].answerOptionId = oId;
        this.setState({questionList: [...questionList]});
        const answerIds = {};
        questionList.forEach((v) => {
            if (v.answerOptionId) answerIds[v.id] = v.answerOptionId;
        });
        Apis.setAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, answerIds, this.props.isPostTest).then(resp => {
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
                                    disabled={this.props.complete}
                                    onClick={() => this.onSelectAnswer(questionIndex, option.id)}
                                >
                                    <div>{option.value}</div>
                                </Button>
                                {
                                    (this.props.complete && option.id === question.answerOptionId && question.matchPercent) &&
                                    <div className={'quiz-percent'}>{question.matchPercent}% of users chose this answer</div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={'covid-question-container chest-data'}>
                <div className={'quiz-question-container'}>
                    {this.state.questionList.map((v, i) => this.renderQuestion(v, i))}
                </div>
            </div>
        )
    }
}


export default connect(null, {
    setImageEDBreastQuality
}, null, {forwardRef: true})(ImagEDMammoQuestions);