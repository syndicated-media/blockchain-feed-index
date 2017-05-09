import React from 'react';
import duck from '../ducks/submit';

export default class Submit extends React.Component {
  constructor (props) {
    super (props);

    this.state = {
      value: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onFocus (e) {
    this.props.onReset ();
    this.setState({
      value: ''
    });
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
      <div className="submit">
        <div className="title">Submit Your Podcast(s)</div>
        <form onSubmit={this.onSubmit}>
          <input {...disabled} type="text" value={value} onClick={this.onFocus} onChange={this.onChange} placeholder="Enter full podcast URL here..." />
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
