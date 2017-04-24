import React from 'react';

export default class Submit extends React.Component {
  constructor (props) {
    super (props);

    this.state = {
      value: ''
    };
    this.onChange = this.onChange.bind (this);
    this.onSubmit = this.onSubmit.bind (this);
  }

  onChange (e) {
    this.setState ({
      value: e.target.value.toLowerCase()
    });
  }

  onSubmit (e) {
    e.preventDefault ();
    this.props.onSubmit (this.state.value);
  }

  render () {
    let disabled = {};
    if (this.props.isPostingUrls) {
        disabled = {
          disabled: 'disabled'
        };
    }
    let value = this.props.isComplete ? '' : this.state.value;

    return (
      <div>
        <h2>Submit your podcast(s)</h2>
        <form onSubmit={this.onSubmit}>
          <input {...disabled} type="text" value={value} onChange={this.onChange} placeholder="Enter full podcast URL here..." />
          <br/>
          <input {...disabled} type="submit" value="Submit" />
        </form>
        <div>{this.progress}</div>
      </div>
    );
  }

  get progress() {
    let {isPostingUrls, isComplete, isError, response} = this.props;

    if (!isPostingUrls && !isComplete && !isError) {
      return '';
    }
    if (isPostingUrls && !isComplete && !isError) {
      return 'Submitting...';
    }
    if (isComplete && !isError) {
      return response;
    }
    if (isError) {
      return response;
    }
  }
}
