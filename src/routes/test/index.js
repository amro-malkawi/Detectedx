/**
 * Test Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from "../../container/PrivateRoute";
import {
    AsyncAdvanceTestListComponent,
    AsyncAdvanceTestCompleteListComponent,
    AsyncAdvanceTestAttemptComponent,
    AsyncAdvanceProfileComponent,
} from 'Components/AsyncComponent/AsyncComponent';

const Test = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route path={`${match.url}/list`} component={AsyncAdvanceTestListComponent} />
            <PrivateRoute path={`${match.url}/complete-list/:test_set_id`} component={AsyncAdvanceTestCompleteListComponent} />
            <PrivateRoute path={`${match.url}/attempt/:attempt_id/:step`} component={AsyncAdvanceTestAttemptComponent} />
            <PrivateRoute path={`${match.url}/attempt/:attempt_id`} component={AsyncAdvanceTestAttemptComponent} />
            <PrivateRoute path={`${match.url}/profile`} component={AsyncAdvanceProfileComponent} />
        </Switch>
    </div>
);

export default Test;
