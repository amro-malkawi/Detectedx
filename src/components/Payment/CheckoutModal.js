import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Dialog} from "@material-ui/core";
import Checkout from './Checkout';
import PropTypes from "prop-types";

export default class CheckoutModal extends Component {

    static propTypes = {
        productPrice: PropTypes.number.isRequired,
        productCurrency: PropTypes.string.isRequired,
        productName: PropTypes.string,
        isOpen: PropTypes.bool.isRequired,
        onStripeOrder: PropTypes.func.isRequired,
        onPaypalOrderCreate: PropTypes.func.isRequired,
        onPaypalOrderApprove: PropTypes.func.isRequired,
        onFinish: PropTypes.func,
        onClose: PropTypes.func.isRequired,
    };

    static defaultProps = {
        productPrice: 0,
        productCurrency: 'AUD',
        productName: '',
        onFinish: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {
            isOpen,
            onClose,
        } = this.props;
        return (
            <FullDialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title" maxWidth='md' fullWidth style={{container: {height: '100%'}}}>
                <Checkout
                    productPrice={this.props.productPrice}
                    productCurrency={this.props.productCurrency}
                    productName={this.props.productName}
                    userName={this.props.userName}
                    userEmail={this.props.userEmail}
                    onStripeOrder={this.props.onStripeOrder}
                    onPaypalOrderCreate={this.props.onPaypalOrderCreate}
                    onPaypalOrderApprove={this.props.onPaypalOrderApprove}
                    onFinish={this.props.onFinish}
                />
            </FullDialog>
        );
    }

}

const FullDialog = withStyles(theme => ({
    paper: {
        height: 570,
        maxWidth: 1100
    }
}))(Dialog);