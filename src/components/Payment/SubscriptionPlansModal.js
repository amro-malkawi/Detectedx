import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Dialog} from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import PlanItem from "Components/Payment/PlanItem";
import * as Apis from "Api/index";
import {NotificationManager} from "react-notifications";
import Checkout from './Checkout';

export default class SubscriptionPlansModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            plans: [],
            selectedPlan: undefined,
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

    onSelectPlan(plan) {
        this.setState({selectedPlan: plan});
    }



    onStripeOrder(token, test_set_id, price, currency) {
        return Apis.subscriptionPlanStripe(test_set_id, price, currency, token);
    }

    onPaypalOrderCreate(test_set_id, price, currency) {
        return Apis.subscriptionPlanPaypalCreate(test_set_id, price, currency);
    }

    onPaypalOrderApprove(data, test_set_id) {
        return Apis.subscriptionPlanPaypalApprove(JSON.stringify(data), test_set_id);
    }

    onFinish() {
        this.props.onClose();
        window.location.reload();
    }

    onClose() {
        this.setState({loading: true, selectedPlan: undefined});
        this.props.onClose();
    }

    render() {
        const {
            isOpen
        } = this.props;

        return (
            <FullDialog open={isOpen} onClose={() => this.onClose()} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '100%'}}}>
                <SwipeableViews
                    index={this.state.selectedPlan === undefined ? 0 : 1}
                    style={{display: 'flex', flex: 1}}
                    containerStyle={{width: '100%', height: '100%'}}
                >
                    <div className={'modal-plan-container'}>
                        <div className={'subscription-modal-title'}>
                            <span>Select subscription plan</span>
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
                    <div>
                        <Checkout
                            productPrice={this.state.selectedPlan ? this.state.selectedPlan.amount : 0}
                            productCurrency={this.state.selectedPlan ? this.state.selectedPlan.currency : ''}
                            productName={(this.state.selectedPlan ? this.state.selectedPlan.name : '') + ' Subscription'}
                            onStripeOrder={(token) => this.onStripeOrder(token, this.state.selectedPlan.id, this.state.selectedPlan.amount, this.state.selectedPlan.currency)}
                            onPaypalOrderCreate={() => this.onPaypalOrderCreate(this.state.selectedPlan.id, this.state.selectedPlan.amount, this.state.selectedPlan.currency)}
                            onPaypalOrderApprove={(data) => this.onPaypalOrderApprove(data, this.state.selectedPlan.id)}
                            onFinish={() => this.onFinish()}
                        />
                    </div>
                </SwipeableViews>
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