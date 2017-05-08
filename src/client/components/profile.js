import React from 'react';
import LoginContainer from './login-container';
import FeedList from './feed-list';

export default class Profile extends React.Component {
  render () {
    if (this.loading) {
      return (<div />);
    } else {
      let {id, email, publicKey, feeds} = this.props.profile;
      return (
        <div>
          <h3>Email: {email}</h3>
          <h3>Id: {id}</h3>
          <h3>Public Key: {publicKey}</h3>
          <FeedList feeds={feeds}></FeedList>
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
