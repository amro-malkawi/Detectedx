/**
 * Test Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainLayout from "Components/MainLayout";
import HomeComponent from './home';
import ProfileComponent from './profile';

const Test = ({ match }) => (
    <MainLayout>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
            <Route path={`${match.url}/home`} component={HomeComponent} />
            <Route path={`${match.url}/profile`} component={ProfileComponent} />
        </Switch>
    </MainLayout>
);

export default Test;
