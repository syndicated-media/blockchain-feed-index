// map podcast request to controller

const podchain = require('../controllers/podchain');
const validate = require('../controllers/validate');
const log = require('../services/log');
const NoValidUrls = {
  message: "No valid urls"
};

// get all, by public key, by url or id
const get = (req, res) => {
  let query = req.query;
  let promise;

  if (query.key) {
    request = podchain.getByPublicKey(query.key)
  } else if (query.url) {
    request = podchain.getByUrl(query.url)
  } else if (query.id) {
    request = podchain.getById(query.id)
  } else {
    request = podchain.get(query.count, query.from)
  }

  request
   .then(body => res.json(body))
   .catch(err => res.status(404).send());
}

// create new entry
const create = (req, res) => {
  let body = req.body;
  let urls = body.url || body.urls;
  let publicKey = body.key;

  if (!Array.isArray(urls)) {
    urls = [urls]
  }
  urls = cleanUrls(urls);

  validate(urls)
    .then(removeInvalid)
    .then(urls => podchain.create(urls, publicKey))
    .then(handleResult(res))
    .catch(handleError(res));
}

const update = (req, res) => {

}

const transfer = (req, res) => {

}

const del = (req, res) => {

}

module.exports = {
  get,
  create,
  update,
  transfer,
  del
};

/*

function handlePOST (req, res) {
  let body = req.body;
  let urls = body.urls || body.url || body.newUrl || body.url;
  let currentUrl = body.currentUrl || body.currenturl;
  let method = body.method;
  let privateKey = body.privateKey || body.privatekey || body.key;
  let newOwnerPublicKey = body.newOwnerPublicKey;
  if (typeof method === 'undefined' || typeof urls === 'undefined') {
    res.status(400).send();
    return;
  }

  if (!Array.isArray(urls)) {
    urls = [urls]
  }

  validate(urls)
    .then(result => {
      let validUrls = [];
      result.urls.forEach(item => {
        if (item.valid) {
          log(' valid: ' + item.url);
          validUrls.push(item);
        } else {
          log.error(' invalid: ' + item.url);
        }
      });

      if (validUrls.length) {
        return validUrls;
      } else {
        throw NoValidUrls;
      }
    })
    .then(urls => {
      log (' method: ' + method);
      switch (method.toLowerCase()) {
        case 'create':
          return podchain.create(urls, privateKey);

        case 'update':
          return podchain.update(currentUrl, urls[0].url, urls[0].title, urls[0].email, privateKey);

        case 'transfer':
          return podchain.transfer(urls[0].url, newOwnerPublicKey);

        case 'delete':
          return podchain.del(urls[0].url, privateKey);
      }
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      if (err === NoValidUrls) {
        res.status(415).send();
      } else {
        res.status(500).send();
      }
    });
}
*/

// helpers

const cleanUrls = urls => {
  return urls.map (url => {
    // remove protocol
    let i = url.indexOf('://');
    if (i > -1 && i < 6) {
      url = url.slice(i + 3);
    }

    // remove query
    i = url.indexOf('?');
    if (i > -1) {
      url = url.slice(0, i);
    }

    // remove trailing slash
    i = url.lastIndexOf('/');
    if (i === url.length - 1) {
      url = url.slice(0, url.length - 1);
    }

    // add http protocol
    return "http://" + url;
  });
}

const removeInvalid = result => {
  let validUrls = [];
  result.urls.forEach(item => {
    if (item.valid) {
      log(' valid: ' + item.url);
      validUrls.push(item);
    } else {
      log.error(' invalid: ' + item.url);
    }
  });

  if (validUrls.length) {
    return validUrls;
  } else {
    NoValidUrls.message = result;
    throw NoValidUrls;
  }
}

const handleResult = res => result => res.json(result);
const handleError = res => err => {
  if (err === NoValidUrls) {
    res.status(415).json(NoValidUrls);
  } else {
    log.error(err);
    res.status(500).send();
  }
}
