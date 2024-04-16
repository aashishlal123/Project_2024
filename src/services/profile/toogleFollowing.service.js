const { Profile } = require('../../db/models');
const { followingSerializer } = require('../../serializers');
module.exports = async (id, user) => {
  const currentUser = await user;

  const userProfile = await Profile.findOne({
    where: { id },
  });
  let follower = await userProfile.getFollowers({
    where: { id: currentUser.id },
  });
  let following = await currentUser.getFollowing({
    where: { id },
  });

  if (following.length === 0) {
    await currentUser.addFollowing(userProfile);
    follower = await userProfile.getFollowers({
      where: { id: currentUser.id },
    });
  } else {
    await currentUser.removeFollowing(userProfile);
  }
  return followingSerializer(follower);
};
