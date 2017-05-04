import React from 'react';
import LoginContainer from './login-container';

export default class Profile extends React.Component {
  render () {
    if (this.loading) {
      return (<div />);
    } else {
      let {id, email, publicKey} = this.props.profile;
      return (
        <div>
          <h3>Email: {email}</h3>
          <h3>Id: {id}</h3>
          <h3>Public Key: {publicKey}</h3>
          <LoginContainer/>
        </div>
      );
    }
  }

  get loading () {
    let props = this.props;
    return props.loggingIn || this.isFetchingProfile;
  }
}
