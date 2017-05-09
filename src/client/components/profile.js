import React from 'react';
import LoginContainer from './login-container';
import FeedList from './feed-list';

export default class Profile extends React.Component {
  render () {
    if (this.props.isLoading) {
      return (
        <div />
      );
    } else if (this.props.isError) {
      return (
        <div>Oops, something went wrong, please try again...</div>
      );
    } else {
      let {id, email, publicKey, feeds} = this.props.profile;
      return (
        <div className='profile'>
          <div className='profile-inner'>
            <div className='profile-welcome'>
              Welcome {email}
            </div>
            <div className='separator'/>
            <div className='profile-info'>
              <div className='id-and-key'>Your id: <span className='bold'>{id}</span></div>
              <div className='id-and-key'>Your Public Key: <span className='bold'>{publicKey}</span></div>
            </div>
            <div className='separator'/>
            <FeedList feeds={feeds}></FeedList>
          </div>
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
