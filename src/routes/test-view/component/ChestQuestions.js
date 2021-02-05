import React, {Component} from 'react'
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";

const question = [
    {
        id: '244ab69a-6688-11eb-ae93-0242ac130002',
        text: '1. Image Quality',
        child: ['1', '2', '3', 'U/R']
    },
    {
        id: '244ab91a-6688-11eb-ae93-0242ac130002',
        text: '2A. Classifiable paranchymal abnormality:',
        child: ['Yes', 'No']
    },
    {
        id: '244aba0a-6688-11eb-ae93-0242ac130002',
        text: '3A. Any Classifiable pleural abnormalities?',
        child: ['Yes', 'No']
    },
    {
        id: '244abad2-6688-11eb-ae93-0242ac130002',
        text: '4A. Any other abnormalities?',
        child: ['Yes', 'No']
    }
]

export default class ChestQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            selectedRating: -1,
            truthValue: {},
            truthRating: -1
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest).then(resp => {
            this.setState({
                selectedRating: resp.chest_answer_rating,
                selectedValue: resp.chest_answer,
                truthValue: resp.chest_truth,
                truthRating: resp.chest_truth_rating
            });
        }).catch(error => {

        });
    }

    saveChestAnswer() {
        if (!this.props.complete) {
            Apis.setAttemptChestAnswer(this.props.attempts_id, this.props.test_case_id, this.state.selectedRating, this.state.selectedValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    onChangeQuestion(qId, childQuestion) {
        const {selectedValue} = this.state;
        if (selectedValue[qId] !== childQuestion) {
            selectedValue[qId] = childQuestion;
        } else {
            if ( selectedValue[qId] !== undefined) delete selectedValue[qId];
        }
        this.setState({selectedValue: {...selectedValue}}, () => {
            this.saveChestAnswer();
        });
    }

    onChangeRating(rating) {
        this.setState({selectedRating: rating}, () => {
            this.saveChestAnswer();
        });
    }

    renderChildQuestion(qId, childQuestion) {
        const {selectedValue, truthValue} = this.state;
        const isAnswer = (selectedValue[qId] !== undefined && selectedValue[qId] === childQuestion);
        const isTruth = (truthValue[qId] !== undefined && truthValue[qId] === childQuestion);
        return (
            <div
                key={childQuestion}
                className={'chest-question-option ' + (this.props.complete ? 'click-disable' : '')}
                onClick={() => !this.props.complete && this.onChangeQuestion(qId, childQuestion)}
            >
                { isAnswer && <div className={'chest-question-answer'} /> }
                { isTruth && <div className={'chest-question-truth'} /> }
                <span>{childQuestion}</span>
            </div>
        )
    }

    renderQuestion(questionObj) {
        return (
            <div key={questionObj.id} className={'chest-question'}>
                <div className={'chest-question-title'}>{questionObj.text}</div>
                <div className={'chest-question-options'}>
                    {questionObj.child.map((v) => this.renderChildQuestion(questionObj.id, v))}
                </div>
            </div>
        )
    }

    renderRatingNumber(number) {
        const {selectedRating, truthRating} = this.state;
        const isAnswer = (number === selectedRating);
        const isTruth = (number === truthRating);
        return (
            <div
                className={'chest-rating-number ' + (this.props.complete ? 'click-disable' : '')}
                key={number}
                onClick={() => !this.props.complete && this.onChangeRating(number)}
            >
                {number}
                { isAnswer && <div className={'chest-rating-answer'}/> }
                { isTruth && <div className={'chest-rating-truth'}/> }
            </div>
        )
    }

    renderTitle() {
        if (!this.props.complete) {
            return <IntlMessages id={"testView.covidQuestion.doyousee"}/>;
        } else {
            return <IntlMessages id={"testView.covidQuestion.yourJudgement"}/>;
        }
    }

    render() {
        return (
            <div className={'pl-10 covid-question-container '}>
                <div>
                    <p className={'covid-question-title'}>
                        {
                            this.renderTitle()
                        }
                    </p>
                    <div className={'covid-questions'}>
                        {
                            question.map(v => this.renderQuestion(v))
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        <p><IntlMessages id={"testView.chestQuestion.ratingTitle"}/></p>
                        <div className={'d-flex justify-content-center'}>
                            {
                                [0, 1, 2, 3, 4, 5].map((v, i) => this.renderRatingNumber(v))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ChestQuestions.defaultProps = {
    complete: false
};
