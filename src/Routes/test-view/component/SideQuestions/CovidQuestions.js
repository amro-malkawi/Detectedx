import React, {Component} from 'react'
import {RadioGroup} from "@mui/material";
import {QuestionLabel, QuestionRadio, QuestionCheckbox, RatingRadio, RatingLabel} from 'Components/SideQuestionComponents';
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import CommentInfo from "Routes/test-view/component/CommentInfo";

export default class CovidQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: [
                {
                    id: 'a0cfe6aa-664b-4eda-8bbd-06b7f12ba81f',
                    type: 'checkbox',
                    text: 'Ground-Glass Opacity',
                    child: [
                        {
                            id: '7c9eb926-f547-4443-bf49-6f9e3566e13c',
                            type: 'option',
                            items: [
                                {id: 'a5b9608e-dc06-4bde-912a-f3ce5ec8ee01', text: 'Left'},
                                {id: '9c779848-1acb-4ca6-b34a-99d7c5373c27', text: 'Right'},
                                {id: 'b5cacd42-8d48-49ac-be6d-59b46cadd65e', text: 'Both'}
                            ]
                        },
                        {
                            id: '314fe197-d53a-4931-bfa1-6722acd19e2b',
                            type: 'option',
                            items: [
                                {id: '89afb153-29d3-43c4-b50c-19a28c1fe2ac', text: 'Upper'},
                                {id: 'f85caecc-ef82-41a1-a104-d2f9bdbb9298', text: 'Lower'},
                                {id: 'f1e4f572-9569-4146-bab1-987860b6dee1', text: 'Both'}
                            ]
                        }
                    ]
                },
                {
                    id: '0ee6d601-790b-45e7-b80f-754cc5a7815a',
                    type: 'checkbox',
                    text: 'Crazy-paving / Mosaic Attenuation',
                    child: [
                        {
                            id: '87ddc0c0-075d-4c0f-a630-7a032acc989c',
                            type: 'option',
                            items: [
                                {id: '0bf01c89-f309-4c93-87db-01ae6fd04714', text: 'Left'},
                                {id: '91714d15-79da-4d86-a2e5-748ce0deecee', text: 'Right'},
                                {id: 'd739471d-c05f-49fc-af1a-6f2ec80efd64', text: 'Both'}
                            ]
                        },
                        {
                            id: '46ffb67b-244a-4ac5-928a-969f42ec3b9d',
                            type: 'option',
                            items: [
                                {id: '30ca7edd-03a3-45da-94d9-037f49796145', text: 'Upper'},
                                {id: '9722b64f-4394-442d-beea-7bf2be8e44eb', text: 'Lower'},
                                {id: '07aed5d4-3000-407b-aaf0-8f267f7d9831', text: 'Both'}
                            ]
                        }
                    ]
                },
                {
                    id: '7b5b3727-ef44-4493-922d-421a95f45330',
                    type: 'checkbox',
                    text: 'Consolidation',
                    child: [
                        {
                            id: '08a1fe7a-bb32-4a29-a9b1-fc7a75ae269c',
                            type: 'option',
                            items: [
                                {id: '7ec27faf-aeb6-493d-a102-810b31957bc4', text: 'Left'},
                                {id: '13065601-b9f8-4df4-b2f3-642d608e5881', text: 'Right'},
                                {id: '5e36cf09-ac05-42ec-b6e8-92d522f5b74e', text: 'Both'}
                            ]
                        },
                        {
                            id: 'b6daf420-68d5-4532-b429-dfb131bf8112',
                            type: 'option',
                            items: [
                                {id: '71376c7b-af66-497a-b406-47077a763dd4', text: 'Upper'},
                                {id: 'd501f1bf-0aab-4d01-9358-4b866d61328e', text: 'Lower'},
                                {id: '11780958-ac5c-45b9-b636-995d6e7cde9a', text: 'Both'}
                            ]
                        }
                    ]
                },
                {
                    id: '9c3e4dc5-99ed-48e3-8994-71c6e1817a9c',
                    type: 'option',
                    items: [
                        {id: '4344e71c-c2b8-46fd-b420-4a1a11ee8125', text: 'Peripheral'},
                        {id: '3aafed20-5447-45ee-8030-2019640d52ef', text: 'Central'},
                        {id: '823f9f78-7564-4a70-82f7-c31a10c4d9a0', text: 'Both'}
                    ]
                },
                {
                    id: '1e6d895c-8132-4985-933a-81968aef1b64',
                    type: 'option',
                    items: [
                        {id: 'b53c8030-cb70-4098-a086-07e88d6fae46', text: 'Anterior'},
                        {id: '9450b634-f859-4687-ac38-3d3b59bf9d38', text: 'Posterior'},
                        {id: '17bcb600-5f2a-428e-b32d-7e61b84975e9', text: 'Both'}
                    ]
                }
            ],
            selectedValue: {},  // example: {'Ground-Glass Opacity': {0: 'Upper', 1: 'Anterior'}, 'Consolidation': {}}
            selectedRating: '-1',
        }
    }

    componentDidMount() {
        this.getCovidAnswer();
    }

    getCovidAnswer() {
        const getCovidAnswer = this.props.isTruth ?
            Apis.attepmtsGetCovidTruth(this.props.attempts_id, this.props.test_case_id) : Apis.attepmtsGetCovidAnswer(this.props.attempts_id, this.props.test_case_id, this.props.isPostTest);
        getCovidAnswer.then(resp => {
            this.setState({
                selectedRating: resp.rating.toString(),
                selectedValue: resp.answer
            })
        }).catch(error => {

        });
    }

    saveCovidAnswer() {
        if (!this.props.isTruth) {
            Apis.attemptsSetCovidAnswer(this.props.attempts_id, this.props.test_case_id, this.state.selectedRating, this.state.selectedValue, this.props.isPostTest).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    checkQuestionValidate() {
        const { selectedRating } = this.state;
        if (isNaN(selectedRating) || Number(selectedRating) < 0 || Number(selectedRating) > 5) {
            NotificationManager.error("Please select suspicion number");
            return false;
        } else {
            return true;
        }
    }

    onChangeQuestionOptions(parentId, questionId, value) {
        const {selectedValue} = this.state;
        if (parentId === null) {
            if (selectedValue[questionId] === value) {
                delete selectedValue[questionId];
            } else {
                selectedValue[questionId] = value;
            }
        } else {
            if (selectedValue[parentId][questionId] === value) {
                delete selectedValue[parentId][questionId];
            } else {
                selectedValue[parentId][questionId] = value;
            }
        }
        this.setState({selectedValue: selectedValue}, () => {
            this.saveCovidAnswer();
        });
    }

    onChangeQuestion(questionName, checked) {
        const {selectedValue} = this.state;
        if (checked) {
            selectedValue[questionName] = {};
        } else {
            if (selectedValue[questionName] !== undefined) delete selectedValue[questionName];
        }
        this.setState({selectedValue: selectedValue}, () => {
            this.saveCovidAnswer();
        });
    }

    onChangeRating(rating) {
        this.setState({selectedRating: rating}, () => {
            this.saveCovidAnswer();
        });
    }

    renderChildQuestion(parentId, questionObj) {
        if (questionObj.type === 'option') {
            const value = this.state.selectedValue[parentId][questionObj.id] === undefined ? '' : this.state.selectedValue[parentId][questionObj.id];
            return (
                <div className={'ms-30'} key={questionObj.id}>
                    <RadioGroup
                        aria-label="position"
                        name="position"
                        value={value}
                        onClick={(event) => this.props.complete ? null : this.onChangeQuestionOptions(parentId, questionObj.id, event.target.value)}
                        row
                        disabled={this.props.complete}
                    >
                        {
                            questionObj.items.map((v) => (
                                <QuestionLabel
                                    value={v.id}
                                    control={
                                        <QuestionCheckbox/>
                                    }
                                    label={v.text}
                                    labelPlacement="end"
                                    key={v.id}
                                    disabled={this.props.complete}
                                />
                            ))
                        }
                    </RadioGroup>
                </div>
            )
        } else {
            return null;
        }
    }

    renderQuestion(questionObj) {
        if (questionObj.type === 'checkbox') {
            const selected = this.state.selectedValue[questionObj.id] !== undefined;
            return (
                <div key={questionObj.id} className={'mt-25'}>
                    <QuestionLabel
                        control={
                            <QuestionCheckbox
                                checked={selected}
                                onChange={(event) => this.onChangeQuestion(questionObj.id, event.target.checked)}
                                value="checkedG"
                                disabled={this.props.complete}
                            />
                        }
                        label={questionObj.text}
                        disabled={this.props.complete}
                    />
                    {
                        selected && questionObj.child.map((v) => this.renderChildQuestion(questionObj.id, v))
                    }
                </div>
            )
        } else {
            const value = this.state.selectedValue[questionObj.id] === undefined ? '' : this.state.selectedValue[questionObj.id];
            return (
                <div className={'mt-20'} key={questionObj.id}>
                    <RadioGroup
                        aria-label="position"
                        name="position"
                        value={value}
                        onClick={(event) => this.props.complete ? null : this.onChangeQuestionOptions(null, questionObj.id, event.target.value)}
                        row
                        disabled={this.props.complete}
                    >
                        {
                            questionObj.items.map((v) => (
                                <QuestionLabel
                                    value={v.id}
                                    control={
                                        <QuestionCheckbox/>
                                    }
                                    label={v.text}
                                    labelPlacement="end"
                                    key={v.id}
                                    disabled={this.props.complete}
                                />
                            ))
                        }
                    </RadioGroup>
                </div>
            )
        }
    }

    renderTitle() {
        const {isTruth, complete} = this.props;
        if (isTruth) {
            return "Experts judgement";
        } else {
            if (!complete) {
                return "Do you see";
            } else {
                return "Your judgement";
            }
        }
    }

    render() {
        return (
            <div className={'ps-10 covid-question-container '}>
                <div>
                    <p className={'covid-question-title'}>
                        {
                            this.renderTitle()
                        }
                    </p>
                    {
                        this.props.isTruth &&
                        <CommentInfo
                            test_case_id={this.props.test_case_id}
                            attempts_id={this.props.attempts_id}
                            modality_type={'covid'}
                            complete={this.props.complete}
                            modality_name={'Covid'}
                            isPostTest={this.props.isPostTest}
                        />
                    }
                    <div className={'covid-questions'}>
                        {
                            this.state.question.slice(0, 3).map(v => this.renderQuestion(v))
                        }
                    </div>
                    <div className={'covid-option-questions mb-20 mt-20'}>
                        <p>Distribution of COVID appearances</p>
                        {
                            this.state.question.slice(3, 5).map(v => this.renderQuestion(v))
                        }
                    </div>
                    <div className={'covid-confidence'}>
                        <p>Suspicion for COVID-19 infection</p>
                        <RadioGroup
                            data-cy="covid-confidence-position"
                            aria-label="position"
                            name="position"
                            className={'ms-15'}
                            value={this.state.selectedRating}
                            onChange={(event) => this.onChangeRating(event.target.value)}
                            row
                        >
                            {
                                [0, 1, 2, 3, 4, 5].map((v, i) => {   // [0, 1, 2, 3...]
                                    return (
                                        <RatingLabel
                                            value={v.toString()}
                                            control={<RatingRadio/>}
                                            label={v}
                                            key={i}
                                            disabled={this.props.complete}
                                        />
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>
            </div>
        )
    }
}

CovidQuestions.defaultProps = {
    complete: false,
    isTruth: false,
};
