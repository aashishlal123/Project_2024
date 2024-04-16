'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hashtag extends Model {
    static associate({ Post }) {
      this.belongsTo(Post, { foreignKey: 'postId', as: 'Post' });
      {
        this.tableName = 'hashtags';
      }
    }
  }
  Hashtag.init(
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
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      hashtag: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      totalUsed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
        defaultValue: 1,
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
      modelName: 'Hashtag',
    }
  );
  return Hashtag;
};
