const { Post } = require('../../db/models');
const { getLikesSerializer } = require('../../serializers');

module.exports = async (postId) => {
  const post = await Post.findOne({
    where: { id: postId },
  });
  if (post) {
    const likes = await post.getLiked();

    return await getLikesSerializer(likes);
  } else {
    return { status: 400, message: 'Post Not Found' };
  }
};
