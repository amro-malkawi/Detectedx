/**
 * News Dashboard
 */

import React, {Component} from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody} from "reactstrap";
import AppBar from "@material-ui/core/AppBar";
import Button from '@material-ui/core/Button';
import Toolbar from "@material-ui/core/Toolbar";

export default class TestView extends Component {
    render() {
        return (
            <div className="viewer">
                <div id="toolbar">
                    <div id="tools">
                        <div className="tool" data-tool="Pan">
                            <svg id="icon-tools-pan" viewBox="0 0 18 18">
                                <title>Pan</title>
                                <g id="icon-tools-pan-group" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                                <g id="icon-tools-zoom-group" fill="none" stroke-width="2" stroke-linecap="round">
                                    <path id="icon-tools-zoom-path" d="m11.5,11.5 4.5,4.5" />
                                    <circle id="icon-tools-zoom-circle" cx="7" cy="7" r="6" />
                                </g>
                            </svg>
                            <p>Zoom</p>
                        </div>
                        <div className="tool active" data-tool="Wwwc">
                            <svg id="icon-tools-levels" viewBox="0 0 18 18">
                                <title>Window / Level</title>
                                <g id="icon-tools-levels-group">
                                    <path id="icon-tools-levels-path" d="M14.5,3.5 a1 1 0 0 1 -11,11 Z" stroke="none" opacity="0.8" />
                                    <circle id="icon-tools-levels-circle" cx="9" cy="9" r="8" fill="none" stroke-width="2" />
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
                        <a className="button" rel="nofollow" data-method="post" href="/test_sets/1/attempts/10/complete">Finish</a>
                        <a className="button" href="/test_sets">Home</a>
                    </nav>
                </div>
                <div id="images">
                    <div className="image" id="image1" data-image-id="1" data-url="/test_sets/1/attempts/10/test_cases/1/images/1.json">
                        <div className="dicom"></div>
                        <div className="zoom status"></div>
                        <div className="window status"></div>
                        <button className="invert">Invert</button>
                        <button className="reset">Reset</button>
                    </div>
                </div>
                <div id="cover" style={{display: 'none'}}>
                    <div id="mark-details">
                        <form>
                            <p className="rating">
                                <label>Rating:</label>
                                <select name="rating">
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </p>

                            <p className="lesion-type">
                                <label>
                                    <input type="checkbox" data-lesion-type-id="1" />
                                    <span>Stellate</span>
                                </label>
                            </p>
                            <p className="lesion-type">
                                <label>
                                    <input type="checkbox" data-lesion-type-id="2" />
                                    <span>Calcification</span>
                                </label>
                            </p>
                            <p className="lesion-type">
                                <label>
                                    <input type="checkbox" data-lesion-type-id="3" />
                                    <span>Discrete Mass</span>
                                </label>
                            </p>

                            <div className="actions">
                                <div className="left">
                                    <button className="cancel">Cancel</button>
                                </div>
                                <div className="right">
                                    <button className="delete">Delete</button>
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
