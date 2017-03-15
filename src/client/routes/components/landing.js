import React from 'react';
import {Link} from 'react-router';
import SubmitContainer from '../../components/submit-container';

export default React.createClass({
  render () {
    return (
      <div>
        <div>LANDING</div>
        <Link to="/login">Login</Link>
        <SubmitContainer />
      </div>
    );
  }
})
