const log = require('electron-log'),
  os = require('os'),
  hostName = os.hostname(),
  path = require('path'),
  { version: app_version } = require('../../../package.json'),
  appVer = `v.${app_version}`,
  appEnv = process.env.NODE_ENV;

log.transports.file.level = 'debug';
log.transports.file.resolvePath = () =>
  path.join('/var/log/metagram', '/metagramApp.log');
log.transports.file.streamConfig = { flags: 'a' };
log.transports.console.level = true;
log.transports.console.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [${hostName}] <{level}> {text}`;
log.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [${hostName}] <{level}> {text}`;

function capitalize(string) {
  let text = string.toLowerCase();
  return text.trim()[0].toUpperCase() + text.slice(1);
}

let logger = {
  error: (msg = '-', source = '-', status = '-') => {
    log.error(
      `${appEnv} ${appVer} [${capitalize(source)}] [${capitalize(
        status
      )}] ${msg}`
    );
  },
  warn: (msg = '-', source = '-', status = '-') => {
    log.warn(
      `${appEnv} ${appVer} [${capitalize(source)}] [${capitalize(
        status
      )}] ${msg}`
    );
  },
  info: (msg = '-', source = '-', status = '-') => {
    log.info(
      `${appEnv} ${appVer} [${capitalize(source)}] [${capitalize(
        status
      )}] ${msg}`
    );
  },
};

module.exports = logger;
