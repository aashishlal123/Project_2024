const { Room, User, Profile, Message } = require('../../../db/models');
const { Pagination } = require('../../../utils');
const { messageSerializer } = require('../../../serializers');
const { Op } = require('sequelize');
module.exports = async (roomId, page, profile) => {
  if (!roomId) return { status: 400, message: 'Room Id not specified' };
  const room = await Room.findOne({ where: { id: roomId } });
  let members = await room.getMember();
  if (room) {
    const sortingQuery = ['createdAt', 'desc'];
    const pagination = new Pagination(page || 1, 50);
    const limit = pagination.getItemPerPage();
    const offset = pagination.getOffset();
    try {
      let messages = await room.getMessage({
        where:
          profile.filterOffensiveMessage && members.length > 1
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
        order: [sortingQuery],
        offset,
        limit,
        distinct: true,
        include: [
          {
            model: Message,
            as: 'messages',
            include: [
              {
                model: User,
                as: 'Member',
                attributes: ['userName', 'fullName', 'status', 'updatedAt'],
                include: {
                  model: Profile,
                  as: 'profile',
                  attributes: ['image'],
                },
              },
            ],
          },
          {
            model: User,
            as: 'Member',
            attributes: ['userName', 'fullName', 'status', 'updatedAt'],
            include: {
              model: Profile,
              as: 'profile',
              attributes: ['image'],
            },
          },
        ],
      });

      const dataCount = await room.countMessage({ where: { deletedAt: null } });
      if (dataCount === 0) return { status: 204, message: 'No Messages Yet' };
      const pageLinkOffsets = pagination.getPageNos(dataCount);
      return await messageSerializer(messages, roomId, pageLinkOffsets);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return { status: 404, message: 'Room not found' };
  }
};
