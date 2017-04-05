import React, {PropTypes} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import Landing from './components/landing';
import Login from './components/login';
import Profile from './components/profile';
import Store from '../store';

const requireAuth = (nextState, replace) => {
  let {profile} = Store.getState();
  if (!(profile.loggingIn || profile.authenticated)) {
    replace({pathname: '/login'});
  }
}

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Landing}/>
        <Route path="/login" component={Login}/>
        <Route path="/authenticate" component={Profile} />
        <Route path="/profile" component={Profile} onEnter={requireAuth}/>
        <Route path="*" component={Landing}/>
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
