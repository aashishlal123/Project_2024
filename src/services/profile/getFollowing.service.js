const { User } = require('../../db/models');
const { followingSerializer } = require('../../serializers');
const { Op } = require('sequelize');

module.exports = async (userName) => {
  const currentUser = await User.findOne({
    where: { userName },
  });
  let following = await currentUser.getFollowing({
    include: [
      { model: User, as: 'User', attributes: ['fullName', 'userName'] },
    ],
    attributes: ['id', 'image'],
    where: { profileStatus: { [Op.ne]: 'Disabled' } },
  });
  return await followingSerializer(following);
};
