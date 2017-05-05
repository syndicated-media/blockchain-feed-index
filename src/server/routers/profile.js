const profile = require('../controllers/profile');

module.exports = (req, res) => {
    profile.set(req.user)
      .then(profile.getFeeds)
      .then(profile.transferIfNeeded)
      .then(user => {
        res.json(user.toResponse());
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
}
