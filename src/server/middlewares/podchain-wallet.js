const request = require('request');

module.exports = (req, res, next) => {
  // get public and private key from auth header
  if (req.headers.Authorization) {
    request({
      uri: 'https://podchaintest.auth0.com/userinfo',
      headers: {
        Authorization: req.headers.Authorization
      }
    }, (err, response, body) => {
      if (err) {
        res.status((response && response.statusCode) || 500).send(err);
      } else {
        // todo: get keys from postgres
        // req.privateKey = ...
        // req.publicKey = ...
        next ();
      }
    });
  } else {
    next();
  }
}
