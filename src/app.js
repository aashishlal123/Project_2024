const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const expressSanitizer = require('express-sanitizer');
const helmet = require('helmet');
const { sequelize } = require('./db/models');
const { errorHandler, log } = require('./utils');
const { cacheStore, passportConfig } = require('./config');
const {
  user,
  profile,
  post,
  messages,
  search,
  settings,
  hashtags,
} = require('./routes');
require('./config/socket');
//use cors middleware (cross-origin (secret-) request sharing)
const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8081',
  'https://metagram-dev.netlify.app',
];
const BASE_URL = '/api/v1';
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      corsOptions = { origin: true };
      return callback(null, corsOptions);
    },
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(expressSanitizer());
app.use(express.json());
app.use(BASE_URL, express.static('/opt/metagram'));
app.use(BASE_URL, express.static(path.join(__dirname, '../public')));

// SETTING UP PASPORTJS USING JWT STRATEGY
app.use(passport.initialize());
// configuring jwt strategy in the passportJS
//actually using passportJS as a middleware, the following method call helps,
// to get the token from the header and then check for authentication of user
require('./config/passport')(passport);

// import ROUTERS

// ROUTES
app.get(['/', BASE_URL], function (req, res) {
  return res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: 'Greetings from metagram api',
  });
});

app.use(`${BASE_URL}/auth`, user);
app.use(`${BASE_URL}/profile`, profile);
app.use(`${BASE_URL}`, post);
app.use(`${BASE_URL}/messages`, messages);
app.use(`${BASE_URL}`, search);
app.use(`${BASE_URL}/settings`, settings);
app.use(`${BASE_URL}/hashtag`, hashtags);

app.use(errorHandler.APIErrorHandler);
require('./utils').sentryLog;

server.listen(process.env.PORT, async () => {
  log.info(`Metagram is listening in ${process.env.PORT}`, 'API', 'Listening');
  try {
    log.info('Connecting to database...', 'Database', 'Connecting');
    log.info('Connecting to cache store...', 'Cachestore', 'Connecting');
    sequelize
      .authenticate()
      .then(() => {
        log.info('Connected to database', 'Database', 'Connected');
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });
    cacheStore.init();
    cacheStore.getClients().cacheInstance.connect();
  } catch (error) {
    log.error(error.message, 'Database', '500');
  }
});
