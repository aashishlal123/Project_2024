'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('user_rooms', {
      roomId: {
        type: DataTypes.UUID,
        references: {
          model: 'rooms',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('user_rooms');
  },
};
