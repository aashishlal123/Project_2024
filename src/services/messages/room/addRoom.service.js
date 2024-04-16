const { User, Profile, Room } = require('../../../db/models');
const { Op } = require('sequelize');
module.exports = async (data, user) => {
  const { name, users } = data;

  if (users.length <= 2) {
    let room = await user.getRooms({
      where: { admin: null },
      include: [
        {
          model: User,
          as: 'Member',
          attributes: ['id', 'userName', 'fullName', 'status'],
          where: {
            id: { [Op.in]: [users[1]] },
          },
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['image', 'isActive', 'updatedAt'],
            },
          ],
        },
      ],
    });
    if (room.length > 0) {
      return room[0];
    }
  }

  let newRoom = await new Room({
    name: name ? name : null,
    admin: users.length > 2 ? user.id : null,
  });

  let createdRoom = await newRoom.save().then(async (room) => {
    users.map(async (user) => {
      await room.setMember(user);
    });
    return await room;
  });

  return createdRoom;
};
