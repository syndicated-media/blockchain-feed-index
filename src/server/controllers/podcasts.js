const postchain = require ('../postchain');
const keys = require ('../postchain/keys');

const get = urls => {
  let promises = [];
  urls.forEach (url => {
    promises.push (postchain.getUrl (url));
  });

  return Promise.all (promises);
}

const post = urls => {
  let promises = [];
  urls.forEach (data => {
    promises.push (postchain.newUrl(data.url, data.title, data.email, keys.public, keys.private));
  });

  return Promise.all (promises);
}

module.exports = {
  get,
  post
};
