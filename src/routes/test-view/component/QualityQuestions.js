import React, {Component} from "react";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";

export default class QualityQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: [],
            selectedValue: {},
            truthValue: {},
            openQuestionList: {},
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then((resp) => {
            const {qualityQuestion, quality_answer, quality_truth} = resp;
            const openQuestionList = {};
            qualityQuestion.forEach((q) => {
                openQuestionList[q.id] = (quality_answer[q.id] !== undefined || quality_truth[q.id] !== undefined);
            });
            this.setState({
                question: qualityQuestion,
                selectedValue: quality_answer,
                truthValue: quality_truth,
                openQuestionList,
            });
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

    checkQualityAnswerValidate() {
        const {selectedValue} = this.state;
        let valid = true;
        this.state.question.forEach((questionObj) => {
            if(selectedValue[questionObj.id] === undefined) {
                valid = false;
            } else {
                questionObj.child.forEach((childQuestion) => {
                   if(selectedValue[questionObj.id][childQuestion] === undefined) {
                       valid = false;
                   }
                });
            }
        });
        return valid;
    }

    onChangeRootQuestion(qId) {
        const openQuestionList = {...this.state.openQuestionList};
        openQuestionList[qId] = !openQuestionList[qId];
        this.setState({openQuestionList});
    }

    onChangeQuestionNumber(qId, childQuestion, number) {
        if(this.props.complete) return;
        const selectedValue = {...this.state.selectedValue};
        if(selectedValue[qId] !== undefined &&
            selectedValue[qId][childQuestion] !== undefined &&
            selectedValue[qId][childQuestion] === number
        ) {
            delete selectedValue[qId][childQuestion];
        } else {
            if (selectedValue[qId] === undefined || typeof selectedValue[qId] !== 'object') {
                selectedValue[qId] = {};
            }
            selectedValue[qId][childQuestion] = number;
        }
        this.setState({selectedValue}, this.saveQualityAnswer);
    }

    renderChildItem(qId, childQuestion, value, index) {
        const {selectedValue, truthValue} = this.state;
        let isAnswer = false;
        if(selectedValue[qId] !== undefined &&
            selectedValue[qId][childQuestion] !== undefined &&
            selectedValue[qId][childQuestion] === value
        ) {
            isAnswer = true;
        }
        let isTruth = false;
        if(truthValue[qId] !== undefined &&
            truthValue[qId][childQuestion] !== undefined &&
            truthValue[qId][childQuestion] === value
        ) {
            isTruth = true;
        }

        return (
            <div key={index} className={'question-number'} onClick={() => this.onChangeQuestionNumber(qId, childQuestion, value)}>
                {value}
                { isAnswer && <div className={'yellow-circle'} /> }
                { isTruth && <div className={'red-circle'} /> }
            </div>
        )
    }

    renderChildQuestion(qId, childQuestion, index) {
        return (
            <div key={index} className={'question-child'}>
                <span>{childQuestion}</span>
                <div className={'question-number-container'}>
                    {
                        [1, 2, 3].map((v, i) => this.renderChildItem(qId, childQuestion, v, i))
                    }
                </div>
            </div>
        )
    }

    renderQuestion(questionObj, i) {
        const isShowChild = this.state.openQuestionList[questionObj.id];
        return (
            <div key={questionObj.id} className={'quality-question'}>
                <div className={'question-title'} onClick={() => this.onChangeRootQuestion(questionObj.id)}>
                    <div><i className={'zmdi zmdi-forward ' + (isShowChild ? 'zmdi-hc-rotate-270': 'zmdi-hc-rotate-90')}/></div>
                    <span>{questionObj.text}</span>
                </div>
                <div className={'question-child-container'}>
                {
                    isShowChild && questionObj.child.map((v, i) => this.renderChildQuestion(questionObj.id, v, i))
                }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={'quality-question-container ' + (this.props.complete ? 'disable-cursor' : 'pointer-cursor')}>
                {this.state.question.map((v, i) => this.renderQuestion(v, i))}
            </div>
        )
    }
}