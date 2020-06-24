/**
 * News Dashboard
 */

import React, {Component} from 'react'
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {Card, CardBody, Button} from "reactstrap";
import {AppBar, Tabs, Tab} from '@material-ui/core';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import * as Apis from 'Api';
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";
import {connect} from "react-redux";
import USStartModal from './USStartModal';
import USCovidStartModal from './USCovidStartModal';
import LearningModal from "./LearningModal";
import LearningCovidModal from "./LearningCovidModal";
import VideoModal from "./VideoModal";
import SweetAlert from 'react-bootstrap-sweetalert'
import PaymentModal from "Components/Payment/PaymentModal";
import {NotificationManager} from "react-notifications";

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

    onGoAttempt() {
        this.setState({isShowModalType: ''});
        if (this.state.selectedId.indexOf !== undefined && this.state.selectedId.indexOf('/app/test/attempt/') === 0) {
            this.props.history.push(this.state.selectedId)
        } else {
            let newData = {
                test_set_id: this.state.selectedId,
            };
            Apis.attemptsAdd(newData).then(resp => {
                // let path = '/test-view/' + test_set_id + '/' + resp.id + '/' + resp.current_test_case_id;
                let path = '/app/test/attempt/' + resp.id;
                this.props.history.push(path);
            });
        }
    }

    onStart(value, modality_type, has_post) {
        if (modality_type === 'image_quality') {
            this.setState({
                selectedId: value
            }, () => {
                this.onGoAttempt();
            });
        } else if (modality_type === 'covid') {
            this.setState({
                isShowModalType: has_post ? 'has_post_covid' : 'covid',
                selectedId: value
            });
        } else {
            this.setState({
                isShowModalType: has_post ? 'has_post' : 'normal',
                selectedId: value
            });
        }
    }

    onPay(test_set_item) {
        const {userInfo} = this.state;
        let isShowModalType = '';
        if (userInfo.user_subscription_id === null || userInfo.is_subscription_expired) {
            isShowModalType = 'sweetSubscribe';
        } else if (userInfo.user_credit < test_set_item.test_set_credit) {
            isShowModalType = 'sweetPurchase';
        } else {
            isShowModalType = 'sweetConfirm';
        }
        this.setState({
            selectedItem: test_set_item,
            isShowModalType: isShowModalType
        });
    }

    onBuyTestSetWithCredit() {
        this.setState({isShowModalType: ''});
        Apis.buyTestSet(this.state.selectedItem.id).then(resp => {
            NotificationManager.success(this.state.selectedItem.name + 'test set purchase succeeded.');
            this.getData();
        }).catch(e => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        });
    }

    onPaymentSuccess() {
        this.setState({isShowModalType: ''});
        this.getData();
    }

    renderExpireDate(test_set_item) {
        const {test_set_credit, test_set_expiry_date, is_test_set_expired} = test_set_item;
        if(test_set_credit === 0 || test_set_expiry_date === 'unpaid') {
            return null;
        } else {
            if(is_test_set_expired) {
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
        if(
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
            return (
                <Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="secondary" size="sm" onClick={() => test_set_credit === 0 ? this.onStart(test_set_id, modality_type, has_post) : this.onPay(test_set_item)}>
                    {test_set_credit === 0 ? <IntlMessages id="test.free"/> : (test_set_credit + ' Credits')}
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
            // let path = '/test-view/' + test_set_id + '/' + attempt.id + '/' + attempt.current_test_case_id;
            if (attempt.progress === '') {
                const path = '/app/test/attempt/' + attempt.id;
                return (
                    <Button className="mr-10 mt-5 mb-5" outline color="primary" size="sm" onClick={() => this.onStart(path, modality_type, has_post)}>
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

    renderInstructionVideo(thumbnail, video) {
        if (video === null || video === '' || thumbnail === '' || thumbnail === null) return null;
        return (
            <div className={'instruction-video'} onClick={() => this.setState({isShowModalType: 'video', selectedVideoLink: video})}>
                <img src={thumbnail} alt=''/>
                <p/>
                <i className="zmdi zmdi-play-circle-outline"/>
            </div>
        );
    }

    renderModalityTab({modality_info}) {
        return (
            <ModalityTab
                key={modality_info.id}
                label={
                    <div className={'modality-tab-item'}>
                        <p>{modality_info.name}</p>
                        <img src={Apis.apiHost + modality_info.modality_icon_image} alt="site logo"/>
                    </div>
                }
            />
        )
    }

    renderTestSets({test_sets, modality_info}) {
        return (
            <div className={'row align-items-start m-0 '} key={modality_info.id}>
                <div className="col-sm-12 col-md-8">
                    {
                        test_sets.map((item, index) => {
                            return (
                                <div className="col-sm-12 col-md-12 col-lg-10 offset-lg-1" key={index}>
                                    <Card className="rct-block">
                                        <CardBody>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <p className="fs-14 fw-bold mb-5">{item.name}</p>
                                                    {this.renderExpireDate(item)}
                                                </div>
                                                <div className={'test-list-action-buttons'}>
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
                <div className={'col-sm-12 col-md-4'}>
                    <PageTitleBar title={<IntlMessages id="test.instructionVideos"/>} match={this.props.match} enableBreadCrumb={false}/>
                    {
                        this.renderInstructionVideo(modality_info.instruction_video_thumbnail, modality_info.instruction_video)
                    }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="test-list-container news-dashboard-wrapper mt-30 mb-20">
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
                >
                    {
                        this.state.testSetsList.map(v => this.renderTestSets(v))
                    }
                </SwipeableViews>
                <USStartModal
                    open={this.state.isShowModalType === 'has_post'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={() => this.onGoAttempt()}
                />
                <USCovidStartModal
                    open={this.state.isShowModalType === 'has_post_covid'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={() => this.onGoAttempt()}
                />
                <LearningModal
                    open={this.state.isShowModalType === 'normal'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={this.onGoAttempt.bind(this)}
                />
                <LearningCovidModal
                    open={this.state.isShowModalType === 'covid'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    onNext={this.onGoAttempt.bind(this)}
                />
                <VideoModal
                    open={this.state.isShowModalType === 'video'}
                    onClose={() => this.setState({isShowModalType: ''})}
                    link={this.state.selectedVideoLink}
                />
                {
                    (this.state.isShowModalType === 'creditPurchase' || this.state.isShowModalType === 'planSubscribe') &&
                    <PaymentModal
                        type={this.state.isShowModalType}
                        onFinish={() => this.onPaymentSuccess()}
                        onClose={() => this.setState({isShowModalType: ''})}
                    />
                }
                <SweetAlert
                    type={'warning'}
                    show={this.state.isShowModalType === 'sweetSubscribe'}
                    title={<IntlMessages id={'test.purchase.warning'}/>}
                    confirmBtnText={<IntlMessages id={"test.purchase.subscribe"}/>}
                    confirmBtnCssClass={'sweetalert-confirm-btn'}
                    cancelBtnText={<IntlMessages id={"testView.cancel"}/>}
                    cancelBtnBsStyle={'danger'}
                    cancelBtnCssClass={'sweetalert-cancel-btn'}
                    showConfirm
                    showCancel
                    reverseButtons
                    closeOnClickOutside
                    onConfirm={() => this.setState({isShowModalType: 'planSubscribe'})}
                    onCancel={() => this.setState({isShowModalType: ''})}
                >
                    <IntlMessages id={"test.purchase.message1"}/>
                </SweetAlert>
                <SweetAlert
                    type={'warning'}
                    show={this.state.isShowModalType === 'sweetPurchase'}
                    title={<IntlMessages id={'test.purchase.attention'}/>}
                    confirmBtnText={<IntlMessages id={"test.purchase.charge"}/>}
                    confirmBtnCssClass={'sweetalert-confirm-btn'}
                    cancelBtnText={<IntlMessages id={"testView.cancel"}/>}
                    cancelBtnBsStyle={'danger'}
                    cancelBtnCssClass={'sweetalert-cancel-btn'}
                    showConfirm
                    showCancel
                    reverseButtons
                    closeOnClickOutside
                    onConfirm={() => this.setState({isShowModalType: 'creditPurchase'})}
                    onCancel={() => this.setState({isShowModalType: ''})}
                >
                    <IntlMessages id={"test.purchase.message2"}/>
                </SweetAlert>
                <SweetAlert
                    type={'info'}
                    show={this.state.isShowModalType === 'sweetConfirm'}
                    title={<IntlMessages id={'test.purchase.confirm'}/>}
                    confirmBtnText={<IntlMessages id={"testView.ok"}/>}
                    confirmBtnCssClass={'sweetalert-confirm-btn'}
                    cancelBtnText={<IntlMessages id={"testView.cancel"}/>}
                    cancelBtnBsStyle={'danger'}
                    cancelBtnCssClass={'sweetalert-cancel-btn'}
                    showConfirm
                    showCancel
                    reverseButtons
                    closeOnClickOutside
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