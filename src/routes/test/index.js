/**
 * Test Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncAdvanceTestListComponent,
    AsyncAdvanceTestCompleteListComponent,
    AsyncAdvanceTestQuestionnaireComponent,
} from 'Components/AsyncComponent/AsyncComponent';

const Test = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
            <Route path={`${match.url}/list`} component={AsyncAdvanceTestListComponent} />
            <Route path={`${match.url}/complete-list/:attempt_id`} component={AsyncAdvanceTestCompleteListComponent} />
            <Route path={`${match.url}/questionnaire/:attempt_id`} component={AsyncAdvanceTestQuestionnaireComponent} />
        </Switch>
    </div>
);

export default Test;
