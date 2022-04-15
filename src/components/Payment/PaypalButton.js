import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Script from 'react-load-script'
import {CircularProgress} from "@material-ui/core";


export default class PaypalButton extends Component {
    constructor() {
        super();
        this.state = {
            scriptLoaded: false,
            scriptError: false
        }
        window.React = React;
        window.ReactDOM = ReactDOM;
    }

    onScriptLoaded() {
        this.setState({scriptLoaded: true});
        const {createOrder, onApprove, onSuccess, onCancel} = this.props;
        paypal.Buttons({
            style: {
                size: 'responsive',
                color: 'black',
                shape: 'rect',
                label: 'paypal',
            },
            createOrder: createOrder,
            onApprove: onApprove,
            onCancel: onCancel
        }).render('#paypal-button-container');
    }

    render() {
        return (
            <div className={!this.state.scriptLoaded ? 'buy-button' : ''} style={{marginTop: 15}}>
                <Script
                    url={'https://www.paypal.com/sdk/js?client-id=' + this.props.paypalKey + '&currency=' + this.props.currency + '&disable-funding=credit,card&vault=true'}
                    onCreate={() => this.setState({scriptLoaded: false})}
                    onError={() => this.setState({scriptError: false})}
                    onLoad={() => this.onScriptLoaded()}
                />
                <div className={!this.state.scriptLoaded ? "paypal-button" : ''} id="paypal-button-container">
                    {!this.state.scriptLoaded && <CircularProgress size={23} style={{margin: 6}}/>}
                </div>
            </div>
        )
    }
}