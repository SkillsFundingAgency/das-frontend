const nunjucks = require('nunjucks');
const express = require('express');
const routes = require('./app/routes');

const app = express();
const port = (process.env.PORT || 1045);

const http = require('http')

nunjucks.configure(
  [
    'src/das/sass/components',
    'app/views',
    'app/views/layouts',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/',
    'dist/campaign/components/',
    'dist/fiu/components/'
  ], {
  express: app,
  autoescape: true,
  watch: true,
  noCache: true,
});


app.set('view engine', 'html');


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:4737');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

app.use(express.static('dist'));

routes.bind(app);

const server = http.createServer(app).listen(port, () => {
  console.log('Website running at http://localhost:' + port);
})


