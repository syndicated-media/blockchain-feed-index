const db = require('../services/db');

module.exports = (req, res, next) => {
  // get public and private key from auth header
  if (req.user) {
    db.get(req.user)
      .then(keys => {
        req.publicKey = keys.public;
        req.privateKey = keys.private;

        next ();
      })
      .catch(err => {
        req.status(401).send();
      });
  } else {
    req.status(401).send();
  }
}
