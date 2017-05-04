const db = require('../services/db');

const set = user => {
  return new Promise(resolve => {
    resolve(user);
  });
}

const getFeeds = user => {
  return new Promise((resolve, reject) => {
    resolve(user);
  });
}

const transferIfNeeded = user => {
  return new Promise((resolve, reject) => {
    resolve(user);
  });
}

module.exports = {
  set,
  getFeeds,
  transferIfNeeded
};
