import React from 'react';
import {connect} from 'react-redux';
import FeedList from './feed-list';
import {update, redirect, transfer, del} from '../ducks/feeds';

const mapStateToProps = (state) => {
  return {
    feeds: state.feeds.list,
    isBusy: state.feeds.isFetching
  };
}

const mapDispatchToProps  = (dispatch) => {
  return {
    onUpdate: (feed) => {
      dispatch (update (feed));
    },
    onRedirect: (feed, url) => {
      dispatch (redirect(feed, url));
    },
    onTransfer: (feed, newOwner) => {
      dispatch(transfer(feed, newOwner));
    },
    onDelete: (feed) => {
      dispatch(del(feed));
    }
  };
}

const FeedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedList);

export default FeedContainer;
