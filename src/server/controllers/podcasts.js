const postchain = require ('../postchain');
const keys = require ('../postchain/keys');

const create = (urls, newOwnerPublicKey) => {
  let promises = [];
  urls.forEach (data => {
    promises.push (postchain.create(data.url, data.title, data.email, keys.private, newOwnerPublicKey || keys.public));
  });

  return Promise.all (promises);
}

const get = (count, fromId) => postchain.get(count, fromId);
const getByPublicKey = publicKey => postchain.getByPublicKey(publicKey);
const getByUrls = urls => {
  let promises = [];
  urls.forEach (url => {
    promises.push (postchain.getByUrl (url));
  });

  return Promise.all (promises);
}

const update = (currentUrl, url, title, email, privateKey) => postchain.update(currentUrl, url, title, email, keys.private, privateKey || keys.private);
const del = (url, privateKey) => postchain.delete(url, privateKey || keys.private);
const transfer = (url, newOwnerPublicKey) => postchain.transfer(url, keys.private, newOwnerPublicKey);

module.exports = {
  create,
  get,
  getByUrls,
  getByPublicKey,
  update,
  transfer,
  del
};
