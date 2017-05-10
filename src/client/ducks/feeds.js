
const INIT = 'podchain/feed/INIT';
const UPDATE = 'podchain/feed/UPDATE';
const REDIRECT = 'podchain/feed/REDIRECT';
const TRANSFER = 'podchain/feed/TRANSFER';
const DELETE = 'podchain/feed/DELETE';

const initalState = {
  list: [],
  feed: {},
  newOwner: '',
  newUrl: '',
  isFetching: false
};

export default function reducer (state = initalState, action = {}) {
  switch (action.type) {
    case INIT:
      return {
        list: action.feeds,
        feed: {},
        newOwner: '',
        newUrl: '',
        isFetching: false
      };

    case UPDATE:
      return {
        ...state,
        isFetching: true,
        feed: action.feed
      };

    case REDIRECT:
      return {
        ...state,
        isFetching: true,
        feed: action.feed,
        newUrl: action.newUrl
      };

    case TRANSFER:
      return {
        ...state,
        isFetching: true,
        feed: action.feed,
        newOwner: action.newOwner
      };

    case DELETE:
      return {
        ...state,
        isFetching: true,
        feed: action.feed
      };

    default:
      return state;
  }
}

// update

export function update (feed) {
  return dispatch => {
    dispatch ({
      type: UPDATE,
      feed: feed
    });
    postTo('create', {
        url: feed.feedUrl
      })
      .then(checkResponse)
      .then(response => {
        dispatch(fetchProfile());
      });
  }
}

export function transfer (feed, newOwner) {
  return dispatch => {
    dispatch({
      type: TRANSFER,
      newOwner
    });

    postTo('transfer', {
        url: feed.feedUrl,
        publicKey: newOwner
      })
      .then(checkResponse)
      .then(response => {
        dispatch(fetchProfile());
      });
  }
}

export function redirect (feed, newUrl) {
  return dispatch => {
    dispatch({
      type: REDIRECT,
      newUrl
    });

    postTo('update', {
        url: newUrl,
        currentUrl: feed.feedUrl
      })
      .then(checkResponse)
      .then(response => {
        dispatch(fetchProfile());
      });
  }
}

export function del (feed) {
  return dispatch => {
    postTo('delete', {
      url: feed.feedUrl
    })
      .then(checkResponse)
      .then(response => {
        dispatch(fetchProfile());
      });
  }
}

export function setFeeds (feeds) {
  return {
    type: INIT,
    feeds
  };
}

// helpers

function postTo (action, data) {
  return fetch('/api/podchain/' + action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    },
    body: JSON.stringify(data)
  });
}

function checkResponse (response) {
  if (!response.ok) {
    alert('Something went wrong, please try again!');
  }
  return response.json();
}

function fetchProfile () {
  // unfortunate dual dependency
  return require('./profile').fetchProfile();
}
