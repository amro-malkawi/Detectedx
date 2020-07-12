/**
 * Main App
 */
import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MomentUtils from '@date-io/moment';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import GoogleAnalyticsTracker from './services/googleAnalytics';
import {PersistGate} from 'redux-persist/integration/react';
import './lib/reactifyCss';
import App from './container/App';
import ErrorBoundary from './container/ErrorBoundary';

import {configureStore} from './store';

const {store, persistor} = configureStore();

const MainApp = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Router>
                    <Switch>
                        <ErrorBoundary>
                            <Route path="/" component={GoogleAnalyticsTracker(App)}/>
                        </ErrorBoundary>
                    </Switch>
                </Router>
            </MuiPickersUtilsProvider>
        </PersistGate>
    </Provider>
);

export default MainApp;
