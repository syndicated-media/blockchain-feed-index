import React from 'react';

export default class Login extends React.Component {
  render () {
    let {authenticated} = this.props.profile;
    let onClick = authenticated ? this.props.onLogout : this.props.onLogin;
    let label = authenticated ? 'Logout' : 'Login';
    let title = authenticated ? '' : <h2>Login to manage your feeds</h2>

    return (
      <div>
        {title}
        <button type="button" onClick={onClick}>{label}</button>
      </div>
    );
  }
}
