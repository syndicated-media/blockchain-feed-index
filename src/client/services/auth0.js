import Auth0Lock from 'auth0-lock'
import {authenticate} from '../ducks/profile';

export default class AuthService {
  constructor (clientId, domain) {
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: 'http://localhost:8000/profile',
        responseType: 'token'
      }
    });

    this.lock.on('authenticated', this._doAuthentication.bind(this));
    this.login = this.login.bind(this);
  }

  _doAuthentication (auth) {
    this.setToken(auth.idToken);

    let store = require('../store').default;
    store.dispatch(authenticate(auth));
  }

  login () {
    this.lock.show();
  }

  loggedIn () {
    return !!this.getToken();
  }

  setToken (idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  logout() {
    localStorage.removeItem('id_token');
  }
}
