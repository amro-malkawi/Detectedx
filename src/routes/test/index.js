/**
 * Test Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncAdvanceTestListComponent
} from 'Components/AsyncComponent/AsyncComponent';

const Test = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route path={`${match.url}/list`} component={AsyncAdvanceTestListComponent} />
        </Switch>
    </div>
);

export default Test;
