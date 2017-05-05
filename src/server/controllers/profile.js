const db = require('../services/db');
const postchain = require('../postchain');
const keys = require('../postchain/keys');

const set = user => {
  return new Promise(resolve => {
    resolve(user);
  });
}

const getFeeds = user => {
  return new Promise((resolve, reject) => {
    console.log('email: ', user.email);
    postchain.getByEmail(user.email)
      .then(feeds => {
        user.feeds = feeds;
        resolve(user);
      })
      .catch(reject);
  });
}

const transferIfNeeded = user => {
  return new Promise((resolve, reject) => {
    let transfers = [];

    user.feeds.forEach(feed => {
      if (feed.publicKey !== user.publicKey) {
        console.log('Transfering ' + feed.feedUrl);
        transfers.push(postchain.transfer(feed.feedUrl, keys.privateKey, user.publicKey));
      }
    });

    if (transfers.length) {
      Promise.all(transfers)
        .then(() => {
          resolve(user);
        })
        .catch(reject);
    } else {
      resolve(user);
    }
  });
}

module.exports = {
  set,
  getFeeds,
  transferIfNeeded
};
