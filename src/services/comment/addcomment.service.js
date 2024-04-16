const { Comment, Post, User, Profile } = require('../../db/models');
const { commentSerializer } = require('../../serializers');

module.exports = async (data, postId, userId) => {
  const post = await Post.findOne({ where: { id: postId } });

  if (post) {
    const { comment, parentId } = data;
    const addedComment = await post
      .createComment({
        userId,
        comment,
        parentId,
      })
      .then(async (comment) => {
        return await Comment.findOne({
          where: { id: comment.id },
          distinct: true,
          attributes: ['id', 'comment', 'createdAt', 'parentId', 'updatedAt'],
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id', 'userName'],
              include: [
                {
                  model: Profile,
                  as: 'profile',
                  attributes: ['id', 'image'],
                },
              ],
            },
            {
              model: Comment,
              as: 'replies',
              attributes: [
                'id',
                'parentId',
                'comment',
                'createdAt',
                'updatedAt',
              ],
              include: [
                {
                  model: User,
                  as: 'User',
                  attributes: ['id', 'userName'],
                  include: [
                    {
                      model: Profile,
                      as: 'profile',
                      attributes: ['id', 'image'],
                    },
                  ],
                },
              ],
            },
          ],
        })
          .then(async (comment) => {
            comment.User.setDataValue(
              'isCurrentUser',
              comment.User.id === userId
            );
            return comment;
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
    return await commentSerializer(addedComment);
  } else {
    return { status: 404, message: 'Post Not Found' };
  }
};
