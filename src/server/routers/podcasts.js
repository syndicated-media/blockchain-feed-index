// map podcast request to controller

const podcasts = require('../controllers/podcasts');
const validate = require('../controllers/validate');
const log = require('../services/log');

module.exports = (req, res) => {
  switch (req.method) {
    case 'GET':
      handleGET(req, res);
      break;

    case 'POST':
      handlePOST(req, res);
      break;

    default:
      throw new Error('Unsupported method');
  }
}

function handleGET (req, res) {
  let query = req.query;
  if (query.key || query.publickey) {
    let publicKey = query.key || query.publickey;
    podcasts.getByPublicKey(publicKey)
      .then(result => res.json(result))
      .catch(err => res.status(404).send());
  } else if (query.url || query.urls) {
    let urls = req.query.url || req.query.urls;
    if (urls.indexOf(',') !== -1) {
      urls = urls.split(',');
    } else {
      urls = [urls];
    }
    log(urls);
    podcasts.getByUrls(urls)
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.status(404).send()
      });
  } else {
    res.status(400).send();
  }
}

function handlePOST (req, res) {
  log('POST');

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
          log(' invalid: ' + item.url);
        }
      });

      if (validUrls.length) {
        return validUrls;
      } else {
        res.status(415).send();
      }
    })
    .then(urls => {
      log (' method: ' + method);
      switch (method.toLowerCase()) {
        case 'create':
          return podcasts.create(urls, privateKey);

        case 'update':
          return podcasts.update(currentUrl, urls[0].url, urls[0].title, urls[0].email, privateKey);

        case 'transfer':
          return podcasts.transfer(urls[0].url, newOwnerPublicKey);

        case 'delete':
          return podcasts.del(urls[0].url, privateKey);
      }
    })
    .then(result => {
      res.json(result);
    });
}
