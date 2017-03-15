import React from 'react';
import {Link} from 'react-router';
import Submit from '../../components/submit';

export default React.createClass({
  render () {
    return (
      <div>
        <div>LANDING</div>
        <Link to="/login">Login</Link>
        <Submit/>
      </div>
    );
  }
})
