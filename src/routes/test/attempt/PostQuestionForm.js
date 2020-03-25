import React, {Component} from 'react';
import {FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField} from "@material-ui/core";
import {Col, Label, Input} from "reactstrap";

export default class PostQuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
                top: {
                    value: '',
                    extra: ''
                },
                firstName: '',
                lastName: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                stateLicense: '',
                email: '',
                q1: {
                    sub1: '',   // 4, 3, 2, 1
                    sub2: '',   // 4, 3, 2, 1
                    sub3: '',   // 4, 3, 2, 1
                },
                q2: '',
                q3: {
                    sub1: '',   // 4, 3, 2, 1
                    sub2: '',   // 4, 3, 2, 1
                    sub3: '',   // 4, 3, 2, 1
                },
                q4: '',
                q5: '',
                q6: '',
                q7: '',
                q8: {
                    value: '',
                    extra: ''
                },
                q9: {
                    value: '',
                    extra_option: '',
                    extra: '',
                },
                q10: '',
                q11: '',
                q12: '',
                q13: {
                    value: '',
                    extra: ''
                },
                q14: ''
        }
    }

    componentDidMount() {
        this.props.onRef(this)
        if(this.props.answer !== undefined && this.props.answer !== [] || this.props.answer !== {}) {
            this.setState({...this.state, ...this.props.answer});
        }
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    validate() {
        let error = false;
        const {top, firstName, lastName, email, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14} = this.state;
        if(top.value === '' || (top.value.toLowerCase() === 'other' && top.extra === '')){
            error = true;
            console.log('top');
        }
        if(firstName === '' || lastName === '' || email === '') {
            error = true;
            console.log('name');
        }
        if(q1.sub1 === '' || q1.sub2 === '' || q1.sub3 === '') {
            error = true;
            console.log('q1');
        }
        if(q2 === '' || q3.sub1 === '' || q3.sub2 === '' || q3.sub3 === '') {
            error = true;
            console.log('q2');
        }
        if(q4 === '' || q5 === '' || q6 === '' || q7 === '') {
            error = true;
            console.log('q4');
        }
        if(q8.value === '' || (q8.value.toLowerCase() === 'no' && q8.extra === '')) {
            error = true;
            console.log('q8');
        }
        if(q9.value === '' || (q9.value === '4' && q9.extra_option === '') || (q9.value === '4' && q9.extra_option === 'other' && q9.extra === '') ){
            error = true;
            console.log('q9');
        }
        if(q10 === '' || q11 === '' || q12 === '') {
            error = true;
            console.log('q10');
        }
        if(q13.value === '' || (q13.value === 'yes' && q13.extra === '')) {
            error = true;
            console.log('q13');
        }
        if(q14 === '') {
            error = true;
            console.log('q14');
        }
        return error;
    }

    getAnswerData() {
        if(this.validate()) {
            return false;
        } else {
            return this.state;
        }

    }

    onChangeTopQuestion(value, isExtra) {
        if (isExtra !== undefined && isExtra) {
            this.setState({top: {...this.state.top, extra: value}});
        } else {
            this.setState({top: {value, extra: ''}});
        }
    }

    onChangeQ8Question(value, isExtra) {
        if (isExtra !== undefined && isExtra) {
            this.setState({q8: {...this.state.q8, extra: value}});
        } else {
            this.setState({q8: {value, extra: ''}});
        }
    }

    onChangeQ9Question(value, isExtraOption, isExtra) {
        if (isExtraOption!== undefined && isExtraOption && isExtra !== undefined && isExtra) {
            this.setState({q9: {...this.state.q9, extra: value}});
        } else if(isExtraOption!== undefined && isExtraOption && (isExtra === undefined || !isExtra)) {
            this.setState({q9: {...this.state.q9, extra_option: value, extra: ''}});
        } else {
            this.setState({q9: {value, extra_option: '', extra: ''}});
        }
    }

    onChangeQ13Question(value, isExtra) {
        if (isExtra !== undefined && isExtra) {
            this.setState({q13: {...this.state.q13, extra: value}});
        } else {
            this.setState({q13: {value, extra: ''}});
        }
    }

    renderTextItem(title, field, complete) {
        return (
            <FormGroup row>
                <Label style={{height: 20, marginTop: 6, marginRight: 10}}>{title}: </Label>
                <TextField
                    disabled={complete}
                    value={this.state[field]}
                    style={{flex: 1}}
                    inputProps={{
                        style: {height: 20, marginTop: 0}
                    }}
                    onChange={(e) => this.setState({[field]: e.target.value})}
                />
            </FormGroup>
        );
    }

    renderRadioGroupWithoutText(complete, field, subfield) {
        return (
            <RadioGroup
                disabled
                value={subfield === undefined ? this.state[field] : this.state[field][subfield]}
                row
                onChange={(event) => {
                    if(subfield === undefined) {
                        this.setState({[field]: event.target.value})
                    } else {
                        this.setState({[field]: {...this.state[field], [subfield]: event.target.value}})
                    }
                }}
            >
                <FormControlLabel
                    disabled={complete}
                    value={'4'}
                    control={<Radio/>}
                    style={{width: 90, paddingLeft: 12}}
                />
                <FormControlLabel
                    disabled={complete}
                    value={'3'}
                    control={<Radio/>}
                    style={{width: 90, paddingLeft: 7}}
                />
                <FormControlLabel
                    disabled={complete}
                    value={'2'}
                    control={<Radio/>}
                    style={{width: 90, paddingLeft: 9}}
                />
                <FormControlLabel
                    disabled={complete}
                    value={'1'}
                    control={<Radio/>}
                    style={{width: 90, paddingLeft: 11}}
                />
            </RadioGroup>
        );
    }

    renderTopQuestion() {
        const {complete} = this.props;
        let isTextDisable = complete || this.state.top.value.toLowerCase() !== 'other';
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'}>
                    <Label>To facilitate accurate credit recording please provide the following information:</Label>
                    <RadioGroup
                        disabled
                        value={this.state.top.value}
                        row
                    >
                        <FormControlLabel
                            disabled={complete}
                            value={'MD/MO'}
                            control={<Radio/>}
                            label={'MD/MO'}
                            onChange={(event) => this.onChangeTopQuestion(event.target.value)}
                        />
                        <FormControlLabel
                            disabled={complete}
                            value={'Nurse'}
                            control={<Radio/>}
                            label={'Nurse'}onChange={(event) => this.onChangeTopQuestion(event.target.value)}
                        />
                        <FormControlLabel
                            disabled={complete}
                            value={'Nurse Practitioner'}
                            control={<Radio/>}
                            label={'Nurse Practitioner'}onChange={(event) => this.onChangeTopQuestion(event.target.value)}
                        />
                        <FormControlLabel
                            disabled={complete}
                            value={'other'}
                            control={<Radio/>}
                            label={'Other'}onChange={(event) => this.onChangeTopQuestion(event.target.value)}
                        />
                        <TextField
                            id="standard-bare"
                            disabled={isTextDisable}
                            margin="none"
                            value={this.state.top.extra}
                            inputProps={{
                                style: {height: 20, marginTop: 7}
                            }}
                            onChange={(e) => this.onChangeTopQuestion(e.target.value, true)}
                        />
                    </RadioGroup>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={5}>
                        {this.renderTextItem('First Name', 'firstName', complete)}
                    </Col>
                    <Col sm={7}>
                        {this.renderTextItem('Last Name', 'lastName', complete)}
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={5}>
                        {this.renderTextItem('Address', 'address', complete)}
                    </Col>
                    <Col sm={3}>
                        {this.renderTextItem('City', 'city', complete)}
                    </Col>
                    <Col sm={2}>
                        {this.renderTextItem('State', 'state', complete)}
                    </Col>
                    <Col sm={2}>
                        {this.renderTextItem('Zip', 'zip', complete)}
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={5}>
                        {this.renderTextItem('State & License #', 'stateLicense', complete)}
                    </Col>
                    <Col sm={7}>
                        {this.renderTextItem('E-mail Address', 'email', complete)}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion1() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-40'}>1. As a result of my participation in this activity, I am better able to:</Label>
                    </Col>
                    <Col sm={5}>
                        <FormGroup row>
                            <Label className={'label-option4'}>Strongly<br/>&nbsp;&nbsp;Agree<br/>&nbsp;&nbsp;&nbsp;&nbsp;(4)</Label>
                            <Label className={'label-option4'}>Agree<br/><br/>&nbsp;&nbsp;&nbsp;(3)</Label>
                            <Label className={'label-option4'}>Disagree<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;(2)</Label>
                            <Label className={'label-option4'}>&nbsp;Strongly<br/>Disagree<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)</Label>
                        </FormGroup>
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'sub-label mt-15'}>• Recognize a range of cancer appearances demonstrated in the image learning set and therefore maximize cancer detection</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q1', 'sub1')}
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'sub-label mt-15'}>• Be aware of the range of appearances of images without cancer and therefore minimize unnecessary call-backs</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q1', 'sub2')}
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'sub-label mt-15'}>• Improve perception and interpretation skills in the reading of digital mammograms</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q1', 'sub3')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion2() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-15'}>2. The activity was appropriate and met my educational needs.</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q2')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion3() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label>3. The following speaker(s) demonstrated experiential knowledge of the topic</Label>
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'sub-label mt-15'}>• Patrick C. Brennan, PhD</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q3', 'sub1')}
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'sub-label mt-15'}>• Mary T Rickard, MB BS BSc(Med) FRANZCR DDU MPH</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q3', 'sub2')}
                    </Col>
                </FormGroup>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'sub-label mt-15'}>• Mo'ayyad E. Suleiman, PhD</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q3', 'sub3')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion4() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-15'}>4. The educational materials were effective</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q4')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion5() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-15'}>5. The faculty was knowledgeable, effective and free of bias.</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q5')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion6() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-15'}>6. The learning activities were effective and incorporated active learning methods.</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q6')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion7() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-15'}>7. The content provided a fair and balanced coverage of the topic.</Label>
                    </Col>
                    <Col sm={5}>
                        {this.renderRadioGroupWithoutText(complete, 'q7')}
                    </Col>
                </FormGroup>
            </div>
        )
    }

    renderQuestion8() {
        const {complete} = this.props;
        let isTextDisable = complete || this.state.q8.value.toLowerCase() !== 'no';
        return (
            <div className={'post-questionnaire-container'}>
                <FormGroup className={'post-questionnaire'} row>
                    <Col sm={7}>
                        <Label className={'mt-15'}>8. The content was objective, current, scientifically sound and free of commercial bias</Label>
                    </Col>
                    <Col sm={5}>
                        <RadioGroup
                            disabled
                            value={this.state.q8.value}
                            row
                        >
                            <FormControlLabel
                                disabled={complete}
                                value={'Yes'}
                                control={<Radio/>}
                                label={'Yes'}
                                onChange={(event) => this.onChangeQ8Question(event.target.value)}
                            />
                            <FormControlLabel
                                disabled={complete}
                                value={'No'}
                                control={<Radio/>}
                                label={'No'}
                                onChange={(event) => this.onChangeQ8Question(event.target.value)}
                            />
                        </RadioGroup>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label className={'sub-label mt-5 mr-5'}>If no, please explain: </Label>
                    <TextField
                        disabled={isTextDisable}
                        id="standard-bare"
                        margin="none"
                        value={this.state.q8.extra}
                        inputProps={{
                            style: {height: 20, marginTop: 0}
                        }}
                        onChange={(e) => this.onChangeQ8Question(e.target.value, true)}
                    />
                </FormGroup>
            </div>
        )
    }

    renderQuestion9() {
        const {complete} = this.props;
        const isDisableSubOption = this.state.q9.value !== '4' || complete;
        const isDisableText = (this.state.q9.extra_option.toLowerCase() !== 'other') || complete;
        return (
            <div className={'post-questionnaire-container'}>
                <Label>9. Based on information presented in the activity, I will:</Label>
                <RadioGroup
                    value={this.state.q9.value}
                    disabled
                    row
                    className={'sub-label'}
                >
                    <FormControlLabel
                        disabled={complete}
                        value={'0'}
                        control={<Radio/>}
                        label={'Do nothing because content was not convincing'}
                        onChange={(event) => this.onChangeQ9Question(event.target.value)}
                    />
                    <FormControlLabel
                        disabled={complete}
                        value={'1'}
                        control={<Radio/>}
                        label={'Seek additional information on this topic'}
                        onChange={(event) => this.onChangeQ9Question(event.target.value)}
                    />
                    <FormControlLabel
                        disabled={complete}
                        value={'2'}
                        control={<Radio/>}
                        label={'Change my practice'}
                        onChange={(event) => this.onChangeQ9Question(event.target.value)}
                    />
                    <FormControlLabel
                        disabled={complete}
                        value={'3'}
                        control={<Radio/>}
                        label={'Do nothing as current practice reflects activity recommendations'}
                        onChange={(event) => this.onChangeQ9Question(event.target.value)}
                    />
                </RadioGroup>
                <FormControlLabel
                    disabled={complete}
                    checked={this.state.q9.value === '4'}
                    value={'4'}
                    control={<Radio/>}
                    onChange={(event) => this.onChangeQ9Question(event.target.value)}
                    className={'sub-label'}
                    label={'Do nothing as the following barriers exist preventing my adoption of presented guidelines and recommendations:'}
                />
                <RadioGroup
                    disabled
                    className={'ml-50'}
                    value={this.state.q9.extra_option}
                    row
                >
                    <FormControlLabel
                        disabled={isDisableSubOption}
                        value={'0'}
                        control={<Radio/>}
                        onChange={(event) => this.onChangeQ9Question(event.target.value, true)}
                        label={'Lack of organizational support'}
                    />
                    <FormControlLabel
                        disabled={isDisableSubOption}
                        value={'1'}
                        control={<Radio/>}
                        onChange={(event) => this.onChangeQ9Question(event.target.value, true)}
                        label={'Lack of financial support'}
                    />
                    <FormControlLabel
                        disabled={isDisableSubOption}
                        value={'other'}
                        control={<Radio/>}
                        onChange={(event) => this.onChangeQ9Question(event.target.value, true)}
                        label={'Other'}
                    />
                    <TextField
                        disabled={isDisableText}
                        id="standard-bare"
                        margin="none"
                        value={this.state.q9.extra}
                        inputProps={{
                            style: {height: 20, marginTop: 7}
                        }}
                        onChange={(e) => this.onChangeQ9Question(e.target.value, true, true)}
                    />
                </RadioGroup>
            </div>
        )
    }

    renderQuestion10() {
        const {complete} = this.props;
        const options = ['Diagnosis', 'Patient Safety', 'Documentation (appropriate)', 'Treatment approach', 'Patient Education', 'Medication'];
        return (
            <div className={'post-questionnaire-container'}>
                <Label>10. As a result of this course, I will likely make changes to my practice in these categories:</Label>
                <FormGroup row className={'sub-label'}>
                    <RadioGroup
                        disabled
                        value={this.state.q10}
                        row
                    >
                        {
                            options.map((v, i) =>
                                <FormControlLabel
                                    disabled={complete}
                                    value={v}
                                    control={<Radio/>}
                                    onChange={(event) => this.setState({q10: event.target.value})}
                                    label={v}
                                    key={i}
                                />
                            )
                        }
                    </RadioGroup>
                </FormGroup>
            </div>
        )
    }

    renderQuestion11() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <Label>11. The most important takeaway I’ve learned from this activity: </Label>
                <FormGroup className={'sub-label'}>
                    <TextField
                        disabled={complete}
                        margin="none"
                        value={this.state.q11}
                        inputProps={{
                            style: {height: 20, marginTop: 0}
                        }}
                        onChange={(event) => this.setState({q11: event.target.value})}
                    />
                </FormGroup>
            </div>
        )
    }

    renderQuestion12() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <Label>12. Please suggest any other future topics you would be interested in:</Label>
                <FormGroup className={'sub-label'}>
                    <TextField
                        disabled={complete}
                        margin="none"
                        value={this.state.q12}
                        inputProps={{
                            style: {height: 20, marginTop: 0}
                        }}
                        onChange={(event) => this.setState({q12: event.target.value})}
                    />
                </FormGroup>
            </div>
        )
    }

    renderQuestion13() {
        const {complete} = this.props;
        let isTextDisable = complete || this.state.q13.value.toLowerCase() !== 'yes';
        return (
            <div className={'post-questionnaire-container'}>
                <Label>13. Would you be interested in participating in a phone interview to discuss your practice patterns?</Label>
                <RadioGroup
                    disabled
                    row
                    value={this.state.q13.value}
                    className={'sub-label'}
                >
                    <FormControlLabel
                        disabled={complete}
                        value={'Yes'}
                        control={<Radio/>}
                        label={'Yes, you can contact me at: '}
                        onChange={(event) => this.onChangeQ13Question(event.target.value)}
                    />
                    <TextField
                        disabled={isTextDisable}
                        value={this.state.q13.extra}
                        style={{marginRight: 50}}
                        inputProps={{
                            style: {height: 20, marginTop: 7}
                        }}
                        onChange={(event) => this.onChangeQ13Question(event.target.value, true)}
                    />
                    <FormControlLabel
                        disabled={complete}
                        value={'No'}
                        control={<Radio/>}
                        label={'No'}
                        onChange={(event) => this.onChangeQ13Question(event.target.value)}
                    />
                </RadioGroup>
            </div>
        )
    }

    renderQuestion14() {
        const {complete} = this.props;
        return (
            <div className={'post-questionnaire-container'}>
                <Label>14. Comments:</Label>
                <FormGroup className={'sub-label'}>
                    <TextField
                        disabled={complete}
                        margin="none"
                        value={this.state.q14}
                        inputProps={{
                            style: {height: 20, marginTop: 0}
                        }}
                        onChange={(event) => this.setState({q14: event.target.value})}
                    />
                </FormGroup>
            </div>
        )
    }

    render() {
        return (
            <div style={{padding: 20}}>
                {this.renderTopQuestion()}
                {/*question 1*/}
                {this.renderQuestion1()}

                {/*question 2*/}
                {this.renderQuestion2()}

                {/*question 3*/}
                {this.renderQuestion3()}

                {/*question 4*/}
                {this.renderQuestion4()}

                {/*question 5*/}
                {this.renderQuestion5()}

                {/*question 6*/}
                {this.renderQuestion6()}

                {/*question 7*/}
                {this.renderQuestion7()}

                {/*question 8*/}
                {this.renderQuestion8()}

                {/*question 9*/}
                {this.renderQuestion9()}

                {/*question 10*/}
                {this.renderQuestion10()}

                {/*question 11*/}
                {this.renderQuestion11()}

                {/*question 12*/}
                {this.renderQuestion12()}

                {/*question 13*/}
                {this.renderQuestion13()}

                {/*question 14*/}
                {this.renderQuestion14()}

            </div>
        )
    }
}
