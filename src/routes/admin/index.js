/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from "react-helmet";
// async components
import {
    AsyncClinicsComponent,
    AsyncDashboardComponent,
    AsyncImagesComponent,
    AsyncMetricsComponent,
    AsyncModalitiesComponent,
    AsyncRolesComponent,
    AsyncTestCasesComponent,
    AsyncSetAssignmentsComponent,
    AsyncTestSetCasesComponent,
    AsyncTestSetsComponent,
    AsyncUsersComponent,
    AsyncBasicTableComponent,
} from 'Components/AsyncComponent/AsyncComponent';

const Pages = ({ match }) => (
    <div className="content-wrapper">
        <Helmet>
            <title>Detectedx Admin</title>
            <meta name="description" content="admin" />
        </Helmet>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
            <Route path={`${match.url}/dashboard`} component={AsyncDashboardComponent} />
            <Route path={`${match.url}/clinics`} component={AsyncClinicsComponent} />
            <Route path={`${match.url}/images`} component={AsyncImagesComponent} />
            <Route path={`${match.url}/metrics`} component={AsyncMetricsComponent} />
            <Route path={`${match.url}/modalities`} component={AsyncModalitiesComponent} />
            <Route path={`${match.url}/roles`} component={AsyncRolesComponent} />
            <Route path={`${match.url}/testCases`} component={AsyncTestCasesComponent} />
            <Route path={`${match.url}/testSetAssignments`} component={AsyncSetAssignmentsComponent} />
            <Route path={`${match.url}/testSetCases`} component={AsyncTestSetCasesComponent} />
            <Route path={`${match.url}/testSets`} component={AsyncTestSetsComponent} />
            <Route path={`${match.url}/users`} component={AsyncUsersComponent} />
        </Switch>
    </div>
);

export default Pages;
