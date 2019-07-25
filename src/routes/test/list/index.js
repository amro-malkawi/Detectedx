/**
 * News Dashboard
 */

import React, { Component } from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Button} from "reactstrap";
import * as Apis from 'Api';

export default class list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testSetsList: [],
        }
    }

    componentDidMount() {
        this.getTestSetsList();
    }

    getTestSetsList() {
        Apis.currentTestSets().then(resp => {
            this.setState({testSetsList: resp});
        }).catch(e => {

        });
    }

    onStart(test_set_id) {
        let newData = {
            test_set_id: test_set_id,
        };
        Apis.attemptsAdd(newData).then(resp => {
            let path = '/test-view/' + test_set_id + '/' + resp.id + '/' + resp.current_test_case_id;
            this.props.history.push(path);
        });
    }

    renderStartButton(test_set_id, attempts) {
        let attempt = attempts[0];
        if(attempt === undefined) {
            return (<Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id)}>Start</Button>);
        } else if( attempt.complete) {
            return ( <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id)}>Re-Start</Button> );
        } else {
            let path = '/test-view/' + test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            return ( <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.props.history.push(path)}>Continue</Button> );
        }
    }

    render() {
        return (
            <div className="news-dashboard-wrapper">
                <PageTitleBar title={"Test Sets"} match={this.props.match} enableBreadCrumb={false}/>
                <div className="row">
                    {
                        this.state.testSetsList.map((item, index) => {
                            return (
                                <div className="col-sm-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2" key={index}>
                                    <Card className="rct-block">
                                        <CardBody className="d-flex justify-content-between">
                                            <div>
                                                <p className="fs-14 fw-bold mb-5">{item.test_sets.name}</p>
                                                <span className="fs-12 d-block text-muted">{item.test_sets.modalities.name}</span>
                                            </div>
                                            <div>
                                                {
                                                    item.test_sets.attempts[1] !== undefined && item.test_sets.attempts[1].complete ?
                                                        <Button
                                                            className="mr-10 mt-5 mb-5"
                                                            outline color="info" size="sm"
                                                            onClick={() => this.props.history.push('/app/test/complete-list/' + (item.test_sets.attempts[0].complete ? item.test_sets.attempts[0].id : item.test_sets.attempts[1].id))}>
                                                            Scores
                                                        </Button> : null
                                                }
                                                {this.renderStartButton(item.test_sets.id, item.test_sets.attempts)}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
