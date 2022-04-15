/**
 * App.js Layout Start Here
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {NotificationContainer} from 'react-notifications';
import {browserName, isChrome, isFirefox} from 'react-device-detect';
import RctThemeProvider from './RctThemeProvider';
import RctDefaultLayout from './DefaultLayout';
import AppSignIn from 'Routes/user/Signin';
import AppSignUp from 'Routes/user/signup';
import Terms from './Terms';
import ForgotPassword from 'Routes/user/ForgotPassword';
import ResetPassword from './ResetPassword';
import SendEmail from 'Routes/user/SendEmail';
import Confirm from 'Routes/user/Confirm';
import NoMatch from './NoMatch';
import VideoView from 'Routes/test-view/VideoView';
import MainPage from 'Routes/main';
import ChromeError from './ChromeError';

// async components
import {
    AsyncAdvanceTestViewComponent,
} from 'Components/AsyncComponent/AsyncComponent';
import * as selectors from "Selectors";




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
        if(browserName !== 'Chrome' && browserName !== 'Firefox' && browserName !== 'Edge') {
            return (<Route component={ChromeError}/>);
        }
        const {isLogin, location, match} = this.props;
        if (location.pathname === '/') {
            if (!isLogin) {
                return (<Redirect to={'/signin'}/>);
                // return (<Redirect to={'/site/home'}/>);
            } else {
                return (<Redirect to={'/main'}/>);
                // return (<Redirect to={'/site/home'}/>);
            }
        }
        return (
            <RctThemeProvider>
                <NotificationContainer/>
                <Switch>
                    <PrivateRoute
                        path={`${match.url}app`}
                        authUser={isLogin}
                        component={RctDefaultLayout}
                    />
                    <PrivateRoute path="/test-view/:test_sets_id/:attempts_id/:test_cases_id/:is_post_test" component={AsyncAdvanceTestViewComponent} authUser={isLogin}/>
                    <PrivateRoute path="/test-view/:test_sets_id/:attempts_id/:test_cases_id" component={AsyncAdvanceTestViewComponent} authUser={isLogin}/>
                    <PrivateRoute path="/video-view/:test_sets_id/:attempts_id/:test_cases_id" component={VideoView} authUser={isLogin}/>
                    <PrivateRoute path="/main" component={MainPage} authUser={isLogin}/>
                    <Route path="/signin" component={AppSignIn}/>
                    <Route path="/signup" component={AppSignUp}/>
                    <Route path="/terms" component={Terms}/>
                    <Route path="/forgot-password" component={ForgotPassword}/>
                    <Route path="/reset-password" component={ResetPassword}/>
                    <Route path="/users/send-email/:user_id" component={SendEmail}/>
                    <Route path="/users/confirm" component={Confirm}/>
                    <Route component={NoMatch}/>
                </Switch>
            </RctThemeProvider>
        );
    }
}

// map state to props
const mapStateToProps = (state) => ({
    isLogin: selectors.getIsLogin(state),
});

export default connect(mapStateToProps)(App);
