import React, {Component} from 'react';
import {CardCVCElement, CardExpiryElement, CardNumberElement, Elements, injectStripe, StripeProvider} from "react-stripe-elements";
import StripeScriptLoader from "react-stripe-script-loader";
import * as selectors from "Selectors";
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import {Col, Input} from "reactstrap";
import {Button, CircularProgress, Collapse, List, ListItem, ListItemIcon, ListItemText, Radio} from "@material-ui/core";
import * as Apis from 'Api';
import PaypalButton from "./PaypalButton";

class _OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: props.productPrice,
            creditPrice: 0,
            creditPriceError: false,
            currency: props.productCurrency,
            paymentType: 'card',
            cardBrand: 'pf-credit-card',
            cardBrandError: false,
            cardName: props.userName,
            cardNumberError: false,
            cardExpiryError: false,
            cardCVCError: false,
            cardNameError: false,
            paying: false,
            payFinished: false,
            couponCode: '',
            couponData: null
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            price: nextProps.productPrice,
            currency: nextProps.productCurrency
        }
    }

    calcTotalPrice() {
        let price = this.state.price;
        if (this.props.productName === '') {
            price = this.state.creditPrice;
        }
        let discountPrice = price;
        let couponCode = '';
        if (this.state.couponData !== null && this.state.couponData.valid) {
            discountPrice = (price * ((100 - this.state.couponData.coupon_discount_value) / 100)).toFixed(2);
            couponCode = this.state.couponData.coupon_code;
        }
        return {
            price,
            currency: this.state.currency,
            discountPrice,
            couponCode
        };
    }

    onChangePaymentType(paymentType) {
        this.setState({paymentType});
    }

    onChangeCardNumber(value) {
        const cardBrandToPfClass = {
            'visa': 'pf-visa',
            'mastercard': 'pf-mastercard',
            'amex': 'pf-american-express',
            'discover': 'pf-discover',
            'diners': 'pf-diners',
            'jcb': 'pf-jcb',
            'unknown': 'pf-credit-card',
        };
        const cardBrandError = value.error !== undefined;
        const brand = value.brand;
        let pfClass = 'pf-credit-card';
        if (brand in cardBrandToPfClass) {
            pfClass = cardBrandToPfClass[brand];
        }
        this.setState({
            cardBrand: pfClass,
            cardBrandError,
            cardNumberError: this.state.cardNumberError ? !value.complete : this.state.cardNumberError
        });
    }

    onChangeCardExpiry(value) {
        if (value.complete) {
            this.setState({cardExpiryError: false});
        }
    }

    onChangeCardCVC(value) {
        if (value.complete) {
            this.setState({cardCVCError: false});
        }
    }

    onChargeCard() {
        const {price, currency, discountPrice, couponCode} = this.calcTotalPrice();
        if (this.state.paymentType === 'card') {
            if (this.state.cardName === '') {
                this.setState({cardNameError: true});
            } else {
                this.setState({paying: true});
                this.props.stripe.createToken({
                    type: 'card',
                    name: this.state.cardName + '(' + this.props.userEmail + ')'
                }).then(resp => {
                    if (resp.error === undefined) {
                        //success
                        return resp.token.id;
                    } else {
                        if (resp.error.code.indexOf('number') > -1) {
                            this.setState({cardNumberError: true});
                        }
                        if (resp.error.code.indexOf('expiry') > -1) {
                            this.setState({cardExpiryError: true});
                        }
                        if (resp.error.code.indexOf('cvc') > -1) {
                            this.setState({cardCVCError: true});
                        }
                        throw new Error('card information invalidate');
                    }
                }).then((token) => {
                    // return Apis.orderChargeCard(this.props.plan.id, token);
                    return this.props.onStripeOrder(price, currency, couponCode, token);
                }).then((result) => {
                    const that = this;
                    this.setState({payFinished: true}, () => {
                        setTimeout(() => {
                            that.props.onFinish(discountPrice, currency);
                        }, 500);
                    });
                }).catch(e => {
                    if (e.response) NotificationManager.error(e.response.data.error.message);
                }).finally(() => {
                    this.setState({paying: false});
                });
            }
        }
    }

    onCheckCouponCode() {
        Apis.couponInfo(this.state.couponCode, 'discount_percent').then((resp) => {
            this.setState({
                couponData: resp
            });
        }).catch((e) => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        });
    }

    onPaypalCreateOrder(data, actions) {
        const {price, currency, discountPrice, couponCode} = this.calcTotalPrice();
        this.setState({paying: true});
        return this.props.onPaypalOrderCreate(price, currency, couponCode);
    }

    onPaypalApprove(data, actions) {
        const {price, currency, discountPrice, couponCode} = this.calcTotalPrice();
        return this.props.onPaypalOrderApprove(price, currency, couponCode, data).then((resp) => {
            const that = this;
            this.setState({payFinished: true}, () => {
                setTimeout(() => {
                    that.props.onFinish(discountPrice, currency);
                }, 500);
            });
        }).catch(e => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        }).finally(() => {
            this.setState({paying: false});
        })
    }

    onPaypalCancel() {
        this.setState({paying: false});
    }

    renderCardBlock() {
        return (
            <div className={'payment-content'}>
                <div className={'payment-card-number ' + (this.state.cardNumberError ? 'invalid' : '')}>
                    <CardNumberElement
                        placeholder={'Card Number'}
                        onChange={(value) => this.onChangeCardNumber(value)}
                    />
                    <i className={`pf ${this.state.cardBrand}`} style={{color: this.state.cardError ? 'red' : '#464d69'}}/>
                </div>
                <div className={'row'}>
                    <Col sm={8} className={'p-0 ' + (this.state.cardExpiryError ? 'invalid' : '')}>
                        <CardExpiryElement
                            className={'mr-5'}
                            onChange={(value) => this.onChangeCardExpiry(value)}
                        />
                    </Col>
                    <Col sm={4} className={'p-0 ' + (this.state.cardCVCError ? 'invalid' : '')}>
                        <CardCVCElement
                            className={'ml-5'}
                            onChange={(value) => this.onChangeCardCVC(value)}
                        />
                    </Col>
                </div>
                <Input
                    type="name"
                    name="card_name"
                    id="card_name"
                    placeholder="Name"
                    value={this.state.cardName}
                    invalid={this.state.cardNameError}
                    onChange={(e) => this.setState({cardName: e.target.value, cardNameError: false})}
                />
                <div className={'payment-card-list'}>
                    <img src={require('Assets/img/card/visa.png')} alt=''/>
                    <img src={require('Assets/img/card/amex.png')} alt=''/>
                    <img src={require('Assets/img/card/mastercard.png')} alt=''/>
                    <img src={require('Assets/img/card/discover.png')} alt=''/>
                    <img src={require('Assets/img/card/jcb.png')} alt=''/>
                    <img src={require('Assets/img/card/diners.png')} alt=''/>
                </div>
            </div>
        )
    }

    renderPaypalBlock() {
        return (
            <div className={'payment-content paypal'}>
                <p>Pay with Paypal</p>
                <p>When you hit "PayPal" button you will be redirected to PayPal where you can complete your purchase securely.</p>
            </div>
        )
    }

    renderResult() {
        const {price, currency, discountPrice, couponCode} = this.calcTotalPrice();
        return (
            <div>
                <div className={'order-info-item row ml-0 mr-0'}>
                    <Col sm={7} className={'p-0 coupon-input-container'}>
                        <Input
                            type="text"
                            name="couponCode"
                            id="couponCode"
                            placeholder="Enter coupon code"
                            value={this.state.couponCode}
                            invalid={false}
                            spellCheck="false"
                            onChange={(e) => this.setState({couponCode: e.target.value, couponData: null})}
                        />
                    </Col>
                    <Col sm={5} className={'coupon-button-container'}>
                        <Button variant="contained" className="btn-light" onClick={() => this.onCheckCouponCode()}>
                            APPLY
                        </Button>
                    </Col>
                </div>
                <p className={'coupon-error'} style={{color: (this.state.couponData && this.state.couponData.valid ? 'green' : 'red')}}>
                    {this.state.couponData === null ? '' : (this.state.couponData.valid ? this.state.couponData.coupon_discount_value + '% discount is available' : this.state.couponData.errorMsg)}
                </p>
                <div className={'order-info-item'}>
                    <span className={'mt-5'}>Total</span>
                    <span className={'order-info-price'}>
                        {couponCode !== '' && <span className={'original-price'}>{price}</span>}
                        <span>{discountPrice} {currency}</span>
                    </span>
                </div>
            </div>
        );
    }

    renderBuyButton() {
        if (this.state.paymentType === 'card') {
            return (
                <Button variant="contained" className="btn-light buy-button" onClick={() => this.onChargeCard()}>
                    {
                        this.state.payFinished ? <i className={'ti-check-box'}/> :
                            this.state.paying ? <CircularProgress size={23} style={{margin: 6}}/> : 'Buy Now'
                    }
                </Button>
            )
        } else if (this.state.paymentType === 'paypal') {
            return (
                <div style={{position: 'relative'}}>
                    <PaypalButton
                        planId=''
                        currency={this.props.productCurrency}
                        createOrder={this.onPaypalCreateOrder.bind(this)}
                        onApprove={this.onPaypalApprove.bind(this)}
                        onSuccess={null}
                        onCancel={this.onPaypalCancel.bind(this)}
                    />
                    {
                        (this.state.payFinished || this.state.paying) &&
                        <div className={'buy-button paypal-overlap'}>
                            <div className={'paypal-button'}>
                                {
                                    this.state.payFinished ? <i className={'ti-check-box'}/> : <CircularProgress size={23} style={{margin: 6}}/>
                                }
                            </div>
                        </div>
                    }
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={'row p-20 site-order'}>
                <Col sm={7}>
                    <List component="nav" className={'payment-type'}>
                        <ListItem button onClick={() => this.onChangePaymentType('card')} className={'payment-type-header'}>
                            <ListItemIcon>
                                <i className={'zmdi zmdi-card'}/>
                            </ListItemIcon>
                            <ListItemText inset primary="Credit / Debit Card" className={'payment-type-text'}/>
                            <Radio color="primary" className={'payment-radio'} checked={this.state.paymentType === 'card'}/>
                        </ListItem>
                        <Collapse in={this.state.paymentType === 'card'} timeout="auto" unmountOnExit>
                            {this.renderCardBlock()}
                        </Collapse>

                        <ListItem button onClick={() => this.onChangePaymentType('paypal')} className={'payment-type-header'}>
                            <ListItemIcon>
                                <i className={'zmdi zmdi-paypal-alt'}/>
                            </ListItemIcon>
                            <ListItemText inset primary="Paypal" className={'payment-type-text'}/>
                            <Radio color="primary" className={'payment-radio'} checked={this.state.paymentType === 'paypal'}/>
                        </ListItem>
                        <Collapse in={this.state.paymentType === 'paypal'} timeout="auto" unmountOnExit>
                            {this.renderPaypalBlock()}
                        </Collapse>
                    </List>
                </Col>
                <Col sm={5}>
                    {
                        this.props.productName !== '' ?
                            <div className={'order-info'}>
                                <p className={'order-summery'}>Order Summary</p>
                                <div className={'order-info-item'}>
                                    <span>Name</span>
                                    <span>{this.props.productName}</span>
                                </div>
                                <div className={'order-info-item'}>
                                    <span>Cost</span>
                                    <span className={'order-info-price'}>{this.state.price} {this.state.currency}</span>
                                </div>
                                <div className={'order-info-split'}/>
                                {this.renderResult()}
                                {this.renderBuyButton()}
                            </div> :
                            <div className={'order-info'}>
                                <p className={'order-summery'}>Order Summary</p>
                                <div className={'order-info-item row ml-0 mr-0'}>
                                    <span className={'mt-5'}>Amount: </span>
                                    <Col>
                                        <Input
                                            type="number"
                                            name="amount"
                                            id="amount"
                                            placeholder=""
                                            value={this.state.creditPrice}
                                            invalid={this.state.creditPriceError}
                                            onChange={(e) => this.setState({creditPrice: e.target.value, creditPriceError: false})}
                                        />
                                    </Col>
                                    <span className={'mt-5'}> {this.props.productCurrency}</span>
                                </div>
                                <div className={'order-info-item'}>
                                    <span>Result</span>
                                    <span className={'order-result'}>You will get <b>{(this.state.creditPrice * this.props.creditRatio).toFixed(0)}</b> credits</span>
                                </div>
                                <div className={'order-info-split'}/>
                                {this.renderResult()}
                                {this.renderBuyButton()}
                            </div>
                    }
                </Col>
            </div>
        )
    }
}

const OrderForm = injectStripe(_OrderForm);

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <StripeScriptLoader
                uniqueId='lhojhkjhi9879798799'
                script='https://js.stripe.com/v3/'
                loader="Loading..."
            >
                <StripeProvider apiKey={'pk_test_o94dTQYi7yrYebuzehraBcqk00QCQPvwhk'}>
                    <Elements>
                        <OrderForm {...this.props} />
                    </Elements>
                </StripeProvider>
            </StripeScriptLoader>
        );
    }

}

const mapStateToProps = (state) => ({
    userName: selectors.getUserName(state),
    userEmail: selectors.getUserEmail(state),
});

export default connect(mapStateToProps, {})(Checkout);