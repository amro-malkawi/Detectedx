/**
 * App.js Layout Start Here
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {NotificationContainer} from 'react-notifications';

// rct theme provider
import RctThemeProvider from './RctThemeProvider';

//Main App
import RctDefaultLayout from './DefaultLayout';

// app signin
import AppSignIn from './Signin';
import AppSignUp from './Signup';
import SendEmail from 'Routes/user/SendEmail';
import Confirm from 'Routes/user/Confirm';
import NoMatch from 'Routes/no-match';

// async components
import {
    AsyncSessionLockScreenComponent,
    AsyncSessionForgotPasswordComponent,
    AsyncSessionPage404Component,
    AsyncSessionPage500Component,
    AsyncTermsConditionComponent,
    AsyncAdvanceTestViewComponent,
} from 'Components/AsyncComponent/AsyncComponent';




/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const PrivateRoute = ({component: Component, ...rest, authUser}) =>
    <Route
        {...rest}
        render={props =>
            authUser
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/signin',
                        state: {from: props.location}
                    }}
                />}
    />;

class App extends Component {
    render() {
        const {location, match, user} = this.props;
        if (location.pathname === '/') {
            if (user === null) {
                return (<Redirect to={'/signin'}/>);
            } else {
                // return (<Redirect to={'/app/home'} />);
                return (<Redirect to={'/app/test/list'}/>);
            }
        }
        return (
            <RctThemeProvider>
                <NotificationContainer/>
                <Switch>
                    <PrivateRoute
                        path={`${match.url}app`}
                        authUser={user}
                        component={RctDefaultLayout}
                    />
                    <PrivateRoute path="/test-view/:test_sets_id/:attempts_id/:test_cases_id/:is_post_test" component={AsyncAdvanceTestViewComponent} authUser={user}/>
                    <PrivateRoute path="/test-view/:test_sets_id/:attempts_id/:test_cases_id" component={AsyncAdvanceTestViewComponent} authUser={user}/>
                    <Route path="/signin" component={AppSignIn}/>
                    <Route path="/signup" component={AppSignUp}/>
                    <Route path="/users/send-email/:user_id" component={SendEmail}/>
                    <Route path="/users/confirm" component={Confirm}/>
                    <Route component={NoMatch}/>
                </Switch>
            </RctThemeProvider>
        );
    }
}

// map state to props
const mapStateToProps = ({authUser}) => {
    const {user} = authUser;
    return {user};
};

export default connect(mapStateToProps)(App);
