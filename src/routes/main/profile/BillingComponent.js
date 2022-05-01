import React, {useState, useEffect} from 'react';
import {Button, CircularProgress} from "@material-ui/core";
import moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import * as Apis from 'Api';

function BillingComponent() {
    const [billingInfo, setBillingInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Apis.paymentSubscribedInfo().then((resp) => {
            setBillingInfo(resp);
        }).catch((e) => {
        }).finally(() => {
           setLoading(false);
        });
    }, []);

    const onUpdateCard = async () => {
        const {sessionId, stripeKey} = await Apis.paymentUpdateCardSession();
        const stripePromise = loadStripe(stripeKey);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            sessionId,
        });
    }

    const renderBillingHistoryItem = (v) => {
        return (
            <div className={'billing-history-item'} key={v}>
                <div className={'d-flex flex-row justify-content-between align-items-end mb-2'}>
                    <span className={'fs-23 text-white fw-semi-bold'}>${v.payment_history_amount}{v.payment_history_currency} {v.payment_history_desc}</span>
                            <span className={'fs-15 paid-text'}>PAID</span>
                </div>
                <div className={'fs-17 fw-semi-bold text-white mb-2'}>
                    {moment(v.created_at).format('DD MMM YYYY')}
                </div>
                <div className={'fs-15 cursor-pointer text-underline'}>INVOICE</div>
            </div>
        )
    }
    if(loading) {
        return <div className={'profile-content justify-content-center align-items-center'}><CircularProgress size={30} /></div>
    }
    return (
        <div className={'profile-content'}>
            {
                !billingInfo.subscriptionInfo ?
                    <div className={'billing-info'}><span className={'fs-19'}>There is not subscription</span></div> :
                    <div className={'billing-info'}>
                        <div className={'d-flex flex-row justify-content-between'}>
                            <div className={'d-flex'}>
                                <div className={'d-flex flex-column mr-50'}>
                                    <span className={'fs-16 fw-semi-bold text-primary1'}>BILLING PLAN</span>
                                    <span className={'fs-23 fw-semi-bold text-white mt-3'}>{billingInfo.subscriptionInfo.planName}</span>
                                </div>
                                <div className={'d-flex flex-column ml-50'}>
                                    <span className={'fs-16 fw-semi-bold text-primary1'}>PAYMENT/s</span>
                                    <span className={'fs-23 fw-semi-bold text-white mt-3'}>${billingInfo.subscriptionInfo.planAmount}/{billingInfo.subscriptionInfo.planName.split(' ')[0]}</span>
                                </div>
                            </div>
                            <div className={'d-flex flex-column'}>
                                <Button className={'contain-btn mb-1'}>CHANGE PLAN</Button>
                                <Button className={'outline-btn px-20'}>CANCEL SUBSCRIPTION</Button>
                            </div>
                        </div>
                        <div className={'divide-line mt-10 mb-4'}/>
                        <div className={'d-flex flex-row justify-content-between mb-10'}>
                            <div className={'d-flex flex-column mr-50'}>
                                <span className={'fs-16 fw-semi-bold text-primary1'}>NEXT PAYMENT DUE</span>
                                <span className={'fs-23 fw-semi-bold text-white mt-3'}>{billingInfo.subscriptionInfo.nextPaymentDate}</span>
                            </div>
                        </div>
                        <div className={'divide-line mt-10 mb-4'}/>
                        <div className={'d-flex flex-row justify-content-between'}>
                            <div className={'d-flex flex-column mr-50'}>
                                <span className={'fs-16 fw-semi-bold text-primary1'}>PAYMENT METHOD</span>
                                <div className={'d-flex flex-row align-items-end fs-23 fw-semi-bold text-white mt-3'}>
                                    <span>Stripe</span>
                                    <img src={require('Assets/img/main/stripe.png')} alt={''} width={25} className={'ml-2'}/>
                                </div>
                            </div>
                            <div className={'d-flex flex-column'}>
                                <Button className={'contain-btn mb-1 px-30'} onClick={onUpdateCard}>UPDATE PAYMENT DETAILS</Button>
                            </div>
                        </div>
                        <div className={'divide-line mt-10 mb-4'}/>
                        <div className={'d-flex flex-row justify-content-between'}>
                            <div className={'d-flex flex-column mr-50'}>
                                <span className={'fs-16 fw-semi-bold text-primary1'}>INVOICES</span>
                            </div>
                            <div className={'d-flex flex-column'}>
                                <Button className={'contain-btn mb-1 px-30'}>PRINT LAST FINANCIAL YEARS INVOICES</Button>
                            </div>
                        </div>
                    </div>
            }
            <div className={'billing-history'}>
                <span className={'fs-16 fw-semi-bold text-primary1'}>BILLING HISTORY</span>
                <div className={'billing-history-data'}>
                    <div className={'billing-history-items'}>
                        {
                            billingInfo.paymentHistory && billingInfo.paymentHistory.map((v) => renderBillingHistoryItem(v))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingComponent