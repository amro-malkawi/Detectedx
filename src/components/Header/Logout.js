/**
 * Cart Component
 */
import React, { Component, Fragment } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from "react-router-dom";

//Actions
import {logoutUserFromEmail} from "Actions";

class Logout extends Component {

    logoutUser() {
        this.props.logoutUserFromEmail();
    }

    render() {
        const { cart, location } = this.props;
        return (
            <UncontrolledDropdown nav className="list-inline-item cart-dropdown">
                <DropdownToggle nav className="p-0" onClick={() => this.logoutUser()}>
                    <Tooltip title="Logout" placement="bottom">
                        <IconButton aria-label="bag">
                            <i className="zmdi zmdi-power"></i>
                        </IconButton>
                    </Tooltip>
                </DropdownToggle>
            </UncontrolledDropdown>
        )
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    return settings;
}

export default withRouter(connect(mapStateToProps, {
    logoutUserFromEmail
})(Logout));
