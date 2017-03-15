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
    if (this.props.isSubmitting) {
        disabled = {
          disabled: 'disabled'
        };
    }

    return (
      <div>
        <div>Submit your podcast(s)</div>
        <form onSubmit={this.onSubmit}>
          <input {...disabled} type="text" value={this.state.value} onChange={this.onChange} placeholder="Enter full podcast URL here..." />
          <br/>
          <input {...disabled} type="submit" value="Submit" />
        </form>
        <div>{this.progress}</div>
      </div>
    );
  }

  get progress() {
    let {isSubmitting, isComplete, isError, response} = this.props;

    if (!isSubmitting && !isComplete && !isError) {
      return '';
    }
    if (isSubmitting && !isComplete && !isError) {
      return 'Submitting...';
    }
    if (isSubmitting && isComplete && !isError) {
      return response;
    }
    if (isError) {
      return response;
    }
  }
}
