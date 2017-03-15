import React, {PropTypes} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import Landing from './components/landing';
import Login from './components/login';

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={Landing}/>
        <Route path="/login" component={Login}/>
        <Route path="*" component={Landing}/>
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
