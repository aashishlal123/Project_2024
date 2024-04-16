const { userSerializer } = require('../../serializers');
const { getChildUserData } = require('../auth/helpers');

module.exports = async (userId) => {
  try {
    let users = await getChildUserData(userId);
    return await userSerializer(users, ['profile']);
  } catch (error) {
    throw new Error(error);
  }
};
