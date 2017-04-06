import React from 'react';
import LoginContainer from './login-container';

export default class Profile extends React.Component {
  render () {
    let {loggingIn} = this.props.profile;

    if (loggingIn) {
      return (<div />);
    } else {
      return (
        <div>
          <h2>Authenticated: {this.props.profile.authenticated + ""}</h2>
          <LoginContainer/>
        </div>
      );
    }
  }
}
