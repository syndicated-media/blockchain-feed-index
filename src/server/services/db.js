const pg = require('pg');

try {
  require('../../../pg-config');
} catch (err) {
  // do nothing, environment variables might be set elsewhere
}
if (!process.env.PGUSER) {
  throw new Error('Missing environment variables for Postgres. Please add environment variables for PGUSER, PGPASSWORD, PGPORT, PGHOST, PGDATABASE');
}

const client = new pg.Client();
client.connect(err => {
  if (err) {
    throw err;
  }

  let query = client.query('CREATE TABLE items(id UUID PRIMARY KEY, publickey TEXT, privatekey TEXT)');
  query.on('end', () => client.end());
  query.on('error', (err) => {
    client.end();
  });
});

const get = (id) => {
  return new Promise((resolve, reject) => {
    client.connect(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve('CONNETED');
    });
  });
}

const put = (id, keys) => {
  return new Promise((resolve, reject) => {
    client.connect(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve('CONNECTED!');
    });
  });
}

module.exports = {
  get: get,
  put: put
};
