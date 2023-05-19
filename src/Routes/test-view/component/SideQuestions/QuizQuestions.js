import React, {Component} from "react";
import cornerstone from 'cornerstone-core';
import {NotificationManager} from "react-notifications";
import {Button} from '@mui/material';
import classNames from 'classnames';
import * as Apis from 'Api';
import withRouter from "Components/WithRouter";
import {connect} from "react-redux";
import {changeHangingLayout, setImageAnswer} from "Store/Actions";

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
        let answerOptions = questionList[qIndex].answerOptionId;
        if(!answerOptions) answerOptions = [];
        if(typeof answerOptions === 'string') {
            answerOptions = [answerOptions];
        }
        const i = answerOptions.indexOf(oId);
        if(i === -1) {
            answerOptions.push(oId);
        } else {
            answerOptions.splice(i, 1);
        }
        questionList[qIndex].answerOptionId = answerOptions;
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
            return Apis.testCasesAnswers(this.props.test_case_id, this.props.attempts_id, false);
        }).then((resp) => {
            resp.images.forEach((i) => {
                this.props.setImageAnswer(i.id, 'markList', i.truths.map((m) => ({...m, isTruth: true, lesionList: {}})));
            });
            // after add truths, call this func to redraw images
            this.props.changeHangingLayout(this.props.selectedHangingType);
        }).catch(error => {
            NotificationManager.error(error.response ? error.response.data.error.message : error.message);
        });
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
                                    className={classNames('quiz-option', {'selected': question.answerOptionId && question.answerOptionId.includes(option.id)}, {'truth': question.truthOptionId && question.truthOptionId.includes(option.id)})}
                                    disabled={this.state.isSubmitted}
                                    onClick={() => this.onSelectAnswer(questionIndex, option.id)}
                                >
                                    <div dangerouslySetInnerHTML={{__html: option.value}}/>
                                </Button>
                                {
                                    (question.truthOptionId && question.truthOptionId.includes(option.id) && option.matchPercent !== undefined) &&
                                    <div className={'quiz-percent'}>{option.matchPercent}% of users chose this answer</div>
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
                <div className={'d-flex flex-column'} style={{flex: 1}}>
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

const mapStateToProps = (state) => {
    return {
        selectedHangingType: state.testView.selectedHangingType,
    };
};

export default connect(mapStateToProps, {
    setImageAnswer,
    changeHangingLayout
}, null, {forwardRef: true})(QuizQuestions);
