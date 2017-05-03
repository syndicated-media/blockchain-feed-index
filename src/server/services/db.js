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
const connect = () => {
  return new Promise ((resolve, reject) => {
    client.connect(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}
const query = q => {
  return new Promise ()
  let query = client.quer
}

connect()
  .then(() => {
    let query = client.query('CREATE TABLE items(id TEXT PRIMARY KEY, publickey TEXT, privatekey TEXT)');
    query.on('end', () => client.end());
    query.on('error', (err) => {
      client.end();
    });
  })
  .catch(err => {
    console.log(err);
  });

const get = (id) => {
  return new Promise((resolve, reject) => {
    connect()
      .then(() => {
        query()
        let query = client.query('SELECT $1::TEXT as id', [id], (err, result) => {

      })
      .catch(reject);

    client.connect(err => {
      if (err) {
        reject(err);
        return;
      }

        if (err) {
          reject(err);
          return;
        }

        if ()
      }
      resolve('CONNETED');
    });
  });
}

module.exports = {
  get
};
