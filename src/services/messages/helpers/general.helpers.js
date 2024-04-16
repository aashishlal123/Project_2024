const { Room, User, Profile } = require('../../../db/models');
const { Op } = require('sequelize');
const getRoom = async (id) => {
  if (id) {
    return await Room.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'Member',
          attributes: ['userName', 'fullName', 'status'],
          include: {
            model: Profile,
            as: 'profile',
            attributes: ['image', 'isActive', 'updatedAt', 'profileStatus'],
          },
        },
      ],
    })
      .then(async (room) => {
        if (room) {
          return room;
        }
        return { status: 404, message: 'Room Not Found' };
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
  throw new Error('No room found with given id');
};

module.exports = { getRoom };
