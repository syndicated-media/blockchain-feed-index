const profile = require('../controllers/profile');

module.exports = (req, res) => {
  switch (req.method) {
    case 'GET':
      getProfile(req, res);
      break;

    case 'POST':
      postProfile(req, res);
      break;

    default:
      res.status(404).send();
  }
}

function getProfile (req, res) {
  profile.get(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(501).send(JSON.stringify(err));
    });
}

function postProfile (req, res) {
  profile.put(req.params.id, req.body)
    .then(result => {
      res.json({
        result: 'ok'
      });
    })
    .catch(err => {
      res.status(501).send(JSON.stringify(err));
    });
}
