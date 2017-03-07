import React from 'react';
import {Router, Route, Link, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import Landing from './components/landing';
import Login from './components/login';
import store from '../store';

export default React.createClass({
  render () {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={Landing}/>
          <Route path="/login" component={Login}/>
          <Route path="*" component={Landing}/>
        </Router>
      </Provider>
    );
  }
});
