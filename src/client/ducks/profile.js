import AuthService from '../services/auth0';

const LOGIN = 'podchain/profile/LOGIN';
const LOGOUT = 'podchain/profile/LOGIN';
const AUTHENTICATE = 'podchain/profile/AUTHENTICATE';
const SET_FEEDS = 'SET_FEEDS';

const authService = new AuthService('K3Cuu3SC9mlt9M3OujeVtJFRAs9MBNL5', 'podchaintest.auth0.com');
const initalState = {
    loggingIn: false,
    logginOut: false,
    authenticated: false,
    isFetchingFeeds: false,
    feeds: [],
    auth: {}
};

export default function reducer (state = initalState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        logginOut: false,
        authenticated: false,
        auth: {}
      };

    case AUTHENTICATE:
      return {
        ...state,
        loggingIn: false,
        logginOut: false,
        authenticated: true,
        auth: action.auth
      };

    case LOGOUT:
      return {
        ...state,
        loggingIn: false,
        logginOut: true,
        authenticated: false,
        auth: {}
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

export function login () {
  return {
    type: LOGIN
  };
}

export function launchAuth0Login () {
  authService.login();
}

export function loggedIn () {
  return authService.loggedIn();
}

export function authenticate (auth) {
  return {
    type: AUTHENTICATE,
    auth: auth
  };
}

export function logout () {
  authService.logout();
  return {
    type: LOGOUT
  };
}

export function setFeeds (feeds) {
  return {
    type: SET_FEEDS,
    feeds: feeds
  };
}
