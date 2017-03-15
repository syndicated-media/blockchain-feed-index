import React from 'react';

export default class Submit extends React.Component {
  render () {
    return (
      <div>
        <div>SUBMIT SOMETHING</div>
        <div>{this.props.submitting}</div>
        <div>{this.props.urls}</div>
        <button onClick={() => this.props.onSubmit("https://rss.acast.com/something/    , http://rss.acast.com/else?q=123")} >SUBMIT</button>
      </div>
    );
  }
}
