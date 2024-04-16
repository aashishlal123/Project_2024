const { APIError } = require('../utils').errorHandler;
const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  toogleLike,
  getLikes,
  getLiked,
  followedPosts,
} = require('../services/post');

exports.getPosts = async (req, res, next) => {
  try {
    let serializedMessage = await getPosts(req);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getFollowedPosts = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    let serializedMessage = await followedPosts(page, size, req.user);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getPost = async (req, res, next) => {
  try {
    let serializedMessage = await getPost(req.params.postId, req.user);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.addPost = async (req, res, next) => {
  try {
    let serializedMessage = await addPost(req);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    if (error?.parent?.code) {
      next(APIError.badRequest({ message: 'No Profile Found to Add Post' }));
    }
    next(APIError.internalServerError(error));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let serializedMessage = await updatePost(req, next);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    if (error?.parent?.code) {
      next(APIError.badRequest({ message: 'No Profile Found to Update Post' }));
    }
    next(APIError.internalServerError(error));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    let serializedMessage = await deletePost(req.params.postId);

    return res
      .status(200)
      .json(
        serializedMessage === 1
          ? { status: 200, message: 'Post Successfully Deleted' }
          : { status: 404, message: 'Post Not Found' }
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.toogleLike = async (req, res, next) => {
  try {
    let serializedMessage = await toogleLike(req);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getPostLikes = async (req, res, next) => {
  try {
    let serializedMessage = await getLikes(req.params.postId);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getPostLiked = async (req, res, next) => {
  try {
    let serializedMessage = await getLiked(req.user);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};
