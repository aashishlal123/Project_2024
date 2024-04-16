const { Room, Message } = require('../../../db/models');

module.exports = async (roomId, messageId) => {
  if (!roomId) return { status: 400, message: 'Room Id not specified' };
  const room = await Room.findOne({ where: { id: roomId } });
  if (room) {
    let deleteMessage = await Message.destroy({ where: { id: messageId } });
    return deleteMessage;
  } else {
    return { status: 404, message: 'Room not found' };
  }
};
