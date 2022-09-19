import React, {useState, useEffect} from "react";
import {Input} from "reactstrap";
import classNames from 'classnames';
import validator from 'validator';
import {
    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {Button, CircularProgress} from "@material-ui/core";
import * as Apis from "Api";
import {NotificationManager} from "react-notifications";

function StripeForm({initialEmail, onStripeSubscribe, discountCode, priceId, isTrial}) {
    const stripe = useStripe();
    const stripeElements = useElements();
    const [completeCardNumber, setCompleteCardNumber] = useState(false);
    const [errorCardNumber, setErrorCardNumber] = useState(false);
    const [completeCardExpiry, setCompleteCardExpiry] = useState(false);
    const [errorCardExpiry, setErrorCardExpiry] = useState(false);
    const [completeCardCvc, setCompleteCardCvc] = useState(false);
    const [errorCardCvc, setErrorCardCvc] = useState(false);
    const [email, setEmail] = useState(initialEmail);
    const [errorEmail, setErrorEmail] = useState(false);
    const [phone, setPhone] = useState('');
    const [errorPhone, setErrorPhone] = useState(false);
    const [cardName, setCardName] = useState('');
    const [errorCardName, setErrorCardName] = useState(false);
    const [contactCountry, setContactCountry] = useState('');
    const [errorCountry, setErrorCountry] = useState(false);
    const [contactAddress, setContactAddress] = useState('');
    const [errorAddress, setErrorAddress] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkValidation = () => {
        let valid = true;
        if(!completeCardNumber) {
            setErrorCardNumber(true);
            valid = false;
        }
        if(!completeCardExpiry) {
            setErrorCardExpiry(true);
            valid = false;
        }
        if(!completeCardCvc) {
            setErrorCardCvc(true);
            valid = false;
        }
        if(email === '' || !validator.isEmail(email)) {
            setErrorEmail(true);
            valid = false;
        }
        if(phone === '') {
            setErrorPhone(true);
            valid = false;
        }
        if(cardName === '') {
            setErrorCardName(true);
            valid = false;
        }
        if(contactCountry === '') {
            setErrorCountry(true);
            valid = false;
        }
        if(contactAddress === '') {
            setErrorAddress(true);
            valid = false;
        }
        return valid;
    }

    const onChangeCardNumber = (event) => {
        setCompleteCardNumber(event.complete);
        setErrorCardNumber(false);
    }

    const onChangeCardExpiry = (event) => {
        setCompleteCardExpiry(event.complete);
        setErrorCardExpiry(false);
    }

    const onChangeCardCvc = (event) => {
        setCompleteCardCvc(event.complete);
        setErrorCardCvc(false);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (stripeElements === null) return;
        if(!checkValidation()) return;
        setLoading(true);
        let subscriptionId, customerId;
        const data = {email, phone, cardName, contactCountry, contactAddress, priceId, isTrial, discountCode};
        Apis.paymentStripeSubscription(data).then((resp) => {
            customerId = resp.customerId;
            subscriptionId = resp.subscriptionId;
            if(!isTrial) {
                return stripe.confirmCardPayment(resp.clientSecret, {
                    payment_method: {
                        card: stripeElements.getElement(CardNumberElement),
                        billing_details: {
                            email, phone, name: cardName
                        }
                    }
                })
            } else {
                // return stripe.confirmCardSetup(resp.clientSecret, {
                //     payment_method: {
                //         card: stripeElements.getElement(CardNumberElement),
                //         billing_details: {
                //             email, phone, name: cardName
                //         }
                //     }
                // })
            }
        }).then((resp) => {
            if(!isTrial) {
                if (resp.paymentIntent && resp.paymentIntent.status === 'succeeded') {
                    onStripeSubscribe(subscriptionId, customerId, resp.paymentIntent.id);
                }
            } else {
                onStripeSubscribe(subscriptionId, customerId, null);
                // if(resp.setupIntent && resp.setupIntent.status === 'succeeded' ) {
                //     onStripeSubscribe(subscriptionId, customerId, null);
                // }
            }
        }).catch((e) => {
            NotificationManager.error(e.response ? e.response.data.error.message : "Subscription failed");
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>CONTACT INFORMATION</span>
                <div className={classNames('pay-form', {'error': errorEmail || errorPhone})}>
                    <div className={'d-flex flex-row align-items-center'}>
                        <i className={'zmdi zmdi-email'}/>
                        <Input
                            type={'text'}
                            className={'card-input'}
                            placeholder={'email@example.com'}
                            value={email}
                            onChange={(e) => {setEmail(e.target.value); setErrorEmail(false)}}
                        />
                    </div>
                    <div className={'d-flex flex-row align-items-center'}>
                        <i className={'zmdi zmdi-phone'}/>
                        <Input
                            type={'text'}
                            className={'card-input'}
                            placeholder={'(201) 555-0123'}
                            value={phone}
                            onChange={(e) => {setPhone(e.target.value); setErrorPhone(false)}}
                        />
                    </div>
                </div>
            </div>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>CARD DETAILS</span>
                <div className={classNames('pay-form', {'error': errorCardNumber || errorCardExpiry || errorCardCvc})}>
                    <div className={'d-flex flex-row align-items-center pl-2'} style={{minHeight: 36}}>
                        <CardNumberElement
                            showIcon
                            placeholder={'Card Number'}
                            onChange={onChangeCardNumber}
                        />
                        <img src={require('Assets/img/main/card_img.png')} alt={''} className={'card-img'}/>
                        {/*<Input type={'text'} className={'card-input'}/>*/}
                    </div>
                    <div className={'pay-form-row'}>
                        <div>
                            <CardExpiryElement
                                className={'mr-10'}
                                placeholder={'MM/YY'}
                                onChange={onChangeCardExpiry}
                            />
                            {/*<Input type={'text'} className={'card-input'}/>*/}
                        </div>
                        <div>
                            <CardCvcElement
                                placeholder={'CVC'}
                                onChange={onChangeCardCvc}
                            />
                            {/*<Input type={'text'} className={'card-input'}/>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>NAME ON CARD</span>
                <div className={classNames('pay-form', {'error': errorCardName})}>
                    <Input
                        type={'text'}
                        className={'card-input'}
                        value={cardName}
                        onChange={(e) => {setCardName(e.target.value); setErrorCardName(false)}}
                    />
                </div>
            </div>
            <div className={'pay-form-container'}>
                <span className={'fs-13 pay-form-title'}>CONTACT INFORMATION</span>
                <div className={classNames('pay-form', {'error': errorCountry || errorAddress})}>
                    <div>
                        <Input
                            type={'text'}
                            className={'card-input'}
                            placeholder={'Country'}
                            value={contactCountry}
                            onChange={(e) => {setContactCountry(e.target.value); setErrorCountry(false);}}
                        />
                    </div>
                    <div>
                        <Input
                            type={'text'}
                            className={'card-input'}
                            placeholder={'Address'}
                            value={contactAddress}
                            onChange={(e) => {setContactAddress(e.target.value); setErrorAddress(false);}}
                        />
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
                <Button className={'pay-button'} type={'submit'} disabled={loading}>
                    {
                        loading ?  <CircularProgress size={20} style={{margin: 4}}/> : 'Process Payment'
                    }
                </Button>
            </div>
        </form>
    )
}

export default StripeForm;