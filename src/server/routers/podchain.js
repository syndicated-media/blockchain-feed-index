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
    request = podchain.getByPublicKey(query.key);
  } else if (query.url) {
    request = podchain.getByUrl(query.url);
  } else if (query.id) {
    request = podchain.getById(query.id);
  } else if (query.email) {
    request = podchain.getByEmail(query.email);
  } else {
    request = podchain.get(query.count, query.from);
  }

  request
   .then(body => res.json(body))
   .catch(err => res.status(404).send());
}

// create new entry
const create = (req, res) => {
  let body = req.body;
  let urls = cleanUrls(body.url || body.urls);

  validate(urls)
    .then(removeInvalid)
    .then(urls => podchain.create(urls))
    .then(handleResult(res))
    .catch(handleError(res));
}

const createWithoutValidation = (req, res) => {
  let body = req.body;

  if (body.url && body.title && body.email) {
    podchain.create([{
      url: body.url,
      title: body.title,
      email: body.email
    }])
      .then(handleResult(res))
      .catch(handleError(res));
  } else {
    res.status(500).json({
      message: 'Need url, title and email in body'
    });
  }
}



// update an entry
const update = (req, res) => {
  let body = req.body;
  let url = cleanUrl(body.url);
  let currentUrl = cleanUrl(body.currentUrl || body.currenturl);
  let privateKey = req.privateKey;

  validate(url)
    .then(removeInvalid)
    .then(validPods => {
      let pod = validPods[0];
      return podchain.update(currentUrl, pod.url, pod.title, pod.email, privateKey);
    })
    .then(handleResult(res))
    .catch(handleError(res));
}

// transfer ownership of entry
const transfer = (req, res) => {
  let body = req.body;
  let url = cleanUrl(body.url);
  let newOwnerPublicKey = body.publicKey;

  validate(url)
    .then(removeInvalid)
    .then(validPods => {
      let pod = validPods[0];
      return podchain.transfer(pod.url, req.user.privateKey, newOwnerPublicKey);
    })
    .then(handleResult(res))
    .catch(handleError(res));
}

// delete entry
const del = (req, res) => {
  let url = cleanUrl(req.body.url);

  validate(url)
    .then(removeInvalid)
    .then(validPods => {
      let pod = validPods[0];
      return podchain.del(pod.url, req.user.privateKey);
    })
    .then(handleResult(res))
    .catch(handleError(res));
}

module.exports = {
  get,
  create,
  createWithoutValidation,
  update,
  transfer,
  del
};

// helpers

const asArray = urls => {
  if (!Array.isArray(urls)) {
    return [urls];
  }
  return urls;
}

const cleanUrl = url => {
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
}

const cleanUrls = urls => {
  urls = asArray(urls);
  return urls.map (url => cleanUrl(url));
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
