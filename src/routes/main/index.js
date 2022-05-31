/**
 * Test Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from "../../container/PrivateRoute";
import MainLayout from "Components/MainLayout";
import HomeComponent from './home';
import ProfileComponent from './profile';
import AttemptComponent from './attempt';

const Test = ({ match }) => (
    <MainLayout>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
            <Route path={`${match.url}/home`} component={HomeComponent} />
            <PrivateRoute path={`${match.url}/profile`} component={ProfileComponent} />
            <PrivateRoute path={`${match.url}/attempt/:attempt_id/:step`} component={AttemptComponent} />
            <PrivateRoute path={`${match.url}/attempt/:attempt_id`} component={AttemptComponent} />
        </Switch>
    </MainLayout>
);

export default Test;
