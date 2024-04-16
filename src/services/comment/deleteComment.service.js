const { Comment } = require('../../db/models');

module.exports = async (id) => {
  const deleteComment = await Comment.destroy({ where: { id } })
    .then((status) => {
      return status;
    })
    .catch((error) => ({ status: 404, message: 'Comment Not Found' }));
  return deleteComment;
};
