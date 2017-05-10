const express = require('express');
const fs = require('fs');
const path = require('path');
const server = require('./src/server');
//const auth0 = require('./src/server/middlewares/auth0');

// configure API
let app = express ();
app.use(server);

// configure client
let client;
if (app.get('env') == 'development') {
  const createDevMiddleware = require ('webpack-dev-middleware');
  const webpack = require ('webpack');
  const webpackConfig = require ('./webpack.config.babel');

  let webpackCompiler = webpack(webpackConfig);
  let devMiddleWare = createDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
  });

  app.use(devMiddleWare);
  client = responseMiddleware(devMiddleWare.fileSystem);
} else {
  app.use('/assets', express.static('./dist'));
  client = responseMiddleware(fs);
}

app.get('*', client);

const port = process.env.PORT || 8000;

// start
app.listen(port, () => {
  console.log('Server running on 8000');

  let crypto = require('crypto');
  let secp256k1 = require('secp256k1');
  var privKey;
  do {
      privKey = crypto.randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));
  var pubKey = secp256k1.publicKeyCreate(privKey);

  console.log('Public key for test purposes:', pubKey.toString('hex'));
});

// helpers
function responseMiddleware (fs) {
  return function (req, res) {
    let html = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'));
    res.send(html.toString());
  }
}
