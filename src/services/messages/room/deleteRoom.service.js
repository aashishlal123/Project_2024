const { Room } = require('../../../db/models');

module.exports = async (roomId) => {
  let deleteRoom = await Room.destroy({ where: { id: roomId } });
  return deleteRoom;
};
