const passport = require('passport');
const APIError = require('../utils/errorHandler/APIError');

const authMid = (req, res, next, justReturn = false) => {
  if (justReturn && !req.headers.authorization) {
    req.user = null;
    return next();
  }
  return passport.authenticate(
    'jwt',
    { session: false },
    async (error, user, info) => {
      if (error) {
        return next(APIError.unauthorized(error));
      }
      req.logIn(user, async (err) => {
        if (err) {
          return next(APIError.unauthorized(err));
        }
        req.user = await user;
        return next();
      });
    }
  )(req, res, next);
};

module.exports = authMid;
