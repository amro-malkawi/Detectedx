import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';

class PaypalButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showButton: false,
        };
        window.React = React;
        window.ReactDOM = ReactDOM;
    }

    componentDidMount() {
        const {
            isScriptLoaded,
            isScriptLoadSucceed
        } = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {
            this.setState({showButton: true});
        }
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
                this.setState({showButton: true});
            }
        }
    }

    render() {
        const {total, currency, env, commit, client, onPayment, onAuthorize, onSuccess, onError, onCancel,} = this.props;
        const {showButton} = this.state;
        return (
            <div className={'buy-button'} style={{marginTop: 32}}>
                {showButton && <paypal.Button.react
                    env={env}
                    client={client}
                    commit={commit}
                    style={{
                        size: 'responsive',
                        color: 'black',
                        shape: 'rect',
                        label: 'paypal',
                        tagline: 'false'
                    }}
                    payment={onPayment}
                    onAuthorize={onAuthorize}
                    onCancel={onCancel}
                    onError={onError}
                />}
            </div>
        );
    }
}

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);