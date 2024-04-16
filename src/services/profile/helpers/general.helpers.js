const { User, Profile } = require('../../../db/models');
const { Op } = require('sequelize');

const getUserProfile = async (userName) => {
  if (userName) {
    return await User.findOne({
      where: { userName },
      include: [
        {
          model: Profile,
          as: 'profile',
          where: { profileStatus: { [Op.ne]: 'Disabled' } },
        },
      ],
      attributes: [
        'id',
        'email',
        'fullName',
        'userName',
        'birthday',
        'parentId',
      ],
    })
      .then(async (profile) => {
        if (profile) {
          return profile;
        }
        return { status: 404, message: 'Profile Not Found' };
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
  throw new Error('No profile found with given id');
};

module.exports = { getUserProfile };
