'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate({ User, Post }) {
      this.belongsTo(User, { as: 'User', foreignKey: 'userId' });

      this.belongsToMany(User, {
        as: 'Followers',
        foreignKey: 'profileId',
        through: 'user_profiles',
      });

      this.hasMany(Post, {
        foreignKey: 'profileId',
        as: 'post',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      {
        this.tableName = 'profiles';
      }
    }
  }
  Profile.init(
    {
      id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        validate: {
          notNull: false,
          notEmpty: true,
        },
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        defaultValue: 'images/profile.jpg',
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
        validate: {
          notNull: true,
          notEmpty: true,
        },
        defaultValue: 'Private',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
        defaultValue: false,
      },
      filterPost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
        defaultValue: false,
      },
      filterOffensiveMessage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  );
  return Profile;
};
