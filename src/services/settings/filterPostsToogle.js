const { Profile } = require('../../db/models');

module.exports = async (user) => {
  let profile = await user.getProfile();
  return await Profile.update(
    {
      filterPost: !profile.filterPost,
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
