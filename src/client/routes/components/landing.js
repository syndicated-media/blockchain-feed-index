import React from 'react';
import {Link} from 'react-router';
import SubmitContainer from '../../components/submit-container';
import LoginContainer from '../../components/login-container';

export default class LandingView extends React.Component {
  render () {
    return (
      <div>
        <SubmitContainer />
        <LoginContainer />
      </div>
    );
  }
}
