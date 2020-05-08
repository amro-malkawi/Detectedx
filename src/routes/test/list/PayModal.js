import React, {Component} from 'react';
import {Dialog, Button, List, ListItem, ListItemIcon, ListItemText, Collapse, Radio, CircularProgress} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {Col, Input} from "reactstrap";
import StripeScriptLoader from 'react-stripe-script-loader';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    StripeProvider,
    injectStripe
} from 'react-stripe-elements';
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import * as selectors from "Selectors";
import * as Apis from 'Api';
import PaypalButton from "./PaypalButton";
import PropTypes from "prop-types";

class _OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentType: 'card',
            cardBrand: 'pf-credit-card',
            cardBrandError: false,
            cardName: this.props.userName,
            cardNumberError: false,
            cardExpiryError: false,
            cardCVCError: false,
            cardNameError: false,
            paying: false,
            payFinished: false,
        }
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
                    return this.props.onStripeOrder(token);
                }).then((result) => {
                    const that = this;
                    this.setState({payFinished: true}, () => {
                        setTimeout(() => {
                            // that.props.history.push('/app/test/profile');
                            that.props.onFinish();
                        }, 500);
                    });
                    console.log(result, result);
                }).catch(e => {
                    if (e.response) NotificationManager.error(e.response.data.error.message);
                }).finally(() => {
                    this.setState({paying: false});
                });
            }
        }
    }

    onPaypalCreateOrder(data, actions) {
        // return Apis.orderPaypalCreateSubscription(this.props.plan.id).then(resp => resp.id);
        return this.props.onPaypalOrderCreate();
    }

    onPaypalApprove(data, actions) {
        // return Apis.orderPaypalApprove(JSON.stringify(data), this.props.plan.id).then((resp) => {
        //     const that = this;
        //     setTimeout(() => {
        //         // that.props.onClose()
        //         that.props.history.push('/app/test/profile');
        //     }, 500);
        // }).catch((e) => {
        //     if (e.response) NotificationManager.error(e.response.data.error.message);
        // });
        return this.props.onPaypalOrderApprove(data).then((resp) => {
            const that = this;
            setTimeout(() => {
                // that.props.history.push('/app/test/profile');
                that.props.onFinish();
            }, 500);
        }).catch(e => {
            if (e.response) NotificationManager.error(e.response.data.error.message);
        })
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
                <PaypalButton
                    planId=''
                    createOrder={this.onPaypalCreateOrder.bind(this)}
                    onApprove={this.onPaypalApprove.bind(this)}
                    onSuccess={null}
                    onCancel={null}
                />
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={'site-order'}>
                <div className={'order-title'}>
                    <span>Checkout</span>
                </div>
                <div className={'row p-20'}>
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
                        <div className={'order-info'}>
                            <p className={'order-summery'}>Order Summary</p>
                            <div className={'order-info-item'}>
                                <span>Name</span>
                                <span>{this.props.productName}</span>
                            </div>
                            <div className={'order-info-split'}/>
                            <div className={'order-info-item'}>
                                <span>Cost</span>
                                <span className={'order-info-price'}>{this.props.productPrice} {this.props.productCurrency}</span>
                            </div>
                            {this.renderBuyButton()}
                        </div>
                    </Col>
                </div>
            </div>
        )
    }
}

const OrderForm = injectStripe(_OrderForm);

class PayModal extends Component {

    static propTypes = {
        productPrice: PropTypes.number.isRequired,
        productName: PropTypes.string,
        userName: PropTypes.string,
        isOpen: PropTypes.bool.isRequired,
        onStripeOrder: PropTypes.func.isRequired,
        onPaypalOrderCreate: PropTypes.func.isRequired,
        onPaypalOrderApprove: PropTypes.func.isRequired,
        onFinish: PropTypes.func,
        onClose: PropTypes.func.isRequired,
    };

    static defaultProps = {
        productPrice: 0,
        productName: '',
        userName: '',
        onFinish: () => null,
    };

    render() {
        const {
            isOpen,
            onClose,
        } = this.props;
        return (
            <FullDialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '100%'}}}>
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
            </FullDialog>
        )
    }
}

const mapStateToProps = (state) => ({
    userName: selectors.getUserName(state),
});

export default connect(mapStateToProps, {})(PayModal);

const FullDialog = withStyles(theme => ({
    paper: {
        height: 570,
        maxWidth: 1100
    }
}))(Dialog);