'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      roomId: {
        type: DataTypes.UUID,
        references: {
          model: 'rooms',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      parentId: {
        type: DataTypes.UUID,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      messageType: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deletedAt: {
        type: DataTypes.TEXT,
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
    await queryInterface.dropTable('messages');
  },
};
