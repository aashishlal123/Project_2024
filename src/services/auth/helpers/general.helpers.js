const { User, Profile } = require('../../../db/models');
const { isEmail, isUUID } = require('validator');
const { userSerializer } = require('../../../serializers');
const { Op } = require('sequelize');

const getUserData = async (userDetail, fieldName = undefined) => {
  if (userDetail) {
    let detailField = undefined;
    let userNameRegex = new RegExp(/^[a-zA-Z_](?!.*?\.{2})[\w.]{3,30}[\w]$/);
    (await isUUID(userDetail)) ? (detailField = 'id') : '';
    (await isEmail(userDetail)) ? (detailField = 'email') : '';
    (await userDetail.match(userNameRegex)) ? (detailField = 'userName') : '';

    if (detailField) {
      return await User.findOne({
        where: {
          [fieldName ? fieldName : detailField]: userDetail,
          deletedAt: null,
        },
        include: { model: Profile, as: 'profile' },
      })
        .then(async (user) => {
          if (user) {
            return user;
          }
          return null;
        })
        .catch((error) => {
          return new Error(error);
        });
    }
  }

  return null;
};

const getChildUserData = async (userId) => {
  if (userId) {
    return await User.findAll({
      where: {
        parentId: userId,
        deletedAt: null,
      },
      include: { model: Profile, as: 'profile' },
    })
      .then(async (user) => {
        if (user) {
          return user;
        }

        return null;
      })
      .catch((error) => {
        return new Error(error);
      });
  }

  return null;
};

const getUsers = async (
  pagination,
  limit,
  offset,
  sortingQuery,
  userDetail,
  currentUser
) => {
  if (userDetail) {
    return await User.findAndCountAll({
      where: {
        [Op.or]: [
          {
            userName: {
              [Op.regexp]: userDetail,
              [Op.ne]: currentUser?.userName || null,
            },
          },

          {
            email: {
              [Op.regexp]: userDetail,
              [Op.ne]: currentUser?.email || null,
            },
          },
        ],
        deletedAt: null,
      },
      offset,
      limit,
      order: [sortingQuery],
      distinct: true,
      include: [
        {
          model: Profile,
          as: 'profile',
          attributes: ['image'],
          where: { profileStatus: { [Op.ne]: 'Disabled' } },
        },
      ],
      attributes: ['id', 'fullName', 'userName'],
    })
      .then(async (user) => {
        if (user) {
          const dataCount = user.count;
          const pageLinkOffsets = pagination.getPageNos(dataCount);
          let serializedData = await userSerializer(
            user.rows,
            ['profile'],
            pageLinkOffsets
          );
          return serializedData;
        }
        return null;
      })
      .catch((error) => {
        return new Error(error);
      });
  }

  return null;
};

module.exports = { getUserData, getChildUserData, getUsers };
