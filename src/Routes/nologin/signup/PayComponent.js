import React, {useState, useEffect} from 'react';
import {Input} from "reactstrap";
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StripeForm from "Components/Payment/StripeForm";
import moment from "moment";
import * as Apis from "Api";

function PayComponent({plan, onPay, signupEmail}) {
    const [discountCode, setDiscountCode] = useState('');
    const [stripePromise, setStripePromise] = useState(() => loadStripe(plan.stripeKey))
    const [showDiscountApply, setShowDiscountApply] = useState(false);
    const [allowedCouponInfo, setAllowedCouponInfo] = useState(null);
    const [couponErrorMsg, setCouponErrorMsg] = useState(null);

    const stripeOptions = {
        // passing the client secret obtained from the server
        // clientSecret: '{{CLIENT_SECRET}}',
    };

    useEffect(() => {
    }, []);

    useEffect(() => {
        setShowDiscountApply(discountCode !== '');
        setCouponErrorMsg(null);
    }, [discountCode])

    const onDiscountApply = () => {
        setCouponErrorMsg(null);
        Apis.couponInfo(discountCode).then((resp) => {
            if (resp.valid) {
                setDiscountCode('');
                setAllowedCouponInfo({code: resp.coupon_code, discountValue: resp.coupon_discount_value});
            } else {
                setCouponErrorMsg(resp.errorMsg)
            }
        }).catch((e) => {
            setCouponErrorMsg("This code is invalid.");
        })
    }

    const onStripeSubscribe = (subscriptionId, customerId, paymentIntentId) => {
        onPay(subscriptionId, customerId, paymentIntentId, allowedCouponInfo ? allowedCouponInfo.code : null);
    }

    const renderTrialBottom = () => {
        if (plan.id === 'free') {
            const trialEndDate = moment().add(7, 'days').format('DD MMM, YYYY');
            return (
                <div className={'pay-purchase-bottom'}>
                    After your trial ends you will be charged ${plan.detail.amount}.00 per month<br/>
                    starting {trialEndDate}. You can always cancel before then.
                </div>
            )
        } else {
            return null;
        }
    }

    const renderDiscount = () => {
        if (plan.id !== 'free') {
            if (!allowedCouponInfo) {
                return (
                    <React.Fragment>
                        <div className={'pay-coupon-code'}>
                            <Input
                                type={'text'}
                                placeholder={'ADD DISCOUNT CODE'}
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            {
                                showDiscountApply &&
                                <div className={'pay-coupon-apply'} onClick={() => onDiscountApply()}>
                                    Apply
                                </div>
                            }
                        </div>
                        {
                            couponErrorMsg &&
                            <div className={'fs-12 ms-2 mt-1 text-red'}>{couponErrorMsg}</div>
                        }
                    </React.Fragment>
                )
            } else {
                const discountPrice = Number(plan.detail.amount) * Number(allowedCouponInfo.discountValue) / 100;
                return (
                    <div className={'pay-allow-coupon-info'}>
                        <div className={'d-flex flex-row justify-content-between align-items-center'}>
                            <div className={'d-flex flex-row align-items-center'}>
                                <LocalOfferIcon fontSize={'small'}/>
                                <span>{allowedCouponInfo.code}</span>
                                <IconButton onClick={() => setAllowedCouponInfo(null)}><CloseIcon fontSize={'small'}/></IconButton>
                            </div>
                            <span className={'fs-14'}>-${discountPrice}</span>
                        </div>
                        <span className={'fs-12'}>{allowedCouponInfo.discountValue}% off</span>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    return (
        <div className={'main-pay'}>
            <div className={'main-pay-content'}>
                <div className={'main-pay-info'}>
                    <div className={'main-pay-info-content'}>
                        <div className={'d-flex justify-content-center'}>
                            <img src={require('Assets/img/main/header_logo.png')} className={'pay-site-logo'} alt={'pay-site-logo'}/>
                        </div>
                        <div className={'mt-40 text-primary1 fs-14 fw-semi-bold'}>
                            YOU HAVE SELECTED THE
                        </div>
                        <div className={'pay-plan-name'}>
                            {plan.desc}
                        </div>
                        <div className={'cost-content'}>
                            <span className={'cost-symbol'}>$</span>
                            <span
                                className={'cost-val'}>{plan.id === 'free' ? 0 : (!allowedCouponInfo ? plan.detail.amount : (plan.detail.amount * (100 - allowedCouponInfo.discountValue) / 100))}</span>
                            <span className={'cost-currency'}>{plan.detail.currency.toUpperCase()}</span>
                        </div>
                        <div className={'fs-14 text-primary1'}>{plan.access}</div>
                        {
                            plan.id !== 'free' && <div className={'fs-12 text-primary1 fw-semi-bold text-underline'}>Billed {plan.name}.</div>
                        }
                        {
                            plan.id === 'free' ?
                                <div className={'d-flex flex-row justify-content-between fs-14 text-white mt-20 mb-40'}>
                                    <span>{plan.desc}</span>
                                </div> :
                                <div className={'d-flex flex-row justify-content-between fs-14 text-white mt-20 mb-40'}>
                                    <span>DETECTEDX {plan.desc.toUpperCase()}</span>
                                    {
                                        plan.id === 'yearly' && <span>SAVE 15%</span>
                                    }
                                </div>
                        }
                        <div className={'d-flex flex-row justify-content-between fs-14 text-white'}>
                            <span>SUBTOTAL</span>
                            <span>${plan.id === 'free' ? 0 : plan.detail.amount}.00</span>
                        </div>
                        <div className={'pay-split-bar'}/>
                        {renderDiscount()}
                        <div className={'d-flex flex-row justify-content-between fs-14 text-white mt-30'}>
                            <span>SALES TAX</span>
                            <span>$0 (INCLUDED)</span>
                        </div>
                        <div className={'pay-split-bar'}/>
                    </div>
                    <div className={'main-pay-info-bottom'}>
                        <span>Powered By Stripe | Legals</span>
                        <span className={'ms-3'}>Refunds</span>
                        <span className={'ms-3'}>Contact</span>
                    </div>
                </div>
                <div className={'main-pay-purchase'}>
                    <div className={'main-pay-purchase-content'}>
                        <div className={'text-center fs-11 mt-2'}>
                            Enter payment details
                        </div>
                        <Elements stripe={stripePromise} options={stripeOptions}>
                            <StripeForm
                                initialEmail={signupEmail}
                                priceId={plan.detail.id}
                                isTrial={plan.id === 'free'}
                                discountCode={allowedCouponInfo ? allowedCouponInfo.code : ''}
                                onStripeSubscribe={onStripeSubscribe}
                            />
                        </Elements>
                    </div>
                    {renderTrialBottom()}
                </div>
            </div>
        </div>
    )
}

export default PayComponent;