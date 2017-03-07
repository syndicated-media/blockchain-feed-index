const SET_FEEDS = 'SET_FEEDS';
const AUTHENTICATE = 'AUTHENTICATE';

const initalState = {
    authenticated: false,
    token: 'N/A',
    email: 'N/A',
    isFetchingFeeds: false,
    feeds: []
};

export default function reducer (state = initalState, action = {}) {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        authenticated: true,
        token: action.token
      };

    case SET_FEEDS:
      return {
        ...state,
        feeds: action.feeds
      };

    default:
      return state;
  }
}

export function authenticate (token) {
  return {
    type: AUTHENTICATE,
    token: token
  };
}

export function setFeeds (feeds) {
  return {
    type: SET_FEEDS,
    feeds: feeds
  };
}
