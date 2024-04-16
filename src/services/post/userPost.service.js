const { getPostDetail } = require('./helpers');
const { postSerializer } = require('../../serializers');
module.exports = async (postId, user) => {
  let post = await getPostDetail(postId, user);
  post.status !== 404
    ? ((post = await postSerializer(post)),
      (post.data.attributes.profile.dataValues.userName =
        post.data.attributes.profile.dataValues.User.userName),
      delete post.data.attributes.profile.dataValues.User)
    : null;
  return post;
};
