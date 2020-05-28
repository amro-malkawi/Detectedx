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
        type: PropTypes.oneOf(['onetime','plan']).isRequired,
        testSetInfo: PropTypes.object,
        onFinish: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        type: 'plan',
        testSetInfo: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            swipeIndex: props.type === 'plan' ? 1 : 0,
            selectedType: props.type === 'plan' ? 'plan' : 'onetime',
            plans: [],
            selectedPlan: {},
            productPrice: '',
            productCurrency: '',
            productName: '',
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getProductPlans().then(resp => {
            this.setState({plans: resp, loading: false});
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    onSelectType(type) {
        this.setState({
            selectedType: type
        }, () => {
            this.setState({swipeIndex: 1});
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

    onStripeOrder(token, product_id, price, currency) {
        if(this.state.selectedType === 'onetime') {
            return Apis.orderTestSetStripe(product_id, price, currency, token);
        } else if (this.state.selectedType === 'plan') {
            return Apis.subscriptionPlanStripe(product_id, price, currency, token);
        }
    }

    onPaypalOrderCreate(product_id, price, currency) {
        if(this.state.selectedType === 'onetime') {
            return Apis.orderTestSetPaypalCreate(product_id, price, currency);
        } else if (this.state.selectedType === 'plan') {
            return Apis.subscriptionPlanPaypalCreate(product_id, price, currency);
        }
    }

    onPaypalOrderApprove(data, product_id) {
        if(this.state.selectedType === 'onetime') {
            return Apis.orderTestSetPaypalApprove(JSON.stringify(data), product_id);
        } else if (this.state.selectedType === 'plan') {
            return Apis.subscriptionPlanPaypalApprove(JSON.stringify(data), product_id);
        }
    }

    onPaymentSuccess() {
        this.setState({
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

    renderSelectType() {
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    <span>Payment Type</span>
                </div>
                <div className={'row mt-10 ml-70 mr-70 pl-50 pr-50'}>
                    <div className={'col-sm-6 select-type'}>
                        <div onClick={() => this.onSelectType('plan')}>
                            <h2>Subscription</h2>
                            <img src={require('Assets/img/icon_subscription.png')} alt={''}/>
                            <p>
                                You can subscription
                            </p>
                        </div>
                    </div>
                    <div className={'col-sm-6 select-type'}>
                        <div onClick={() => this.onSelectType('onetime')}>
                            <h2>Payment</h2>
                            <img src={require('Assets/img/icon_payment.png')} alt={''}/>
                            <p>
                                You can buy test set
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderPlans() {
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    {
                        this.props.type !== 'onetime' ? null :
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
                                    users={1}
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
        const {testSetInfo} = this.props;
        const productPrice = selectedType === 'onetime' ? testSetInfo.price : selectedPlan.amount;
        const productCurrency = selectedType === 'onetime' ? testSetInfo.currency : selectedPlan.currency;
        const productName = selectedType === 'onetime' ? testSetInfo.name + ' Test Set' : selectedPlan.name + ' Subscription';
        const productId = selectedType === 'onetime' ? testSetInfo.id : selectedPlan.id;
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    <i className="zmdi zmdi-arrow-left" onClick={() => this.onBackSwipe()}/>
                    <span>Checkout</span>
                </div>
                <Checkout
                    productPrice={productPrice}
                    productCurrency={productCurrency}
                    productName={productName}
                    onStripeOrder={(token) => this.onStripeOrder(token, productId, productPrice, productCurrency)}
                    onPaypalOrderCreate={() => this.onPaypalOrderCreate(productId, productPrice, productCurrency)}
                    onPaypalOrderApprove={(data) => this.onPaypalOrderApprove(data, productId)}
                    onFinish={() => this.onPaymentSuccess()}
                />
            </div>
        )
    }

    renderSuccess() {
        const {selectedType, selectedPlan} = this.state;
        const {testSetInfo} = this.props;
        const productPrice = selectedType === 'onetime' ? testSetInfo.price : selectedPlan.amount;
        const productCurrency = selectedType === 'onetime' ? testSetInfo.currency : selectedPlan.currency;
        return (
            <div className={'payment-slide-container'}>
                <div className={'payment-slide-title'}>
                    <span>Result</span>
                </div>
                <div className={'payment-result'}>
                    <i className="zmdi zmdi-check-circle"/>
                    <h2>Payment Success</h2>
                    <p>Your payment of {productPrice} {productCurrency} was successfully completed</p>
                    <Button variant="contained" color="primary" size={'large'} onClick={() => this.onFinish()}><IntlMessages id={"testView.ok"}/></Button>
                </div>
            </div>
        )
    }

    renderContent() {
        if(this.state.selectedType === 'onetime') {
            return (
                <SwipeableViews
                    index={this.state.swipeIndex}
                    style={{display: 'flex', flex: 1}}
                    containerStyle={{width: '100%', height: '100%'}}
                    className={'payment-modal'}
                >
                    {this.renderSelectType()}
                    {this.renderOrder()}
                    {this.renderSuccess()}
                </SwipeableViews>
            )
        } else if(this.state.selectedType === 'plan') {
            return (
                <SwipeableViews
                    index={this.state.swipeIndex}
                    style={{display: 'flex', flex: 1}}
                    containerStyle={{width: '100%', height: '100%'}}
                    className={'payment-modal'}
                >
                    {this.renderSelectType()}
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