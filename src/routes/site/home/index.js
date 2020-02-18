import React, {Component} from 'react';
import {Col} from "reactstrap";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

export default class home extends Component {
    render() {
        return (
            <div className={'site-home'}>
                <div className={'row site-home-top'}>
                    <Col sm={5}>
                        <p className={'main-title mt-50'}>
                            Perfecting detection through education
                        </p>
                        <p className={'main-desc'}>
                            Powerful, personalised, on-line radiology training and research tool that is available world-wide.
                        </p>
                        <div className={'read-btn-container'}>
                            <Button component={Link} to={"/site/platform"} variant="contained" className="read-btn">
                                READ MORE
                            </Button>
                        </div>
                    </Col>
                </div>
                <div className={'row mt-70'}>
                    <Col sm={3}>
                        <div>
                            <p className={'sub-title'}>
                                HOW WE HELP YOU PERFORM
                            </p>
                            <ul className={'sub-functions'}>
                                <li>
                                    Measure your screen reading skills.
                                </li>
                                <li>
                                    Compare your performance with that of your peers.
                                </li>
                                <li>
                                    Improve your detection skills.
                                </li>
                                <li>
                                    Perfect your image Interpretation.
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div>
                            <svg preserveAspectRatio="xMidYMid meet" data-bbox="40.5 42.5 119 115.001" viewBox="40.5 42.5 119 115.001" height="70" width="70" xmlns="http://www.w3.org/2000/svg" data-type="color" role="img">
                                <g>
                                    <path d="M149.46 73.135l-.159.173v75.764h-45.963v-38.043a164.404 164.404 0 0 1-8.438 4.534v33.51H48.939v-18.874c-2.796.427-5.612.78-8.439 1.052v26.25h117.24V63.286a218.86 218.86 0 0 1-8.28 9.849z" fill="#000000" data-color="1"/>
                                    <path d="M149.138 42.5C130.152 69.147 94.627 105.906 40.5 111.871v8.487c37.688-3.914 72.527-22.698 100.864-54.434A214.631 214.631 0 0 0 159.5 42.5h-10.362z" fill="#000000" data-color="1"/>
                                </g>
                            </svg>
                            <p className={'item-title'}>Increased performance</p>
                            <p className={'item-desc'}>Repeat users of our test set approach have shown a 34% average increase in performance.</p>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div>
                            <svg preserveAspectRatio="xMidYMid meet" data-bbox="42.5 45 115 110" viewBox="42.5 45 115 110" height="70" width="70" xmlns="http://www.w3.org/2000/svg" data-type="color" role="img">
                                <g>
                                    <path d="M113.556 45v34.409H78.028v34.406H42.5V155h115V45h-43.944zM78.028 146.603H50.915v-24.392h27.113v24.392zm35.528 0H86.445V87.806h27.112v58.797zm35.529 0h-27.114V53.396h27.114v93.207z" fill="#000000" data-color="1"/>
                                </g>
                            </svg>
                            <p className={'item-title'}>Instant feedback</p>
                            <p className={'item-desc'}>Instant feedback with various international, national or local reports on performance comparisons.</p>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div>
                            <svg preserveAspectRatio="xMidYMid meet" data-bbox="43 43 114 114" viewBox="43 43 114 114" height="70" width="70" xmlns="http://www.w3.org/2000/svg" data-type="color" role="img">
                                <g>
                                    <path d="M99.999 43C68.57 43 43 68.57 43 100s25.57 57 56.999 57S157 131.43 157 100s-25.572-57-57.001-57zm-48.587 57c0-1.723.094-3.427.27-5.106 4.069-3.703 12.211-7.377 23.652-9.638a145.705 145.705 0 0 0-.738 14.713c0 5.074.256 10.028.745 14.775-11.446-2.261-19.59-5.937-23.659-9.643a48.558 48.558 0 0 1-.27-5.101zm31.594-.031c0-5.772.341-11.121.918-16.046a137.8 137.8 0 0 1 16.046-.918c5.797 0 11.165.343 16.104.925.58 4.925.919 10.269.919 16.039 0 5.794-.341 11.161-.925 16.097-4.936.582-10.302.925-16.097.925-5.77 0-11.114-.339-16.039-.918a137.305 137.305 0 0 1-.926-16.104zm41.658-14.706c11.477 2.276 19.62 5.973 23.666 9.698a49.466 49.466 0 0 1 0 10.071c-4.047 3.728-12.191 7.427-23.67 9.701.486-4.742.745-9.692.745-14.764-.001-5.05-.257-9.977-.741-14.706zm20.937-2.038c-5.957-2.918-13.544-5.208-22.123-6.695-1.478-8.568-3.759-16.153-6.664-22.115 13.301 4.921 23.877 15.504 28.787 28.81zm-40.496-31.543c3.703 4.069 7.377 12.213 9.64 23.657a145.41 145.41 0 0 0-14.775-.745c-5.052 0-9.986.256-14.712.74 2.261-11.442 5.933-19.584 9.636-23.653 1.679-.176 3.382-.27 5.105-.27s3.427.095 5.106.271zm-21.921 2.731C80.281 60.372 78 67.955 76.522 76.521c-8.568 1.478-16.148 3.759-22.108 6.666 4.917-13.29 15.485-23.858 28.77-28.774zm-28.771 62.398c5.962 2.907 13.548 5.186 22.121 6.666 1.485 8.579 3.774 16.166 6.693 22.124-13.308-4.908-23.894-15.487-28.814-28.79zm40.552 31.518c-3.726-4.044-7.424-12.189-9.701-23.666 4.729.484 9.656.74 14.706.74 5.072 0 10.022-.259 14.764-.747-2.274 11.482-5.973 19.627-9.698 23.673a49.28 49.28 0 0 1-10.071 0zm21.809-2.728c2.921-5.96 5.208-13.549 6.693-22.135 8.586-1.485 16.177-3.772 22.134-6.693-4.912 13.319-15.506 23.914-28.827 28.828z" fill="#000000" data-color="1"/>
                                </g>
                            </svg>
                            <p className={'item-title'}>Globally available</p>
                            <p className={'item-desc'}>Test sets are accessible 24/7 from anywhere around the world.</p>
                        </div>
                    </Col>
                </div>
            </div>
        );
    }
}