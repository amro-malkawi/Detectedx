import React, {Component} from 'react';
import {
    Dialog,
    withStyles,
    Button
} from "@material-ui/core";
import CustomDialogTitle from 'Components/Dialog/CustomDialogTitle';
import {Input} from "reactstrap";
import * as Apis from "Api/index";
import {NotificationManager} from "react-notifications";
import IntlMessages from "Util/IntlMessages";

export default class TestSetCouponModal extends Component {
    constructor() {
        super();
        this.state = {
            couponCode: '',
            couponData: null,
            applyResult: null,
        }
    }

    onCheckCouponCode() {
        Apis.couponInfo(this.state.couponCode, 'test_set').then((resp) => {
            this.setState({
                couponData: resp
            });
        }).catch((e) => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        });
    }

    onApplyCouponCode() {
        Apis.couponApplyTestSetCoupon(this.state.couponCode).then((resp) => {
            this.setState({applyResult: resp});
        }).catch((e) => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        });
    }

    onFinish() {
        this.setState({
            couponCode: '',
            couponData: null,
            applyResult: null,
        });
        this.props.onFinish();
    }

    onClose() {
        this.setState({
            couponCode: '',
            couponData: null,
            applyResult: null,
        });
        this.props.onClose();
    }

    renderContent() {
        if(this.state.applyResult === null) {
            return (
                <div>
                    <div className={'row justify-content-center align-items-center test-set-coupon-info'}>
                        <div className={'col-sm-12 col-md-3'}>
                            <span><IntlMessages id={'test.couponCode'}/></span>
                        </div>
                        <div className={'col-sm-12 col-md-5'}>
                            <Input
                                type="text"
                                name="couponCode"
                                id="couponCode"
                                // placeholder="Enter coupon code"
                                value={this.state.couponCode}
                                invalid={false}
                                spellCheck="false"
                                onChange={(e) => this.setState({couponCode: e.target.value})}
                            />
                        </div>
                        <div className={'col-sm-12 col-md-3'}>
                            <Button variant="contained" className="btn-light" onClick={() => this.onCheckCouponCode()}>
                                <IntlMessages id={'test.verify'}/>
                            </Button>
                        </div>
                    </div>
                    <div className={'row m-0 justify-content-center align-items-center'}>
                        <p className={'test-set-coupon-error'} style={{color: (this.state.couponData && this.state.couponData.valid ? 'green' : 'red')}}>
                            {
                                this.state.couponData === null ? '' :
                                    (!this.state.couponData.valid ? this.state.couponData.errorMsg :
                                            'You can unlock ' + this.state.couponData.totalTestSetCount + ' test sets. ' +
                                            (this.state.couponData.alreadyPaidTestSetCount <= 0 ? '' : this.state.couponData.alreadyPaidTestSetCount + ' test sets of them have already been unlocked.')
                                    )
                            }
                        </p>
                    </div>
                    <div className={'row m-0 pt-30 justify-content-center align-items-center'}>
                        <Button variant="contained" className="btn-light test-set-coupon-apply" disabled={!(this.state.couponData && this.state.couponData.valid)} onClick={() => this.onApplyCouponCode()}>
                            <IntlMessages id={'test.apply'}/>
                        </Button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className={'row m-0 pt-30 justify-content-center align-items-center'}>
                        <p className={'test-set-coupon-result'}>{`Success! ${this.state.applyResult.totalCount} test sets were unlocked`}</p>
                    </div>
                    <div className={'row m-0 pt-30 justify-content-center align-items-center'}>
                        <Button variant="contained" className="test-set-coupon-apply" onClick={() => this.onFinish()}>
                            <IntlMessages id={"testView.ok"}/>
                        </Button>
                    </div>
                </div>
            )
        }
    }

    render() {
        const {isOpen} = this.props;
        return (
            <FullDialog open={isOpen} onClose={() => this.onClose()}>
                <CustomDialogTitle onClose={() => this.onClose()}><IntlMessages id={"test.testSetCoupon"}/></CustomDialogTitle>
                {this.renderContent()}
            </FullDialog>
        )
    }
}

const FullDialog = withStyles(theme => ({
    paper: {
        height: 230,
        width: 1000
    }
}))(Dialog);