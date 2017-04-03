import React from 'react';

export default class Profile extends React.Component {
  render () {
    let {loggingIn} = this.props.profile;

    if (loggingIn) {
      debugger;
      return (<div />);
    } else {
      return (
        <div>
          <h2>Authenticated: {this.props.profile.authenticated + ""}</h2>
        </div>
      );
    }
  }
}
