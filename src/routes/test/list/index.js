/**
 * News Dashboard
 */

import React, {Component} from 'react'
import {Card, CardBody, Button, Modal} from "reactstrap";
import {AppBar, Tabs, Tab, IconButton, Button as MuiButton} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";
import LearningModal from './LearningModal';
import SweetAlert from 'react-bootstrap-sweetalert'
import PaymentModal from "Components/Payment/PaymentModal";
import {NotificationManager} from "react-notifications";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import InstructionModal from "../../instructions";
import {NavLink, withRouter} from 'react-router-dom';
import * as Apis from 'Api';
import TestSetCouponModal from "Components/Payment/TestSetCouponModal";
import JSONParseDefault from 'json-parse-default';
import {connect} from "react-redux";
import VideoModal from "Routes/instructions/VideoModal";

// import NetSpeedMeter from "Components/NetSpeedMeter";

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            modalityList: [],
            selectedItem: {},
            selectedId: null,
            isShowModalType: '',
            modalInfo: {},
            showInstructionVideoModal: false,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.currentTestSets().then((modalityList) => {
            console.log('asdfasdf', modalityList)
            this.setState({modalityList: modalityList});
        });
    }

    onLearningModal(modality_name, instruction_type, test_set) {
        let type;
        if (modality_name === 'DentalED') {
            type = 'dentalED';
        } else if (instruction_type === 'COVID-19') {
            type = test_set.has_post ? 'has_post_covid' : 'covid';
        } else if (instruction_type === 'VOLPARA') {
            type = test_set.has_post ? 'has_post_volpara' : 'volpara';
        } else if (instruction_type === 'LUNGED') {
            type = 'LUNGED';
        } else {
            type = test_set.has_post ? 'has_post' : 'normal';
        }
        this.setState({
            isShowModalType: 'learningModal',
            modalInfo: {learningType: type, name: test_set.name, postTestCount: test_set.post_test_count, credit: test_set.test_set_point}
        });
    }

    onGoAttempt() {
        this.setState({isShowModalType: ''});
        if (this.state.selectedId.indexOf !== undefined && this.state.selectedId.indexOf('/app/test/attempt/') === 0) {
            this.props.history.push(this.state.selectedId)
        } else {
            let newData = {
                test_set_id: this.state.selectedId,
            };
            Apis.attemptsAdd(newData).then(resp => {
                let path = '/test-view/' + resp.test_set_id + '/' + resp.id + '/' + resp.current_test_case_id;
                // let path = '/app/test/attempt/' + resp.id;
                this.props.history.push(path);
            });
        }
    }

    onStart(value, modality_type, has_post) {
        this.setState({
            selectedId: value
        }, () => {
            this.onGoAttempt();
        });
    }

    onPay(test_set_item) {
        this.setState({
            selectedItem: test_set_item,
            isShowModalType: 'purchaseTestSet'
        });
    }

    onPaymentSuccess() {
        this.setState({isShowModalType: ''});
        this.getData();
    }

    onInstruction(modality_info) {
        this.setState({
            isShowModalType: 'instructionModal',
            modalInfo: {type: modality_info.instruction_type}
        });
    }

    onShowTestSetCouponModal() {
        this.setState({isShowModalType: 'couponModal'});
    }

    renderLearningButton(test_set_item, modality_info) {
        if (modality_info.modality_type === 'imaged_mammo' || modality_info.instruction_type === "PCT") {
            return null;
        } else {
            return (
                <NavLink to='#' className={'learning-objective'} onClick={() => this.onLearningModal(modality_info.name, modality_info.instruction_type, test_set_item)}>
                    <IntlMessages id="test.learningObjectives"/>
                </NavLink>
            )
        }
    }

    renderExpireDate(test_set_item) {
        const {test_set_point, test_set_expiry_date, is_test_set_expired} = test_set_item;
        if (test_set_point === 0 || test_set_expiry_date === 'unpaid') {
            return null;
        } else {
            if (is_test_set_expired) {
                return (
                    <span className={'fs-12 text-pink'}>Expired</span>
                )
            } else {
                return (
                    <span className={'fs-12'}>Expires: {moment(test_set_expiry_date).format('DD MMM YYYY')}</span>
                )
            }
        }
    }

    renderScoresButton(test_set_item, instruction_type) {
        const {id, attempts} = test_set_item;
        if (
            instruction_type !== 'PCT' && attempts.some((v) => v.complete)
        ) {
            return (
                <Button
                    className="mr-10 mt-5 mb-5"
                    outline color="info" size="sm"
                    onClick={() => this.props.history.push('/app/test/complete-list/' + id)}>
                    <IntlMessages id="test.scores"/>
                </Button>
            );
        } else {
            return null;
        }
    }

    renderStartButton(test_set_item, modality_type) {
        const {id, attempts, has_post, test_set_paid, test_set_point, is_test_set_expired, test_set_price} = test_set_item;
        const test_set_id = id;
        let attempt = attempts[0];
        if (!test_set_paid || is_test_set_expired) {
            // free test set
            return (
                <Button className="mr-10 mt-5 mb-5 pl-20 pr-20 test-set-buy-btn" outline color="secondary" size="sm"
                        onClick={() => test_set_point === 0 ? this.onStart(test_set_id, modality_type, has_post) : this.onPay(test_set_item)}>
                    {test_set_point === 0 ? <IntlMessages id="test.start"/> : `Buy ${test_set_price.currency_symbol}${test_set_price.price} ${test_set_price.currency}`}
                </Button>
            );
        } else if (attempt === undefined) {
            return (
                <Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, modality_type, has_post)}>
                    <IntlMessages id="test.start"/>
                </Button>
            );
        } else if (attempt.complete) {
            return (
                <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(test_set_id, modality_type, has_post)}>
                    <IntlMessages id="test.reStart"/>
                </Button>
            );
        } else {
            if (attempt.progress === '' || attempt.progress === 'test') {
                const path = '/test-view/' + attempt.test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
                return (
                    <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.props.history.push(path)}>
                        <IntlMessages id="test.continue"/>
                    </Button>
                );
            } else {
                const path = '/app/test/attempt/' + attempt.id + '/' + attempt.progress;
                return (
                    <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.props.history.push(path)}>
                        <IntlMessages id="test.continue"/>
                    </Button>
                );
            }
        }
    }

    renderModalityTab({modality_info}) {
        return (
            <ModalityTab
                key={modality_info.id}
                label={
                    <div className={'modality-tab-item'}>
                        <p>{modality_info.name}</p>
                        <img src={Apis.apiHost + modality_info.modality_icon_image} alt="site logo"/>
                        {
                            modality_info.instruction_type !== null ?
                                <MuiButton variant="outlined" size="small" color="default" startIcon={<MenuBookIcon/>} onClick={() => this.onInstruction(modality_info)}>
                                    <IntlMessages id={"testView.instructions"}/>
                                </MuiButton> : <div style={{height: 35}}/>
                        }
                    </div>
                }
            />
        )
    }

    renderModalityDesc(modality_info) {
        const {modality_desc, instruction_video_thumbnail, instruction_video} = modality_info;
        if (modality_desc === undefined || modality_desc === null) return <div className={'mt-50'}/>
        const modalityDesc = JSONParseDefault(modality_desc === null ? {} : modality_desc, null, modality_desc);
        let descText = '';
        if (typeof modalityDesc !== 'object') {
            // if desc is not JSON type, will be shown this text
            descText = modality_desc;
        } else if (modalityDesc[this.props.locale] !== undefined) {
            descText = modalityDesc[this.props.locale];
        } else if (modalityDesc['en'] !== undefined) {
            descText = modalityDesc['en'];
        }
        const unavailableDescText = (descText === null || descText === '');
        const unavailableVideo = (instruction_video_thumbnail === undefined || instruction_video_thumbnail === '' || instruction_video === undefined || instruction_video === '');

        if (unavailableDescText && unavailableVideo) {
            return <div className={'mt-50'}/>
        } else {
            return (
                <div className="modality-desc-text d-flex col-sm-12 col-md-12 col-lg-10 offset-lg-1 mt-20 mb-20">
                    {
                        !unavailableDescText &&
                        <div className={unavailableVideo ? 'col-sm-12' : 'col-sm-12 col-md-7'} dangerouslySetInnerHTML={{__html: descText}}/>
                    }
                    {
                        !unavailableVideo &&
                        <div className={(unavailableDescText ? 'col-sm-12' : 'col-md-5 col-sm-12') + ' d-flex flex-column justify-content-center'}>
                            <div className={'d-flex justify-content-center'}>
                                <h3><strong><IntlMessages id="test.list.instructionVideo"/></strong></h3>
                            </div>
                            <div className={'instruction-video'}
                                 onClick={() => this.setState({
                                     isShowModalType: 'instructionVideoModal',
                                     modalInfo: {type: modality_info.instruction_type, video: instruction_video}
                                 })}
                            >
                                <img src={instruction_video_thumbnail} alt=''/>
                                <p/>
                                <i className="zmdi zmdi-play-circle-outline"/>
                            </div>
                        </div>
                    }
                </div>
            )
        }
    }

    renderTestSets(
        {
            test_sets, modality_info
        }
    ) {
        return (
            <div className={'m-0'} key={modality_info.id}>
                {
                    this.renderModalityDesc(modality_info)
                }
                {
                    test_sets.map((item, index) => {
                        return (
                            <div className="col-sm-12 col-md-12 col-lg-10 offset-lg-1 p-0" key={index}>
                                <Card className="rct-block">
                                    <CardBody>
                                        <div className="row d-flex justify-content-between">
                                            <div className={'col-sm-12 col-md-9'}>
                                                <div className={'d-flex flex-row align-items-center mb-5'}>
                                                    <span className="fs-14 fw-bold">{item.name}</span>
                                                    {this.renderLearningButton(item, modality_info)}
                                                </div>
                                                {this.renderExpireDate(item)}
                                            </div>
                                            <div className={'col-sm-12 col-md-3 test-list-action-buttons'}>
                                                {this.renderScoresButton(item, modality_info.instruction_type)}
                                                {this.renderStartButton(item, modality_info.modality_type)}
                                            </div>
                                        </div>
                                        {
                                            item.test_set_desc !== null && item.test_set_desc !== '' &&
                                            <div className={'test-list-desc-text'}>
                                                {item.test_set_desc}
                                            </div>
                                        }
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        return (
            <div className="test-list-container news-dashboard-wrapper mb-20">
                <div className={'test-set-coupon'}>
                    <MuiButton data-cy="test-set-coupon-button" variant="outlined" size="small" color="primary" startIcon={<i className="ti-gift"/>} onClick={() => this.onShowTestSetCouponModal()}>
                        <IntlMessages id={"test.testSetCoupon"}/>
                    </MuiButton>
                </div>
                <AppBar position="static" color="default">
                    <ModalityTabs
                        value={this.state.tabIndex}
                        onChange={(e, value) => this.setState({tabIndex: value})}
                        variant="scrollable"
                        scrollButtons="auto"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                    >
                        {
                            this.state.modalityList.map((v) => this.renderModalityTab(v))
                        }
                    </ModalityTabs>
                </AppBar>
                <SwipeableViews
                    index={this.state.tabIndex}
                    style={{display: 'flex', flex: 1}}
                    containerStyle={{width: '100%', height: '100%'}}
                    onChangeIndex={(index, indexLatest, meta) => this.setState({tabIndex: index})}
                >
                    {
                        this.state.modalityList.map(v => this.renderTestSets(v))
                    }
                </SwipeableViews>
                <LearningModal
                    open={this.state.isShowModalType === 'learningModal'}
                    type={this.state.modalInfo.learningType}
                    name={this.state.modalInfo.name}
                    postTestCount={this.state.modalInfo.postTestCount}
                    credit={this.state.modalInfo.credit}
                    onClose={() => this.setState({isShowModalType: '', modalInfo: {}})}
                />
                {
                    (this.state.isShowModalType === 'purchaseTestSet') &&
                    <PaymentModal
                        testSetItem={this.state.selectedItem}
                        onFinish={() => this.onPaymentSuccess()}
                        onClose={() => this.setState({isShowModalType: ''})}
                    />
                }
                <InstructionModal
                    isOpen={this.state.isShowModalType === 'instructionModal'}
                    onClose={() => this.setState({isShowModalType: '', modalInfo: {}})}
                    theme={'white'}
                    type={this.state.modalInfo.type}
                />
                <TestSetCouponModal
                    isOpen={this.state.isShowModalType === 'couponModal'}
                    onFinish={() => this.getData()}
                    onClose={() => this.setState({isShowModalType: ''})}
                />
                <VideoModal
                    open={this.state.isShowModalType === 'instructionVideoModal'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    link={this.state.modalInfo.video}
                />

                {/*<NetSpeedMeter*/}
                {/*    imageUrl={'https://static.detectedx.com/data/dummy.dat'}*/}
                {/*    downloadSize={104857600}*/}
                {/*    pingInterval={40000} // milliseconds*/}
                {/*    thresholdUnit = 'megabyte'*/}
                {/*    callbackFunctionOnNetworkDown={(speed)=>console.log("down speed", speed)}*/}
                {/*/>*/}
            </div>
        )
    }
}

// map state to props
const mapStateToProps = (state) => {
        return {
            locale: state.settings.locale.locale,
        };
    }
;

export default withRouter(connect(mapStateToProps)(List));

const ModalityTabs = withStyles(
    {
        root: {}
        ,
        indicator: {
            height: 3,
        }
        ,
    }
)(Tabs);

const ModalityTab = withStyles((theme) => (
    {
        root: {
            '&$selected':
                {
                    fontWeight: 'bold',
                }
            ,
        }
        ,
        selected: {
            fontWeight: 'bold',
        }
        ,
    }
))(Tab);