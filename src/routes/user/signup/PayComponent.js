import React, {useState, useEffect} from 'react';
import {Input} from "reactstrap";
import {Button, CircularProgress} from "@material-ui/core";
import {NotificationManager} from "react-notifications";
import {loadStripe} from '@stripe/stripe-js';
import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import PaypalButton from "Components/Payment/PaypalButton";
import StripeForm from "Components/Payment/StripeForm";
import * as Apis from "Api";

function PayComponent({plan, stripeKey, paypalKey, onPay}) {
    const {price, currency, couponCode} = plan;
    const [keyLoading, setKeyLoading] = useState(true);

    const stripePromise = loadStripe(stripeKey);
    const stripeOptions = {
        // passing the client secret obtained from the server
        // clientSecret: '{{CLIENT_SECRET}}',
    };

    useEffect(() => {
    }, []);

    const onPaypalCreateOrder = () => {
        return Apis.paymentPaypalCreate('test_set_id', price, currency, couponCode);
    }

    const onPaypalApprove = (data, action) => {
        return Apis.paymentPaypalApprove('test_set_id', price, currency, couponCode, JSON.stringify(data));
    }

    const onPaypalCancel = () => {

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
                            Annual Plan
                        </div>
                        <div className={'cost-content'}>
                            <span className={'cost-symbol'}>$</span>
                            <span className={'cost-val'}>499</span>
                            <span className={'cost-currency'}>AUD</span>
                        </div>
                        <div className={'fs-14 text-primary1'}>COMPLETE ACCESS</div>
                        <div className={'fs-12 text-primary1 fw-semi-bold text-underline'}>Billed Monthly.</div>
                        <div className={'d-flex flex-row justify-content-between fs-14 text-white mt-20 mb-40'}>
                            <span>DETECTEDX ANNUAL PLAN</span>
                            <span>SAVE 15%</span>
                        </div>
                        <div className={'d-flex flex-row justify-content-between fs-14 text-white'}>
                            <span>SUBTOTAL</span>
                            <span>$499.00</span>
                        </div>
                        <div className={'pay-split-bar'}/>
                        <div>
                            <Input type={'text'} className={'pay-coupon-code'} placeholder={'ADD DISCOUNT CODE'}/>
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
                        <div>
                            {
                                keyLoading ?
                                    <div className={'paypal-button'}>
                                        <CircularProgress size={23}/>
                                    </div> :
                                    <PaypalButton
                                        planId=''
                                        paypalKey={paypalKey}
                                        currency={'AUD'}
                                        createOrder={onPaypalCreateOrder}
                                        onApprove={onPaypalApprove}
                                        onSuccess={null}
                                        onCancel={onPaypalCancel}
                                    />
                            }
                        </div>
                        <div className={'text-center fs-11 mt-2'}>
                            Or enter payment details
                        </div>
                        <Elements stripe={stripePromise} options={stripeOptions}>
                            <StripeForm />
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