const { compare } = require('bcrypt');
const { issueJWT } = require('./auth.helpers');
const { Profile, User } = require('../../../db/models');
const { getClients } = require('../../../config/cacheStore');

const comparePassword = async (givenPassword, realPassword) => {
  return await compare(givenPassword, realPassword)
    .then((isMatch) => {
      return isMatch;
    })
    .catch(() => {
      return false;
    });
};

const loginUser = async (password, user) => {
  return await comparePassword(password, user.password)
    .then(async (isValid) => {
      if (isValid) {
        if (user.status === 'banned') {
          return {
            status: 403,
            message: 'banned',
          };
        }
        if (user.status === 'suspended') {
          let client = await getClients().cacheInstance;
          if (!(await client.exists(`suspendedTime:${user.id}`))) {
            await User.update(
              { status: 'active' },
              { where: { status: 'suspended', id: user.id } }
            );
          }
          return {
            status: 403,
            timeLeft: await client.ttl(`suspendedTime:${user.id}`),
            message: 'suspended',
          };
        }
        await Profile.update(
          { profileStatus: 'Private' },
          { where: { userId: user.id, profileStatus: 'Disabled' } }
        );
        const { accessToken } = await issueJWT(user.id);
        return { user, accessToken };
      } else {
        return {
          status: 401,
          source: 'password',
          title: 'Incorrect Password',
          message: `Password did not match`,
        };
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = { loginUser };
