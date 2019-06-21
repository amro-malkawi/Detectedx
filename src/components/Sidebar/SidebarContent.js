/**
 * Sidebar Content
 */
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import IntlMessages from 'Util/IntlMessages';

import NavMenuItem from './NavMenuItem';

// redux actions
import { onToggleMenu } from 'Actions';

class SidebarContent extends Component {

	toggleMenu(menu, stateCategory) {
		let data = {
			menu,
			stateCategory
		}
		this.props.onToggleMenu(data);
	}

	render() {
		const { sidebarMenus } = this.props.sidebar;
		return (
			<div className="rct-sidebar-nav">
					<nav className="navigation">
					<List
						className="rct-mainMenu p-0 m-0 list-unstyled"
					>
					</List>
				</nav>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ sidebar, settings }) => {
	return { sidebar, settings };
};

export default withRouter(connect(mapStateToProps, {
    onToggleMenu
})(SidebarContent));
