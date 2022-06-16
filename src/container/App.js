/**
 * App.js Layout Start Here
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {NotificationContainer} from 'react-notifications';
import {browserName, isChrome, isFirefox, isSafari} from 'react-device-detect';
import ReactGA from "react-ga4";
import RctThemeProvider from './RctThemeProvider';
import RctDefaultLayout from './DefaultLayout';
import AppSignIn from 'Routes/root/Signin';
import AppSignUp from 'Routes/root/signup';
import Terms from './Terms';
import ForgotPassword from 'Routes/root/ForgotPassword';
import ResetPassword from './ResetPassword';
import SendEmail from 'Routes/root/SendEmail';
import Confirm from 'Routes/root/Confirm';
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
        ReactGA.initialize('G-JHV7X81227');

        if(!isChrome && !isFirefox && !isSafari) {
            return (<Route component={ChromeError}/>);
        }
        const {isLogin, location, match} = this.props;
        if (location.pathname === '/') {
            return (<Redirect to={'/main'}/>);
            // if (!isLogin) {
            //     return (<Redirect to={'/signin'}/>);
            // } else {
            //     return (<Redirect to={'/main'}/>);
            // }
        }
        return (
            <RctThemeProvider>
                <NotificationContainer/>
                <Switch>
                    {/*<Route path={`${match.url}app`} component={RctDefaultLayout} />*/}
                    <Route path="/main" component={MainPage}/>
                    <PrivateRoute path="/test-view/:test_sets_id/:attempts_id/:test_cases_id/:is_post_test" component={AsyncAdvanceTestViewComponent} authUser={isLogin}/>
                    <Route path="/test-view/:test_sets_id/:attempts_id/:test_cases_id" component={AsyncAdvanceTestViewComponent} authUser={isLogin}/>
                    {/*<PrivateRoute path="/test-view/:test_sets_id/:attempts_id/:test_cases_id" component={AsyncAdvanceTestViewComponent} authUser={isLogin}/>*/}
                    <Route path="/video-view/:test_sets_id/:attempts_id/:test_cases_id" component={VideoView} authUser={isLogin}/>
                    <Route path="/signin" component={AppSignIn}/>
                    <Route path="/signup" component={AppSignUp}/>
                    <Route path="/plan" component={AppSignUp}/>
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
