const APIError = require('./APIError');
const log = require('../logger/customLogger');
const Sentry = require('@sentry/node');

function APIErrorHandler(err, req, res, next) {
  let { statusCode, error } = err;
  if (statusCode === 400) {
    if (err instanceof APIError) {
      let errorDetails = [];
      let errorType = '';
      if (error.errors) {
        error.errors.map((errorDetail) => {
          errorType = errorDetail.type;
          errorDetails = [
            ...errorDetails,
            {
              fieldName: errorDetail.path,
              message: errorDetail.message,
            },
          ];
        });
      } else {
        errorType = error.type;
        errorDetails = [
          {
            message: error.message,
          },
        ];
      }

      return res.status(200).json({
        status: statusCode,
        errorType,
        errorList: errorDetails,
      });
    }
  } else {
    if (statusCode > 400 && statusCode < 500) {
      if (err instanceof APIError) {
        return res.status(200).json({
          status: statusCode,
          message: error.message,
        });
      }
    } else {
      if (err instanceof APIError) {
        Sentry.captureException(error);
        log.error(`${error.message}`, 'API', `${statusCode}`);
        return res.status(200).json({
          status: statusCode,
          message: error.message,
        });
      }
    }
    return res.status(500).json('Something went wrong, please try again.');
  }
}

module.exports = APIErrorHandler;
