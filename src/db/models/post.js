'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate({ User, Profile, Hashtag, PostImage, Comment }) {
      this.belongsTo(Profile, { foreignKey: 'profileId' });

      this.hasMany(Hashtag, {
        foreignKey: 'postId',
        as: 'hashtag',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(PostImage, {
        foreignKey: 'postId',
        as: 'postImage',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.belongsToMany(User, {
        as: 'Liked',
        foreignKey: 'postId',
        through: 'user_posts',
      });

      this.hasMany(Comment, {
        as: 'Comment',
        foreignKey: 'postId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      {
        this.tableName = 'posts';
      }
    }
  }
  Post.init(
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
      profileId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      caption: { type: DataTypes.TEXT, validate: { len: [0, 2200] } },
      isChildSafe: { type: DataTypes.BOOLEAN, defaultValue: false },
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
      modelName: 'Post',
    }
  );
  return Post;
};
