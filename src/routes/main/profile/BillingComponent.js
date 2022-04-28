import React from 'react';
import {Button} from "@material-ui/core";

function BillingComponent() {

    const renderBillingHistoryItem = (v) => {
        return (
            <div className={'billing-history-item'} key={v}>
                <div className={'d-flex flex-row justify-content-between align-items-end mb-2'}>
                    <span className={'fs-23 text-white fw-semi-bold'}>$50pm Subscription</span>
                    {
                        v !== 2 ?
                            <span className={'fs-15'}>SCHEDULED</span> :
                            <span className={'fs-15 paid-text'}>PAID</span>
                    }
                </div>
                <div className={'fs-17 fw-semi-bold text-white mb-2'}>
                    MAY 23 2022
                </div>
                <div className={'fs-15 cursor-pointer text-underline'}>INVOICE</div>
            </div>
        )
    }
    return (
        <div className={'profile-content'}>
            <div className={'billing-info'}>
                <div className={'d-flex flex-row justify-content-between'}>
                    <div className={'d-flex'}>
                        <div className={'d-flex flex-column mr-50'}>
                            <span className={'fs-16 fw-semi-bold text-primary1'}>BILLING PLAN</span>
                            <span className={'fs-23 fw-semi-bold text-white mt-3'}>Monthly</span>
                        </div>
                        <div className={'d-flex flex-column ml-50'}>
                            <span className={'fs-16 fw-semi-bold text-primary1'}>PAYMENT/s</span>
                            <span className={'fs-23 fw-semi-bold text-white mt-3'}>$50/month</span>
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
                        <span className={'fs-23 fw-semi-bold text-white mt-3'}>23 May 2022</span>
                    </div>
                </div>
                <div className={'divide-line mt-10 mb-4'}/>
                <div className={'d-flex flex-row justify-content-between'}>
                    <div className={'d-flex flex-column mr-50'}>
                        <span className={'fs-16 fw-semi-bold text-primary1'}>PAYMENT METHOD</span>
                        <div className={'d-flex flex-row align-items-end fs-23 fw-semi-bold text-white mt-3'}>
                            <span>Stripe</span>
                            <img src={require('Assets/img/main/stripe.png')} alt={''} width={25} className={'ml-2'} />
                        </div>
                    </div>
                    <div className={'d-flex flex-column'}>
                        <Button className={'contain-btn mb-1 px-30'}>UPDATE PAYMENT DETAILS</Button>
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
            <div className={'billing-history'}>
                <span className={'fs-16 fw-semi-bold text-primary1'}>BILLING HISTORY</span>
                <div className={'billing-history-data'}>
                    <div className={'billing-history-items'}>
                        {
                            [0,].map((v) => renderBillingHistoryItem(v))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingComponent