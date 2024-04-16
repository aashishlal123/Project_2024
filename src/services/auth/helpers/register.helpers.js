const { User, Profile } = require('../../../db/models');
const { getClients } = require('../../../config/cacheStore');
const serializer = require('../../../serializers/serializer');
const { issueJWT } = require('./auth.helpers');

const registerUser = async (data) => {
  const newUser = await new User(data, {
    include: [
      {
        model: Profile,
        as: 'profile',
      },
    ],
  });
  let client = await getClients().cacheInstance;
  const code = await client.get(`conformationCode:${email}`);
  if (data.conformationCode && code && data.conformationCode == code) {
    return newUser
      .save()
      .then(async (user) => {
        if (user) {
          const { accessToken } = await issueJWT(user.id);
          let serializedData = await serializer('user', user, ['password']);
          serializedData = { ...serializedData, accessToken };
          return serializedData;
        }
      })
      .catch((error) => {
        return new Error(error);
      });
  } else {
    return {
      status: '400',
      title: 'Invalid Conformation Code',
      message: "That code isn't valid. You can request a new one.",
    };
  }
};

module.exports = { registerUser };
