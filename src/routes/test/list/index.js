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
import USStartModal from './USStartModal';
import USCovidStartModal from './USCovidStartModal';
import LearningModal from "./LearningModal";
import LearningCovidModal from "./LearningCovidModal";
import SweetAlert from 'react-bootstrap-sweetalert'
import PaymentModal from "Components/Payment/PaymentModal";
import {NotificationManager} from "react-notifications";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import InstructionModal from "../../instructions";
import {NavLink} from 'react-router-dom';
import * as Apis from 'Api';
import TestSetCouponModal from "Components/Payment/TestSetCouponModal";

export default class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            testSetsList: [],
            userInfo: {},
            selectedItem: {},
            selectedId: null,
            isShowModalType: '',
            instructionModalInfo: {},
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.currentTestSets().then((testSetsInfo) => {
            this.setState({testSetsList: testSetsInfo.testSetsList, userInfo: testSetsInfo.userInfo});
        });
    }

    onLearningModal(modality_type, has_post) {
        if (modality_type === 'covid') {
            this.setState({
                isShowModalType: has_post ? 'has_post_covid' : 'covid',
            });
        } else {
            this.setState({
                isShowModalType: has_post ? 'has_post' : 'normal',
            });
        }
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
        const {userInfo} = this.state;
        let isShowModalType = '';
        if (userInfo.user_subscription_id === null || userInfo.is_subscription_expired) {
            NotificationManager.warning(<IntlMessages id={"test.purchase.message1"}/>);
            isShowModalType = 'planSubscribe';
        } else if (userInfo.user_credit < test_set_item.test_set_credit) {
            NotificationManager.warning(<IntlMessages id={"test.purchase.message2"}/>);
            isShowModalType = 'creditPurchase';
        } else {
            isShowModalType = 'sweetConfirm';
        }
        this.setState({
            selectedItem: test_set_item,
            isShowModalType: isShowModalType
        });
    }

    onBuyTestSetWithCredit() {
        const {userInfo, selectedItem} = this.state;
        if (userInfo.user_subscription_id === null || userInfo.is_subscription_expired) {
            NotificationManager.warning(<IntlMessages id={"test.purchase.message1"}/>);
            this.setState({isShowModalType: 'planSubscribe'});
        } else if (userInfo.user_credit < selectedItem.test_set_credit) {
            NotificationManager.warning(<IntlMessages id={"test.purchase.message2"}/>);
            this.setState({isShowModalType: 'creditPurchase'})
        } else {
            this.setState({isShowModalType: ''});
            Apis.buyTestSet(this.state.selectedItem.id).then(resp => {
                NotificationManager.success(this.state.selectedItem.name + 'test set purchase succeeded.');
                this.getData();
            }).catch(e => {
                if (e.response) NotificationManager.error(e.response.data.error.message);
            });
        }
    }

    onPaymentSuccess() {
        this.setState({isShowModalType: 'sweetConfirm'});
    }

    onInstruction(modality_info) {
        this.setState({instructionModalInfo: {type: modality_info.instruction_type, video: {thumbnail: modality_info.instruction_video_thumbnail, link: modality_info.instruction_video}}});
    }

    onShowTestSetCouponModal() {
        this.setState({isShowModalType: 'couponModal'});
    }

    renderLearningButton(test_set_item, modality_type) {
        const {has_post} = test_set_item;
        if (modality_type === 'image_quality') {
            return null;
        } else {
            return (
                <NavLink to='#' className={'learning-objective'} onClick={() => this.onLearningModal(modality_type, has_post)}>
                    <IntlMessages id="test.learningObjectives"/>
                </NavLink>
            )
        }
    }

    renderExpireDate(test_set_item) {
        const {test_set_credit, test_set_expiry_date, is_test_set_expired} = test_set_item;
        if (test_set_credit === 0 || test_set_expiry_date === 'unpaid') {
            return null;
        } else {
            if (is_test_set_expired) {
                return (
                    <span className={'fs-12 text-pink'}>Expired</span>
                )
            } else {
                return (
                    <span className={'fs-12'}>Expires: {moment(test_set_expiry_date).format('MM/DD/YYYY')}</span>
                )
            }
        }
    }

    renderScoresButton(test_set_item) {
        const {id, attempts, has_post, test_set_paid, test_set_credit} = test_set_item;
        if (
            (test_set_credit === 0 || (this.state.userInfo.user_subscription_id !== null && !this.state.userInfo.is_subscription_expired)) &&
            attempts.some((v) => v.complete)
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
        const {id, attempts, has_post, test_set_paid, test_set_credit, is_test_set_expired} = test_set_item;
        const test_set_id = id;
        let attempt = attempts[0];
        if (!test_set_paid || is_test_set_expired) {
            // free test set
            return (
                <Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="secondary" size="sm" onClick={() => test_set_credit === 0 ? this.onStart(test_set_id, modality_type, has_post) : this.onPay(test_set_item)}>
                    {test_set_credit === 0 ? <IntlMessages id="test.start"/> : (test_set_credit + ' Points')}
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
                                    <IntlMessages id={"testView.instruction"}/>
                                </MuiButton> : <div style={{height: 35}}/>
                        }
                    </div>
                }
            />
        )
    }

    renderTestSets({test_sets, modality_info}) {
        return (
            <div className={'m-0 '} key={modality_info.id}>
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
                                                    {this.renderLearningButton(item, modality_info.modality_type)}
                                                </div>
                                                {this.renderExpireDate(item)}
                                            </div>
                                            <div className={'col-sm-12 col-md-3 test-list-action-buttons'}>
                                                {this.renderScoresButton(item)}
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
                    <MuiButton variant="outlined" size="small" color="primary" startIcon={<i className="ti-gift"/>} onClick={() => this.onShowTestSetCouponModal()}>
                        <IntlMessages id={"test.testSetCoupon"}/>
                    </MuiButton>
                </div>
                <AppBar position="static" color="default" className={'mb-50'}>
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
                            this.state.testSetsList.map((v) => this.renderModalityTab(v))
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
                        this.state.testSetsList.map(v => this.renderTestSets(v))
                    }
                </SwipeableViews>
                <USStartModal
                    open={this.state.isShowModalType === 'has_post'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    // onNext={() => this.onGoAttempt()}
                />
                <USCovidStartModal
                    open={this.state.isShowModalType === 'has_post_covid'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    // onNext={() => this.onGoAttempt()}
                />
                <LearningModal
                    open={this.state.isShowModalType === 'normal'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    // onNext={this.onGoAttempt.bind(this)}
                />
                <LearningCovidModal
                    open={this.state.isShowModalType === 'covid'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    // onNext={this.onGoAttempt.bind(this)}
                />
                {
                    (this.state.isShowModalType === 'creditPurchase' || this.state.isShowModalType === 'planSubscribe') &&
                    <PaymentModal
                        type={this.state.isShowModalType}
                        onFinish={() => this.onPaymentSuccess()}
                        onClose={() => this.setState({isShowModalType: ''})}
                    />
                }
                <InstructionModal
                    isOpen={this.state.instructionModalInfo.type !== undefined}
                    onClose={() => this.setState({instructionModalInfo: {}})}
                    theme={'white'}
                    type={this.state.instructionModalInfo.type}
                    video={this.state.instructionModalInfo.video}
                />
                <TestSetCouponModal
                    isOpen={this.state.isShowModalType === 'couponModal'}
                    onFinish={() => this.getData()}
                    onClose={() => this.setState({isShowModalType: ''})}
                />
                <SweetAlert
                    type={'default'}
                    show={this.state.isShowModalType === 'sweetConfirm'}
                    customClass={'sweetalert-container'}
                    title={<IntlMessages id={'test.purchase.confirm'}/>}
                    confirmBtnText={<IntlMessages id={"testView.ok"}/>}
                    confirmBtnCssClass={'sweetalert-confirm-btn'}
                    cancelBtnText={<IntlMessages id={"testView.cancel"}/>}
                    cancelBtnBsStyle={'danger'}
                    cancelBtnCssClass={'sweetalert-cancel-btn'}
                    showConfirm
                    showCancel
                    reverseButtons
                    onConfirm={() => this.onBuyTestSetWithCredit()}
                    onCancel={() => this.setState({isShowModalType: ''})}
                >
                    <IntlMessages id={"test.purchase.message3"}/>
                    {this.state.selectedItem.name} ?
                </SweetAlert>

            </div>
        )
    }
}

const ModalityTabs = withStyles({
    root: {},
    indicator: {
        height: 3,
    },
})(Tabs);

const ModalityTab = withStyles((theme) => ({
    root: {
        '&$selected': {
            fontWeight: 'bold',
        },
    },
    selected: {
        fontWeight: 'bold',
    },
}))(Tab);