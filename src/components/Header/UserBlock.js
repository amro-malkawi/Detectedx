/**
 * User Block Component
 */
import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal} from 'reactstrap';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as selectors from 'Selectors';


// intl messages
import IntlMessages from 'Util/IntlMessages';
import {logoutUserFromEmail} from "Actions";
import LanguageProvider from "Components/Header/LanguageProvider";
import PaymentModal from "Components/Payment/PaymentModal";

class UserBlock extends Component {

    state = {
        userDropdownMenu: false,
        isSupportModal: false,
        isShowSubscriptionModal: false,
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

    onFinishSubscribe() {
        this.setState({isShowSubscriptionModal: false});
        window.location.reload();
    }

    render() {
        return (
            <div className="user-block mr-15">
                <Dropdown
                    isOpen={this.state.userDropdownMenu}
                    toggle={() => this.toggleUserDropdownMenu()}
                    className="rct-dropdown"
                    direction={'down'}
                >
                    <DropdownToggle
                        tag="div"
                        className="d-flex align-items-center"
                    >
                        <div className="user-profile">
                            <span>{this.props.userName === undefined ? '' : this.props.userName.charAt(0).toUpperCase()}</span>
                        </div>
                    </DropdownToggle>
                    <DropdownMenu>
                        <ul className="list-unstyled mb-0">
                            <li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
                                <p className="text-white mb-0 fs-14">{this.props.userName}</p>
                                <p className="text-white fs-14">{this.props.userEmail}</p>
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
                                    <span><IntlMessages id={'header.modules'}/></span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/app/test"
                                    onClick={() => this.setState({isShowSubscriptionModal: true, userDropdownMenu: false})}
                                >
                                    <SubscriptionsIcon style={{fontSize: 11.5, marginRight: 15, color: 'red'}}/>
                                    <span><IntlMessages id={'header.subscribe'}/></span>
                                </Link>
                        </li>

                            <LanguageProvider/>
                            <DropdownItem divider />
                            <li className="border-top">
                                <a onClick={() => this.logoutUser()}>
                                    <i className="zmdi zmdi-power text-danger mr-3"/>
                                    <span><IntlMessages id={'header.logout'}/></span>
                                </a>
                            </li>
                        </ul>
                    </DropdownMenu>
                </Dropdown>
                {
                    this.state.isShowSubscriptionModal &&
                    <PaymentModal
                        type={'planSubscribe'}
                        onFinish={() => this.onFinishSubscribe()}
                        onClose={() => this.setState({isShowSubscriptionModal: false})}
                    />
                }
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
