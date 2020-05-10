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
import USStartModal from './USStartModal';
import USCovidStartModal from './USCovidStartModal';
import LearningModal from "./LearningModal";
import LearningCovidModal from "./LearningCovidModal";
import VideoModal from "./VideoModal";
import PayModal from "./PayModal";
import IntlMessages from "Util/IntlMessages";
import {connect} from "react-redux";

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            testSetsList: [],
            instructionVideos: [
                {
                    title: 'CovED',
                    thumbnail: 'https://static.detectedx.com/instruction_video/covid/thumbnail.png',
                    video: 'https://static.detectedx.com/instruction_video/covid/video.mp4'
                },
                {
                    title: 'Mammography',
                    thumbnail: 'https://static.detectedx.com/instruction_video/mammography/thumbnail.png',
                    video: 'https://static.detectedx.com/instruction_video/mammography/video.mp4'
                }
            ],
            selectedItem: {},
            selectedId: null,
            isShowModalType: '',
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
        this.setState({
            selectedItem: test_set_item,
            isShowModalType: 'pay'
        });
    }

    onStripeOrder(token, test_set_id, price, currency) {
        return Apis.orderTestSetStripe(test_set_id, price, currency, token);
    }

    onPaypalOrderCreate(test_set_id, price, currency) {
        return Apis.orderTestSetPaypalCreate(test_set_id, price, currency);
    }

    onPaypalOrderApprove(data, test_set_id) {
        return Apis.orderTestSetPaypalApprove(JSON.stringify(data), test_set_id);
    }

    onPaymentSuccess() {
        this.setState({isShowModalType: ''});
        this.getTestSetsList();
    }

    renderStartButton(test_set_item, modality_type) {
        const {id, attempts, has_post, paid, price, currency} = test_set_item;
        const test_set_id = id;
        let attempt = attempts[0];
        if (!paid) {
            return (
                <Button className="mr-10 mt-5 mb-5 pl-20 pr-20" outline color="secondary" size="sm" onClick={() => price === 0 ? this.onStart(test_set_id, modality_type, has_post) : this.onPay(test_set_item)}>
                    {price === 0 ? <IntlMessages id="test.free"/> : (price + ' ' + currency)}
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
        if (video === null) return null;
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
                                        <CardBody className="d-flex justify-content-between">
                                            <div>
                                                <p className="fs-14 fw-bold mb-5">{item.name}</p>
                                                <span className="fs-12 d-block text-muted">{modality_info.name}</span>
                                            </div>
                                            <div className={'test-list-action-buttons'}>
                                                {
                                                    item.attempts.some((v) => v.complete) ?
                                                        <Button
                                                            className="mr-10 mt-5 mb-5"
                                                            outline color="info" size="sm"
                                                            onClick={() => this.props.history.push('/app/test/complete-list/' + item.id)}>
                                                            <IntlMessages id="test.scores"/>
                                                        </Button> : null
                                                }
                                                {this.renderStartButton(item, modality_info.modality_type)}
                                            </div>
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
            <div className="news-dashboard-wrapper mt-30 mb-20">
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
                <PayModal
                    productPrice={this.state.selectedItem.price}
                    productCurrency={this.state.selectedItem.currency}
                    productName={this.state.selectedItem.name}
                    userName={this.props.userName}
                    userEmail={this.props.userEmail}
                    isOpen={this.state.isShowModalType === 'pay'}
                    onStripeOrder={(token) => this.onStripeOrder(token, this.state.selectedItem.id, this.state.selectedItem.price, this.state.selectedItem.currency)}
                    onPaypalOrderCreate={() => this.onPaypalOrderCreate(this.state.selectedItem.id, this.state.selectedItem.price, this.state.selectedItem.currency)}
                    onPaypalOrderApprove={(data) => this.onPaypalOrderApprove(data, this.state.selectedItem.id)}
                    onFinish={() => this.onPaymentSuccess()}
                    onClose={() => this.setState({isShowModalType: ''})}
                />
            </div>
        )
    }
}

const mapStateToProps = ({authUser}) => {
    const {userName, userEmail} = authUser;
    return {userName, userEmail};
};

export default connect(mapStateToProps, null)(List);

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