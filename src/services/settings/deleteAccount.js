const { User } = require('../../db/models');

module.exports = async (userId) => {
  let deleteAccount = await User.destroy({ where: { id: userId } });
  return deleteAccount;
};
