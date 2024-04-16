const { userSerializer } = require('../../serializers');
const { getUserData, loginUser } = require('../auth/helpers');

module.exports = async (userId, password) => {
  let user = await getUserData(userId);
  try {
    if (user) {
      let data = await loginUser(password, user);

      if (data.accessToken) return await userSerializer(data.user, ['profile']);

      return {
        status: 401,
        message: `Unauthorized Request`,
      };
    } else {
      return {
        status: 401,
        message: `Unauthorized Request`,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};
