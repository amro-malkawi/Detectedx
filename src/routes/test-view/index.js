/**
 * News Dashboard
 */

import React, {Component} from 'react'
import {Col, FormGroup, Input, Label} from "reactstrap";
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import yellow from '@material-ui/core/colors/yellow';
import chroma from 'chroma-js';
import * as Apis from 'Api';

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';
import Loader from './functions/loader';
import Dtx from './functions/dtx';
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

import Switch from "@material-ui/core/Switch";
import {withStyles} from '@material-ui/core/styles';

export default class TestView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            test_cases_id: this.props.match.params.test_cases_id,
            test_sets_id: this.props.match.params.test_sets_id,
            attempts_id: this.props.match.params.attempts_id,
            loading: true,
            attemptDetail: {},
            test_case: {},
            test_set_cases: [],
            selectedRating: '2',
            lesionsValue: [],
            selectedLesions: [],
            isAnswerCancer: undefined,
            isTruthCancer: undefined,
            imageAnswers: [],
        };

        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const that = this;
        let promise0 = new Promise(function (resolve, reject) {
            Apis.testCasesViewInfo(that.state.test_cases_id).then((data) => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise1 = new Promise(function (resolve, reject) {
            Apis.testSetsCases(that.state.test_sets_id).then((data) => {
                data = data.map((v) => v.test_case_id);
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise2 = new Promise(function (resolve, reject) {
            Apis.attemptsDetail(that.state.attempts_id).then(data => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise3 = new Promise(function (resolve, reject) {
            Apis.testCasesAnswers(that.state.test_cases_id, that.state.attempts_id).then((imageAnswers) => {
                resolve(imageAnswers);
            }).catch(e => {
                reject(e);
            })
        });
        Promise.all([promise0, promise1, promise2, promise3]).then(function (values) {
            that.setState({
                test_case: values[0],
                test_set_cases: values[1],
                attemptDetail: values[2],
                imageAnswers: values[3].images,
                isAnswerCancer: values[3].isAnswerCancer,
                isTruthCancer: values[3].isTruthCancer,
                loading: false
            }, () => {
                cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
                cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
                cornerstoneTools.external.cornerstone = cornerstone;
                cornerstoneTools.external.Hammer = Hammer;
                cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
                cornerstoneTools.init();
                cornerstone.registerImageLoader('dtx', Loader);
                Dtx.init(that, that.state.test_cases_id, that.state.attempts_id, that.state.test_case.modalities.lesion_types, that.state.test_case.modalities.circle_size, that.state.imageAnswers);
            });
        });
    }

    onMove(seek) { // previous -1, next 1
        let test_case_index = this.state.test_set_cases.indexOf(Number(this.state.test_cases_id));
        let next_test_case_id = this.state.test_set_cases[test_case_index + seek];
        this.setState({test_cases_id: next_test_case_id, loading: true}, () => {
            let url = '/test-view/' + this.state.test_sets_id + '/' + this.state.attempts_id + '/' + next_test_case_id;
            Apis.attemptsUpdate(this.state.attempts_id, {current_test_case_id: next_test_case_id}).then((resp) => {
                this.getData();
                this.props.history.push(url);
            });
        });
    }

    onComplete() {
        Apis.attemptsComplete(this.state.attempts_id).then((resp) => {
            this.props.history.push('/app/test/attempt/' + this.state.attempts_id + '/3');
        }).catch((e) => {
            console.warn(e.message);
        });
    }

    onHome() {
        let url;
        if (!this.state.attemptDetail.complete) {
            url = '/app/test/list';
        } else {
            url = '/app/test/complete-list/' + this.state.attempts_id;
        }
        this.props.history.replace(url);
    }

    onChangeSynchonize(e) {
        Dtx.enableSynchronize(e.target.checked);
    }

    setSelectedRating(value) {
        if (value === '2') {
            this.setState({selectedLesions: []});
        }
        this.setState({selectedRating: value});
    }

    onChangeRating(event) {
        this.setSelectedRating(event.target.value);
    }

    setSelectedLesions(lesions) {
        let lesionsValue = [];
        lesions = lesions.map(v => v.toString());
        this.state.test_case.modalities.lesion_types.forEach(v => {
            if (lesions.indexOf(v.id.toString()) !== -1) {
                lesionsValue.push({value: v.id, label: v.name});
            }
        });
        this.setState({selectedLesions: lesionsValue});
    }

    onChangeLesions(value) {
        debugger
        this.setState({selectedLesions: value})
    }

    renderNav() {
        let test_case_index = this.state.test_set_cases.indexOf(Number(this.state.test_cases_id));
        let test_case_length = this.state.test_set_cases.length;
        return (
            <nav>
                {
                    test_case_index > 0 ?
                        <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onMove(-1)}> Previous</Button> : null
                }
                {
                    this.state.attemptDetail.complete || test_case_index + 1 !== test_case_length ?
                        null : <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onComplete()}> Finish</Button>
                }
                {
                    test_case_index + 1 < test_case_length ?
                        <Button className='mr-10' variant="contained" color="primary" onClick={() => this.onMove(1)}> Next</Button> : null
                }
                <Button variant="contained" color="primary" onClick={() => this.onHome()}>Home</Button>
            </nav>
        );
    }

    renderTestResult() {
        const {isAnswerCancer, isTruthCancer} = this.state;
        if (isAnswerCancer === undefined || isTruthCancer === undefined) {
            return null;
        } else {
            let isCorrect = isAnswerCancer === isTruthCancer;
            let resultStr = (isCorrect ? 'Correct: ' : 'Wrong: ') + (isTruthCancer ? "Cancer Case" : "Normal Case");
            return (
                <div className={isCorrect ? 'correct-result correct' : 'correct-result wrong'}>
                    <span style={{color: 'white'}}>{resultStr}</span>
                </div>
            );
        }
    }

    render() {
        if (!this.state.loading) {
            let disabled = this.state.attemptDetail.complete ? {'disabled': 'disabled'} : {};
            let test_case_index = this.state.test_set_cases.indexOf(Number(this.state.test_cases_id));
            let lesions = this.state.test_case.modalities.lesion_types.map((v, i) => {
                return {label: v.name, value: v.id}
            });
            return (
                <div className="viewer">
                    <div id="toolbar">
                        <div id="tools">
                            <div className="tool option" data-tool="Pan">
                                <svg id="icon-tools-pan" viewBox="0 0 18 18">
                                    <title>Pan</title>
                                    <g id="icon-tools-pan-group" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path id="icon-tools-pan-line-v" d="M9,1 L9,17"/>
                                        <path id="icon-tools-pan-line-h" d="M1,9 L17,9"/>
                                        <polyline id="icon-tools-pan-caret-t" points="7 3 9 1 11 3"/>
                                        <polyline id="icon-tools-pan-caret-r" points="15 11 17 9 15 7"/>
                                        <polyline id="icon-tools-pan-caret-b" points="11 15 9 17 7 15"/>
                                        <polyline id="icon-tools-pan-caret-l" points="3 7 1 9 3 11"/>
                                    </g>
                                </svg>
                                <p>Pan</p>
                            </div>

                            <div className="tool option" data-tool="Zoom" data-synchronize="true">
                                <svg id="icon-tools-zoom" viewBox="0 0 17 17">
                                    <title>Zoom</title>
                                    <g id="icon-tools-zoom-group" fill="none" strokeWidth="2" strokeLinecap="round">
                                        <path id="icon-tools-zoom-path" d="m11.5,11.5 4.5,4.5"/>
                                        <circle id="icon-tools-zoom-circle" cx="7" cy="7" r="6"/>
                                    </g>
                                </svg>
                                <p>Zoom</p>
                            </div>
                            <div className="tool option" data-tool="Wwwc">
                                <svg id="icon-tools-levels" viewBox="0 0 18 18">
                                    <title>Window / Level</title>
                                    <g id="icon-tools-levels-group">
                                        <path id="icon-tools-levels-path" d="M14.5,3.5 a1 1 0 0 1 -11,11 Z" stroke="none" opacity="0.8"/>
                                        <circle id="icon-tools-levels-circle" cx="9" cy="9" r="8" fill="none" strokeWidth="2"/>
                                    </g>
                                </svg>
                                <p>Window</p>
                            </div>
                            <div className="tool option" data-tool="Marker">
                                <svg id="icon-tools-elliptical-roi" viewBox="0 0 24 28">
                                    <title>Elliptical ROI</title>
                                    <path
                                        d="M12 5.5c-4.688 0-8.5 3.813-8.5 8.5s3.813 8.5 8.5 8.5 8.5-3.813 8.5-8.5-3.813-8.5-8.5-8.5zM24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12v0c6.625 0 12 5.375 12 12z"/>
                                </svg>
                                <p>Mark</p>
                            </div>
                            <div className="tool">
                                <AntSwitch
                                    defaultChecked
                                    onChange={(e) => this.onChangeSynchonize(e)}
                                    value="checkedB"
                                />
                                <p>&nbsp;Sync</p>
                            </div>
                        </div>

                        {this.renderTestResult()}

                        <h1>{test_case_index + 1} / {this.state.test_set_cases.length}</h1>

                        {this.renderNav()}
                    </div>
                    <div id="images">
                        {
                            this.state.test_case.images.map((item, index) => {
                                return (
                                    <div className="image" id={"image" + item.id} data-image-id={item.id} data-url={item.id} data-stack={item.stack_count} data-index={index} key={item.id}>
                                        <a className="eye">
                                            <i className="zmdi zmdi-eye fs-23"/>
                                        </a>
                                        <div className="dicom"/>
                                        <div className="stack-scrollbar">
                                            <input type="range"/>
                                        </div>
                                        <div className="location status"/>
                                        <div className="zoom status"/>
                                        <div className="window status"/>
                                        <button className="invert">Invert</button>
                                        <button className="reset">Reset</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div id="cover" style={{display: 'none'}} ref={this.myRef}>
                        <div id="mark-details">
                            <form>
                                <FormGroup className={'mb-5'} row>
                                    <Label sm={3} style={{marginTop: 6}}>Rating:</Label>
                                    <Col sm={9}>
                                        <RadioGroup
                                            disabled
                                            aria-label="position"
                                            name="position"
                                            value={this.state.selectedRating}
                                            onChange={this.onChangeRating.bind(this)}
                                            row
                                        >
                                            {
                                                this.state.test_case.ratings.map((v, i) => {   // [0, 1, 2, 3...]
                                                    return (
                                                        <CustomFormControlLabel
                                                            disabled={this.state.attemptDetail.complete}
                                                            value={v.toString()}
                                                            control={<CustomRadio/>}
                                                            label={v}
                                                            key={i}
                                                        />
                                                    )
                                                })
                                            }
                                        </RadioGroup>
                                    </Col>
                                </FormGroup>
                                <Label>Lesions:</Label>
                                <Select
                                    isDisabled={this.state.attemptDetail.complete || this.state.selectedRating === '2'}
                                    placeholder={this.state.attemptDetail.complete || this.state.selectedRating === '2' ? 'Can not select Lesions' : 'Select Lesions'}
                                    isMulti
                                    name="lesions"
                                    options={lesions}
                                    value={this.state.selectedLesions}
                                    styles={selectStyles}
                                    onChange={this.onChangeLesions.bind(this)}
                                />

                                <div className="actions">
                                    <div className="left">
                                        <button className="cancel" {...disabled}>Cancel</button>
                                    </div>
                                    {
                                        this.state.attemptDetail.complete ?
                                            <div className="right">
                                                <button className="mr-15 ok">&nbsp;&nbsp;Ok&nbsp;&nbsp;</button>
                                            </div> :
                                            <div className="right">
                                                <button className="mr-15 delete">Delete</button>
                                                <button className="save">Save</button>
                                            </div>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<RctSectionLoader style={{backgroundColor: 'black'}}/>);
        }
    }
}


const AntSwitch = withStyles(theme => ({
    root: {
        width: 27,
        height: 16,
        padding: 0,
        margin: 0,
    },
    switchBase: {
        color: '#7da5c7',
        marginTop: -23,
        marginLeft: -14,
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    checked: {
        transform: 'translateX(15px)',
        opacity: 1,
        border: 'none',
    },
    bar: {
        borderRadius: 7.5,
        width: 28,
        height: 16,
        marginTop: -15,
        marginLeft: -11.5,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    icon: {
        width: 16,
        height: 16,
    },
    iconChecked: {
        boxShadow: theme.shadows[1],
    },
}))(Switch);

const CustomRadio = withStyles(theme => ({
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

const CustomFormControlLabel = withStyles(theme => ({
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

const selectStyles = {
    control: styles => ({...styles, backgroundColor: 'black'}),
    menu: styles => ({...styles, backgroundColor: 'black', borderColor: 'red', borderWidth: 10}),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? 'yellow'
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : 'yellow',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? 'yellow' : color.alpha(0.3).css()),
            },
        };
    },
    multiValue: (styles, {data}) => {
        const color = chroma('yellow');
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
    }),
    multiValueRemove: (styles, {data}) => ({
        ...styles,
        color: 'yellow',
        ':hover': {
            backgroundColor: 'yellow',
            color: 'black',
        },
    }),
};