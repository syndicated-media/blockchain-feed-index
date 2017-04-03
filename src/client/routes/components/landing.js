import React from 'react';
import {Link} from 'react-router';
import SubmitContainer from '../../components/submit-container';
import LoginContainer from '../../components/login-container';

export default React.createClass({
  render () {
    return (
      <div>
        <h1>P O D C H A I N</h1>
        <SubmitContainer />
        <LoginContainer />
      </div>
    );
  }
});
