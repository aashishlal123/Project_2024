'use strict';

const { Model, Op } = require('sequelize'),
  { genSalt, hash } = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Profile, Post, Comment, Room, Message }) {
      this.hasOne(Profile, {
        foreignKey: 'userId',
        as: 'profile',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasOne(Room, {
        as: 'admin',
        foreignKey: 'admin',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.belongsToMany(Profile, {
        as: 'Following',
        foreignKey: 'userId',
        through: 'user_profiles',
      });

      this.belongsToMany(Post, {
        as: 'Like',
        foreignKey: 'userId',
        through: 'user_posts',
      });

      this.hasMany(Comment, {
        as: 'Commenter',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.belongsToMany(Room, {
        as: 'Rooms',
        foreignKey: 'userId',
        through: 'user_rooms',
      });

      this.hasMany(this, {
        foreignKey: 'parentId',
        as: 'ChildAccount',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.hasMany(Message, {
        foreignKey: 'userId',
        as: 'Messenger',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      {
        this.tableName = 'users';
      }
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        allowNull: false,
        validate: {
          notNull: false,
          notEmpty: true,
        },
        defaultValue: DataTypes.UUIDV4,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        customValidator(value, next) {
          User.findOne({
            where: { email: value, deletedAt: { [Op.ne]: null } },
            attributes: ['id'],
          })
            .then((user) => {
              if (user) {
                return next('Email is already taken');
              }
              next();
            })
            .catch((error) => {
              return next(error);
            });
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Email is required',
          },
          notNull: {
            args: true,
            msg: 'Email is required',
          },
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          customValidator(value, next) {
            User.findOne({
              where: { userName: value, deletedAt: { [Op.ne]: null } },
              attributes: ['id'],
            })
              .then((user) => {
                if (user) {
                  return next('Username is already taken');
                }
                next();
              })
              .catch((error) => {
                return next(error);
              });
          },
          notEmpty: {
            args: true,
            msg: 'Username is required',
          },
          notNull: {
            args: true,
            msg: 'Username is required',
          },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Name is required',
          },
          notNull: {
            args: true,
            msg: 'Name is required',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Password Field is required',
          },
          notNull: {
            args: true,
            msg: 'Password Field is required',
          },
        },
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['user', 'admin', 'superAdmin'],
        validate: {
          notEmpty: true,
          notNull: true,
        },
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['active', 'suspended', 'banned'],
        validate: {
          notEmpty: true,
          notNull: true,
        },
        defaultValue: 'active',
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Birthday Field is required',
          },
          notNull: {
            args: true,
            msg: 'Birthday Field is required',
          },
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
      deletedAt: 'deletedAt',
      paranoid: true,
      modelName: 'User',
    }
  );

  User.beforeCreate(async (user) => {
    // generate a salt
    await genSalt(SALT_WORK_FACTOR)
      .then(async (salt) => {
        // hash the password using our new salt
        user.dataValues.password = await hash(user.dataValues.password, salt);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  return User;
};
