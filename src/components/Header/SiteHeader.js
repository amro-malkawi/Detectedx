/**
 * App Header
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import * as selectors from 'Selectors';

// helpers
import {getAppLayout} from "Helpers/helpers";
import UserBlock from "./UserBlock";
import InstructionModal from "Routes/test-view/InstructionModal";

class SiteHeader extends Component {

    state = {
        customizer: false,
        isMobileSearchFormVisible: false,
        isShowInstructionModal: false,
        navList: [
            {
                path: 'home',
                label: 'Home'
            },
            {
                path: 'news',
                label: 'News'
            },
            {
                path: 'platform',
                label: 'Platform'
            },
            {
                path: 'pricing',
                label: 'Pricing'
            },
            {
                path: 'about_us',
                label: 'About Us'
            },
            {
                path: 'contact_us',
                label: 'Contact Us'
            },
        ]
    };

    renderNavButton(navInfo) {
        const className = "nav-button " + (this.props.location.pathname === `/${getAppLayout(this.props.location)}/${navInfo.path}` ? 'active' : '');
        return (
            <li className="list-inline-item" key={navInfo.path}>
                <div className={'nav-button-container'}>
                    <Button component={Link} to={`/${getAppLayout(this.props.location)}/${navInfo.path}`} variant="contained" className={className}>
                        {navInfo.label}
                    </Button>
                </div>
            </li>
        );
    }

    renderNavBar() {
        if(!this.props.isLogin) {
            return (
                <ul className="navbar-right list-inline mb-0">
                    {
                        this.state.navList.map((v, i) => this.renderNavButton(v))
                    }
                    <li className="list-inline-item">
                        <div className={'nav-button-container'}>
                            <Button component={Link} to={'/signin'} variant="contained" className={'nav-button'}>
                                Login/Register
                            </Button>
                        </div>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="navbar-right list-inline mb-0">
                    {
                        this.state.navList.map((v, i) => this.renderNavButton(v))
                    }
                    <li className="list-inline-item">
                        <UserBlock />
                    </li>
                </ul>
            )
        }
        /*return (
            <ul className="navbar-right list-inline mb-0">
                {
                    this.state.navList.map((v, i) => this.renderNavButton(v))
                }
                <UserInfo history={this.props.history}/>
                <Logout/>
            </ul>
        )*/
    }

    render() {
        return (
            <AppBar position="static" className="rct-header">
                <Toolbar className="d-flex justify-content-between w-100 pl-0">
                    <div className="d-flex align-items-center">
                        <div className="site-logo">
                            <Link to="/" className="logo-mini">
                                <img src={require('Assets/img/site-logo.png')} className="mr-15" alt="site logo" width="209" height="44"/>
                            </Link>
                        </div>
                    </div>
                    {
                        this.renderNavBar()
                    }
                </Toolbar>
                <InstructionModal
                    isOpen={this.state.isShowInstructionModal}
                    toggle={() => this.setState({isShowInstructionModal: false})}
                    theme={'white'}
                />
            </AppBar>
        );
    }
}

// map state to props
const mapStateToProps = (state) => ({
    isLogin: selectors.getIsLogin(state),
});

export default withRouter(connect(mapStateToProps, {
})(SiteHeader));
