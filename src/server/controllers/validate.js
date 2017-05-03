const request = require ('request');
const FeedParser = require ('feedparser');
const log = require('../services/log');

module.exports = urls => {
  if (!Array.isArray(urls)) {
    urls = [urls];
  }
  var response = {
    urls: []
  };
  return new Promise ((resolve, reject) => {
    validate (urls, response, resolve, reject);
  });
}

const validate = (urls, response, resolve, reject) => {
  if (urls.length) {
    url = urls.shift();

    validateOne (url)
      .then (result => {
        response.urls.push (result);
        validate (urls, response, resolve);
      })
      .catch (result => {
        response.urls.push (result);
//        resolve (response);
        validate (urls, response, resolve);
      });
  } else {
    resolve(response);
  }
}

const validateOne = url => {
  return new Promise ((resolve, reject) => {
    log(' validating: ' + url);
    let feedparser = new FeedParser();
    let result = {};
    let req;
    try {
      req = request(url, {
        timeout: 10000,
        pool: false
      });
    } catch (e) {
      doReject(reject, url)(e);
      return;
    }

    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
    req.setHeader('accept', 'text/html,application/xhtml+xml');
    req.on('error', doReject(reject, url));
    req.on('response', (res) => {
      if (res.statusCode != 200) {
        doReject(reject, url)('Invalid status code: ' + res.statusCode);
      }
      let encoding = res.headers['content-encoding'] || 'identity';
      let charset = getParams(res.headers['content-type'] || '').charset;
      res = maybeDecompress(res, encoding);
      res = maybeTranslate(res, charset, reject);
      res.pipe(feedparser);
    });

    feedparser.on('end', () => {
      if (result['meta'] &&
          result['meta']['itunes:owner'] &&
          result['meta']['itunes:owner']['itunes:email'] &&
          result['meta']['itunes:owner']['itunes:email']['#'] &&
          result['meta']['title']) {
        resolve({
          valid: true,
          url: url,
          email: result['meta']['itunes:owner']['itunes:email']['#'],
          title: result['meta']['title']
        });
      } else {
        resolve({
          valid: false,
          url: url,
          error: 'No metadata about title and/or email'
        });
      }
    });
    feedparser.on('readable', function() {
      let post;
      try {
        while (post = this.read()) {
          Object.keys(post).forEach (key => {
            result[key] = post[key];
          });
        }
      } catch (err) {
        doReject(reject, url)(err);
      }
    });
    feedparser.on('error', doReject(reject, url));
  });
}

const doReject = (reject, url) => {
  return (err) => {
    reject({
      valid: false,
      url: url,
      error: err
    });
  }
}

// Define our handlers

function maybeDecompress (res, encoding) {
  var decompress;
  if (encoding.match(/\bdeflate\b/)) {
    decompress = zlib.createInflate();
  } else if (encoding.match(/\bgzip\b/)) {
    decompress = zlib.createGunzip();
  }
  return decompress ? res.pipe(decompress) : res;
}

function maybeTranslate (res, charset, reject) {
  var iconv;
  // Use iconv if its not utf8 already.
  if (!iconv && charset && !/utf-*8/i.test(charset)) {
    try {
      iconv = new Iconv(charset, 'utf-8');
      console.log('Converting from charset %s to utf-8', charset);
      iconv.on('error', reject);
      // If we're using iconv, stream will be the output of iconv
      // otherwise it will remain the output of request
      res = res.pipe(iconv);
    } catch(err) {
      reject (err);
    }
  }
  return res;
}

function getParams(str) {
  var params = str.split(';').reduce(function (params, param) {
    var parts = param.split('=').map(function (part) { return part.trim(); });
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
  }, {});
  return params;
}
