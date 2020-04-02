/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import authUserReducer from './AuthUserReducer';
import testViewReducer from './TestViewReducer';

const reducers = combineReducers({
  settings,
  authUser: authUserReducer,
  testView: testViewReducer,
});

export default reducers;
