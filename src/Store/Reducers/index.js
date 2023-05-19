/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import authUserReducer from './AuthUserReducer';
import testViewReducer from './TestViewReducer';
import testViewCompReducer from './TestViewCompReducer';

const reducers = combineReducers({
  authUser: authUserReducer,
  testView: testViewReducer,
  testViewComp: testViewCompReducer,
});

export default reducers;
