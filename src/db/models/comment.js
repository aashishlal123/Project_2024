'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ User, Post }) {
      this.belongsTo(Post, { foreignKey: 'postId' });
      this.belongsTo(User, { foreignKey: 'userId' });
      this.hasMany(this, { as: 'replies', foreignKey: 'parentId' });
      this.belongsTo(this, { as: 'comments', foreignKey: 'parentId' });
      {
        this.tableName = 'comments';
      }
    }
  }
  Comment.init(
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
      postId: {
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
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      modelName: 'Comment',
    }
  );

  return Comment;
};
