import React, {Component} from 'react';
import {Dropdown, DropdownMenu, DropdownToggle, Input, Button} from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import {Scrollbars} from "react-custom-scrollbars";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import $ from 'jquery';

export default class CommentInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commentText: '',
            panelOpen: false,
            loading: true,
        }
    }

    componentDidMount() {
        this.getComment();
    }

    getComment() {
        Apis.attemptGetTestCaseComment(this.props.attempts_id, this.props.test_case_id).then((resp) => {
            this.setState({
                commentText: resp,
                loading: false
            })
        }).catch((error) => {
            NotificationManager.error(error.response.data.error.message);
        });
    }

    togglePanel() {
        //control overlap in mobile browser
        $('.covid-question-container ').css('overflow', !this.state.panelOpen ? 'inherit' : 'auto');
        this.setState({
            panelOpen: !this.state.panelOpen
        });
    }

    render() {
        if (this.state.commentText === '') {
            return null;
        } else {
            return (
                <div className={this.props.isCovid ? 'comment-info covid-comment' : 'comment-info'}>
                    <Dropdown isOpen={this.state.panelOpen} toggle={() => this.togglePanel()}>
                        <DropdownToggle className="bg-primary">
                            {
                                this.props.isCovid ?
                                    <Button size={'small'} color="primary" onClick={() => null}><IntlMessages id={"testView.synopticComment"}/></Button> :
                                    <Tooltip title="Comment" placement="right">
                                        <i className="zmdi zmdi-comment-text"/>
                                    </Tooltip>
                            }
                        </DropdownToggle>
                        <DropdownMenu>
                            <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={530} autoHide autoHideDuration={100}>
                                <ul className="list-unstyled text-center mb-0">
                                    <li className="header-title mb-10">
                                        <IntlMessages id={"testView.comment"}/>
                                    </li>
                                    <li className={'comment-text'}>
                                        {this.state.commentText}
                                    </li>
                                </ul>
                            </Scrollbars>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );
        }
    }
}