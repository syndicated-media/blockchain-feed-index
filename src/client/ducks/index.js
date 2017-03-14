import {combineReducers} from 'redux';
import profile from './profile';
import submitFeeds from './submit-feeds';

const reducer = combineReducers({
  profile,
  submitFeeds
});

export default reducer;
