import Auth0Lock from 'auth0-lock'
import {browserHistory} from 'react-router';
import {authenticate} from '../ducks/profile';

export default class AuthService {
  constructor (clientId, domain) {
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: 'http://localhost:8000/authenticate',
        responseType: 'token'
      }
    });

    this.lock.on('authenticated', this._doAuthentication.bind(this));
    this.login = this.login.bind(this);
  }

  _doAuthentication (auth) {
    debugger;
    this.setToken(auth.idToken, auth.accessToken);

    let store = require('../store').default;
    store.dispatch(authenticate(auth));

    browserHistory.replace('/profile');
  }

  login () {
    this.lock.show();
  }

  loggedIn () {
    return !!this.getToken();
  }

  setToken (idToken, accessToken) {
    localStorage.setItem('id_token', idToken);
    localStorage.setItem('access_token', accessToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  getAccessToken () {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    browserHistory.replace('/');
  }
}
