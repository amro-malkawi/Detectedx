import React from 'react';
import {Button} from '@mui/material';
import {Carousel} from 'react-responsive-carousel';
import {isMobile} from 'react-device-detect';
import {useSelector} from "react-redux";


function PlanComponent({onSelectPlan, planList}) {
    const isLogin = useSelector((state) => state.authUser.isLogin);

    const getDiscountValue = (planDetail) => {
        const isDiscount = (planDetail.nickname && planDetail.nickname.toLowerCase().indexOf('discount') !== -1);
        let discountPrice = planDetail.amount;
        if(isDiscount) {
            const reg = /discount([\d]+)/;
            const match = planDetail.nickname.match(reg);
            if(match && match.length === 2) {
                discountPrice = match[1];
            }
        }
        return {isDiscount, discountPrice};
    }

    const renderFreePlan = () => {
        console.log(planList.free)
        return (
            <div className={'main-plan-item'}>
                <div className={'plan-item-header'}>
                    <span>7 Day Free Trial</span>
                </div>
                <div className={'plan-item-price'}>
                    <span className={'plan-price-num'}>Free</span>
                </div>
                <div className={'plan-item-content'}>
                    <div className={'plan-item-features'}>
                        <div><span/>
                            <div>Self-assessment modules</div>
                        </div>
                        <div><span/>
                            <div>Quizzes</div>
                        </div>
                        <div><span/>
                            <div>On-demand lectures</div>
                        </div>
                        <div><span/>
                            <div>Unlimited access online 24/7</div>
                        </div>
                        <div><span/>
                            <div>Upgrade to monthly subscription at the end of your trial</div>
                        </div>
                    </div>
                    <div className={'plan-item-btn'}>
                        <Button onClick={() => onSelectPlan(planList.free)}>
                            <i className="zmdi zmdi-arrow-right"/>
                            {isLogin ? 'Register' : 'Sign Up'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const renderAnnual = () => {
        const {isDiscount, discountPrice} = getDiscountValue(planList.yearly.detail);
        return (
            <div className={'main-plan-item charged'}>
                <div className={'plan-item-header'}>
                    <span>Annual</span>
                </div>
                <div className={'plan-item-price'}>
                    <div className={'d-flex flex-row align-items-start'}>
                        {
                            isDiscount &&
                            <div className={'plan-price-discount'}>
                                <div>
                                    <span className={'fs-23'}>$</span>{discountPrice}
                                    <div className={'diagonal-line'}/>
                                </div>
                            </div>
                        }
                        <span className={'plan-price-currency'}>$</span>
                        <span className={'plan-price-num'}>{planList.yearly.detail.amount}</span>
                    </div>
                    <span className={'fs-14 fw-semi-bold'}>PRICES IN {planList.yearly.detail.currency.toUpperCase()}</span>
                </div>
                <div className={'plan-item-content'}>
                    <div className={'plan-item-features'}>
                        <div className={'fw-bold'}><span/>Save two months fee</div>
                        <div><span/>Instant certification</div>
                        <div><span/>Accredited CME points</div>
                        <div><span/>Self-assessment modules</div>
                        <div><span/>Quizzes</div>
                        <div><span/>On-demand lectures</div>
                        <div><span/>Cost savings by paying annually</div>
                        <div><span/>Unlimited access online 24/7</div>
                    </div>
                    <div className={'plan-item-btn'}>
                        <Button onClick={() => onSelectPlan(planList.yearly)}>
                            <i className="zmdi zmdi-arrow-right"/>
                            {isLogin ? 'Subscribe' : 'Sign Up'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const renderMonthlyPlan = () => {
        const {isDiscount, discountPrice} = getDiscountValue(planList.monthly.detail);
        return (
            <div className={'main-plan-item charged'}>
                <div className={'plan-item-header'}>
                    <span>Monthly</span>
                </div>
                <div className={'plan-item-price'}>
                    <div className={'d-flex flex-row align-items-start'}>
                        {
                            isDiscount &&
                            <div className={'plan-price-discount'}>
                                <div>
                                    <span className={'fs-23'}>$</span>{discountPrice}
                                    <div className={'diagonal-line'}/>
                                </div>
                            </div>
                        }
                        <span className={'plan-price-currency'}>$</span>
                        <span className={'plan-price-num'}>{planList.monthly.detail.amount}</span>
                    </div>
                    <span className={'fs-14 fw-semi-bold'}>PRICES IN {planList.monthly.detail.currency.toUpperCase()}</span>
                </div>
                <div className={'plan-item-content'}>
                    <div className={'plan-item-features'}>
                        <div><span/>Instant certification</div>
                        <div><span/>Accredited CME / CPD points</div>
                        <div><span/>Self-assessment modules</div>
                        <div><span/>Quizzes</div>
                        <div><span/>On-demand lectures</div>
                        <div><span/>Unlimited access online 24/7</div>
                    </div>
                    <div className={'plan-item-btn'} onClick={() => onSelectPlan(planList.monthly)}>
                        <Button>
                            <i className="zmdi zmdi-arrow-right"/>
                            {isLogin ? 'Subscribe' : 'Sign Up'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const renderEnterprise = () => {
        return (
            <div className={'main-plan-item enterprise'}>
                <div className={'plan-item-header'}>
                    <span>Enterprise</span>
                </div>
                <div className={'plan-item-price'}>
                    <span>Contact us to unlock <br/>exclusive pricing for <br/>multiple users</span>
                </div>
                <div className={'plan-item-content'}>
                    <div className={'plan-item-features'}/>
                    <div className={'plan-item-btn'}>
                        <Button onClick={() => window.open('https://detectedx.com/contact/', "_self")}>
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
        )
    }


    return (
        <div className={'main-plan'}>
            {
                !isMobile ?
                    <div className={'main-plan-container'}>
                        {renderFreePlan()}
                        {renderAnnual()}
                        {renderMonthlyPlan()}
                        {renderEnterprise()}
                    </div> :
                    <div className={'main-plan-container'}>
                        <Carousel
                            autoPlay={false}
                            showArrows={false}
                            showIndicators={false}
                            showStatus={false}
                            dynamicHeight
                            centerMode
                            centerSlidePercentage={80}
                            verticalSwipe={'natural'}
                        >
                            {renderFreePlan()}
                            {renderAnnual()}
                            {renderMonthlyPlan()}
                            {renderEnterprise()}
                        </Carousel>
                    </div>
            }
        </div>
    )
}

export default PlanComponent;