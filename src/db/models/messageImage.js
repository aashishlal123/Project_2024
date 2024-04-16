'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageImage extends Model {
    static associate({ Message }) {
      this.belongsTo(Message, { foreignKey: 'messageId' });
      {
        this.tableName = 'message_images';
      }
    }
  }
  MessageImage.init(
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
      messageId: {
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
        validate: {
          notNull: true,
          notEmpty: true,
        },
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
      modelName: 'MessageImage',
    }
  );
  return MessageImage;
};
