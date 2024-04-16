const { getUserProfile } = require('./helpers');
const { profileSerializer, userSerializer } = require('../../serializers');

module.exports = async (req, res, next) => {
  const userData = await getUserProfile(req.params.userName);

  if (userData?.profile) {
    userData.isCurrentUser = req.user
      ? req.user.userName === req.params.userName
      : null;
    const serializedProfile = await userSerializer(userData, [
      'profile',
      'isCurrentUser',
    ]);
    return serializedProfile;
  }
};
