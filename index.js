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
//app.get('/login', client);
//app.use(auth0.initialize);
//app.use(auth0.session);
//app.get('/callback', auth0.authenticate, auth0.login);
//app.get('/profile', auth0.ensureLoggedIn, client);
//app.get('/logout', auth0.ensureLoggedIn, auth0.logout);

// start
app.listen(8000, () => {
  console.log('Server running on 8000');
});

// helpers
function responseMiddleware (fs) {
  return function (req, res) {
    let html = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'));
    res.send(html.toString());
  }
}
