import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  render () {
    return (
      <div>
        <div>LANDING</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
})
