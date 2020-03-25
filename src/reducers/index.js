/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import sidebarReducer from './SidebarReducer';
import authUserReducer from './AuthUserReducer';
import testViewReducer from './TestViewReducer';

const reducers = combineReducers({
  settings,
  sidebar: sidebarReducer,
  authUser: authUserReducer,
  testView: testViewReducer,
});

export default reducers;
