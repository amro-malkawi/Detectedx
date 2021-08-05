import React, {Component} from "react";
import Tooltip from '@material-ui/core/Tooltip';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import {setImageEDBreastQuality} from "Actions";
import {connect} from "react-redux";

class ImagEDMammoQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: [],
            selectedValue: {},
            truthValue: {},
            openQuestionList: {},
            errorQuestions: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptImageQuality(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then((resp) => {
            const {qualityQuestion, quality_answer, quality_truth, breastQuality} = resp;
            const openQuestionList = {};
            qualityQuestion.forEach((q) => {
                openQuestionList[q.id] = (quality_answer[q.id] !== undefined || quality_truth[q.id] !== undefined);
            });

            // expand first question
            for (const id in openQuestionList) {
                if (!openQuestionList[id]) {
                    openQuestionList[id] = true;
                    break;
                }
            }

            this.props.setImageEDBreastQuality(breastQuality);

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

    checkQuestionValidate() {
        const {selectedValue} = this.state;
        const errorQuestions = [];
        let valid = true;
        this.state.question.forEach((questionObj) => {
            if (selectedValue[questionObj.id] === undefined) {
                valid = false;
                if (errorQuestions.indexOf(questionObj.id) === -1) errorQuestions.push(questionObj.id);
            } else {
                questionObj.child.forEach((childQuestion) => {
                    if (selectedValue[questionObj.id][childQuestion] === undefined) {
                        valid = false;
                        if (errorQuestions.indexOf(questionObj.id) === -1) errorQuestions.push(questionObj.id);
                    }
                });
            }
        });
        if (!valid) {
            this.setState({errorQuestions});
        }
        return valid;
    }

    scrollToQuestion(qId) {
        if (this.state.openQuestionList[qId]) {
            const containerElem = document.getElementsByClassName('quality-question-container')[0];
            const objOffsetBottom = document.getElementById(qId).offsetTop + document.getElementById(qId).offsetHeight;
            if (objOffsetBottom > (containerElem.offsetHeight + containerElem.scrollTop)) containerElem.scrollTop = objOffsetBottom - containerElem.offsetHeight + 10;
        }
    }

    onChangeRootQuestion(qId) {
        const openQuestionList = {...this.state.openQuestionList};
        openQuestionList[qId] = !openQuestionList[qId];
        this.setState({openQuestionList, errorQuestions: []}, () => this.scrollToQuestion(qId));
    }

    onChangeQuestionNumber(qId, childQuestion, number) {
        if (this.props.complete) return;
        const selectedValue = {...this.state.selectedValue};
        if (selectedValue[qId] !== undefined &&
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
        // expand next question
        const {question} = this.state;
        let expandQuestionId;
        const openQuestionList = {...this.state.openQuestionList};
        const questionIndex = question.findIndex((v) => v.id === qId);
        if ((questionIndex + 1 < question.length) && question[questionIndex].child.length === Object.keys(selectedValue[qId]).length) {
            expandQuestionId = question[questionIndex + 1].id;
            openQuestionList[expandQuestionId] = true;
        }
        this.setState({selectedValue, openQuestionList}, () => {
            if (expandQuestionId) this.scrollToQuestion(expandQuestionId);
            this.saveQualityAnswer();
        });
    }

    renderChildItem(qId, childQuestion, value, index) {
        const {selectedValue, truthValue} = this.state;
        let isAnswer = false;
        if (selectedValue[qId] !== undefined &&
            selectedValue[qId][childQuestion] !== undefined &&
            selectedValue[qId][childQuestion] === value
        ) {
            isAnswer = true;
        }
        let isTruth = false;
        if (truthValue[qId] !== undefined &&
            truthValue[qId][childQuestion] !== undefined &&
            truthValue[qId][childQuestion] === value
        ) {
            isTruth = true;
        }

        return (
            <div key={index} className={'question-number'} onClick={() => this.onChangeQuestionNumber(qId, childQuestion, value)}>
                {value}
                {isAnswer && <div className={'yellow-circle'}/>}
                {isTruth && <div className={'red-circle'}/>}
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
        const isError = this.state.errorQuestions.indexOf(questionObj.id) !== -1;

        return (
            <div key={questionObj.id} className={'quality-question'} id={questionObj.id}>
                <div className={'question-title'} onClick={() => this.onChangeRootQuestion(questionObj.id)}>
                    <div>
                        <i className={'zmdi zmdi-forward ' + (isShowChild ? 'zmdi-hc-rotate-270' : 'zmdi-hc-rotate-90')}/>
                    </div>
                    <Tooltip title={questionObj.valueDesc && questionObj.valueDesc.map(v => <div className={'fs-12 mb-1'}>{v}</div>)} placement={'left'}>
                        <span className={isError ? 'text-red' : ''}>{questionObj.text}</span>
                    </Tooltip>
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


export default connect(null, {
    setImageEDBreastQuality
}, null, {forwardRef: true})(ImagEDMammoQuestions);