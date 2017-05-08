import React from 'react';

export default class Login extends React.Component {
  render () {
    let {authenticated} = this.props.profile;
    let onClick = authenticated ? this.props.onLogout : this.props.onLogin;
    let label = authenticated ? 'Logout' : 'Login';
    let title = authenticated ? '' : <div>Login to manage your feeds</div>

    return (
      <div className="login">
        <div className="login-inner">
          <div className="separator"></div>
          {title}
          <button type="button" onClick={onClick}>{label}</button>
        </div>
      </div>
    );
  }
}
