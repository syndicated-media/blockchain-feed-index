import AuthService from '../services/auth0';

const LOGIN = 'podchain/profile/LOGIN';
const LOGOUT = 'podchain/profile/LOGIN';
const AUTHENTICATE = 'podchain/profile/AUTHENTICATE';
const FETCHING_PROFILE = 'podchain/profile/FETCHING_PROFILE';
const SET_PROFILE = 'podchain/profile/SET_PROFILE';
const ERROR = 'podchain/profile/ERROR';
const LOCALSTORAGEKEY = 'podchain-poc-state';

const authService = new AuthService('K3Cuu3SC9mlt9M3OujeVtJFRAs9MBNL5', 'podchaintest.auth0.com');
const initalState = {
    loggingIn: false,
    logginOut: false,
    authenticated: false,
    isFetchingProfile: false,
    error: false,
    id: '',
    email: '',
    publicKey: '',
    feeds: [],
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

    case FETCHING_PROFILE:
      return {
        ...state,
        isFetchingProfile: true
      };

    case SET_PROFILE:
      return {
        ...state,
        isFetchingProfile: false,
        id: action.id,
        email: action.email,
        publicKey: action.publicKey,
        feeds: action.feeds
      };

    case LOGOUT:
      return {
        ...state,
        loggingIn: false,
        logginOut: true,
        authenticated: false,
        id: '',
        email: '',
        publicKey: '',
        feeds: [],
        auth: {}
      };

    case ERROR:
      return {
        ...state,
        error: true
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

    dispatch(fetchingProfile());
    fetch('/api/wallet/profile', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusMessage);
        }
        return response.json()
      })
      .then(profile => {
        dispatch(setProfile(profile));
      })
      .catch(error => {
        dispatch(error(error));
      });
  }
}

function fetchingProfile () {
  return {
    type: FETCHING_PROFILE
  };
}

function setProfile (profile) {
  return {
    type: SET_PROFILE,
    ...profile
  }
}

function error (error) {
  return {
    type: ERROR
  };
}

export function logout () {
  authService.logout();
  return {
    type: LOGOUT
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
