const validate = require ('../controllers/validate');

module.exports = (req, res) => {
  let urls = req.query.q;
  if (urls.indexOf(',') > -1) {
    urls = urls.split (',');
  } else {
    urls = [urls];
  }

console.log(urls);

  validate (urls)
    .then (result => {
      res.status (200).json (result);
    })
    .catch (error => {
      res.status (415).send (JSON.stringify (error));
    });
}
