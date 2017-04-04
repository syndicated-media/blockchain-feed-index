const db = require('../services/db');

const get = (id) => {
  return db.get(id);
}

const put = (id, payload) => {
  return new Promise ((resolve, reject) => {
    if (!payload.publickey || !payload.privatekey) {
        reject(new Error('Invalid payload'));
        return;
    }

    db.post(id, payload)
      .then(resolve)
      .catch(reject);
  });
}
