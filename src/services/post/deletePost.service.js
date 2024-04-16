const { Post } = require('../../db/models');

module.exports = async (postId) => {
  let deletePost = await Post.destroy({ where: { id: postId } });
  return deletePost;
};
