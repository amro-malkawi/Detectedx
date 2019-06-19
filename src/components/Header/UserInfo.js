/**
 * Cart Component
 */
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from "react-router-dom";

//Helper
import { textTruncate, getAppLayout } from "Helpers/helpers";

//Actions
import { deleteItemFromCart } from "Actions";

//intl Messages
import IntlMessages from 'Util/IntlMessages';

class UserInfo extends Component {

    //Get Total Price
    getTotalPrice() {
        const { cart } = this.props;
        let totalPrice = 0;
        for (const item of cart) {
            totalPrice += item.totalPrice
        }
        return totalPrice.toFixed(2);
    }

    //Is Cart Empty
    isCartEmpty() {
        const { cart } = this.props;
        if (cart.length === 0) {
            return true;
        }
    }

    render() {
        const { cart, deleteItemFromCart, location } = this.props;
        return (
            <UncontrolledDropdown nav className="list-inline-item cart-dropdown">
                <DropdownToggle nav className="p-0">
                    <Tooltip title="User Info" placement="bottom">
                        <IconButton aria-label="bag">
                            <i className="zmdi zmdi-account"></i>
                        </IconButton>
                    </Tooltip>
                </DropdownToggle>
            </UncontrolledDropdown>
        )
    }
}

// map state to props
const mapStateToProps = ({ ecommerce }) => {
    const { cart } = ecommerce;
    return { cart };
}

export default withRouter(connect(mapStateToProps, {
    deleteItemFromCart
})(UserInfo));
