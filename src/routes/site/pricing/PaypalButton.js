import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';

const PAYPAL_CLIENT_ID = 'ASNlAmrUflaRXLfCF_Y3Tg5JwkdQfFxC3f4VlVrhxD9LiTdRQIrjtSvZ45FdKUhlRQPNwCcdjrSNh3qA';


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
                const {cliendId, planId, onCreateSubscription, onApprove, onSuccess, onCancel} = this.props;
                paypal.Buttons({
                    style: {
                        size: 'responsive',
                        color: 'black',
                        shape: 'rect',
                        label: 'paypal',
                    },
                    createSubscription: onCreateSubscription,
                    onApprove: onApprove,
                    // createSubscription: function (data, actions) {
                    //     return actions.subscription.create({
                    //         'plan_id': planId
                    //     });
                    // },
                    // onApprove: function (data, actions) {
                    //     alert('You have successfully created subscription ' + data.subscriptionID);
                    //     // onSuccess(data);
                    // }
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

export default scriptLoader('https://www.paypal.com/sdk/js?client-id=' + PAYPAL_CLIENT_ID +'&disable-funding=credit,card&vault=true')(PaypalButton);