const { User, Profile, Message } = require('../../../db/models');
const { Pagination } = require('../../../utils');
const { roomSerializer } = require('../../../serializers');
const { Op } = require('sequelize');
module.exports = async (user, page) => {
  const sortingQuery = ['createdAt', 'desc'];
  const pagination = new Pagination(page || 1, 15);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();
  let profile = await user.getProfile();

  let rooms = await user.getRooms({
    where: { deletedAt: null },
    order: [sortingQuery],
    offset,
    limit,
    distinct: true,
    include: [
      {
        model: User,
        as: 'Member',
        attributes: ['userName', 'fullName', 'status', 'updatedAt'],
        include: {
          model: Profile,
          as: 'profile',
          attributes: [
            'image',
            'isActive',
            'filterOffensiveMessage',
            'updatedAt',
            'profileStatus',
          ],
        },
      },
      {
        model: Message,
        as: 'Message',
        order: [sortingQuery],
        where: profile.filterOffensiveMessage
          ? {
              deletedAt: null,
              [Op.or]: [
                {
                  [Op.and]: [
                    { userId: { [Op.ne]: profile.userId } },
                    { messageType: false },
                  ],
                },
                { userId: profile.userId },
              ],
            }
          : { deletedAt: null },
        limit: 1,
        subQuery: false,
      },
    ],
  });
  const dataCount = await user.countRooms({ where: { deletedAt: null } });
  const pageLinkOffsets = pagination.getPageNos(dataCount);
  return await roomSerializer(rooms, pageLinkOffsets);
};
