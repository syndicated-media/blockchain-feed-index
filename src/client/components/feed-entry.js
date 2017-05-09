import React from 'react';

export default class FeedEntry extends React.Component {
  render () {
    let {title, url, id} = this.props;
    return (
      <div className='feed-entry'>
        <div className='title'>{title}</div>
        <div className='url'><a href={url} target='_blank'>{url}</a></div>
        <div className='id'>Id: {id}</div>
        <div className='actions'>
          <button>Update</button>
          <button>Redirect</button>
          <button>Transfer</button>
          <button>Delete</button>
        </div>
      </div>
    );
  }
}
