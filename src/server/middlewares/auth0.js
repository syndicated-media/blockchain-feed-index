const request = require('request');

module.exports = (req, res, next) => {
  request({
    uri: 'https://podchaintest.auth0.com/userinfo',
    headers: {
      Authorization: req.headers.authorization
    }
  }, (err, result, body) => {
    if (err) {
      res.status(401).send();
    } else {
      body = JSON.parse(body);

      if (body.email_verified) {
        req.user.id = body.identities[0].user_id;
        req.user.email = body.email;
        next();
      } else {
        res.status(401).send();
      }
    }
  });
}
