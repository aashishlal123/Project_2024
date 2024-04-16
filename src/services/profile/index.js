const userProfile = require('./userProfile.service');
const editProfile = require('./editProfile.service');
const headerProfile = require('./headerProfile.service');
const getFollowing = require('./getFollowing.service');
const getFollowers = require('./getFollowers.service');
const toogleFollowing = require('./toogleFollowing.service');

module.exports = {
  userProfile,
  editProfile,
  headerProfile,
  getFollowing,
  getFollowers,
  toogleFollowing,
};
