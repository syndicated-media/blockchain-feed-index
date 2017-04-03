import React from 'react';
import {connect} from 'react-redux';
import {login, logout} from '../ducks/profile';
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
