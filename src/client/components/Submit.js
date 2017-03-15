import React from 'react';

export default class Submit extends React.Component {
  render () {
    debugger;
    return (
      <div>
        <div>SUBMIT SOMETHING</div>
        <div>{this.props.submitting}</div>
        <div>{this.props.urls}</div>
        <button onClick={() => this.props.onSubmit(this.props.urls + "another url ")} />
      </div>
    );
  }
}
