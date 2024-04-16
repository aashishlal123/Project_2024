const { User } = require('../db/models');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const serializer = require('../serializers/serializer');
const { APIError } = require('../utils').errorHandler;

module.exports = (passport) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.AUTH_ACCESS_TOKEN_SECRET,
  };

  passport.use(
    new JwtStrategy(options, (payload, done) => {
      User.findOne({
        where: { id: payload.sub },
      })
        .then((userDetail) => {
          if (userDetail) {
            return done(null, userDetail);
          } else {
            return done(null, false);
          }
        })
        .catch((error) => {
          done(APIError.internalServerError(error));
        });
    })
  );
  // required for custom authentication middleware; which handles its own errors
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
