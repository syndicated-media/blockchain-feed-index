import React from 'react';
import {connect} from 'react-redux';
import {login, launchAuth0Login, logout} from '../ducks/profile';
import Login from './login';

const mapStateToProps = (state) => {
  return {
    profile: state.profile
  };
}

const mapDispatchToProps  = (dispatch) => {
  return {
    onLogin: () => {
      dispatch(login());
      launchAuth0Login();
    },
    onLogout: () => {
      dispatch(logout());
    }
  };
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;
