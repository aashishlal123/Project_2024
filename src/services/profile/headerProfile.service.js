const { getUserProfile } = require('./helpers');
const { profileSerializer } = require('../../serializers');

const calculateAge = (birthday) => {
  const diffTime = Math.abs(new Date() - new Date(birthday));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365);
};

module.exports = async (req, res, next) => {
  const userData = await getUserProfile(req.user.userName);

  if (userData.profile) {
    userData.profile.fullName = req.user.fullName;
    userData.profile.userName = req.user.userName;
    userData.profile.email = req.user.email;
    userData.profile.birthday = req.user.birthday;
    userData.profile.childAccount = calculateAge(req.user.birthday) <= 18;
    const serializedProfile = await profileSerializer(userData.profile, true);
    return serializedProfile;
  }
  return userData;
};
