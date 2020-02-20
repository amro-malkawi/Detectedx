/**
 * User Block Component
 */
import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu} from 'reactstrap';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as selectors from 'Selectors';


// intl messages
import IntlMessages from 'Util/IntlMessages';
import {logoutUserFromEmail} from "Actions";

class UserBlock extends Component {

    state = {
        userDropdownMenu: false,
        isSupportModal: false
    };

    /**
     * Logout User
     */
    logoutUser() {
        this.props.logoutUserFromEmail();
    }

    /**
     * Toggle User Dropdown Menu
     */
    toggleUserDropdownMenu() {
        this.setState({userDropdownMenu: !this.state.userDropdownMenu});
    }

    render() {
        return (
            <div className="user-block ml-15">
                <Dropdown
                    isOpen={this.state.userDropdownMenu}
                    toggle={() => this.toggleUserDropdownMenu()}
                    className="rct-dropdown"
                >
                    <DropdownToggle
                        tag="div"
                        className="d-flex align-items-center"
                    >
                        <div className="user-profile">
                            <span>{this.props.userName.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-info">
                            <span className="user-name">{this.props.userName}</span>
                            <i className="zmdi zmdi-chevron-down dropdown-icon"/>
                        </div>
                    </DropdownToggle>
                    <DropdownMenu>
                        <ul className="list-unstyled mb-0">
                            <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
                                <p className="text-white mb-0 fs-14">{this.props.userName}</p>
                                <span className="text-white fs-14">{this.props.userEmail}</span>
                            </li>
                            <li>
                                <Link
                                    to={{
                                        pathname: '/app/test/profile',
                                        state: {activeTab: 0}
                                    }}
                                    onClick={() => this.setState({userDropdownMenu: false})}
                                >
                                    <i className="zmdi zmdi-account text-primary mr-3"/>
                                    <IntlMessages id="widgets.profile"/>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/app/test"
                                    onClick={() => this.setState({userDropdownMenu: false})}
                                >
                                    <i className="zmdi zmdi-edit text-warning mr-3"/>
                                    <span>Modules</span>
                                </Link>
                            </li>
                            <li className="border-top">
                                <a onClick={() => this.logoutUser()}>
                                    <i className="zmdi zmdi-power text-danger mr-3"/>
                                    <span>Log out</span>
                                </a>
                            </li>
                        </ul>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = (state) => ({
    user: selectors.getUser(state),
    userName: selectors.getUserName(state),
    userEmail: selectors.getUserEmail(state),
});

export default connect(mapStateToProps, {
    logoutUserFromEmail
})(UserBlock);
