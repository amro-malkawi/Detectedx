/**
 * Agency App
 */
import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';

// Agency layout
import RctSiteLayout from 'Components/RctSiteLayout';

// router service
import routerService from '../services/routerSiteService';

class SiteLayout extends Component {
    render() {
        const { match, location } = this.props;
        if (location.pathname === '/site') {
            return (<Redirect to={'/site/home'} />);
        }
        return (
            <RctSiteLayout>
                {routerService && routerService.map((route,key)=>
                    <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
                )}
            </RctSiteLayout>
        );
    }
}

export default withRouter(SiteLayout);
