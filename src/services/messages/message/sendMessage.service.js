const { Room, User, Profile, Message } = require('../../../db/models');
const { messageSerializer } = require('../../../serializers');

module.exports = async (data, roomId, userId) => {
  const { parentId, message, messageType } = data;

  if (!roomId) return { status: 400, message: 'Room Id not specified' };
  const room = await Room.findOne({ where: { id: roomId } });
  if (room) {
    if (!message) return { status: 400, message: 'Message cannot be empty' };
    const addMessage = await room.createMessage({
      userId,
      parentId,
      message,
      messageType,
    });
    return await messageSerializer(
      await room.getMessage({
        where: { id: addMessage.id },
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
        ],
      })
    );
  } else {
    return { status: 404, message: 'Room not found' };
  }
};
