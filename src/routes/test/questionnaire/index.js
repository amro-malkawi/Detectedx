import React, {Component} from 'react';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import * as Apis from 'Api';
import {Col, Label, Input} from "reactstrap";
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Button} from "@material-ui/core";
import {NotificationManager} from 'react-notifications';

export default class TestQuestionnaire extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attempts_id: this.props.match.params.attempt_id,
            attemptInfo: {},
            questionnaires: [],
            isComplete: false,
            isChanged: false,
            loading: true,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const that = this;
        let promise0 = new Promise(function (resolve, reject) {
            Apis.attemptsQuestionnaire(that.state.attempts_id).then((resp) => {
                let questionnaires = resp.map((v) => {
                    if(v.questionnaire.type === 0) {
                        v.answer = v.questionnaire_answers[0] !== undefined ? v.questionnaire_answers[0].answer.toString() : '';
                    } else if (v.questionnaire.type === 1) {
                        v.answer = v.questionnaire_answers[0] !== undefined ? v.questionnaire_answers[0].answer.split(',') : [];
                    } else if(v.questionnaire.type === 2 ) {
                        v.answer = v.questionnaire_answers[0] !== undefined ? v.questionnaire_answers[0].answer : '';
                    }
                    return v;
                });
                resolve(questionnaires);
            }).catch((e) => {
                reject(e);
            });
        });

        let promise1 = new Promise(function (resolve, reject) {
            Apis.attemptsDetail(that.state.attempts_id).then((resp) => {
                resolve(resp);
            }).catch((e) => {
                reject(e);
            })
        });

        Promise.all([promise0, promise1]).then(function (values) {
            that.setState({
                questionnaires: values[0],
                attemptInfo: values[1],
                loading: false,
            });
        }).catch((e) =>{
            console.warn(e.message);
        })
    }

    goTestView() {
        let nextPath = '/test-view/' + this.state.attemptInfo.test_set_id + '/' + this.state.attempts_id + '/' + this.state.attemptInfo.current_test_case_id;
        this.props.history.push(nextPath);
    }

    onNext() {
        console.warn('asdfasd');
        let {questionnaires, isChanged} = this.state;
            let isValidate = true;
            let answers = [];
            questionnaires.forEach((v, index) => {
                let obj = {
                    test_set_questionnaire_id: v.id
                };
                if (v.questionnaire.type === 0) {
                    if (v.answer === '') {
                        isValidate = false;
                        questionnaires[index].error = true;
                    }
                    obj.answer = v.answer;
                } else if (v.questionnaire.type === 1) {
                    if (v.answer.length === 0) {
                        isValidate = false;
                        questionnaires[index].error = true;
                    }
                    obj.answer = v.answer.join(',');
                } else if (v.questionnaire.type === 2) {
                    if (v.answer === '') {
                        isValidate = false;
                        questionnaires[index].error = true;
                    }
                    obj.answer = v.answer;
                }
                answers.push(obj);
            });
            if (!isValidate) {
                this.setState({questionnaires: [...questionnaires]});
            } else {
                if(isChanged) {
                    this.setState({loading: true});
                    Apis.attemptsQuestionnaireAnswer(this.state.attempts_id, answers).then(resp => {
                        this.goTestView()
                    }).catch((e) => {
                        NotificationManager.error(e.message);
                        this.setState({loading: false});
                    });
                } else {
                    this.goTestView()
                }
            }
    }

    onChangeValue(index, value, checked) {
        let { questionnaires } = this.state;
        questionnaires[index].error = false;
        if(questionnaires[index].questionnaire.type === 0) {
            questionnaires[index].answer = value;
        } else if(questionnaires[index].questionnaire.type === 1) {
            if(questionnaires[index].answer === undefined) questionnaires[index].answer = [];
            if(checked) {
                questionnaires[index].answer.push(value);
            } else {
                let i = questionnaires[index].answer.indexOf(value);
                if(i !== -1 ) questionnaires[index].answer.splice(i, 1);
            }
        } else if(questionnaires[index].questionnaire.type === 2) {
            questionnaires[index].answer = value;
        }
        this.setState({questionnaires: [...questionnaires], isChanged: true});
    }

    renderQuestionnaire(item, index) {
        let itemClass = 'row questionnaire ' + (item.error ? "error" : "");
        if (item.questionnaire.type === 0) { //single option
            return (
                <div className={itemClass} key={index}>
                    <Label sm={4} style={{marginTop: 6}}>{item.questionnaire.name}</Label>
                    <Col sm={8}>
                        <RadioGroup
                            disabled
                            aria-label="position"
                            name="position"
                            value={item.answer}
                            onChange={(event) => this.onChangeValue(index, event.target.value)}
                            row
                        >
                            {
                                item.questionnaire.questionnaire_options.map((v, i) => {
                                    return (
                                        <FormControlLabel
                                            value={v.id.toString()}
                                            control={<Radio/>}
                                            label={v.content}
                                            key={i}
                                        />
                                    )
                                })
                            }
                        </RadioGroup>
                    </Col>
                </div>
            )
        } else if (item.questionnaire.type === 1) {  //multiple option
            return (
                <div className={itemClass} key={index}>
                    <Label sm={4} style={{marginTop: 6}}>{item.questionnaire.name}</Label>
                    <Col sm={8}>
                        <FormGroup row>
                        {
                            item.questionnaire.questionnaire_options.map((v, i) => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={item.answer.indexOf(v.id.toString()) !== -1}
                                                onChange={(event) => this.onChangeValue(index, v.id.toString(), event.target.checked)}
                                            />
                                        }
                                        label={v.content}
                                        key={i}
                                    />
                                )
                            })
                        }
                        </FormGroup>
                    </Col>
                </div>
            )
        } else if (item.questionnaire.type === 2) {   // text question
            return (
                <div className={itemClass} key={index}>
                    <Label sm={4} style={{marginTop: 6}}>{item.questionnaire.name}</Label>
                    <Col sm={8}>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder=""
                            value={item.answer}
                            onChange={(e) => this.onChangeValue(index, e.target.value)}
                        />
                    </Col>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className={'questionnaire-wrapper'}>
                    <h1>Questionnaire</h1>
                    {
                        this.state.questionnaires.map((v, index) => {
                            return this.renderQuestionnaire(v, index)
                        })
                    }
                    <div className={'text-center mt-70'}>
                        <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.props.history.replace('/app/test/list')}>Home</Button>
                        <Button variant="contained" color="primary" className="mr-10 mb-10 text-white" onClick={() => this.onNext()}>Next</Button>
                    </div>
                </div>
            )
        } else {
            return (<RctSectionLoader/>);
        }
    }
}