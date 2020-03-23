import React, {Component} from 'react'
import {Checkbox, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import green from '@material-ui/core/colors/green';
import {withStyles} from '@material-ui/core/styles';
import yellow from "@material-ui/core/colors/yellow";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";

export default class CovidQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: ['Ground-Glass Opacity', 'Consolidation', 'Carzy-paving / Mosaic attenuation'],
            questionOptions: [
                ['Left', 'Right', 'Both'],
                ['Upper', 'Lower', 'Both'],
                ['Peripheral', 'Central', 'Both'],
                ['Anterior', 'Posterior', 'Both'],
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
            Apis.attepmtsGetCovidTruth(this.props.attempts_id, this.props.test_case_id) : Apis.attepmtsGetCovidAnswer(this.props.attempts_id, this.props.test_case_id);
        getCovidAnswer.then(resp => {
            this.setState({
                selectedRating: resp.rating.toString(),
                selectedValue: resp.answer
            })
        }).catch(error => {

        });
    }

    saveCovidAnswer() {
        if(!this.props.isTruth) {
            Apis.attemptsSetCovidAnswer(this.props.attempts_id, this.props.test_case_id, this.state.selectedRating, this.state.selectedValue).then(resp => {

            }).catch(error => {
                NotificationManager.error(error.response ? error.response.data.error.message : error.message);
            });
        }
    }

    onChangeQuestionOptionItems(questionName, optionIndex, optionValue) {
        const {selectedValue} = this.state;
        selectedValue[questionName][optionIndex] = optionValue;
        this.setState({selectedValue}, () => {
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

    renderQuestionOptionItem(questionName, options, value, index) {
        return (
            <div className={'ml-20'} key={index}>
                <RadioGroup
                    aria-label="position"
                    name="position"
                    value={value}
                    onChange={(event) => this.onChangeQuestionOptionItems(questionName, index, event.target.value)}
                    row
                    disabled={this.props.complete}
                >
                    {
                        options.map((v) => (
                            <CustomFormControlLabel1
                                value={v}
                                control={
                                    <CustomRadio1/>
                                }
                                label={v}
                                labelPlacement="end"
                                key={v}
                                disabled={this.props.complete}
                            />
                        ))
                    }
                </RadioGroup>
            </div>
        )
    }

    renderQuestionOptions(questionName) {
        const selectedOptions = this.state.selectedValue[questionName];
        const displayOptions = [];
        for (let i = 0; i < this.state.questionOptions.length; i++) {
            if (i === 0) {
                displayOptions.push(this.state.questionOptions[i]);
            } else if (selectedOptions[i] !== undefined) {
                displayOptions.push(this.state.questionOptions[i]);
            } else if (selectedOptions[i] === undefined && selectedOptions[i - 1] !== undefined) {
                displayOptions.push(this.state.questionOptions[i]);
                break;
            }
        }
        return (
            <div>
                {
                    displayOptions.map((v, i) => this.renderQuestionOptionItem(questionName, v, selectedOptions[i], i))
                }
            </div>
        )
    }

    renderQuestions(questionName) {
        const selected = this.state.selectedValue[questionName] !== undefined;
        return (
            <div key={questionName} className={'mt-25'}>
                <CustomFormControlLabel1
                    control={
                        <CustomCheckbox
                            checked={selected}
                            onChange={(event) => this.onChangeQuestion(questionName, event.target.checked)}
                            value="checkedG"
                            disabled={this.props.complete}
                        />
                    }
                    label={questionName}
                    disabled={this.props.complete}
                />
                {
                    selected && this.renderQuestionOptions(questionName)
                }
            </div>
        )
    }


    render() {
        return (
            <div className={'pl-10 covid-question-container '}>
                <p className={'covid-question-title'}>
                    {
                        this.props.isTruth ? '' : 'Do you see:'
                    }
                </p>
                <div className={'covid-questions'}>
                    {
                        this.state.questions.map(v => this.renderQuestions(v))
                    }
                </div>
                <div className={'covid-confidence'}>
                    <p className={'covid-question-title'}>Confidence of COVID-19 infection</p>
                    <RadioGroup
                        aria-label="position"
                        name="position"
                        value={this.state.selectedRating}
                        onChange={(event) => this.onChangeRating(event.target.value)}
                        row
                    >
                        {
                            [0, 1, 2, 3, 4, 5].map((v, i) => {   // [0, 1, 2, 3...]
                                return (
                                    <CustomFormControlLabel2
                                        value={v.toString()}
                                        control={<CustomRadio2/>}
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
        )
    }
}

CovidQuestions.defaultProps = {
    complete: false,
    isTruth: false,
};

const CustomRadio1 = withStyles(theme => ({
    root: {
        color: green[600],
        padding: 2,
        '&$checked': {
            color: green[500],
        },
        '&$disabled': {
            color: green[200],
        },
    },
    checked: {},
    disabled: {},
}))(Radio);

const CustomFormControlLabel1 = withStyles(theme => ({
    root: {
        marginLeft: 0,
    },
    label: {
        color: '#b3b3b3',
        fontSize: 16,
        '&$disabled': {
            color: '#b3b3b3',
        },
    },
    disabled: {},
}))(FormControlLabel);

const CustomCheckbox = withStyles(theme => ({
    root: {
        color: green[600],
        padding: 2,
        '&$checked': {
            color: green[500],
        },
        '&$disabled': {
            color: green[200],
        },
    },
    checked: {},
    disabled: {},
}))(Checkbox);

const CustomRadio2 = withStyles(theme => ({
    root: {
        color: yellow[600],
        '&$checked': {
            color: yellow[500],
        },
        '&$disabled': {
            color: yellow[200],
        },
    },
    checked: {},
    disabled: {},
}))(Radio);


const CustomFormControlLabel2 = withStyles(theme => ({
    label: {
        color: yellow[600],
        fontSize: 15,
        fontWeight: 600,
        marginLeft: -10,
        '&$disabled': {
            color: yellow[200],
        },
    },
    disabled: {},
}))(FormControlLabel);
