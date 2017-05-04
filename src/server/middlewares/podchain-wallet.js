const db = require('../services/db');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');

module.exports = (req, res, next) => {
  // get public and private key from user id (auth header)

  let user = req.user;
  if (user) {
    db.select(user.id)
      .then(keys => {
        if (keys.length == 0) {
            create(user)
              .then(next)
              .catch(err => {
                console.log(err);
                  res.status(500).send(err);
              });
        } else {
          user.setKeys(keys)
            .then(next);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(401).send();
      });
  } else {
    res.status(401).send();
  }
}

const create = user => {
  return new Promise((resolve, reject) => {
    let privateKey;
    do {
        privateKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));
    let publicKey = secp256k1.publicKeyCreate(privateKey);

    let publicKeyAsString = publicKey.toString('hex');
    let privateKeyAsString = privateKey.toString('hex');

    db.insert(user.id, user.email, publicKeyAsString, privateKeyAsString)
      .then(() => {
        user.publicKey = publicKeyAsString;
        user.privateKey = privateKeyAsString;
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

}
