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
import Logout from './Logout';
import LanguageProvider from "./LanguageProvider";
import InstructionModal from "Routes/test-view/InstructionModal";
import PaymentModal from "Components/Payment/PaymentModal";
import IntlMessages from "Util/IntlMessages";
import AppConfig from "Constants/AppConfig";
import UserBlock from "Components/Header/UserBlock";

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

    // close dashboard overlay
    closeDashboardOverlay() {
        $('.dashboard-overlay').removeClass('show');
        $('.dashboard-overlay').addClass('d-none');
        $('body').css('overflow', '');
    }

    render() {
        $('body').click(function () {
            $('.dashboard-overlay').removeClass('show');
            $('.dashboard-overlay').addClass('d-none');
            $('body').css('overflow', '');
        });
        const {horizontalMenu, agencyMenu, location} = this.props;
        return (
            <AppBar position="static" className="rct-header app-wrapper">
                <Toolbar className="d-flex justify-content-between w-100 pl-0 main-header">
                    <div className="d-flex align-items-center">
                        <div className="site-logo">
                            <Link to="/" className="logo-mini">
                                <img src={require('Assets/img/white-logo.png')} className="mr-15" alt="site logo" width="115" height="35"/>
                            </Link>
                        </div>
                        {/*<li className="list-inline-item menu-icon" onClick={(e) => this.setState({showModalType: 'drawer'})}>*/}
                        {/*    <IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">*/}
                        {/*        <MenuIcon fontSize={'small'}/>*/}
                        {/*    </IconButton>*/}
                        {/*</li>*/}
                    </div>
                    <ul className="navbar-right list-inline mb-0">
                        <li className="list-inline-item">
                            <Button component={Link} to={`/${getAppLayout(location)}/test`} variant="contained" className="upgrade-btn tour-step-4 text-white mr-20" color="primary">
                                <IntlMessages id={"header.home"}/>
                            </Button>
                        </li>
                        {/*<li className="list-inline-item">*/}
                        {/*    <Button onClick={() => this.setState({showModalType: 'instructions'})} variant="contained" className="upgrade-btn tour-step-4 text-white" color="primary">*/}
                        {/*        <IntlMessages id={"header.instructions"}/>*/}
                        {/*    </Button>*/}
                        {/*</li>*/}
                        {/*<li className="list-inline-item">*/}
                        {/*    <Button onClick={() => this.setState({showModalType: 'subscribe'})} variant="contained" className="upgrade-btn tour-step-4 text-white" color="primary">*/}
                        {/*        <IntlMessages id={"header.subscribe"}/>*/}
                        {/*    </Button>*/}
                        {/*</li>*/}
                        {/*<LanguageProvider/>*/}
                        {/*<UserInfo history={this.props.history}/>*/}
                        {/*<Logout/>*/}
                        <li className="list-inline-item">
                            <UserBlock />
                        </li>
                    </ul>
                </Toolbar>
                {/*<Drawer*/}
                {/*    anchor="left"*/}
                {/*    open={this.state.showModalType === 'drawer'}*/}
                {/*    onClose={() => this.setState({showModalType: ''})}*/}
                {/*>*/}
                {/*    <div className="mt-30 ml-15">*/}
                {/*        <Link to="/" className="logo-mini">*/}
                {/*            <img src={AppConfig.appLogo} alt="session-logo" width="120" height="29"/>*/}
                {/*        </Link>*/}
                {/*    </div>*/}
                {/*    <List className={'pt-30'}>*/}
                {/*        <ListItem button onClick={() => {this.setState({showModalType: ''}); this.props.history.push(`/${getAppLayout(location)}/test`);}}>*/}
                {/*            <ListItemIcon><CollectionsBookmark/></ListItemIcon>*/}
                {/*            <ListItemText primary={<IntlMessages id={"header.modules"}/>}/>*/}
                {/*        </ListItem>*/}
                {/*        <ListItem button onClick={() => this.setState({showModalType: 'instructions'})}>*/}
                {/*            <ListItemIcon><Info/></ListItemIcon>*/}
                {/*            <ListItemText primary={<IntlMessages id={"header.instructions"}/>}/>*/}
                {/*        </ListItem>*/}
                {/*        <ListItem button onClick={() => this.setState({showModalType: 'subscribe'})}>*/}
                {/*            <ListItemIcon><Subscriptions/></ListItemIcon>*/}
                {/*            <ListItemText primary={<IntlMessages id={"header.subscribe"}/>}/>*/}
                {/*        </ListItem>*/}
                {/*    </List>*/}
                {/*</Drawer>*/}
                <InstructionModal
                    isOpen={this.state.showModalType === 'instructions'}
                    toggle={() => this.setState({showModalType: ''})}
                    theme={'white'}
                />
                {
                    this.state.showModalType === 'subscribe' &&
                    <PaymentModal
                        type={'planSubscribe'}
                        onFinish={() => {
                            this.setState({showModalType: ''});
                            window.location.reload();
                        }}
                        onClose={() => {
                            this.setState({showModalType: ''})
                        }}
                    />
                }
            </AppBar>
        );
    }
}

// map state to props
const mapStateToProps = ({settings}) => {
    return settings;
};

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction
})(Header));
