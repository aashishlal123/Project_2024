'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      profileId: {
        type: DataTypes.UUID,
        references: {
          model: 'profiles',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      caption: {
        type: DataTypes.TEXT,
      },
      isChildSafe: {
        type: DataTypes.BOOLEAN,
      },
      deletedAt: {
        type: DataTypes.DATE,
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
    await queryInterface.dropTable('posts');
  },
};
