/**
 * App Header
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {CollectionsBookmark, Info, Subscriptions} from '@material-ui/icons';
import {Link} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';
import {collapsedSidebarAction} from 'Actions';
import {getAppLayout} from "Helpers/helpers";
import UserInfo from './UserInfo';
import LanguageProvider from "./LanguageProvider";
import InstructionModal from "Routes/test-view/InstructionModal";
import PaymentModal from "Components/Payment/PaymentModal";
import IntlMessages from "Util/IntlMessages";
import AppConfig from "Constants/AppConfig";
import UserBlock from "Components/Header/UserBlock";
import * as selectors from "Selectors";

class Header extends Component {

    state = {
        showModalType: '',
        isShowDrawer: false,
        isShowInstructionModal: false,
        isShowSubscriptionPlanModal: false,
    };

    // function to change the state of collapsed sidebar
    onToggleNavCollapsed = (event) => {
        const val = !this.props.navCollapsed;
        this.props.collapsedSidebarAction(val);
    }

    render() {
        const {location} = this.props;
        return (
            <AppBar position="static" className="rct-header app-wrapper">
                <Toolbar className="d-flex justify-content-between w-100 pl-0 main-header">
                    <div className="d-flex align-items-center">
                        <div className="site-logo">
                            <a href="https://www.detectedx.com" className="logo-mini">
                                <img src={require('Assets/img/white-logo.png')} className="mr-15" alt="site logo" width="115" height="35"/>
                            </a>
                        </div>
                    </div>
                    {
                        this.props.isLogin ?
                            <ul className="navbar-right list-inline mb-0">
                                <li className="list-inline-item">
                                    <Button component={Link} to={`/${getAppLayout(location)}/test`} variant="contained" className="upgrade-btn tour-step-4 text-white mr-20" color="primary">
                                        <IntlMessages id={"header.home"}/>
                                    </Button>
                                </li>
                                <li className="list-inline-item">
                                    <UserBlock/>
                                </li>
                            </ul> :
                            <ul className="navbar-right list-inline mb-0">
                                <li className="list-inline-item">
                                    <Button component={Link} to={`/signin`} className="text-white mr-10" color="primary">
                                        <IntlMessages id={"user.signin"}/>
                                    </Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button component={Link} to={`/signup`} className="text-white mr-20" color="primary">
                                        <IntlMessages id={"user.signup"}/>
                                    </Button>
                                </li>
                            </ul>
                    }
                </Toolbar>
                <InstructionModal
                    isOpen={this.state.showModalType === 'instructions'}
                    toggle={() => this.setState({showModalType: ''})}
                    theme={'white'}
                />
            </AppBar>
        );
    }
}

// map state to props
const mapStateToProps = (state) => ({
    settings: state.settings,
    isLogin: selectors.getIsLogin(state),
});

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction
})(Header));
