const express = require ('express');
const error = require ('./middlewares/error');
const podcasts = require ('./routers/podcasts');
const validate = require ('./routers/validate');

let router = express.Router();

router.get('/api/podcasts', podcasts);
router.post('/api/podcasts', podcasts);
router.get('/api/validate', validate);
router.use(error);

module.exports = router;
