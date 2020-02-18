import React, {Component} from 'react';
// components
import PricingBlock from './PricingBlock';
import * as selectors from "Selectors";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import PricingOrder from './PlanOrder';
import * as Apis from 'Api';

class Pricing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedPlan: {},
            isOpenOrderModal: false,
            plans: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Apis.getProductPlans().then(resp => {
            this.setState({plans: resp});
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : e.message);
        });
    }

    onPayment(plan) {
        if(this.props.isLogin) {
            this.setState({
                selectedPlan: plan,
                isOpenOrderModal: true
            });
        } else {
            this.props.history.push('/signin');
        }
    }

    render() {
        return (
            <div className="site-pricing">
                <div className="pricing-top mt-50 mb-10">
                    <div className="row">
                        <div className="col-sm-12 col-md-9 col-lg-7 mx-auto text-center">
                            <h2 className="mb-20">Choose the plan that works for you.</h2>
                        </div>
                    </div>
                </div>
                <div className="price-list">
                    <div className="row row-eq-height">
                        {
                            this.state.plans.map((v) => (
                                <PricingBlock
                                    key={v.id}
                                    planType={v.name}
                                    type={v.name}
                                    color={v.color}
                                    buttonText="Select"
                                    price={v.amount}
                                    users={1}
                                    features={JSON.parse(v.functions)}
                                    onClick={() => this.onPayment(v)}
                                />
                            ))
                        }
                    </div>
                </div>
                <PricingOrder
                    plan={this.state.selectedPlan}
                    isOpen={this.state.isOpenOrderModal}
                    onClose={() => this.setState({isOpenOrderModal: false})}
                />
            </div>
        );
    }
}

// map state to props
const mapStateToProps = (state) => ({
    isLogin: selectors.getIsLogin(state),
});

export default withRouter(connect(mapStateToProps, {
})(Pricing));
