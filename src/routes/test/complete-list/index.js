import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {Card, CardBody, CardText} from "reactstrap";
import Button from '@material-ui/core/Button';
import * as Apis from 'Api';
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import moment from 'moment';

export default class CompleteList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            testSetId: this.props.match.params.test_set_id,
            attemptDetail: {},
            completeList: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.attemptsCompletedList(this.state.testSetId).then(resp => {
            this.setState({completeList: resp, loading: false});
        }).catch(e => {

        });
    }

    renderScores(scores) {
        let scoreValues = this.state.completeList.metrics.map((v) => {
            let findObj = scores.find((vv) => vv.metric_id === v.id);
            if (findObj === undefined) {
                return '';
            } else {
                return findObj.score;
            }
        });
        return scoreValues.map((vv, ii) => (
            <td key={ii} className={'text-center'}>{vv}</td>
        ))
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="table-responsive">
                    <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                        <h3>{"Attempt for " + this.state.completeList.test_set_name}</h3>
                    </div>
                    <table className="table table-middle table-hover mb-0">
                        <thead>
                        <tr>
                            <th className={'text-center'}>Attempt Number</th>
                            {
                                this.state.completeList.metrics.map((v, i) => (
                                    <th key={i} className={'text-center'}>{v.name}</th>
                                ))
                            }
                            <th className={'text-center'}>Start</th>
                            <th className={'text-center'}>Finish</th>
                            <th className={'text-center'}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.completeList.attempts && this.state.completeList.attempts.map((item, i) => (
                            <tr key={i}>
                                <td className={'text-center'}>{this.state.completeList.attempts.length - i}</td>
                                {
                                    this.renderScores(item.scores)
                                }
                                <td className={'text-center'}>{moment(item.created_at).format('MM/DD/YYYY, HH:mm:ss')}</td>
                                <td className={'text-center'}>{moment(item.updated_at).format('MM/DD/YYYY, HH:mm:ss')}</td>
                                <td className="list-action text-center">
                                    <Button variant="contained" className={'text-white'} color="primary" size="small"
                                            onClick={() => this.props.history.push('/app/test/attempt/' + item.id)}>View</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className="border-top">
                        <tr>
                            <td colSpan="100%">
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            );
        } else {
            return (<RctSectionLoader/>);
        }
    }
}
