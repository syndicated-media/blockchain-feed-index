import React from 'react';

export default class FeedEntry extends React.Component {
  render () {
    let {title, url, id} = this.props;
    return (
      <div>
        {title} - {url} - {id}
      </div>
    );
  }
}
