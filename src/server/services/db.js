const pg = require('pg');

try {
  require('../../../pg-config');
} catch (err) {
  // do nothing, environment variables might be set elsewhere
}
if (!process.env.PGUSER) {
  throw new Error('Missing environment variables for Postgres. Please add environment variables for PGUSER, PGPASSWORD, PGPORT, PGHOST, PGDATABASE');
}

// setup a pool
const pool = new pg.Pool({
  max: 10,
  idleTimeoutMillis: 30000
});
pool.on('error', (err, client) => {
  console.log(err);
});

const getClient = () => {
  return new Promise ((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        reject(err);
      } else {
        resolve(client, done);
      }
    })
  });
}
const query = (query, values) => {
  return new Promise ((resolve, reject) => {
    pool.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// create table
//query('DROP TABLE wallet')
//.then(()=>{
query('CREATE TABLE IF NOT EXISTS wallet(id TEXT PRIMARY KEY, email TEXT NOT NULL, publicKey TEXT NOT NULL, privateKey TEXT NOT NULL)')
  .then(() => {
    console.log('PG table created');
  })
  .catch(err => {
    console.log('PG table error', err);
  });
//});
// get by id
const select = (id) => {
  return new Promise((resolve, reject) => {
    query('SELECT * from wallet WHERE id = $1', [id])
      .then(result => {
        console.log('PG SELECT', result.rows.length);
        resolve(result.rows);
      })
      .catch(err => {
        reject(err);
      });
    });
}

// insert
const insert = (id, email, publicKey, privateKey) => {
  return new Promise((resolve, reject) => {
    console.log('PG INSERT', id);
    query('INSERT INTO wallet (id, email, publicKey, privateKey) VALUES ($1, $2, $3, $4)', [id, email, publicKey, privateKey])
      .then(resolve)
      .catch(err => {
        console.log('PG insert error', err);
        reject(err);
      });
  });
}

module.exports = {
  select,
  insert
};
