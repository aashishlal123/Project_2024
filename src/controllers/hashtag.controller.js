const { APIError } = require('../utils').errorHandler;
const { trendingHashtag, explore, explored } = require('../services/hashtag');

exports.getTrendingHashtags = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const trendings = await trendingHashtag(page, size);
    res.status(200).json(trendings);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.explore = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const trendings = await explore(page, size);
    res.status(200).json(trendings);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.explored = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const trendings = await explored(page, size, req.params.hashtag);
    res.status(200).json(trendings);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};
