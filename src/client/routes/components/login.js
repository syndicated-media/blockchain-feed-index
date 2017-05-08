import React from 'react';
import LoginContainer from '../../components/login-container';

export default class LoginView extends React.Component {
  render () {
    return (
      <div>
        <div style={{textAlign: "center"}}>You need to login to manage your feeds</div>
        <LoginContainer/>
      </div>
    );
  }
}
