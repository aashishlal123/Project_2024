const { Profile } = require('../../db/models');

module.exports = async (user) => {
  let profile = await user.getProfile();
  return await Profile.update(
    {
      profileStatus: profile.profileStatus === 'Private' ? 'Public' : 'Private',
    },
    { where: { id: profile.id } }
  )
    .then(async (updatedRow) => {
      return updatedRow;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
