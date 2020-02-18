import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';

class PaypalButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        window.React = React;
        window.ReactDOM = ReactDOM;
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const {
            isScriptLoaded,
            isScriptLoadSucceed,
        } = nextProps;
        const isLoadedButWasntLoadedBefore =
            !this.state.showButton &&
            !this.props.isScriptLoaded &&
            isScriptLoaded;
        if (isLoadedButWasntLoadedBefore) {
            if (isScriptLoadSucceed) {
                let PayPalButton = paypal.Buttons.driver('react', {React, ReactDOM});
                paypal.Buttons({
                    style: {
                        size: 'responsive',
                        color: 'black',
                        shape: 'rect',
                        label: 'paypal',
                    },
                    createSubscription: function (data, actions) {
                        return actions.subscription.create({
                            'plan_id': 'P-8YS05629T57601256LZFHRVQ'
                        });
                    },
                    onApprove: function (data, actions) {
                        alert('You have successfully created subscription ' + data.subscriptionID);
                    }
                }).render('#paypal-button-container');
            }
        }
    }

    render() {

        // https://github.com/paypal/paypal-checkout-components
        return (
            <div className={'buy-button'} style={{marginTop: 32}}>
                <div className="paypal-button" id="paypal-button-container"/>
            </div>
        );
    }
}

export default scriptLoader('https://www.paypal.com/sdk/js?client-id=ASNlAmrUflaRXLfCF_Y3Tg5JwkdQfFxC3f4VlVrhxD9LiTdRQIrjtSvZ45FdKUhlRQPNwCcdjrSNh3qA&disable-funding=credit,card&vault=true')(PaypalButton);