/**
 * News Dashboard
 */

import React, { Component } from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Button} from "reactstrap";
import * as Apis from 'Api';
import {Link} from "react-router-dom";
import {getAppLayout} from "Helpers/helpers";

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

    onRestart(item) {
        let newData = {
            user_id: item.attempts.user_id,
            current_test_case_id: item.attempts.current_test_case_id,
            rating_scale_id: item.attempts.rating_scale_id,
            test_set_id: item.attempts.test_set_id,
            complete: false,
        };
        Apis.attemptsAdd(newData).then(resp => {
            let path = '/test-view/' + item.test_set_id + '/' + resp.id + '/' + item.attempts.current_test_case_id;
            this.props.history.push(path);
        });
    }

    renderButton(item) {
        let path = '/test-view/' + item.test_set_id + '/' + item.attempts.id + '/' + item.attempts.current_test_case_id;
        let completePath = '/app/test/complete-list/' + item.attempts.id;
        if(item.attempts === null) {
            return (<Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.props.history.push(path)}>Start</Button>);
        } else if( item.attempts.complete) {
            return (
                <div>
                    <Button className="mr-10 mt-5 mb-5" outline color="info" size="sm" onClick={() => this.props.history.push(completePath)}>Scores</Button>
                    <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onRestart(item)}>Re-Start</Button>
                </div>
            );
        } else {
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
                                            {this.renderButton(item)}
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
