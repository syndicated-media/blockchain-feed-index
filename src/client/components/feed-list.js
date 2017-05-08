import React from 'react';
import FeedEntry from './feed-entry';

export default class FeedList extends React.Component {
  render () {
    let entries = this.props.feeds.map(feed =>
      <FeedEntry title={feed.title} url={feed.feedUrl} id={feed.id} key={feed.id} />
    );

    return (
      <div>
        {entries}
      </div>
    );
  }
}
