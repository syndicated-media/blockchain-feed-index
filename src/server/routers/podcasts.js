// map podcast request to controller

const podcasts = require('../controllers/podcasts');
const validate = require('../controllers/validate');

module.exports = (req, res) => {
  switch (req.method) {
    case 'GET':
      getPodcasts(req, res);
      break;

    case 'POST':
      postPodcasts(req, res);
      break;

    default:
      throw new Error('Unsupported method');
  }
}

function getPodcasts (req, res) {
  let urls = req.query.q;
  if (urls.indexOf(',') !== -1) {
    urls = urls.split(',');
  } else {
    urls = [urls];
  }

  podcasts.get(urls)
    .then(result => {
      res.json(result);
    });
}

function postPodcasts (req, res) {
  let urls = req.body.urls || req.body.url;
  if (!Array.isArray(urls)) {
    urls = [urls]
  }

  validate(urls)
    .then(result => {
      let validUrls = [];
      result.urls.forEach(item => {
        if (item.valid) {
          validUrls.push(item);
        }
      });

      if (validUrls.length) {
        return validUrls;
      } else {
        res.status(415).send();
      }
    })
    .then(podcasts.post)
    .then(result => {
      res.json(result);
    });
}
