/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import authUserReducer from './AuthUserReducer';
import testViewReducer from './TestViewReducer';
import testViewCompReducer from './TestViewCompReducer';

const reducers = combineReducers({
  settings,
  authUser: authUserReducer,
  testView: testViewReducer,
  testViewComp: testViewCompReducer,
});

export default reducers;
