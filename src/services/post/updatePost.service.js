const { Post } = require('../../db/models');
const { APIError } = require('../../utils/errorHandler');
const { postSerializer } = require('../../serializers');

module.exports = async (req, next) => {
  try {
    let updatePost = await Post.update(
      { caption: req.body.caption },
      { where: { id: req.params.postId }, returning: true }
    );
    return await postSerializer(updatePost[1]);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};
