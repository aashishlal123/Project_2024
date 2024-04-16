const { loginUser, hashPassword } = require('../auth/helpers');
const { User, Profile } = require('../../db/models');

module.exports = async (user, currentPassword, data) => {
  if (user) {
    try {
      let isAuthorized = await loginUser(currentPassword, user);
      if (isAuthorized?.accessToken) {
        if (data?.password) data.password = await hashPassword(data?.password);
        let user = await User.update(
          { ...data },
          { where: { id: isAuthorized.user.id } }
        );
        let profile = await Profile.update(
          { ...data },
          { where: { userId: isAuthorized.user.id } }
        );

        return user[0] === 1 || profile[0] === 1
          ? { status: 200, message: 'Successfully updated data' }
          : { status: 500, message: 'Error updating data' };
      } else {
        return {
          status: 401,
          message: `Unauthorized Request`,
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return {
      status: 401,
      message: `Unauthorized Request`,
    };
  }
};
