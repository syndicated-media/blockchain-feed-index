import {combineReducers} from 'redux';
import profile from './profile';
import submit from './submit';
import feeds from './feeds';

const reducer = combineReducers({
  profile,
  submit,
  feeds
});

export default reducer;
