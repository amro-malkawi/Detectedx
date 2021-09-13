import React, {Component} from 'react';
import {Dropdown, DropdownMenu, DropdownToggle, Input, Button} from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import {Scrollbars} from "react-custom-scrollbars";
import * as Apis from 'Api';
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import $ from 'jquery';
import PropTypes from "prop-types";
import 'Assets/css/quill.snow.css'
import {connect} from "react-redux";

class CommentInfo extends Component {

    static propTypes = {
        test_case_id: PropTypes.string.isRequired,
        attempts_id: PropTypes.string.isRequired,
        modality_type: PropTypes.string.isRequired,
        complete: PropTypes.bool.isRequired
    };

    static defaultProps = {
        modality_type: '',
        complete: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            commentText: '',
            // panelOpen: ((props.modality_type === 'volpara' || props.modality_type === 'imaged_mammo' || props.modality_name.indexOf('GE - CESM') === 0) && props.complete),
            panelOpen: (props.modality_type === 'volpara' || props.modality_type === 'imaged_mammo' || props.modality_name.indexOf('GE - CESM') === 0),
            imageCount: props.imageList.length,
            isGETestCase: false,
            loading: true,
        }
    }

    componentDidMount() {
        this.getComment();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.imageList.length !== prevState.imageCount) {
            if(nextProps.imageList.some((image) => (image.hangingId !== undefined && image.hangingId.indexOf('VPREVIEW') !== -1))) {
                return {panelOpen: true, isGETestCase: true, imageCount: nextProps.imageList.length}
            }
        }
        return null;
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
        if (this.state.commentText === undefined || this.state.commentText === '') {
            return null;
        } else {
            const {modality_type, complete} = this.props;
            let containerClass;
            if (modality_type === 'covid') {
                containerClass = 'comment-info covid-comment';
            } else if (modality_type === 'volpara' && complete) {
                containerClass = 'comment-info right-comment';
            } else {
                containerClass = 'comment-info';
            }
            return (
                <div className={containerClass}>
                    <Dropdown isOpen={this.state.panelOpen} toggle={() => this.togglePanel()}>
                        <DropdownToggle className="bg-primary">
                            {
                                modality_type === 'covid' ?
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
                                        {
                                            this.state.isGETestCase ? <IntlMessages id={"testView.comment.patient"}/> :
                                                <IntlMessages id={"testView.comment"}/>
                                        }
                                    </li>
                                    <li className={'comment-text'}>
                                        <div className={'ql-editor'} dangerouslySetInnerHTML={{__html: this.state.commentText}}/>
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

// map state to props
const mapStateToProps = (state) => ({
    imageList: state.testView.imageList,
});

export default connect(mapStateToProps, null)(CommentInfo);