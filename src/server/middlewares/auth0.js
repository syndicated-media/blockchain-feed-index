const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

let strategy = new Auth0Strategy({
  domain: 'podchaintest.auth0.com',
  clientID: 'K3Cuu3SC9mlt9M3OujeVtJFRAs9MBNL5',
  clientSecret: 'vuRUTsLNBBx_De3_5GOi7KJp4nrSjtFFwHGxcXf5Nby4v_NoKbNX1Vr3aZvDsxTU',
  callbackURL: 'http://localhost/profile'
}, (accessToken, refreshToken, extraParams, profile, done) => {
  console.log(accessToken, refreshToken, extraParams, profile);
  done(null, profile);
});
passport.use(strategy);

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticate: passport.authenticate('auth0', {failureRedirect: '/failure'}),
  login: (req, res) => {
    res.redirect(req.session.returnTo || '/profile');
  },
  ensureLoggedIn: ensureLoggedIn,
  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  }
};
