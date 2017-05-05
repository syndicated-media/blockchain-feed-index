const postchain = require ('../postchain');
const keys = require ('../postchain/keys');

const create = (urls, privateKey, publicKey) => {
  let promises = [];
  urls.forEach (data => {
    promises.push (postchain.create(data.url, data.title, data.email, privateKey || keys.private, publicKey || keys.public));
  });

  return Promise.all (promises);
}

const get = (count, fromId) => postchain.get(count, fromId);
const getByPublicKey = publicKey => postchain.getByPublicKey(publicKey);
const getById = id => postchain.getById(id);
const getByUrl = url => postchain.getByUrl(url);
const getByEmail = email => postchain.getByEmail(email);

const update = (currentUrl, url, title, email, privateKey) => postchain.update(currentUrl, url, title, email, keys.private, privateKey || keys.private);
const del = (url, privateKey) => postchain.delete(url, privateKey || keys.private);
const transfer = (url, privateKey, newOwnerPublicKey) => postchain.transfer(url, privateKey || keys.private, newOwnerPublicKey);

module.exports = {
  create,
  get,
  getById,
  getByUrl,
  getByEmail,
  getByPublicKey,
  update,
  transfer,
  del
};
