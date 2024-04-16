'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('user_profiles', {
      profileId: {
        type: DataTypes.UUID,
        references: {
          model: 'profiles',
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
    await queryInterface.dropTable('user_profiles');
  },
};
