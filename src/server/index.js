const express = require('express');
const bodyParser = require('body-parser');
const error = require('./middlewares/error');
const podcasts = require('./routers/podcasts');
const validate = require('./routers/validate');
const profile = require('./routers/profile');

let router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.all('/api/podcasts', podcasts);
router.get('/api/validate', validate);
router.all('/api/profile/:id', profile);
router.use(error);

module.exports = router;
