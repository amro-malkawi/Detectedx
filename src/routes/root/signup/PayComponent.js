import React, {useState, useEffect} from 'react';
import {Input} from "reactstrap";
import {NotificationManager} from "react-notifications";
import {loadStripe} from '@stripe/stripe-js';
import {CardNumberElement, Elements, useStripe} from '@stripe/react-stripe-js';
import PaypalButton from "Components/Payment/PaypalButton";
import StripeForm from "Components/Payment/StripeForm";
import * as Apis from "Api";

function PayComponent({plan, onPay, signupEmail}) {
    const [discountCode, setDiscountCode] = useState('');
    const [stripePromise, setStripePromise] = useState(() => loadStripe(plan.stripeKey))
    const stripeOptions = {
        // passing the client secret obtained from the server
        // clientSecret: '{{CLIENT_SECRET}}',
    };

    useEffect(() => {
    }, []);

    const onStripeSubscribe = (subscriptionId, customerId, paymentIntentId) => {
        onPay(subscriptionId, customerId, paymentIntentId);
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
                            <span className={'cost-val'}>{plan.detail.amount}</span>
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
                            <span>${plan.detail.amount}.00</span>
                        </div>
                        <div className={'pay-split-bar'}/>
                        <div>
                            <Input
                                type={'text'}
                                className={'pay-coupon-code'}
                                placeholder={'ADD DISCOUNT CODE'}
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                        </div>
                        <div className={'d-flex flex-row justify-content-between fs-14 text-white mt-30'}>
                            <span>SALES TAX</span>
                            <span>$0 (INCLUDED)</span>
                        </div>
                        <div className={'pay-split-bar'}/>
                    </div>
                    <div className={'main-pay-info-bottom'}>
                        <span>Powered By Stripe | Legals</span>
                        <span className={'ml-3'}>Refunds</span>
                        <span className={'ml-3'}>Contact</span>
                    </div>
                </div>
                <div className={'main-pay-purchase'}>
                    <div className={'main-pay-purchase-content'}>
                        {/*<div>*/}
                        {/*    <PaypalButton*/}
                        {/*        planId=''*/}
                        {/*        paypalKey={paypalKey}*/}
                        {/*        currency={'AUD'}*/}
                        {/*        createOrder={onPaypalCreateOrder}*/}
                        {/*        onApprove={onPaypalApprove}*/}
                        {/*        onSuccess={null}*/}
                        {/*        onCancel={onPaypalCancel}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className={'text-center fs-11 mt-2'}>
                            Enter payment details
                        </div>
                        <Elements stripe={stripePromise} options={stripeOptions}>
                            <StripeForm initialEmail={signupEmail} priceId={plan.detail.id} discountCode={discountCode} onStripeSubscribe={onStripeSubscribe}/>
                        </Elements>
                    </div>
                    <div className={'pay-purchase-bottom'}>
                        After your trial ends you will be charged $xx.xx per month<br/>
                        starting April 30, 2022. You can always cancel before then.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayComponent;