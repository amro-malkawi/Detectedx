/**
 * News App
 */
import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';

// Agency layout
import RctAgencyLayout from 'Components/RctAgencyLayout';

// router service
import routerService from '../services/routerAppService';

class RctNewsApp extends Component {
	render() {
		const { match, location } = this.props;
		if (location.pathname === '/app') {
			// return (<Redirect to={'/app/welcome'} />);
			return (<Redirect to={'/app/test/list'} />);
		}
		return (
			<RctAgencyLayout enableBgImage>
				{routerService && routerService.map((route,key)=>
					<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
				)}
			</RctAgencyLayout>
		);
	}
}

export default withRouter(RctNewsApp);
