import {combineReducers} from 'redux';
import profile from './profile';
import submit from './submit';

const reducer = combineReducers({
  profile,
  submit
});

export default reducer;
