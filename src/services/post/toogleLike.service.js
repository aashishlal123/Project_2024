const { getPostDetail } = require('./helpers');

const { likeSerializer } = require('../../serializers');
module.exports = async (req) => {
  const currentUser = await req.user;
  let post = await getPostDetail(req.params.postId);

  if (post.status === 404) {
    return { status: 404, message: 'No Post Found' };
  }
  if (post.id) {
    let liked = await post.getLiked({
      where: { id: currentUser.id },
    });
    let like = await currentUser.getLike({
      where: { id: req.params.postId },
    });

    if (like.length === 0) {
      await currentUser.addLike(post);
      liked = await post.getLiked({
        where: { id: currentUser.id },
      });
    } else {
      await currentUser.removeLike(post);
    }

    return likeSerializer(liked);
  } else {
    return { status: 400, message: 'Post Not Found' };
  }
};
