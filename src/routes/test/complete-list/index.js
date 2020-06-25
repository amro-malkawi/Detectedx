import React, {Component} from 'react'
import Button from '@material-ui/core/Button';
import * as Apis from 'Api';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";

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
            <td key={ii} className={'text-center'} data-title={this.state.completeList.metrics[ii].name}>{vv}</td>
        ))
    }

    render() {
        if (!this.state.loading) {
            return (
                <div className="complete-list-container table-responsive">
                    <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                        <h3><IntlMessages id="test.attemptFor"/> {this.state.completeList.test_set_name}</h3>
                    </div>
                    <table className="table table-middle table-hover mb-0 mobile-table">
                        <thead>
                        <tr>
                            <th className={'text-center'}><IntlMessages id={"test.attemptNumber"}/></th>
                            {
                                this.state.completeList.metrics.map((v, i) => (
                                    <th key={i} className={'text-center'}>{v.name}</th>
                                ))
                            }
                            <th className={'text-center'}><IntlMessages id={"test.start"}/></th>
                            <th className={'text-center'}><IntlMessages id={"test.finish"}/></th>
                            <th className={'text-center'}><IntlMessages id={"test.action"}/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.completeList.attempts && this.state.completeList.attempts.map((item, i) => (
                            <tr key={i}>
                                <td className={'text-center'} data-title={'Attempt Number'}>{this.state.completeList.attempts.length - i}</td>
                                {
                                    this.renderScores(item.scores)
                                }
                                <td className={'text-center'} data-title={'Start'}>{moment(item.created_at).format('MM/DD/YYYY, HH:mm:ss')}</td>
                                <td className={'text-center'} data-title={'Finish'}>{moment(item.updated_at).format('MM/DD/YYYY, HH:mm:ss')}</td>
                                <td className="list-action text-center" data-title={'Action'}>
                                    <Button variant="contained" className={'text-white'} color="primary" size="small"
                                            onClick={() => this.props.history.push('/app/test/attempt/' + item.id)}><IntlMessages id={"test.view"}/></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (<RctSectionLoader/>);
        }
    }
}
