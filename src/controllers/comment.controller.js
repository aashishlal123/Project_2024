const { APIError } = require('../utils').errorHandler;
const {
  addComment,
  getComments,
  deleteComment,
} = require('../services/comment');

exports.getComments = async (req, res, next) => {
  try {
    const serializedMessage = await getComments(
      req.params.postId,
      req.query,
      req.user?.id
    );
    res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const serializedMessage = await addComment(
      req.body,
      req.params.postId,
      req.user.id
    );
    res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const serializedMessage = await deleteComment(req.params.commentId);
    res
      .status(200)
      .json(
        serializedMessage === 1
          ? { status: 200, message: 'Successfully deleted comment' }
          : serializedMessage
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};
