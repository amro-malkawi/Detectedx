/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

// actions
import { collapsedSidebarAction } from 'Actions';
// helpers
import { getAppLayout } from "Helpers/helpers";

import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import Cart from './Cart';

import UserInfo from './UserInfo';
import Logout from './Logout';
import InstructionModal from "Routes/test-view/InstructionModal";

class Header extends Component {

   state = {
      customizer: false,
      isMobileSearchFormVisible: false,
      isShowInstructionModal: false,
   }

   // function to change the state of collapsed sidebar
   onToggleNavCollapsed = (event) => {
      const val = !this.props.navCollapsed;
      this.props.collapsedSidebarAction(val);
   }

   // open dashboard overlay
   openDashboardOverlay() {
      $('.dashboard-overlay').toggleClass('d-none');
      $('.dashboard-overlay').toggleClass('show');
      if ($('.dashboard-overlay').hasClass('show')) {
         $('body').css('overflow', 'hidden');
      } else {
         $('body').css('overflow', '');
      }
   }

   // close dashboard overlay
   closeDashboardOverlay() {
      $('.dashboard-overlay').removeClass('show');
      $('.dashboard-overlay').addClass('d-none');
      $('body').css('overflow', '');
   }

   // toggle screen full
   toggleScreenFull() {
      screenfull.toggle();
   }

   // mobile search form
   openMobileSearchForm() {
      this.setState({ isMobileSearchFormVisible: true });
   }

   render() {
      const { isMobileSearchFormVisible } = this.state;
      $('body').click(function () {
         $('.dashboard-overlay').removeClass('show');
         $('.dashboard-overlay').addClass('d-none');
         $('body').css('overflow', '');
      });
      const { horizontalMenu, agencyMenu, location } = this.props;
      return (
         <AppBar position="static" className="rct-header">
            <Toolbar className="d-flex justify-content-between w-100 pl-0">
               <div className="d-flex align-items-center">
                  {(horizontalMenu || agencyMenu) &&
                     <div className="site-logo">
                        <Link to="/" className="logo-mini">
                           <img src={require('Assets/img/white-logo.png')} className="mr-15" alt="site logo" width="115" height="35" />
                        </Link>
                     </div>
                  }
                  {!agencyMenu &&
                     <ul className="list-inline mb-0 navbar-left">
                        {!horizontalMenu ?
                           <li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
                              <Tooltip title="Sidebar Toggle" placement="bottom">
                                 <IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
                                    <MenuIcon />
                                 </IconButton>
                              </Tooltip>
                           </li> :
                           <li className="list-inline-item">
                              <Tooltip title="Sidebar Toggle" placement="bottom">
                                 <IconButton color="inherit" aria-label="Menu" className="humburger p-0" component={Link} to="/">
                                    <i className="ti-layout-sidebar-left"></i>
                                 </IconButton>
                              </Tooltip>
                           </li>
                        }
                     </ul>
                  }
               </div>
               <ul className="navbar-right list-inline mb-0">
                  <li className="list-inline-item">
                     <Tooltip title="Tests" placement="bottom">
                        <Button component={Link} to={`/${getAppLayout(location)}/test`} variant="contained" className="upgrade-btn tour-step-4 text-white" color="primary">
                           Modules
                        </Button>
                     </Tooltip>
                  </li>
                  <li className="list-inline-item">
                     <Tooltip title="Instructions" placement="bottom">
                        {/*<Button component={Link} to={`/${getAppLayout(location)}/instructions`} variant="contained" className="upgrade-btn tour-step-4 text-white" color="primary">*/}
                        <Button onClick={() => this.setState({isShowInstructionModal: true})} variant="contained" className="upgrade-btn tour-step-4 text-white" color="primary">
                           Instructions
                        </Button>
                     </Tooltip>
                  </li>
                  <UserInfo />
                  <Logout />
               </ul>
            </Toolbar>
            <DashboardOverlay
               onClose={() => this.closeDashboardOverlay()}
            />
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
const mapStateToProps = ({ settings }) => {
   return settings;
};

export default withRouter(connect(mapStateToProps, {
   collapsedSidebarAction
})(Header));
