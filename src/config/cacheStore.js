const redis = require('redis');
const _ = require('lodash');
const { log } = require('../utils');
const Sentry = require('@sentry/node');
const clients = {};
let connectionTimeout;

function throwTimeoutError() {
  connectionTimeout = setTimeout(() => {
    throw new Error('Redis connection failed');
  }, 10000);
}
function instanceEventListeners({ conn }) {
  conn.on('connect', () => {
    log.info(`Connected to cache store`, 'cacheStore', 'Status');
    clearTimeout(connectionTimeout);
  });
  conn.on('end', () => {
    log.info(`Disconnected  from cache store`, 'cacheStore', 'Status');
    throwTimeoutError();
  });
  conn.on('reconnecting', () => {
    log.warn(`Reconnecting to cache store...`, 'cacheStore', 'Status');
    clearTimeout(connectionTimeout);
  });
  conn.on('error', (error) => {
    log.error(`${error.message}`, 'cacheStore', 'Status');
    Sentry.captureException(error);
    throwTimeoutError();
  });
}

module.exports.init = () => {
  const cacheInstance = redis.createClient({
    port: 6379,
    host: 'redis',
    retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    },
  });
  clients.cacheInstance = cacheInstance;
  instanceEventListeners({ conn: cacheInstance });
};

module.exports.getClients = () => clients;

module.exports.closeConnections = () =>
  _.forOwn(clients, (conn) => conn.quit());
