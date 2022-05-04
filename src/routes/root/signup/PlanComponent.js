import React from 'react';
import {Button} from '@material-ui/core';
import * as selectors from "Selectors";


function PlanComponent({onSelectPlan, planList}) {
    const isLogin = selectors.getIsLogin(null);
    return (
        <div className={'main-plan'}>
            <div className={'main-plan-container'}>
                <div className={'main-plan-item'}>
                    <div className={'plan-item-header'}>
                        <span>7 Day Free Trial</span>
                    </div>
                    <div className={'plan-item-price'}>
                        <span className={'plan-price-num'}>Free</span>
                    </div>
                    <div className={'plan-item-content'}>
                        <div className={'plan-item-features'}>
                            <div>Point one here</div>
                            <div>Point one here</div>
                        </div>
                        <div className={'plan-item-btn'}>
                            <Button onClick={() => onSelectPlan(planList.free)}>
                                <i className="zmdi zmdi-arrow-right"/>
                                {isLogin ? 'Subscribe' : 'Sign Up'}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={'main-plan-item'}>
                    <div className={'plan-item-header'}>
                        <span>Annual</span>
                    </div>
                    <div className={'plan-item-price'}>
                        <div className={'d-flex flex-row align-items-start'}>
                            <span className={'plan-price-currency'}>$</span>
                            <span className={'plan-price-num'}>{planList.yearly.detail.amount}</span>
                        </div>
                        <span className={'fs-14 fw-semi-bold'}>PRICES IN {planList.yearly.detail.currency.toUpperCase()}</span>
                    </div>
                    <div className={'plan-item-content'}>
                        <div className={'plan-item-features'}>
                            <div>Point one here</div>
                            <div>Point one here</div>
                            <div>Point one here</div>
                            <div>Point one here</div>
                        </div>
                        <div className={'plan-item-btn'}>
                            <Button onClick={() => onSelectPlan(planList.yearly)}>
                                <i className="zmdi zmdi-arrow-right"/>
                                {isLogin ? 'Subscribe' : 'Sign Up'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={'main-plan-item'}>
                    <div className={'plan-item-header'}>
                        <span>Monthly</span>
                    </div>
                    <div className={'plan-item-price'}>
                        <div className={'d-flex flex-row align-items-start'}>
                            <span className={'plan-price-currency'}>$</span>
                            <span className={'plan-price-num'}>{planList.monthly.detail.amount}</span>
                        </div>
                        <span className={'fs-14 fw-semi-bold'}>PRICES IN {planList.monthly.detail.currency.toUpperCase()}</span>
                    </div>
                    <div className={'plan-item-content'}>
                        <div className={'plan-item-features'}>
                            <div>Point one here</div>
                            <div>Point one here</div>
                            <div>Point one here</div>
                        </div>
                        <div className={'plan-item-btn'} onClick={() => onSelectPlan(planList.monthly)}>
                            <Button>
                                <i className="zmdi zmdi-arrow-right"/>
                                {isLogin ? 'Subscribe' : 'Sign Up'}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={'main-plan-item enterprise'}>
                    <div className={'plan-item-header'}>
                        <span>Enterprise</span>
                    </div>
                    <div className={'plan-item-price'}>
                        <span>Contact us to unlock <br />exclusive pricing for <br/>multiple users</span>
                    </div>
                    <div className={'plan-item-content'}>
                        <div className={'plan-item-features'} />
                        <div className={'plan-item-btn'}>
                            <Button>
                                <i className="zmdi zmdi-arrow-right"/>
                                Contact Us
                            </Button>
                            <div className={'plan-item-code'}>
                                <span className={'cursor-pointer'} onClick={() => onSelectPlan(planList.enterprise)}>
                                    I HAVE AN ENTERPRISE CODE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanComponent;