const express = require('express');
const bodyParser = require('body-parser');
const error = require('./middlewares/error');
const podchain = require('./routers/podchain');
const profile = require('./routers/profile');

let router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// podchain api
router.get('/api/podchain/', podchain.get);
router.post('/api/podchain/create', podchain.create);
router.post('/api/podchain/update', podchain.update);
router.post('/api/podchain/transfer', podchain.transfer);
router.post('/api/podchain/delete', podchain.del);

// podchain wallet api
router.all('/api/wallet/profile/:id', profile);
router.use(error);

module.exports = router;
