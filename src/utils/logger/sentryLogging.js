const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: 'https://62edf6b41d8440159320097f44a2a20d@o1076642.ingest.sentry.io/6078668',

  tracesSampleRate: 1.0,
});
