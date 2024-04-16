'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      gender: {
        type: DataTypes.STRING,
      },
      websiteURL: {
        type: DataTypes.STRING,
      },
      profileStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Private',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      filterPost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      filterOffensiveMessage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('profiles');
  },
};
