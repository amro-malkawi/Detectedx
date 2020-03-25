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

export default class UserInfo extends Component {

    userProfile() {
        this.props.history.push('/app/test/profile');
    }

    render() {
        return (
            <UncontrolledDropdown nav className="list-inline-item cart-dropdown">
                <DropdownToggle nav className="p-0" onClick={() => this.userProfile()}>
                    <Tooltip title="User Info" placement="bottom">
                        <IconButton aria-label="bag">
                            <i className="zmdi zmdi-account"/>
                        </IconButton>
                    </Tooltip>
                </DropdownToggle>
            </UncontrolledDropdown>
        )
    }
}