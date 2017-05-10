import React from 'react';
import FeedEntry from './feed-entry';

export default class FeedList extends React.Component {
  render () {
    let {onUpdate, onTransfer, onRedirect, onDelete} = this.props;
    let entries = this.props.feeds.map(feed =>
      <FeedEntry key={feed.id} data={feed} onUpdate={onUpdate} onTransfer={onTransfer} onRedirect={onRedirect} onDelete={onDelete} />
    );

    return (
      <div className='feed-list'>
        {entries}
      </div>
    );
  }
}
