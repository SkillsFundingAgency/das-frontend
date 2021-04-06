const nunjucks = require('nunjucks');
const express = require('express');
const routes = require('./app/routes');
const utils = require('./app/libs/utilities')
const sessionInCookie = require('client-sessions')
const bodyParser = require('body-parser')

const app = express();
const port = (process.env.PORT || 1045);

const http = require('http')

nunjucks.configure(
  [
    'src/das/sass/components',
    'app/views',
    'app/views/fiu',
    'src/fiu/components/',
    'app/views/layouts',
    'app/views/documentation',
    'app/views/documentation/components',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/',
    'dist/fiu/components/'
  ], {
  express: app,
  autoescape: true,
  watch: true,
  noCache: true,
});


app.set('view engine', 'html');

// Support for parsing data in POSTs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:50160');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});


const sessionName = 'das-frontend-session'.toString('hex')
let sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: false
  }
}

  app.use(sessionInCookie(Object.assign(sessionOptions, {
    cookieName: sessionName,
    proxy: true,
    requestKey: 'session'
  })))

app.use(utils.autoStoreData)

app.use(express.static('dist'));

routes.bind(app);

const server = http.createServer(app).listen(port, () => {
  console.log('Website running at http://localhost:' + port);
})


