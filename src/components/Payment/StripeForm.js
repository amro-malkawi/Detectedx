import React, {useState, useEffect} from "react";
import {Input} from "reactstrap";
import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {Button} from "@material-ui/core";

function StripeForm({onStripePay}) {
    const stripe = useStripe();
    const stripeElements = useElements();

    const onSubmit = async (event) => {
        console.log('submit!!!!!!!!!!!!')
        event.preventDefault();
        if (stripeElements == null) {
            return;
        }
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: stripeElements.getElement(CardNumberElement),
            billing_details: {
                email: '',
                phone: '',
                name: '',
                contactCountry: '',
                contactAddress: '',
            }
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>CONTACT INFORMATION</span>
                <div className={'pay-form'}>
                    <div className={'d-flex flex-row align-items-center'}>
                        <i className={'zmdi zmdi-email'}/>
                        <Input type={'text'} className={'card-input'} placeholder={'email@example.com'}/>
                    </div>
                    <div className={'d-flex flex-row align-items-center'}>
                        <i className={'zmdi zmdi-phone'}/>
                        <Input type={'text'} className={'card-input'} placeholder={'(201) 555-0123'}/>
                    </div>
                </div>
            </div>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>CARD DETAILS</span>
                <div className={'pay-form'}>
                    <div className={'d-flex flex-row align-items-center pl-2'} style={{minHeight: 36}}>
                        <CardNumberElement
                            showIcon
                            placeholder={'Card Number'}
                            onChange={(value) => null}
                        />
                        <img src={require('Assets/img/main/card_img.png')} alt={''} className={'card-img'}/>
                        {/*<Input type={'text'} className={'card-input'}/>*/}
                    </div>
                    <div className={'pay-form-row'}>
                        <div>
                            <CardExpiryElement
                                className={'mr-10'}
                                placeholder={'MM/YY'}
                                onChange={(value) => null}
                            />
                            {/*<Input type={'text'} className={'card-input'}/>*/}
                        </div>
                        <div>
                            <CardCvcElement
                                placeholder={'CVC'}
                                onChange={(value) => null}
                            />
                            {/*<Input type={'text'} className={'card-input'}/>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>NAME ON CARD</span>
                <div className={'pay-form'}>
                    <Input type={'text'} className={'card-input'}/>
                </div>
            </div>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>CONTACT INFORMATION</span>
                <div className={'pay-form'}>
                    <div>
                        <Input type={'text'} className={'card-input'}/>
                    </div>
                    <div>
                        <Input type={'text'} className={'card-input'}/>
                    </div>
                </div>
            </div>
            <div className={'fs-11 text-underline fw-semi-bold mt-10'} style={{color: '#6C6C6C'}}>
                Enter Address Manually
            </div>
            <div className={'fs-11 fw-semi-bold text-center mt-20 mt-3'}>
                Eligible for a Refund?
            </div>
            <div className={'d-flex flex-row'}>
                <Button className={'pay-button'} type={'submit'}>Process Payment</Button>
            </div>
        </form>
    )
}

export default StripeForm;