/**
 * News Dashboard
 */

import React, {Component} from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Col, FormGroup, Input, Label} from "reactstrap";
import AppBar from "@material-ui/core/AppBar";
import Button from '@material-ui/core/Button';
import Toolbar from "@material-ui/core/Toolbar";
import * as Apis from 'Api';

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';
import Loader from './functions/loader';
import Dtx from './functions/dtx';
import IntlMessages from "Util/IntlMessages";

export default class TestView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            test_case: {},
            images: [],
            modality: {},
            rating_scale: {lesion_types: []},
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { params } = this.props.match;
        let promise1 = new Promise(function (resolve, reject) {
            Apis.testCasesInfo(params.test_cases_id).then((data) => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise2 = new Promise(function (resolve, reject) {
            Apis.testCasesImagesList(params.test_cases_id).then((data) => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise3 = new Promise(function (resolve, reject) {
            Apis.testSetsModality(params.test_sets_id).then((data) => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        let promise4 = new Promise(function (resolve, reject) {
            Apis.attemptsRatingScale(params.attempts_id).then((data) => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        const that = this;
        Promise.all([promise1, promise2, promise3, promise4]).then(function (values) {
            that.setState({test_case: values[0], images: values[1], modality: values[2], rating_scale: values[3]}, () => {
                cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
                cornerstoneTools.external.cornerstone = cornerstone;
                cornerstoneTools.external.Hammer = Hammer;
                cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
                cornerstoneTools.init();
                cornerstone.registerImageLoader('dtx', Loader);
                Dtx.init(params.test_cases_id, params.attempts_id);
            });
        });
    }

    render() {
        return (
            <div className="viewer">
                <div id="toolbar">
                    <div id="tools">
                        <div className="tool" data-tool="Pan">
                            <svg id="icon-tools-pan" viewBox="0 0 18 18">
                                <title>Pan</title>
                                <g id="icon-tools-pan-group" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path id="icon-tools-pan-line-v" d="M9,1 L9,17"></path>
                                    <path id="icon-tools-pan-line-h" d="M1,9 L17,9"></path>
                                    <polyline id="icon-tools-pan-caret-t" points="7 3 9 1 11 3"></polyline>
                                    <polyline id="icon-tools-pan-caret-r" points="15 11 17 9 15 7"></polyline>
                                    <polyline id="icon-tools-pan-caret-b" points="11 15 9 17 7 15"></polyline>
                                    <polyline id="icon-tools-pan-caret-l" points="3 7 1 9 3 11"></polyline>
                                </g>
                            </svg>
                            <p>Pan</p>
                        </div>
                        <div className="tool" data-tool="Zoom">
                            <svg id="icon-tools-zoom" viewBox="0 0 17 17">
                                <title>Zoom</title>
                                <g id="icon-tools-zoom-group" fill="none" strokeWidth="2" strokeLinecap="round">
                                    <path id="icon-tools-zoom-path" d="m11.5,11.5 4.5,4.5" />
                                    <circle id="icon-tools-zoom-circle" cx="7" cy="7" r="6" />
                                </g>
                            </svg>
                            <p>Zoom</p>
                        </div>
                        <div className="tool" data-tool="Wwwc">
                            <svg id="icon-tools-levels" viewBox="0 0 18 18">
                                <title>Window / Level</title>
                                <g id="icon-tools-levels-group">
                                    <path id="icon-tools-levels-path" d="M14.5,3.5 a1 1 0 0 1 -11,11 Z" stroke="none" opacity="0.8" />
                                    <circle id="icon-tools-levels-circle" cx="9" cy="9" r="8" fill="none" strokeWidth="2" />
                                </g>
                            </svg>
                            <p>Window</p>
                        </div>
                        <div className="tool" data-tool="Marker">
                            <svg id="icon-tools-elliptical-roi" viewBox="0 0 24 28">
                                <title>Elliptical ROI</title>
                                <path d="M12 5.5c-4.688 0-8.5 3.813-8.5 8.5s3.813 8.5 8.5 8.5 8.5-3.813 8.5-8.5-3.813-8.5-8.5-8.5zM24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12v0c6.625 0 12 5.375 12 12z"></path>
                            </svg>
                            <p>Mark</p>
                        </div>
                    </div>

                    <h1>1 / 1</h1>

                    <nav>
                        <Button className='mr-10' variant="contained" color="primary"> Finish</Button>
                        <Button variant="contained" color="primary">Home</Button>
                    </nav>
                </div>
                <div id="images">
                    {
                        this.state.images.map((item, index) => {
                            return (
                                <div className="image" id={"image" + item.id} data-image-id={item.id} data-url={item.id} key={item.id}>
                                    <div className="dicom"></div>
                                    <div className="zoom status"></div>
                                    <div className="window status"></div>
                                    <button className="invert">Invert</button>
                                    <button className="reset">Reset</button>
                                </div>
                            )
                        })
                    }
                </div>
                <div id="cover" style={{display: 'none'}}>
                    <div id="mark-details">
                        <form>
                            <FormGroup row>
                                <Label for="occupation" sm={3}>Rating:</Label>
                                <Col sm={9}>
                                    <Input type="select" name="rating">
                                        {
                                            Array.from(Array(this.state.rating_scale.max_rating).keys()).map((v) => {   // [0, 1, 2, 3...]
                                                return v + 1 === this.state.rating_scale.default_rating ? null : <option value={v + 1} key={v + 1}>{v + 1}</option>;
                                            })
                                        }
                                    </Input>
                                </Col>
                            </FormGroup>
                            {
                                this.state.rating_scale.lesion_types.map((v, i) => {
                                    return (
                                        <FormGroup check key={i} className={"lesion-type"}>
                                            <Label check>
                                                <Input type="checkbox" data-lesion-type-id={v.id} />{' '}
                                                {v.name}
                                            </Label>
                                        </FormGroup>
                                    )
                                })
                            }

                            <div className="actions">
                                <div className="left">
                                    <button className="cancel">Cancel</button>
                                </div>
                                <div className="right">
                                    <button className="mr-15 delete">Delete</button>
                                    <button className="save">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
