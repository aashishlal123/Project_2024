'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate({ User, Message }) {
      this.belongsToMany(User, {
        as: 'Member',
        foreignKey: 'roomId',
        through: 'user_rooms',
      });

      this.belongsTo(User, { as: 'User', foreignKey: 'admin' });

      this.hasMany(Message, {
        foreignKey: 'roomId',
        as: 'Message',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      {
        this.tableName = 'rooms';
      }
    }
  }
  Room.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin: {
        type: DataTypes.UUID,
        allowNull: true,
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
      modelName: 'Room',
    }
  );

  return Room;
};
