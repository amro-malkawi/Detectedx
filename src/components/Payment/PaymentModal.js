import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Dialog} from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import * as Apis from "Api/index";
import {NotificationManager} from "react-notifications";
import Checkout from './Checkout';
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from "prop-types";

export default class PaymentModal extends Component {

    static propTypes = {
        onFinish: PropTypes.func,
        onClose: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            swipeIndex: 0,
            stripeKey: '',
            paypalKey: '',
            productPrice: props.testSetItem.test_set_price.price,
            productCurrency: props.testSetItem.test_set_price.currency,
            productName: props.testSetItem.name,
            resultPrice: '',
            resultCurrency: '',
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.paymentInfo().then(resp => {
            this.setState({
                stripeKey: resp.stripe,
                paypalKey: resp.paypal,
                loading: false
            });
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    onBackSwipe() {
        const {swipeIndex} = this.state;
        console.log(swipeIndex);
        if (Number(swipeIndex) === 0) return;
        this.setState({swipeIndex: swipeIndex - 1});
    }

    /**
     * purchase free coupon discount 100%
     */
    onFreeOrder(price, currency, couponCode, token) {
        return Apis.paymentFree(this.props.testSetItem.id, price, currency, couponCode, token);
    }

    onStripeOrder(price, currency, couponCode, token) {
        return Apis.paymentStripe(this.props.testSetItem.id, price, currency, couponCode, token);
    }

    onPaypalOrderCreate(price, currency, couponCode) {
        return Apis.paymentPaypalCreate(this.props.testSetItem.id, price, currency, couponCode);
    }

    onPaypalOrderApprove(price, currency, couponCode, approveData) {
        return Apis.paymentPaypalApprove(this.props.testSetItem.id, price, currency, couponCode, JSON.stringify(approveData));
    }

    onPaymentSuccess(resultPrice, resultCurrency) {
        this.setState({
            errorMessage: '',
            resultPrice,
            resultCurrency,
            swipeIndex: this.state.swipeIndex + 1,
        });
    }

    onFinish() {
        this.props.onFinish();
    }

    onClose() {
        this.setState({loading: true});
        this.props.onClose();
    }

    renderOrder() {
        const { productName, productPrice, productCurrency } = this.state;
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    <div>
                        <span> Purchase {productName}</span>
                    </div>
                    <IconButton onClick={() => this.onClose()}><CloseIcon/></IconButton>
                </div>
                {
                    (this.state.stripeKey !== '' && this.state.paypalKey !== '') &&
                    <Checkout
                        productPrice={productPrice}
                        productCurrency={productCurrency}
                        productName={productName}
                        creditRatio={1}
                        stripeKey={this.state.stripeKey}
                        paypalKey={this.state.paypalKey}
                        onFreeOrder={(price, currency, couponCode) => this.onFreeOrder(price, currency, couponCode)}
                        onStripeOrder={(price, currency, couponCode, token) => this.onStripeOrder(price, currency, couponCode, token)}
                        onPaypalOrderCreate={(price, currency, couponCode) => this.onPaypalOrderCreate(price, currency, couponCode)}
                        onPaypalOrderApprove={(price, currency, couponCode, approveData) => this.onPaypalOrderApprove(price, currency, couponCode, approveData)}
                        onFinish={(resultPrice, resultCurrency) => this.onPaymentSuccess(resultPrice, resultCurrency)}
                    />
                }
            </div>
        )
    }

    renderSuccess() {
        const {resultPrice, resultCurrency, errorMessage} = this.state;
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    <div>
                        <span>Result</span>
                    </div>
                    <IconButton onClick={() => this.onClose()}><CloseIcon/></IconButton>
                </div>
                {
                    errorMessage === '' ?
                        <div className={'payment-result'}>
                            <i className="success zmdi zmdi-check-circle"/>
                            <h2>Payment Success</h2>
                            <p>Your payment of {resultPrice} {resultCurrency} was successfully completed</p>
                            <Button variant="contained" color="primary" size={'large'} onClick={() => this.onFinish()}><IntlMessages id={"testView.ok"}/></Button>
                        </div> :
                        <div className={'payment-result'}>
                            <i className="fault zmdi zmdi-check-circle"/>
                            <h2>Payment Fault</h2>
                            <p>{errorMessage}</p>
                            <Button variant="contained" color="primary" size={'large'} onClick={() => this.onFinish()}><IntlMessages id={"testView.ok"}/></Button>
                        </div>
                }
            </div>
        )
    }

    renderContent() {
        return (
            <SwipeableViews
                index={this.state.swipeIndex}
                style={{display: 'flex', flex: 1}}
                containerStyle={{width: '100%', height: '100%'}}
                className={'payment-modal'}
            >
                {this.renderOrder()}
                {this.renderSuccess()}
            </SwipeableViews>
        )
    }

    render() {
        return (
            <FullDialog open={true} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '100%'}}}>
                {this.renderContent()}
            </FullDialog>
        );
    }

}

const FullDialog = withStyles(theme => ({
    paper: {
        height: 550,
        maxWidth: 1100
    }
}))(Dialog);