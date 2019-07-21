

import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {Card, CardBody, Button, CardText} from "reactstrap";
import * as Apis from 'Api';
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import moment from 'moment';

export default class score extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            attemptId: this.props.match.params.attempt_id,
            attemptDetail: {},
            completeList: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        let attemptId = this.state.attemptId;
        let promise1 = new Promise(function (resolve, reject) {
            Apis.attemptsDetail(attemptId).then(data => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });

        let promise2 = new Promise(function (resolve, reject) {
            Apis.attemptsCompleteList().then(data => {
                resolve(data);
            }).catch(e => {
                reject(e);
            });
        });
        const that = this;
        Promise.all([promise1, promise2]).then(function (values) {
            that.setState({attemptDetail: values[0], completeList: values[1], loading: false});
        });
    }

    onOtherAttempt(id) {
        this.props.history.push('/app/test/complete-list/' + id);
        this.setState({attemptId: id, loading: true}, () => {
            this.getData();
        });
    }

    render() {
        let reviewPath = '/test-view/' + this.state.attemptDetail.test_set_id + '/' + this.state.attemptDetail.id + '/' + this.state.attemptDetail.current_test_case_id;
        if (!this.state.loading) {
            return (
                <div className="card-wrapper">
                    <RctCollapsibleCard heading={"Attempt for " + this.state.attemptDetail.test_sets.name}>
                        <CardText>Completed: {moment(this.state.attemptDetail.updated_at).format('MMMM Do YYYY, HH:mm:ss')}</CardText>
                        <h3>Scores:</h3>
                        <div className="ml-25">
                            {
                                this.state.attemptDetail.scores !== undefined ? this.state.attemptDetail.scores.map((v, i) => {
                                    return (
                                        <CardText key={i}>{v.metrics.name}: {v.score}</CardText>
                                    );
                                }) : null
                            }
                            <Link className="mt-5" to={reviewPath}>Review</Link>
                        </div>
                    </RctCollapsibleCard>
                    <RctCollapsibleCard heading="Other Attempts">
                        <List className="p-0">
                            {
                                this.state.completeList.map((v, i) => {
                                    if (v.id === this.state.attemptDetail.id) {
                                        return null;
                                    } else {
                                        return (
                                            <ListItem button key={i} onClick={() => this.onOtherAttempt(v.id)}>
                                                <ListItemText primary={moment(v.updated_at).format('MMMM Do YYYY, HH:mm:ss')}/>
                                            </ListItem>
                                        )
                                    }
                                })
                            }
                        </List>
                    </RctCollapsibleCard>
                </div>
            )
        } else {
            return (<RctSectionLoader/>);
        }
    }
}
