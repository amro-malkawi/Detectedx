/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

// css
import './lib/reactifyCss';


// app component
import App from './container/App';
import ErrorBoundary from './container/ErrorBoundary';

import { configureStore } from './store';

const MainApp = () => (
	<Provider store={configureStore()}>
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<Router>
				<Switch>
					<ErrorBoundary>
						<Route path="/" component={App} />
					</ErrorBoundary>
				</Switch>
			</Router>
		</MuiPickersUtilsProvider>
	</Provider>
);

export default MainApp;
