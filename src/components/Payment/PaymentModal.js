import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Dialog} from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import PlanItem from "Components/Payment/PlanItem";
import * as Apis from "Api/index";
import {NotificationManager} from "react-notifications";
import Checkout from './Checkout';
import IntlMessages from "Util/IntlMessages";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

export default class PaymentModal extends Component {

    static propTypes = {
        type: PropTypes.oneOf(['creditPurchase','planSubscribe']).isRequired,
        onFinish: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        type: 'planSubscribe',
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            swipeIndex: 0,
            selectedType: props.type === 'creditPurchase' ?  'creditPurchase' : 'planSubscribe',
            plans: [],
            ratioInfo: {ratio: 1, currency: 'USD'},
            selectedPlan: {},
            productPrice: '',
            productCurrency: '',
            productName: '',
            resultPrice: '',
            resultCurrency: ''
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getProductPlans().then(resp => {
            this.setState({plans: resp.planList, ratioInfo: resp.ratioInfo, loading: false});
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    onBackSwipe() {
        const {swipeIndex} = this.state;
        console.log(swipeIndex);
        if(Number(swipeIndex) === 0) return;
        this.setState({swipeIndex: swipeIndex - 1});
    }

    onSelectPlan(plan) {
        this.setState({
            selectedPlan: plan,
            swipeIndex: this.state.swipeIndex + 1
        });
    }

    onStripeOrder(product_id, price, currency, couponCode, token) {
        if(this.state.selectedType === 'creditPurchase') {
            return Apis.orderCreditStripe(price, currency, couponCode, token);
        } else if (this.state.selectedType === 'planSubscribe') {
            return Apis.subscriptionPlanStripe(product_id, price, currency, couponCode, token);
        }
    }

    onPaypalOrderCreate(product_id, price, currency, couponCode) {
        if(this.state.selectedType === 'creditPurchase') {
            return Apis.orderCreditPaypalCreate(price, currency, couponCode);
        } else if (this.state.selectedType === 'planSubscribe') {
            return Apis.subscriptionPlanPaypalCreate(product_id, price, currency, couponCode);
        }
    }

    onPaypalOrderApprove(product_id, price, currency, couponCode, approveData) {
        if(this.state.selectedType === 'creditPurchase') {
            return Apis.orderCreditPaypalApprove(price, currency, couponCode, JSON.stringify(approveData));
        } else if (this.state.selectedType === 'planSubscribe') {
            return Apis.subscriptionPlanPaypalApprove(product_id, price, currency, couponCode, JSON.stringify(approveData));
        }
    }

    onPaymentSuccess(resultPrice, resultCurrency) {
        this.setState({
            resultPrice,
            resultCurrency,
            swipeIndex: this.state.swipeIndex + 1,
        });
    }

    onFinish() {
        this.props.onFinish();
    }

    onClose() {
        this.setState({loading: true, selectedPlan: undefined});
        this.props.onClose();
    }

    renderPlans() {
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    {
                        this.props.type !== 'creditPurchase' ? null :
                            <i className="zmdi zmdi-arrow-left" onClick={() => this.onBackSwipe()}/>
                    }
                    <span>Subscription Plan</span>
                </div>
                <div className="price-list">
                    <div className="row row-eq-height justify-content-md-center plan-zoom-out">
                        {
                            this.state.plans.map((v) => (
                                <PlanItem
                                    key={v.id}
                                    planType={v.name}
                                    type={v.name}
                                    color={v.color}
                                    price={v.amount}
                                    currency={v.currency}
                                    planSubscribed={v.plan_subscribed}
                                    planCredit={v.plan_credit}
                                    features={JSON.parse(v.functions)}
                                    onClick={() => this.onSelectPlan(v)}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }

    renderOrder() {
        const {selectedType, selectedPlan} = this.state;
        const productPrice = selectedType === 'creditPurchase' ? 0 : selectedPlan.amount;
        const productCurrency = selectedType === 'creditPurchase' ? this.state.ratioInfo.currency : selectedPlan.currency;
        const productName = selectedType === 'creditPurchase' ? '' : selectedPlan.name + ' Subscription';
        const productId = selectedType === 'creditPurchase' ? '' : selectedPlan.id;
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    {
                        productName !== '' &&
                        <i className="zmdi zmdi-arrow-left" onClick={() => this.onBackSwipe()}/>
                    }
                    <span>
                        {
                            productName !== '' ? 'Checkout' : 'Purchase Credits'
                        }
                    </span>
                </div>
                <Checkout
                    productPrice={productPrice}
                    productCurrency={productCurrency}
                    productName={productName}
                    creditRatio={this.state.ratioInfo.ratio}
                    onStripeOrder={(price, currency, couponCode, token) => this.onStripeOrder(productId, price, currency, couponCode, token)}
                    onPaypalOrderCreate={(price, currency, couponCode) => this.onPaypalOrderCreate(productId, price, currency, couponCode)}
                    onPaypalOrderApprove={(price, currency, couponCode, approveData) => this.onPaypalOrderApprove(productId, price, currency, couponCode, approveData)}
                    onFinish={(resultPrice, resultCurrency) => this.onPaymentSuccess(resultPrice, resultCurrency)}
                />
            </div>
        )
    }

    renderSuccess() {
        const {resultPrice, resultCurrency} = this.state;
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    <span>Result</span>
                </div>
                <div className={'payment-result'}>
                    <i className="zmdi zmdi-check-circle"/>
                    <h2>Payment Success</h2>
                    <p>Your payment of {resultPrice} {resultCurrency} was successfully completed</p>
                    <Button variant="contained" color="primary" size={'large'} onClick={() => this.onFinish()}><IntlMessages id={"testView.ok"}/></Button>
                </div>
            </div>
        )
    }

    renderContent() {
        if(this.state.selectedType === 'creditPurchase') {
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
        } else if(this.state.selectedType === 'planSubscribe') {
            return (
                <SwipeableViews
                    index={this.state.swipeIndex}
                    style={{display: 'flex', flex: 1}}
                    containerStyle={{width: '100%', height: '100%'}}
                    className={'payment-modal'}
                >
                    {this.renderPlans()}
                    {this.renderOrder()}
                    {this.renderSuccess()}
                </SwipeableViews>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <FullDialog open={true} onClose={() => this.onClose()} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '100%'}}}>
                {this.renderContent()}
            </FullDialog>
        );
    }

}

const FullDialog = withStyles(theme => ({
    paper: {
        height: 570,
        maxWidth: 1100
    }
}))(Dialog);