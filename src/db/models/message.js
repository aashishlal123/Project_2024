'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate({ User, Room, MessageImage }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'Member',
      });
      this.belongsTo(Room, { foreignKey: 'roomId' });

      this.hasMany(MessageImage, {
        foreignKey: 'messageImage',
        as: 'messageImage',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(this, { as: 'replies', foreignKey: 'parentId' });
      this.belongsTo(this, { as: 'messages', foreignKey: 'parentId' });
      {
        this.tableName = 'messages';
      }
    }
  }
  Message.init(
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
      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      parentId: {
        type: DataTypes.UUID,
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
      deletedAt: 'deletedAt',
      paranoid: true,
      modelName: 'Message',
    }
  );

  return Message;
};
