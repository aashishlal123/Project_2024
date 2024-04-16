const errorHandler = require('./errorHandler');
const log = require('./logger/customLogger');
const sentryLog = require('./logger/sentryLogging');
const getIP = require('./ip/getIpAddress');
const sendMail = require('./mail/sendMail');
const Pagination = require('./pagination/pagination');
const toxy = require('./toxy/toxy');

module.exports = {
  errorHandler,
  log,
  sentryLog,
  getIP,
  sendMail,
  Pagination,
  toxy,
};
