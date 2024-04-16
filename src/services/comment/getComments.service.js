const { Comment, User, Profile } = require('../../db/models');
const { commentSerializer } = require('../../serializers');
const { Pagination } = require('../../utils');
const Sequelize = require('sequelize');

module.exports = async (postId, queries, user) => {
  const sortingQuery = [queries.sort || 'createdAt', queries.order || 'desc'];
  const pagination = new Pagination(queries.page, queries.size);
  const limit = pagination.getItemPerPage();
  const offset = pagination.getOffset();

  const comments = await Comment.findAndCountAll({
    where: { postId: postId, parentId: { [Sequelize.Op.is]: null } },
    offset,
    limit,
    order: [sortingQuery],
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
        attributes: ['id', 'parentId', 'comment', 'createdAt', 'updatedAt'],
        order: [sortingQuery],
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
    .then(async (comments) => {
      if (comments.count > 0) {
        const dataCount = comments.count;

        const commentsDetails = await comments.rows.map((comment) => {
          comment.User.setDataValue('isCurrentUser', comment.User.id === user);
          comment.replies = comment.replies.map((reply) => {
            reply.User.setDataValue('isCurrentUser', reply.User.id === user);
            return reply;
          });
          return comment;
        });
        const pageLinkOffsets = pagination.getPageNos(dataCount);
        let serializedData = await commentSerializer(
          commentsDetails,
          postId,
          pageLinkOffsets
        );
        return { count: dataCount, ...serializedData };
      }
      return { status: 204, message: 'No Comments Added' };
    })
    .catch((error) => {
      throw new Error(error);
    });

  return comments;
};
