const express = require ('express');
const app = express ();
const server = require ('./src/server');
const fs = require ('fs');
const path = require ('path');

function responseMiddleware (fs) {
  return function (req, res) {
    let html = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'));
    res.send(html.toString());
  }
}

if (app.get('env') == 'development') {
  const createDevMiddleware = require ('webpack-dev-middleware');
  const webpack = require ('webpack');
  const webpackConfig = require ('./webpack.config.babel');

  let webpackCompiler = webpack(webpackConfig);
  let devMiddleWare = createDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
  });

  app.use(devMiddleWare);
  app.get('/', responseMiddleware(devMiddleWare.fileSystem));
} else {
  app.use('/assets', express.static('./dist'));
  app.get('/', responseMiddleware(fs));
}

app.use(server);
app.listen(8000, () => {
  console.log('Server running on 8000');
});
