const express = require('express');
const bodyParser = require('body-parser');
const error = require('./middlewares/error');
const auth0 = require('./middlewares/auth0');
const wallet = require('./middlewares/podchain-wallet');
const podchain = require('./routers/podchain');
const profile = require('./routers/profile');

let router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// podchain api
router.get('/api/podchain/', podchain.get);
router.post('/api/podchain/create', podchain.create);
router.post('/api/podchain/update', auth0, wallet, podchain.update);
router.post('/api/podchain/transfer', auth0, wallet, podchain.transfer);
router.post('/api/podchain/delete', auth0, wallet, podchain.del);

// podchain wallet api
router.get('/api/wallet/profile', auth0, wallet, profile);
router.use(error);

module.exports = router;
