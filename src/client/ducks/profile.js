import AuthService from '../services/auth0';

const LOGIN = 'podchain/profile/LOGIN';
const LOGOUT = 'podchain/profile/LOGIN';
const AUTHENTICATE = 'podchain/profile/AUTHENTICATE';
const FETCHING_USER_INFO = 'podchain/profile/FETCHING_USER_INFO';
const SET_USER_INFO = 'podchain/profile/SET_USER_INFO';
const FETCHING_KEYS = 'podchain/profile/FETCHING_KEYS';
const SET_KEYS = 'podchain/profile/SET_KEYS';
const FETCHING_FEEDS = 'podchain/profile/FETCHING_FEEDS';
const SET_FEEDS = 'podchain/profile/SET_FEEDS';
const LOCALSTORAGEKEY = 'podchain-poc-state';

const authService = new AuthService('K3Cuu3SC9mlt9M3OujeVtJFRAs9MBNL5', 'podchaintest.auth0.com');
const initalState = {
    loggingIn: false,
    logginOut: false,
    authenticated: false,
    isFetchingInfo: false,
    feeds: [],
    email: '',
    id: '',
    auth: {}
};

export default function reducer (state = initalState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return saveState({
        ...state,
        loggingIn: true,
        logginOut: false,
        authenticated: false,
        auth: {}
      });

    case AUTHENTICATE:
      return {
        ...loadState(),
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

    case FETCHING_USER_INFO:
      return {
        ...state,
        isFetchingInfo: true
      };

    case SET_USER_INFO:
      return {
        ...state,
        isFetchingInfo: false,
        id: action.userId,
        email: action.email
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
  return dispatch => {
    dispatch({
      type: AUTHENTICATE,
      auth: auth
    });

    dispatch(fetchingUserInfo());                         // this step with user info is probably not needed
    fetch('https://podchaintest.auth0.com/userinfo', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    })
      .then(response => response.json())
      .then(user => {
        dispatch(setUserInfo(user));

        dispatch(fetchingFeeds());
        fetch('/api/wallet/profile/', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
          }
        })
          .then(response => response.json())
          .then(feeds => {
            dispatch(setFeeds(feeds));
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

function fetchingUserInfo () {
  return {
    type: FETCHING_USER_INFO
  };
}

function setUserInfo (user) {
  return {
    type: SET_USER_INFO,
    id: user.user_id.split('uth0|')[1],
    email: user.email,
  };
}

function fetchingKeys () {
  return {
    type: FETCHING_KEYS
  };
}

function setKeys (publicKey) {
  return {
    type: SET_KEYS,
    publicKey: publicKey
  };
}

function fetchingFeeds () {
  return {
    type: FETCHING_FEEDS
  };
}

function setFeeds (feeds) {
  return {
    type: SET_FEEDS,
    feeds: feeds
  }
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

// helpers

const saveState = (state) => {
  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(state));
  return state;
}

const loadState = () => {
  let state = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY));
  localStorage.removeItem(LOCALSTORAGEKEY);
  return state;
}
