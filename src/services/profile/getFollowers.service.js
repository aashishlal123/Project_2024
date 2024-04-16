const { Profile } = require('../../db/models');
const { followersSerializer } = require('../../serializers');
const { Op } = require('sequelize');

module.exports = async (id) => {
  try {
    const currentUser = await Profile.findOne({
      where: { id },
    });
    if (currentUser) {
      const followers = await currentUser.getFollowers({
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: ['image'],
            where: { profileStatus: { [Op.ne]: 'Disabled' } },
          },
        ],
        attributes: ['id', 'fullName', 'userName'],
      });
      return await followersSerializer(followers);
    }
    return followersSerializer([]);
  } catch (error) {
    throw new Error(error);
  }
};
