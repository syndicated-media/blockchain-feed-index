import React from 'react';

export default class FeedEntry extends React.Component {
  constructor (props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.onRedirect = this.onRedirect.bind(this);
    this.onTransfer = this.onTransfer.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onUpdate (e) {
    e.preventDefault ();
    this.props.onUpdate(this.props.data);
  }

  onRedirect (e) {
    e.preventDefault();
    let url = prompt('Please enter new feed URL', this.props.data.url);

    if (url != this.props.data.url && url.indexOf('http') == 0) {
      this.props.onRedirect(this.props.data, url);
    } else {
      alert('Not redirecting!');
    }
  }

  onTransfer (e) {
    e.preventDefault();
    let newOwner = prompt('Please enter new owner public key');

    if (newOwner.length === 66) {
      this.props.onTransfer(this.props.data, newOwner);
    } else {
      alert('Invalid public key');
    }
  }

  onDelete (e) {
    e.preventDefault();
    let accept = confirm('Are you sure you want to delete your feed?');
    if (accept) {
      accept = confirm('Really, are you sure?');
      if (accept) {
        this.props.onDelete(this.props.data);
      }
    }
  }

  render () {
    let {title, feedUrl, id} = this.props.data;
    return (
      <div className='feed-entry'>
        <div className='title'>{title}</div>
        <div className='url'><a href={feedUrl} target='_blank'>{feedUrl}</a></div>
        <div className='id'>Id: {id}</div>
        <div className='actions'>
          <button onClick={this.onUpdate}>Update</button>
          <button onClick={this.onRedirect}>Redirect</button>
          <button onClick={this.onTransfer}>Transfer</button>
          <button onClick={this.onDelete}>Delete</button>
        </div>
      </div>
    );
  }
}
